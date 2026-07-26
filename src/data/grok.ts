import type { AgentDef } from './types';

export const grok: AgentDef = {
  id: 'grok',
  name: 'Grok Build',
  binary: 'grok',
  vendor: 'xAI',
  homepage: 'https://docs.x.ai/build/overview',
  install: 'curl -fsSL https://x.ai/cli/install.sh | bash',
  prompt: '$',
  tagline: {
    zh: 'xAI 官方终端编程代理：全屏 TUI 读改代码、跑命令，支持规划模式、子代理和无头 CI 运行。',
  },
  coverage: 'core',
  categories: [
    {
      id: 'cli-flags',
      i18n: { zh: { title: 'CLI 启动选项' } },
      entries: [
        {
          kind: 'flag',
          name: '--single',
          aliases: ['-p'],
          argSpec: '"<prompt>"',
          example: 'grok -p "总结这个仓库的结构"',
          en: 'Headless mode: send one prompt, print the result and exit',
          i18n: {
            zh: {
              summary: '无头模式：发送一条指令，输出结果后退出',
              detail: '适合脚本和 CI 流水线。配合 --output-format streaming-json 可以逐事件拿到结构化输出。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--model',
          aliases: ['-m'],
          argSpec: '<model>',
          example: 'grok -m grok-build-0.1',
          en: 'Choose a model for this run',
          i18n: {
            zh: {
              summary: '指定本次运行使用的模型',
              detail: '默认使用配套的编程模型（如 grok-build-0.1）。也可以在 ~/.grok/config.toml 里用 [model.xxx] 段接入自定义模型。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--continue',
          aliases: ['-c'],
          example: 'grok --continue',
          en: 'Continue the most recent session in the current directory',
          i18n: {
            zh: {
              summary: '继续当前目录里最近一次的会话',
              detail: '会话数据存在 ~/.grok/sessions，关掉终端后回来接着干活就靠它。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--resume',
          aliases: ['-r'],
          argSpec: '<id>',
          example: 'grok --resume my-session',
          en: 'Resume an existing session by ID',
          i18n: { zh: { summary: '按 ID 恢复指定的历史会话' } },
        },
        {
          kind: 'flag',
          name: '--session-id',
          aliases: ['-s'],
          argSpec: '<id>',
          example: 'grok -s nightly-fix -p "跑一遍测试并修复失败用例"',
          en: 'Create or resume a named headless session',
          i18n: {
            zh: {
              summary: '创建/恢复一个具名的无头会话',
              detail: '给脚本里的会话起固定名字，多次调用共享同一份上下文，适合分步骤的自动化任务。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--output-format',
          argSpec: '<fmt>',
          example: 'grok -p "hi" --output-format json',
          en: 'Output format for headless mode: plain, json, streaming-json',
          i18n: {
            zh: {
              summary: '设置无头模式的输出格式',
              detail: 'plain 纯文本；json 结构化结果；streaming-json 逐事件流式输出，方便程序解析。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--always-approve',
          example: 'grok --always-approve -p "格式化所有代码"',
          en: 'Auto-approve tool executions (no permission prompts)',
          i18n: {
            zh: {
              summary: '自动批准所有工具执行（不再询问）',
              detail: '无人值守跑任务时用，建议只在容器/CI 等隔离环境开启。会话内对应 /always-approve 或 Ctrl+O。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--cwd',
          argSpec: '<path>',
          example: 'grok --cwd ../backend -p "解释入口文件"',
          en: 'Set the working directory',
          i18n: { zh: { summary: '指定工作目录' } },
        },
        {
          kind: 'flag',
          name: '--no-alt-screen',
          example: 'grok --no-alt-screen',
          en: 'Run inline (no alternate screen / fullscreen TUI takeover)',
          i18n: {
            zh: {
              summary: '行内运行，不接管全屏',
              detail: '默认是全屏 TUI；加这个选项后在终端原地输出，滚动历史保留在原终端里。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--no-auto-update',
          example: 'grok --no-auto-update',
          en: 'Skip background update checks (for automated environments)',
          i18n: { zh: { summary: '跳过后台更新检查（CI 环境适用）' } },
        },
        {
          kind: 'flag',
          name: '--version',
          example: 'grok --version',
          en: 'Print the version number',
          i18n: { zh: { summary: '查看版本号' } },
        },
      ],
    },
    {
      id: 'subcommands',
      i18n: { zh: { title: '子命令' } },
      entries: [
        {
          kind: 'subcommand',
          name: 'inspect',
          example: 'grok inspect',
          en: 'See what Grok discovered in the current directory: config sources, instructions, skills, plugins, hooks, and MCP servers',
          i18n: {
            zh: {
              summary: '查看当前目录被加载了什么（配置、指令、技能、插件、钩子、MCP）',
              detail: '排查"为什么它这样行动"的第一步：把所有生效的配置来源一次列全。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'mcp',
          example: 'grok mcp list',
          en: 'Manage MCP servers: add / list / remove / doctor',
          i18n: {
            zh: {
              summary: '管理 MCP 服务器（添加/列出/删除/诊断）',
              detail: '本地服务器用 grok mcp add <name> -- <command>；远程用 grok mcp add --transport http <name> <url>；加 --scope project 定义到项目级。grok mcp doctor 诊断连通性。配置写在 ~/.grok/config.toml，也兼容 .mcp.json、.cursor/mcp.json。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'agent stdio',
          example: 'grok agent stdio',
          en: 'Run Grok as an ACP agent over JSON-RPC on stdin/stdout',
          i18n: {
            zh: {
              summary: '以 ACP 代理模式运行（stdin/stdout 上的 JSON-RPC）',
              detail: 'ACP（Agent Client Protocol）让编辑器/IDE 把 Grok Build 当作内嵌代理驱动。',
            },
          },
        },
      ],
    },
    {
      id: 'slash-commands',
      i18n: { zh: { title: '会话内斜杠命令' } },
      entries: [
        {
          kind: 'slash',
          name: '/plan',
          argSpec: '[description]',
          example: '/plan 重构登录模块',
          en: 'Enter plan mode: only the session plan file can be edited until you approve',
          i18n: {
            zh: {
              summary: '进入规划模式：先出方案，批准前不改任何代码',
              detail: '批准前只允许编辑会话计划文件，你可以逐条评论或直接改写计划。大改动前强烈建议先规划。Shift+Tab 也能切进来。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/view-plan',
          example: '/view-plan',
          en: 'View the current plan',
          i18n: { zh: { summary: '查看当前计划' } },
        },
        {
          kind: 'slash',
          name: '/auto',
          example: '/auto',
          en: 'Toggle auto mode: a classifier auto-approves safe tools; dangerous ones may still prompt',
          i18n: {
            zh: {
              summary: '切换自动模式：安全操作自动放行，危险操作仍会确认',
              detail: '介于逐条确认和完全放开之间的折中，由分类器判断工具调用是否安全。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/always-approve',
          example: '/always-approve',
          en: 'Toggle always-approve mode: skip permission prompts for tool calls',
          i18n: { zh: { summary: '切换免确认模式：所有工具调用直接放行（慎用）' } },
        },
        {
          kind: 'slash',
          name: '/model',
          aliases: ['/m'],
          argSpec: '<name>',
          example: '/model grok-build-0.1',
          en: 'Switch the active model within the TUI',
          i18n: { zh: { summary: '会话中切换模型' } },
        },
        {
          kind: 'slash',
          name: '/new',
          aliases: ['/clear'],
          example: '/new',
          en: 'Start a new session',
          i18n: { zh: { summary: '开启新会话（清空当前上下文）' } },
        },
        {
          kind: 'slash',
          name: '/resume',
          example: '/resume',
          en: 'Resume a previous session',
          i18n: { zh: { summary: '恢复之前的会话' } },
        },
        {
          kind: 'slash',
          name: '/btw',
          argSpec: '<question>',
          example: '/btw 这个报错一般是什么原因？',
          en: 'Ask a side question without interrupting the current task',
          i18n: {
            zh: {
              summary: '插一句题外问题，不打断当前任务',
              detail: '主任务继续跑，你的问题走旁路回答，避免为一个小疑问中断长任务。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/loop',
          argSpec: '[interval] <prompt>',
          example: '/loop 5m 检查一下 CI 是否通过',
          en: 'Run a prompt on a recurring interval',
          i18n: { zh: { summary: '按固定间隔循环执行一条指令', detail: '适合轮询构建状态、盯部署这类周期性任务。' } },
        },
        {
          kind: 'slash',
          name: '/context',
          example: '/context',
          en: 'Check context usage',
          i18n: { zh: { summary: '查看上下文占用情况' } },
        },
        {
          kind: 'slash',
          name: '/mcps',
          example: '/mcps',
          en: 'Open the MCP extensions modal',
          i18n: {
            zh: {
              summary: '打开 MCP 扩展面板',
              detail: '面板里 Space 启停服务器、r 刷新、i 完成 OAuth 认证、a 添加、x 删除。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/config-agents',
          aliases: ['/agents'],
          example: '/config-agents',
          en: 'Manage subagents (independent child sessions with their own context)',
          i18n: {
            zh: {
              summary: '管理子代理（subagent）',
              detail: '子代理是拥有独立上下文的子会话，结束后向主会话返回摘要。内置 general-purpose（全能力）、explore（只读检索）、plan（只出方案）三种；自定义放在 .grok/agents/ 或 ~/.grok/agents/。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/memory',
          aliases: ['/mem'],
          example: '/memory',
          en: 'Browse and manage memories',
          i18n: { zh: { summary: '浏览和管理记忆' } },
        },
        {
          kind: 'slash',
          name: '/settings',
          aliases: ['/config'],
          example: '/settings',
          en: 'Open the settings modal',
          i18n: { zh: { summary: '打开设置面板' } },
        },
        {
          kind: 'slash',
          name: '/dashboard',
          example: '/dashboard',
          en: 'Open the Agent Dashboard',
          i18n: { zh: { summary: '打开代理面板（Agent Dashboard）', detail: '总览各个会话/任务的运行状态。快捷键 Ctrl+\\ 同效。' } },
        },
        {
          kind: 'slash',
          name: '/quit',
          aliases: ['/exit'],
          example: '/quit',
          en: 'Quit the application',
          i18n: { zh: { summary: '退出 Grok Build' } },
        },
      ],
    },
    {
      id: 'shortcuts',
      i18n: { zh: { title: '快捷键与输入技巧' } },
      entries: [
        {
          kind: 'shortcut',
          name: 'Shift+Tab',
          en: 'Cycle session mode: Normal / Plan / Auto / Always-approve',
          i18n: {
            zh: {
              summary: '循环切换会话模式（普通 → 规划 → 自动 → 免确认）',
              detail: '规划模式只出方案不动代码；自动模式安全操作免确认；免确认模式全部放行。',
            },
          },
        },
        {
          kind: 'shortcut',
          name: 'Esc',
          en: 'Cancel the running turn',
          i18n: { zh: { summary: '打断当前正在执行的回合' } },
        },
        {
          kind: 'shortcut',
          name: 'Esc Esc',
          en: 'Clear the prompt, or open rewind when it is empty',
          i18n: { zh: { summary: '双击 Esc：清空输入框；输入框为空时打开回退（rewind）' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+P',
          aliases: ['?'],
          en: 'Open the command palette',
          i18n: { zh: { summary: '打开命令面板' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+Enter',
          aliases: ['Ctrl+I'],
          en: 'Interject while a turn is running',
          i18n: {
            zh: {
              summary: '任务运行中插话',
              detail: '不打断当前回合，直接把补充说明递给正在干活的代理。',
            },
          },
        },
        {
          kind: 'shortcut',
          name: 'Shift+Enter',
          en: 'Newline — or send, in multiline mode',
          i18n: { zh: { summary: '换行（多行模式下变为发送）', detail: '终端不支持时可用 Alt+Enter 换行；Ctrl+M 切换多行输入模式。' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+B',
          en: 'Send the running command to the background',
          i18n: { zh: { summary: '把正在运行的命令转入后台' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+O',
          en: 'Toggle always-approve',
          i18n: { zh: { summary: '快速开关免确认模式' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+T',
          en: 'Toggle the todo pane (agent screen)',
          i18n: { zh: { summary: '开关待办事项面板' } },
        },
        {
          kind: 'interactive',
          name: '!',
          argSpec: '<command>',
          example: '! git status',
          en: 'Shell mode: on an empty prompt, run a shell command directly',
          i18n: { zh: { summary: '空输入框时输入 !：直接执行 shell 命令' } },
        },
      ],
    },
  ],
};
