/** 支持的界面/翻译语言。新增语言时在此扩展，例如 'zh' | 'ja' | 'ko'。 */
export type Locale = 'zh';

export type EntryKind = 'flag' | 'subcommand' | 'slash' | 'shortcut' | 'interactive';

export interface LocalizedText {
  /** 一行摘要（母语） */
  summary: string;
  /** 可选的详细说明（母语） */
  detail?: string;
}

export interface CommandEntry {
  kind: EntryKind;
  /** 命令原文，如 '--model'、'mcp'、'/compact'、'Ctrl+R' */
  name: string;
  /** 别名/短选项，如 ['-m'] */
  aliases?: string[];
  /** 参数占位，如 '<model>' */
  argSpec?: string;
  /** 可直接在模拟终端里执行的示例 */
  example?: string;
  /** 官方英文原文（一行） */
  en: string;
  /** 各语言翻译。v1 只填 zh，英文原文始终保留展示。 */
  i18n: Record<Locale, LocalizedText>;
  /** 触发效果模拟规格；无则回退到解释卡片 */
  simulate?: SimulateSpec;
}

export interface Category {
  id: string;
  i18n: Record<Locale, { title: string }>;
  entries: CommandEntry[];
}

export interface AgentDef {
  id: string;
  name: string;
  /** 终端可执行名，如 'claude'、'codex' */
  binary: string;
  vendor: string;
  homepage: string;
  /** 安装命令 */
  install: string;
  /** 本轮核验过的官方发行信息。版本源必须能被 scripts/check-releases.mjs 自动读取。 */
  release: {
    version: string;
    channel: 'latest' | 'stable';
    verifiedAt: string;
    source: string;
  };
  /** 模拟终端提示符，如 '$' */
  prompt: string;
  /** 一句话介绍 */
  tagline: Record<Locale, string>;
  /** full = 全量收录；core = 核心命令集，持续补充 */
  coverage: 'full' | 'core';
  /** 会话仿真配置；未配置的 agent 保持纯 shell 行为 */
  session?: SessionSim;
  categories: Category[];
}

/* ── 命令触发效果模拟 ─────────────────────────────
 * 所有字段均为可选扩展：无 simulate 的 entry 回退到解释卡片。
 * 文案 i18n 约定不变：面向用户的注释/标签都是 Record<Locale, string>。
 */

/** 一行仿真输出。text 支持 {key} 占位：会话状态键、{arg}（首个参数）、{args}（全部参数） */
export interface SimLine {
  text: string;
  /** 行尾的母语注释 */
  note?: Record<Locale, string>;
  style?: 'dim' | 'accent' | 'ok' | 'warn';
}

/** 仿真状态栏字段定义 */
export interface SimField {
  key: string;
  label: Record<Locale, string>;
  initial: string;
  options?: string[];
}

export interface SimPanelItem {
  /** 选中后写入 stateKey 的值 */
  value: string;
  label: string;
  note?: Record<Locale, string>;
}

/** 仿真交互面板（如 /model 的模型选择列表） */
export interface SimPanelSpec {
  title: Record<Locale, string>;
  /** 绑定的状态键：点击条目写回该键，选中态取当前 state 值。省略则为纯展示列表 */
  stateKey?: string;
  items: SimPanelItem[];
}

export type SimEffect =
  | { type: 'print'; lines: SimLine[] }
  | { type: 'panel'; panel: SimPanelSpec }
  /** 修改会话状态；值支持 {arg} 等占位 */
  | { type: 'state'; patch: Record<string, string> }
  | { type: 'clear' }
  /** 历史折叠为一条摘要块 */
  | { type: 'compact'; summary?: Record<Locale, string> }
  | { type: 'exitSession'; lines?: SimLine[] };

export interface SimulateSpec {
  /** 生效层。缺省推断：slash → session，flag/subcommand → shell */
  scope?: 'shell' | 'session' | 'both';
  /** 无参数时执行的效果序列 */
  effects: SimEffect[];
  /** 带参数时执行；缺省则带参也走 effects */
  argEffects?: SimEffect[];
  /** shell 层专用：该 flag/子命令打印即退出，不进入会话（如 --version、mcp list） */
  preventSession?: boolean;
}

/** agent 的会话仿真配置 */
export interface SessionSim {
  /** 会话内提示符，如 '>' */
  prompt: string;
  /** 进入会话时的欢迎横幅 */
  banner: SimLine[];
  /** 状态栏字段与初始值 */
  statusFields: SimField[];
  /** 会话内输入普通文本时的模拟回复 */
  chatReply: SimLine[];
  /** 退出会话的输入，默认 ['exit', '/exit', '/quit'] */
  exitInputs?: string[];
}
