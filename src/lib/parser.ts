import type { AgentDef, CommandEntry } from '../data/types';

export interface Token {
  text: string;
  kind: 'binary' | 'entry' | 'arg' | 'unknown-flag' | 'unknown-slash';
  entry?: CommandEntry;
}

export function flattenEntries(agent: AgentDef): CommandEntry[] {
  return agent.categories.flatMap((c) => c.entries);
}

/** 去掉 --flag=value 里的取值部分 */
function stripValue(word: string): string {
  const eq = word.indexOf('=');
  return eq > 0 ? word.slice(0, eq) : word;
}

function matchEntry(
  agent: AgentDef,
  word: string,
  kinds: CommandEntry['kind'][],
): CommandEntry | undefined {
  const w = stripValue(word);
  return flattenEntries(agent).find(
    (e) => kinds.includes(e.kind) && (e.name === w || e.aliases?.includes(w)),
  );
}

export function tokenizeWords(input: string): string[] {
  return input.trim().split(/\s+/).filter(Boolean);
}

/**
 * 把一行输入解析成 token 序列，并为每个 token 关联当前 agent 的命令条目。
 * 规则：
 * - 行首的 /xxx 按斜杠命令匹配
 * - 行首的 ! / # 按交互触发符匹配
 * - -x / --xxx（含 --xxx=value）按 flag 匹配
 * - 其余单词按子命令匹配，匹配不到视为参数
 */
export function parse(input: string, agent: AgentDef): Token[] {
  const words = tokenizeWords(input);
  if (words.length === 0) return [];

  const tokens: Token[] = [];
  words.forEach((word, i) => {
    if (i === 0 && word === agent.binary) {
      tokens.push({ text: word, kind: 'binary' });
      return;
    }
    if (i === 0 && word.startsWith('/')) {
      const entry = matchEntry(agent, word, ['slash']);
      tokens.push(entry ? { text: word, kind: 'entry', entry } : { text: word, kind: 'unknown-slash' });
      return;
    }
    if (word.startsWith('@')) {
      const entry = matchEntry(agent, '@', ['interactive']);
      if (entry) {
        tokens.push({ text: word, kind: 'entry', entry });
        return;
      }
    }
    if (i === 0 && (word === '!' || word === '#')) {
      const entry = matchEntry(agent, word, ['interactive']);
      if (entry) {
        tokens.push({ text: word, kind: 'entry', entry });
        return;
      }
    }
    if (word.startsWith('-') && word.length > 1) {
      const entry = matchEntry(agent, word, ['flag']);
      tokens.push(entry ? { text: word, kind: 'entry', entry } : { text: word, kind: 'unknown-flag' });
      return;
    }
    const entry = matchEntry(agent, word, ['subcommand']);
    tokens.push(entry ? { text: word, kind: 'entry', entry } : { text: word, kind: 'arg' });
  });
  return tokens;
}

/** 是否在请求帮助：`claude --help` / `claude -h` / 只输入了 binary */
export function isHelpRequest(input: string, agent: AgentDef): boolean {
  const words = tokenizeWords(input);
  if (words.length === 0) return false;
  if (words.length === 1 && words[0] === agent.binary) return true;
  return words[0] === agent.binary && words.some((w) => w === '--help' || w === '-h');
}

export interface Suggestion {
  entry?: CommandEntry;
  /** 应用补全后替换「最后一个词」的文本 */
  insert: string;
  /** 展示用标签 */
  label: string;
  /** 展示用中文摘要 */
  summary: string;
}

/** 基于最后一个正在输入的词给出补全建议 */
export function suggest(
  input: string,
  agent: AgentDef,
  locale: 'zh' = 'zh',
  mode: 'shell' | 'session' = 'shell',
): Suggestion[] {
  if (input.endsWith(' ') || input.trim() === '') return [];
  const words = tokenizeWords(input);
  const last = words[words.length - 1];
  const isFirst = words.length === 1;
  const all = flattenEntries(agent);
  const out: Suggestion[] = [];

  const pushEntry = (e: CommandEntry) =>
    out.push({ entry: e, insert: e.name, label: e.name + (e.argSpec ? ' ' + e.argSpec : ''), summary: e.i18n[locale].summary });

  // 会话层：只提示斜杠命令和 exit
  if (mode === 'session') {
    if (isFirst && last.startsWith('/')) {
      all.filter((e) => e.kind === 'slash' && e.name.startsWith(last)).forEach(pushEntry);
    } else if (isFirst && 'exit'.startsWith(last) && last !== 'exit') {
      out.push({ insert: 'exit', label: 'exit', summary: '退出仿真会话' });
    }
    return out.slice(0, 8);
  }

  if (isFirst && last.startsWith('/')) {
    all.filter((e) => e.kind === 'slash' && e.name.startsWith(last)).forEach(pushEntry);
  } else if (last.startsWith('-') && last.length >= 1 && !isFirst) {
    all
      .filter((e) => e.kind === 'flag' && (e.name.startsWith(last) || e.aliases?.some((a) => a.startsWith(last))))
      .forEach(pushEntry);
  } else if (isFirst) {
    if (agent.binary.startsWith(last) && agent.binary !== last) {
      out.push({ insert: agent.binary, label: agent.binary, summary: agent.tagline[locale] });
    }
  } else {
    all.filter((e) => e.kind === 'subcommand' && e.name.startsWith(last) && e.name !== last).forEach(pushEntry);
  }
  return out.slice(0, 8);
}

/** 应用补全：替换输入里最后一个词 */
export function applySuggestion(input: string, s: Suggestion): string {
  const idx = input.lastIndexOf(input.trim().split(/\s+/).pop() ?? '');
  return input.slice(0, idx) + s.insert + ' ';
}

/** 检测第一个词是否是其他 agent 的可执行名 */
export function detectOtherAgent(input: string, current: AgentDef, agents: AgentDef[]): AgentDef | undefined {
  const first = tokenizeWords(input)[0];
  if (!first) return undefined;
  return agents.find((a) => a.id !== current.id && a.binary === first);
}
