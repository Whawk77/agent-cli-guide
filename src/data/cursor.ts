import type { AgentDef } from './types';

export const cursor: AgentDef = {
  id: 'cursor',
  name: 'Cursor CLI',
  binary: 'cursor-agent',
  vendor: 'Cursor (Anysphere)',
  homepage: 'https://cursor.com/docs/cli',
  install: 'curl https://cursor.com/install -fsS | bash',
  prompt: '$',
  tagline: {
    zh: 'Cursor 出品的终端编程代理，把编辑器里的 Agent 能力搬进命令行，支持 Agent / Plan / Ask 三种模式。',
  },
  coverage: 'core',
  categories: [
    {
      id: 'cli-flags',
      i18n: { zh: { title: 'CLI 启动选项' } },
      entries: [
        {
          kind: 'flag',
          name: '--print',
          aliases: ['-p'],
          example: 'cursor-agent -p "总结这个仓库的结构"',
          en: 'Print responses to console (for scripts or non-interactive use)',
          i18n: {
            zh: {
              summary: '非交互模式：输出结果后直接退出',
              detail: '适合脚本和 CI 流水线，不进入交互界面。配合 --output-format 可输出 JSON。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--output-format',
          argSpec: '<format>',
          example: 'cursor-agent -p "hi" --output-format json',
          en: 'Output format for print mode: text, json, or stream-json (default: text)',
          i18n: {
            zh: {
              summary: '设置 -p 模式的输出格式',
              detail: 'text 纯文本（默认）；json 结构化结果；stream-json 逐事件流式输出，方便程序集成。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--model',
          argSpec: '<model>',
          example: 'cursor-agent --model gpt-5',
          en: 'Specify the model to use for the session',
          i18n: {
            zh: {
              summary: '指定本次会话使用的模型',
              detail: '可用模型随账号套餐不同，用 --list-models 或 cursor-agent models 查看当前可选列表。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--resume',
          argSpec: '[chatId]',
          example: 'cursor-agent --resume',
          en: 'Resume an existing chat session, optionally by chat ID',
          i18n: {
            zh: {
              summary: '恢复历史会话（可指定会话 ID）',
              detail: '不带参数时从最近的会话恢复；也可以先用 cursor-agent ls 找到会话 ID 再指定。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--continue',
          example: 'cursor-agent --continue',
          en: 'Alias for --resume=-1 — continue the most recent chat',
          i18n: { zh: { summary: '继续最近一次的对话（等价于 --resume=-1）' } },
        },
        {
          kind: 'flag',
          name: '--mode',
          argSpec: '<mode>',
          example: 'cursor-agent --mode plan',
          en: 'Start in a specific mode: plan or ask',
          i18n: {
            zh: {
              summary: '以指定模式启动（plan 或 ask）',
              detail: 'plan 规划模式：先设计方案、多问问题再动手；ask 只读模式：只回答问题不改代码。默认是全能力的 Agent 模式。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--plan',
          example: 'cursor-agent --plan "重构鉴权模块"',
          en: 'Shorthand for --mode=plan',
          i18n: { zh: { summary: '以规划模式启动（--mode=plan 的简写）' } },
        },
        {
          kind: 'flag',
          name: '--force',
          aliases: ['-f', '--yolo'],
          example: 'cursor-agent --force',
          en: 'Force allow commands unless explicitly denied',
          i18n: {
            zh: {
              summary: '放行所有命令，除非被明确拒绝（危险）',
              detail: '相当于自动批准执行，只建议在容器/沙箱等隔离环境里用。别名 --yolo 名副其实。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--sandbox',
          argSpec: '<mode>',
          example: 'cursor-agent --sandbox enabled',
          en: 'Set sandbox mode: enabled or disabled',
          i18n: {
            zh: {
              summary: '启用/关闭沙箱执行模式',
              detail: '沙箱模式下命令在受限环境里运行，限制文件与网络访问。会话中也可以用 /sandbox 调整。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--api-key',
          argSpec: '<key>',
          example: 'cursor-agent --api-key sk-... -p "hi"',
          en: 'Authenticate with an API key (or the CURSOR_API_KEY env var)',
          i18n: {
            zh: {
              summary: '用 API Key 认证（脚本/CI 场景）',
              detail: '也可以设置环境变量 CURSOR_API_KEY，避免把密钥写进命令行历史。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--worktree',
          aliases: ['-w'],
          argSpec: '[name]',
          example: 'cursor-agent -w feature-x',
          en: 'Run in a new Git worktree under ~/.cursor/worktrees/<reponame>/<name>',
          i18n: {
            zh: {
              summary: '在新建的 Git worktree 里干活，不动主工作区',
              detail: '自动在 ~/.cursor/worktrees/ 下创建隔离副本，适合并行跑多个任务。配合 --worktree-base 可指定基础分支。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--version',
          aliases: ['-v'],
          example: 'cursor-agent --version',
          en: 'Output the version number',
          i18n: { zh: { summary: '查看版本号' } },
        },
        {
          kind: 'flag',
          name: '--help',
          aliases: ['-h'],
          example: 'cursor-agent --help',
          en: 'Display help for the command',
          i18n: { zh: { summary: '显示帮助信息' } },
        },
      ],
    },
    {
      id: 'subcommands',
      i18n: { zh: { title: '子命令' } },
      entries: [
        {
          kind: 'subcommand',
          name: 'agent',
          argSpec: '[prompt...]',
          example: 'cursor-agent agent "修复登录页面的报错"',
          en: 'Start in agent mode (the default command)',
          i18n: {
            zh: {
              summary: '启动 Agent 交互会话（默认命令）',
              detail: '直接运行 cursor-agent 效果相同；后面跟提示词可以带着任务启动。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'login',
          example: 'cursor-agent login',
          en: 'Authenticate with Cursor',
          i18n: { zh: { summary: '登录 Cursor 账号（浏览器授权）' } },
        },
        {
          kind: 'subcommand',
          name: 'logout',
          example: 'cursor-agent logout',
          en: 'Sign out and clear stored authentication',
          i18n: { zh: { summary: '退出登录并清除本地凭据' } },
        },
        {
          kind: 'subcommand',
          name: 'status',
          aliases: ['whoami'],
          example: 'cursor-agent status',
          en: 'View authentication status',
          i18n: { zh: { summary: '查看当前登录状态', detail: '加 --format json 可输出结构化结果，方便脚本判断。' } },
        },
        {
          kind: 'subcommand',
          name: 'ls',
          example: 'cursor-agent ls',
          en: 'List chat sessions and pick one to resume',
          i18n: {
            zh: {
              summary: '列出历史会话并挑一个恢复',
              detail: '想直接接着最近一次聊，用 cursor-agent resume 或 --continue 更快。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'resume',
          example: 'cursor-agent resume',
          en: 'Resume the latest chat session',
          i18n: { zh: { summary: '恢复最近一次的会话' } },
        },
        {
          kind: 'subcommand',
          name: 'mcp',
          example: 'cursor-agent mcp list',
          en: 'Manage MCP servers (list / list-tools / login / enable / disable)',
          i18n: {
            zh: {
              summary: '管理 MCP 服务器',
              detail: '服务器配置在 .cursor/mcp.json 里。mcp list 查看状态、mcp list-tools <名称> 看某个服务器提供的工具、mcp enable/disable 控制加载、mcp login 处理需要授权的服务器。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'sandbox',
          example: 'cursor-agent sandbox enable',
          en: 'Configure sandbox mode or run a command in a sandbox',
          i18n: {
            zh: {
              summary: '配置沙箱模式，或在沙箱里跑命令',
              detail: 'sandbox enable/disable 开关沙箱；sandbox run <命令> 把任意命令放进沙箱执行，可用 --allow-paths、--network 等细调权限。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'generate-rule',
          aliases: ['rule'],
          example: 'cursor-agent generate-rule',
          en: 'Generate a new Cursor rule with interactive prompts',
          i18n: {
            zh: {
              summary: '交互式生成 Cursor 规则文件',
              detail: '规则（Rules）是项目级的持久指令，存放在 .cursor/rules/，编辑器和 CLI 都会遵循。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'update',
          example: 'cursor-agent update',
          en: 'Update the CLI to the latest version',
          i18n: { zh: { summary: '更新到最新版本（会话中用 /update 同效）' } },
        },
      ],
    },
    {
      id: 'slash-commands',
      i18n: { zh: { title: '会话内斜杠命令' } },
      entries: [
        {
          kind: 'slash',
          name: '/help',
          argSpec: '[command]',
          example: '/help',
          en: 'Show help documentation',
          i18n: { zh: { summary: '查看可用命令和帮助' } },
        },
        {
          kind: 'slash',
          name: '/model',
          argSpec: '[filter]',
          example: '/model',
          en: 'Select a model',
          i18n: { zh: { summary: '会话中挑选/切换模型' } },
        },
        {
          kind: 'slash',
          name: '/plan',
          argSpec: '[prompt]',
          example: '/plan',
          en: 'Switch to Plan mode, show the current plan, or submit a prompt',
          i18n: {
            zh: {
              summary: '切换到规划模式，或查看/提交计划',
              detail: '规划模式下先出方案再动手，大改动前推荐先 /plan。Shift+Tab 也能轮换模式。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/ask',
          example: '/ask',
          en: 'Toggle Ask mode for read-only questions',
          i18n: { zh: { summary: '切换到只读问答模式（不改代码）' } },
        },
        {
          kind: 'slash',
          name: '/run-everything',
          argSpec: '[on|off|status]',
          example: '/run-everything status',
          en: 'Toggle automatic command execution or check its status',
          i18n: {
            zh: {
              summary: '开关"自动执行所有命令"',
              detail: '开启后命令不再逐条确认，相当于会话内版的 --force，注意风险。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/summarize',
          aliases: ['/compress'],
          example: '/summarize',
          en: 'Free up context window space by summarizing the conversation',
          i18n: {
            zh: {
              summary: '压缩对话：用摘要释放上下文空间',
              detail: '对话太长、上下文吃紧时用，保留要点继续干活。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/rewind',
          example: '/rewind',
          en: 'Jump back to a previous message',
          i18n: { zh: { summary: '回退到之前的某条消息重新来' } },
        },
        {
          kind: 'slash',
          name: '/clear',
          example: '/clear',
          en: 'Start a new chat session',
          i18n: { zh: { summary: '清空当前对话，开新会话' } },
        },
        {
          kind: 'slash',
          name: '/resume',
          example: '/resume',
          en: 'Open recent chats and resume one',
          i18n: { zh: { summary: '打开最近会话列表并恢复' } },
        },
        {
          kind: 'slash',
          name: '/shell',
          argSpec: '[command]',
          example: '/shell git status',
          en: 'Enter Shell Mode to run commands directly',
          i18n: { zh: { summary: '进入 Shell 模式，直接执行命令' } },
        },
        {
          kind: 'slash',
          name: '/quit',
          aliases: ['/exit'],
          example: '/quit',
          en: 'Exit the application',
          i18n: { zh: { summary: '退出 Cursor CLI（双击 Ctrl+D 同效）' } },
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
          en: 'Rotate between modes: Agent, Plan, Ask',
          i18n: {
            zh: {
              summary: '循环切换模式（Agent → Plan → Ask）',
              detail: 'Agent 全能力干活；Plan 先规划再执行；Ask 只读问答。',
            },
          },
        },
        {
          kind: 'shortcut',
          name: 'Shift+Enter',
          en: 'Insert a newline instead of submitting (Ctrl+J also works in all terminals)',
          i18n: { zh: { summary: '输入换行而不发送（Ctrl+J 通用兼容）' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+R',
          en: 'Review changes made by the agent',
          i18n: {
            zh: {
              summary: '打开改动审查视图，逐个文件看 diff',
              detail: '审查时用 ↑/↓ 滚动、←/→ 切换文件，按 i 可以针对改动追加指示。',
            },
          },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+D',
          en: 'Exit the CLI (press twice)',
          i18n: { zh: { summary: '双击退出 Cursor CLI' } },
        },
        {
          kind: 'interactive',
          name: '@',
          argSpec: '<file>',
          example: '@src/auth.ts 这个文件有什么问题？',
          en: 'Reference files and folders to include them in context',
          i18n: { zh: { summary: '输入 @ 引用文件/目录，纳入对话上下文' } },
        },
        {
          kind: 'interactive',
          name: '&',
          argSpec: '<prompt>',
          example: '& 重构鉴权模块并补全测试',
          en: 'Prepend & to hand the task off to a Cloud Agent that keeps running in the background',
          i18n: {
            zh: {
              summary: '行首输入 &：把任务交给云端 Agent 后台跑',
              detail: '会话被推到 Cloud Agent 继续执行，你可以关掉终端离开，稍后回来看结果。',
            },
          },
        },
      ],
    },
  ],
};
