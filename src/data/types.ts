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
  /** 模拟终端提示符，如 '$' */
  prompt: string;
  /** 一句话介绍 */
  tagline: Record<Locale, string>;
  /** full = 全量收录；core = 核心命令集，持续补充 */
  coverage: 'full' | 'core';
  categories: Category[];
}
