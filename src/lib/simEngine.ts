import type {
  AgentDef,
  CommandEntry,
  Locale,
  SimEffect,
  SimLine,
  SimPanelSpec,
} from '../data/types';
import { flattenEntries, tokenizeWords } from './parser';

export type SimState = Record<string, string>;
export type TermMode = 'shell' | 'session';

/** 引擎产出的输出块；Terminal 负责渲染 */
export type SimBlock =
  | { type: 'sim-print'; lines: SimLine[] }
  | { type: 'sim-panel'; panel: SimPanelSpec }
  | { type: 'banner'; lines: SimLine[] }
  | { type: 'chat'; userText: string; reply: SimLine[] }
  | { type: 'sim-error'; text: string }
  | { type: 'compacted'; summary: string }
  | { type: 'cards-fallback'; entries: CommandEntry[] }
  | { type: 'help-fallback' }
  | { type: 'exit-note' };

export interface ExecResult {
  blocks: SimBlock[];
  nextMode: TermMode;
  nextState: SimState;
  /** 清空当前输出流，仅保留本次 blocks */
  clear?: boolean;
  /** 将历史折叠为本次 blocks（含 compacted 摘要块） */
  compact?: boolean;
}

export function initialState(agent: AgentDef): SimState {
  const state: SimState = {};
  for (const f of agent.session?.statusFields ?? []) state[f.key] = f.initial;
  return state;
}

type Ctx = SimState & { arg?: string; args?: string };

/** 替换 {key} 占位；未知键保留原样，便于发现数据笔误 */
export function interpolate(tpl: string, ctx: Ctx): string {
  return tpl.replace(/\{([\w-]+)\}/g, (raw, key: string) => {
    const v = ctx[key as keyof Ctx];
    return v === undefined ? raw : String(v);
  });
}

function interpolateLines(lines: SimLine[], ctx: Ctx): SimLine[] {
  return lines.map((l) => ({
    ...l,
    text: interpolate(l.text, ctx),
    note: l.note
      ? (Object.fromEntries(
          Object.entries(l.note).map(([k, v]) => [k, interpolate(v, ctx)]),
        ) as Record<Locale, string>)
      : undefined,
  }));
}

interface EffectOutcome {
  blocks: SimBlock[];
  state: SimState;
  clear: boolean;
  compact: boolean;
  exit: boolean;
}

function applyEffects(
  effects: SimEffect[],
  agent: AgentDef,
  state: SimState,
  argCtx: { arg?: string; args?: string },
  locale: Locale,
): EffectOutcome {
  const out: EffectOutcome = { blocks: [], state: { ...state }, clear: false, compact: false, exit: false };
  for (const eff of effects) {
    const ctx: Ctx = { ...out.state, ...argCtx };
    switch (eff.type) {
      case 'print':
        out.blocks.push({ type: 'sim-print', lines: interpolateLines(eff.lines, ctx) });
        break;
      case 'panel':
        out.blocks.push({ type: 'sim-panel', panel: eff.panel });
        break;
      case 'state':
        for (const [k, v] of Object.entries(eff.patch)) out.state[k] = interpolate(v, ctx);
        break;
      case 'clear':
        out.clear = true;
        break;
      case 'compact':
        out.compact = true;
        out.blocks.push({
          type: 'compacted',
          summary: interpolate(eff.summary?.[locale] ?? '…', ctx),
        });
        break;
      case 'exitSession':
        if (eff.lines) out.blocks.push({ type: 'sim-print', lines: interpolateLines(eff.lines, ctx) });
        out.blocks.push({ type: 'exit-note' });
        out.exit = true;
        out.state = initialState(agent);
        break;
    }
  }
  return out;
}

function findEntryByWord(
  agent: AgentDef,
  word: string,
  kinds: CommandEntry['kind'][],
): CommandEntry | undefined {
  const eq = word.indexOf('=');
  const w = eq > 0 ? word.slice(0, eq) : word;
  return flattenEntries(agent).find(
    (e) => kinds.includes(e.kind) && (e.name === w || e.aliases?.includes(w)),
  );
}

function scopeAllows(entry: CommandEntry, mode: TermMode): boolean {
  const scope = entry.simulate?.scope ?? (entry.kind === 'slash' ? 'session' : 'shell');
  return scope === 'both' || scope === mode;
}

/** 匹配 shell 输入里的 flag/子命令及其参数（--flag value / --flag=value / 子命令 参数） */
function matchShellEntries(
  words: string[],
  agent: AgentDef,
): { entry: CommandEntry; arg?: string; args?: string }[] {
  const out: { entry: CommandEntry; arg?: string; args?: string }[] = [];
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const kinds: CommandEntry['kind'][] =
      word.startsWith('-') && word.length > 1 ? ['flag'] : ['subcommand'];
    const entry = findEntryByWord(agent, word, kinds);
    if (!entry) continue;
    const eq = word.indexOf('=');
    let arg: string | undefined = eq > 0 ? word.slice(eq + 1) : undefined;
    const rest = words.slice(i + 1);
    if (arg === undefined && rest.length > 0 && !rest[0].startsWith('-')) arg = rest[0];
    out.push({ entry, arg, args: rest.length ? rest.join(' ') : arg });
  }
  return out;
}

/**
 * shell 层执行。仅处理「binary 开头且该 agent 配置了 session」的输入：
 * - 命中 preventSession 的 flag/子命令 → 执行其效果，留在 shell
 * - 否则应用各 flag 的效果（如 --model opus 注入初始状态）→ 横幅 + 进入会话
 * 其余输入（--help、非 binary 开头、无 session 配置）返回 null，由 Terminal 走原有逻辑。
 */
export function executeShell(input: string, agent: AgentDef, locale: Locale = 'zh'): ExecResult | null {
  const words = tokenizeWords(input);
  if (words.length === 0 || words[0] !== agent.binary || !agent.session) return null;
  if (words.some((w) => w === '--help' || w === '-h')) return null;

  const matched = matchShellEntries(words, agent);

  // 未知 flag → 交回原有解释/报错逻辑
  const matchedWords = new Set(
    matched.map((m) => m.entry.name).concat(matched.flatMap((m) => m.entry.aliases ?? [])),
  );
  for (const w of words.slice(1)) {
    if (!w.startsWith('-') || w.length <= 1) continue;
    const eq = w.indexOf('=');
    if (!matchedWords.has(eq > 0 ? w.slice(0, eq) : w)) return null;
  }
  // 子命令（如 claude mcp list）真实行为是执行后退出：无 preventSession 模拟时交回解释卡片
  if (matched.some((m) => m.entry.kind === 'subcommand' && !m.entry.simulate?.preventSession)) {
    return null;
  }

  let state = initialState(agent);
  const blocks: SimBlock[] = [];

  const preventer = matched.find((m) => m.entry.simulate?.preventSession);
  if (preventer) {
    const sim = preventer.entry.simulate!;
    const effects = preventer.arg !== undefined && sim.argEffects ? sim.argEffects : sim.effects;
    const outcome = applyEffects(effects, agent, state, { arg: preventer.arg, args: preventer.args }, locale);
    return { blocks: outcome.blocks, nextMode: 'shell', nextState: state };
  }

  for (const m of matched) {
    const sim = m.entry.simulate;
    if (!sim || !scopeAllows(m.entry, 'shell')) continue;
    const effects = m.arg !== undefined && sim.argEffects ? sim.argEffects : sim.effects;
    const outcome = applyEffects(effects, agent, state, { arg: m.arg, args: m.args }, locale);
    state = outcome.state;
    blocks.push(...outcome.blocks);
  }

  blocks.push({ type: 'banner', lines: interpolateLines(agent.session.banner, state) });
  return { blocks, nextMode: 'session', nextState: state };
}

/** 会话层执行：exit / 斜杠命令 / 普通文本（模拟发消息） */
export function executeSession(
  input: string,
  agent: AgentDef,
  state: SimState,
  locale: Locale = 'zh',
): ExecResult {
  const text = input.trim();
  const session = agent.session!;
  const exitInputs = session.exitInputs ?? ['exit', '/exit', '/quit'];

  if (exitInputs.includes(text)) {
    return {
      blocks: [{ type: 'exit-note' }],
      nextMode: 'shell',
      nextState: initialState(agent),
    };
  }

  // 裸 clear 视同 /clear；无模拟规格时默认清屏
  const normalized = text === 'clear' ? '/clear' : text;
  if (normalized === '/clear' && !findEntryByWord(agent, '/clear', ['slash'])?.simulate) {
    return { blocks: [], nextMode: 'session', nextState: state, clear: true };
  }

  if (normalized.startsWith('/')) {
    const words = tokenizeWords(normalized);
    const word = words[0];
    if (word === '/help') {
      return { blocks: [{ type: 'help-fallback' }], nextMode: 'session', nextState: state };
    }
    const entry = findEntryByWord(agent, word, ['slash']);
    if (!entry) {
      return {
        blocks: [{ type: 'sim-error', text: `Unknown command: ${word}` }],
        nextMode: 'session',
        nextState: state,
      };
    }
    const sim = entry.simulate;
    if (!sim || !scopeAllows(entry, 'session')) {
      return { blocks: [{ type: 'cards-fallback', entries: [entry] }], nextMode: 'session', nextState: state };
    }
    const rest = words.slice(1);
    const argCtx = { arg: rest[0], args: rest.length ? rest.join(' ') : undefined };
    const effects = rest.length > 0 && sim.argEffects ? sim.argEffects : sim.effects;
    const outcome = applyEffects(effects, agent, state, argCtx, locale);
    return {
      blocks: outcome.blocks,
      nextMode: outcome.exit ? 'shell' : 'session',
      nextState: outcome.state,
      clear: outcome.clear || undefined,
      compact: outcome.compact || undefined,
    };
  }

  return {
    blocks: [{ type: 'chat', userText: text, reply: interpolateLines(session.chatReply, { ...state }) }],
    nextMode: 'session',
    nextState: state,
  };
}
