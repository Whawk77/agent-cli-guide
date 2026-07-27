import type { AgentDef, CommandEntry } from '../src/data/types';

export type OutputMode = 'annotate' | 'passthrough';

export interface CliOptions {
  locale: 'zh-CN';
  mode: OutputMode;
  agentId?: string;
  command?: string;
  forwardedArgs: string[];
  action: 'run' | 'help' | 'explain' | 'list' | 'doctor' | 'version';
}

export function parseCliArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    locale: 'zh-CN',
    mode: 'annotate',
    action: 'help',
    forwardedArgs: [],
  };
  const args = [...argv];

  while (args.length > 0) {
    const arg = args[0];
    if (arg === '--locale') {
      args.shift();
      const locale = args.shift();
      if (locale !== 'zh-CN' && locale !== 'zh') {
        throw new Error(`暂不支持语言 ${locale ?? '(空)'}；当前可用：zh-CN`);
      }
      options.locale = 'zh-CN';
      continue;
    }
    if (arg === '--mode') {
      args.shift();
      const mode = args.shift();
      if (mode !== 'annotate' && mode !== 'passthrough') {
        throw new Error(`无效模式 ${mode ?? '(空)'}；可用：annotate、passthrough`);
      }
      options.mode = mode;
      continue;
    }
    if (arg === '--passthrough') {
      args.shift();
      options.mode = 'passthrough';
      continue;
    }
    break;
  }

  const first = args.shift();
  if (!first || first === '--help' || first === '-h' || first === 'help') {
    options.action = 'help';
    options.agentId = args.shift();
    return options;
  }
  if (first === '--version' || first === '-V') {
    options.action = 'version';
    return options;
  }
  if (first === 'list') {
    options.action = 'list';
    return options;
  }
  if (first === 'doctor') {
    options.action = 'doctor';
    return options;
  }
  if (first === 'explain') {
    options.action = 'explain';
    const maybeAgent = args[0];
    if (maybeAgent && !maybeAgent.startsWith('/') && !maybeAgent.startsWith('-')) {
      options.agentId = args.shift();
    } else {
      options.agentId = 'codex';
    }
    options.command = args.shift();
    return options;
  }

  options.agentId = first;
  options.forwardedArgs = args;
  options.action = args.includes('--help') || args.includes('-h') ? 'help' : 'run';
  return options;
}

export function findAgent(agents: AgentDef[], idOrBinary?: string): AgentDef | undefined {
  if (!idOrBinary) return undefined;
  const normalized = idOrBinary.toLowerCase();
  return agents.find((agent) =>
    agent.id.toLowerCase() === normalized
    || agent.binary.toLowerCase() === normalized
    || agent.name.toLowerCase() === normalized,
  );
}

export function allEntries(agent: AgentDef): CommandEntry[] {
  return agent.categories.flatMap((category) => category.entries);
}

export function findEntry(agent: AgentDef, input?: string): CommandEntry | undefined {
  if (!input) return undefined;
  return allEntries(agent).find((entry) => entry.name === input || entry.aliases?.includes(input));
}

export function formatEntry(entry: CommandEntry, detailed = true): string {
  const aliases = entry.aliases?.length ? `  别名：${entry.aliases.join(', ')}` : '';
  const argument = entry.argSpec ? ` ${entry.argSpec}` : '';
  const detail = detailed && entry.i18n.zh.detail ? `\n  说明：${entry.i18n.zh.detail}` : '';
  const example = detailed && entry.example ? `\n  示例：${entry.example}` : '';
  return `${entry.name}${argument}${aliases}\n  中文：${entry.i18n.zh.summary}\n  EN：${entry.en}${detail}${example}`;
}

export function formatAgentHelp(agent: AgentDef): string {
  const sections = agent.categories.map((category) => {
    const rows = category.entries.map((entry) => {
      const aliases = entry.aliases?.length ? ` (${entry.aliases.join(', ')})` : '';
      const left = `${entry.name}${entry.argSpec ? ` ${entry.argSpec}` : ''}${aliases}`;
      return `  ${left.padEnd(38)} ${entry.i18n.zh.summary}\n${''.padEnd(40)} EN: ${entry.en}`;
    });
    return `\n${category.i18n.zh.title}\n${'─'.repeat(72)}\n${rows.join('\n')}`;
  });

  return [
    `${agent.name} · 中英双语命令帮助`,
    agent.tagline.zh,
    `官方命令：${agent.binary}    安装：${agent.install}`,
    `文档：${agent.homepage}`,
    ...sections,
  ].join('\n');
}

export function formatRootHelp(agents: AgentDef[]): string {
  return [
    'AgentL10n · Agent CLI 开源本地化层（MVP）',
    '',
    '用法：',
    '  agent-l10n <agent> [官方参数...]       启动真实 CLI（默认透传）',
    '  agent-l10n <agent> --help              显示中英双语帮助',
    '  agent-l10n explain [agent] <command>   解释一个命令',
    '  agent-l10n list                        列出支持的 CLI',
    '  agent-l10n doctor                      检查本机 CLI 安装情况',
    '',
    '选项：',
    '  --locale zh-CN        界面语言',
    '  --mode annotate       中英注释模式（当前用于帮助和解释）',
    '  --mode passthrough    完全透传，不修改官方 CLI 输出',
    '  --passthrough         passthrough 的快捷写法',
    '',
    '已收录：',
    ...agents.map((agent) => `  ${agent.binary.padEnd(10)} ${agent.name} — ${agent.tagline.zh}`),
    '',
    '示例：',
    '  agent-l10n codex --help',
    '  agent-l10n explain codex /permissions',
    '  agent-l10n codex',
  ].join('\n');
}

