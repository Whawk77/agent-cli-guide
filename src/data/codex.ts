import type { AgentDef } from './types';

export const codex: AgentDef = {
  id: 'codex',
  name: 'Codex CLI',
  binary: 'codex',
  vendor: 'OpenAI',
  homepage: 'https://developers.openai.com/codex/cli',
  install: 'npm install -g @openai/codex',
  prompt: '$',
  tagline: {
    zh: 'OpenAI 官方终端编程代理，在命令行里读代码、改文件、跑命令，支持沙箱与审批控制。',
  },
  coverage: 'full',
  categories: [
    {
      id: 'cli-flags',
      i18n: { zh: { title: 'CLI 启动选项' } },
      entries: [
        {
          kind: 'flag',
          name: '--model',
          aliases: ['-m'],
          argSpec: '<model>',
          example: 'codex --model gpt-5.1-codex',
          en: 'Override the configured model for this session',
          i18n: {
            zh: {
              summary: '指定本次会话使用的模型',
              detail: '覆盖配置文件里的默认模型，也可以连推理力度一起选（如 gpt-5.1-codex 配 high）。会话中用 /model 也能切换。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--ask-for-approval',
          aliases: ['-a'],
          argSpec: '<policy>',
          example: 'codex --ask-for-approval on-request',
          en: 'Approval policy for running commands: untrusted, on-request, never',
          i18n: {
            zh: {
              summary: '设置执行命令前的审批策略',
              detail: 'untrusted 只放行少数可信命令、其余都先问你；on-request 由模型在需要时申请；never 从不询问（配合沙箱使用）。官方推荐日常用 --sandbox workspace-write 加 on-request。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--sandbox',
          aliases: ['-s'],
          argSpec: '<policy>',
          example: 'codex --sandbox workspace-write',
          en: 'Sandbox policy: read-only, workspace-write, danger-full-access',
          i18n: {
            zh: {
              summary: '选择沙箱权限级别',
              detail: 'read-only 只读；workspace-write 可写工作目录（最常用）；danger-full-access 不设防（危险）。想让它多访问一个目录时，优先用 --add-dir 而不是直接放开全部权限。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--full-auto',
          example: 'codex --full-auto "修复所有 lint 报错"',
          en: 'Low-friction automation preset (workspace-write sandbox); deprecated in exec, prefer --sandbox workspace-write',
          i18n: {
            zh: {
              summary: '全自动模式：在沙箱内放手干活',
              detail: '相当于 workspace-write 沙箱加低打扰审批的组合预设。新版文档在 exec 中已标记弃用，建议改用 --sandbox workspace-write 显式声明。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--cd',
          aliases: ['-C'],
          argSpec: '<path>',
          example: 'codex --cd ~/projects/demo',
          en: 'Set the working directory before Codex starts',
          i18n: {
            zh: {
              summary: '指定启动时的工作目录',
              detail: '不用先 cd 过去，直接告诉 Codex 以哪个目录为工作区根。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--add-dir',
          argSpec: '<path>',
          example: 'codex --add-dir ../backend',
          en: 'Grant additional directories write access alongside the main workspace',
          i18n: {
            zh: {
              summary: '额外授权可写的其他目录',
              detail: '跨仓库/跨目录干活时把别的路径加进沙箱，比一刀切的 danger-full-access 安全得多。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--config',
          aliases: ['-c'],
          argSpec: '<key=value>',
          example: 'codex -c model_reasoning_effort=high',
          en: 'Override individual configuration values for this run',
          i18n: {
            zh: {
              summary: '临时覆盖单个配置项',
              detail: '配置来自 ~/.codex/config.toml，这个参数可重复使用，逐项覆盖，只对本次运行生效。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--profile',
          aliases: ['-p'],
          argSpec: '<name>',
          example: 'codex --profile work',
          en: 'Layer a named profile config on top of the base user config',
          i18n: {
            zh: {
              summary: '加载指定配置档案（profile）',
              detail: '在基础配置之上叠加一套命名配置，方便在不同项目/场景间切换整组设置。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--image',
          aliases: ['-i'],
          argSpec: '<path,...>',
          example: 'codex -i screenshot.png "按这个设计稿改页面"',
          en: 'Attach one or more image files to the initial prompt',
          i18n: {
            zh: {
              summary: '在首条消息里附带图片',
              detail: '可以一次带多张（逗号分隔），常用于喂设计稿、报错截图。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--search',
          example: 'codex --search',
          en: 'Enable live web search for the session',
          i18n: { zh: { summary: '开启联网搜索能力' } },
        },
        {
          kind: 'flag',
          name: '--oss',
          example: 'codex --oss --local-provider ollama',
          en: 'Use a local open source model provider (with --local-provider lmstudio or ollama)',
          i18n: {
            zh: {
              summary: '改用本地开源模型',
              detail: '搭配 --local-provider 选择 lmstudio 或 ollama，让 Codex 跑在本地模型上。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--dangerously-bypass-approvals-and-sandbox',
          aliases: ['--yolo'],
          example: 'codex --yolo',
          en: 'Run every command without approvals or sandboxing (dangerous)',
          i18n: {
            zh: {
              summary: '跳过所有审批和沙箱（危险）',
              detail: '完全放开手脚，任何命令都直接执行。官方明确警告：只应在隔离的沙箱虚拟机里使用。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--version',
          example: 'codex --version',
          en: 'Print the version number',
          i18n: { zh: { summary: '查看版本号' } },
        },
        {
          kind: 'flag',
          name: '--help',
          aliases: ['-h'],
          example: 'codex --help',
          en: 'Show help for the command',
          i18n: { zh: { summary: '显示帮助信息（本站会显示翻译版）' } },
        },
      ],
    },
    {
      id: 'subcommands',
      i18n: { zh: { title: '子命令' } },
      entries: [
        {
          kind: 'subcommand',
          name: 'exec',
          aliases: ['e'],
          argSpec: '"<prompt>"',
          example: 'codex exec "把 TODO 注释整理成清单"',
          en: 'Run Codex non-interactively, with optional JSONL output',
          i18n: {
            zh: {
              summary: '非交互模式：执行任务后直接退出',
              detail: '适合脚本和 CI。--json 输出逐行 JSON 事件，--output-last-message 把最终回复写入文件，codex exec resume --last 可接着上一次继续。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'resume',
          argSpec: '[sessionId]',
          example: 'codex resume --last',
          en: 'Continue a previous interactive session by ID, or resume the most recent chat',
          i18n: {
            zh: {
              summary: '恢复历史会话继续聊',
              detail: '不带参数时弹出会话选择器；--last 直接恢复最近一次；--all 把其他目录的会话也列出来。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'fork',
          argSpec: '[sessionId]',
          example: 'codex fork --last',
          en: 'Fork a previous session into a new chat, preserving the original transcript',
          i18n: {
            zh: {
              summary: '基于历史会话分叉出新对话',
              detail: '原会话记录保持不动，在副本上尝试另一条路线，适合"想试试别的方案但不想弄丢现在的进度"。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'review',
          example: 'codex review --uncommitted',
          en: 'Run a code review non-interactively on uncommitted, branch, or commit changes',
          i18n: {
            zh: {
              summary: '非交互式代码审查',
              detail: '--uncommitted 审未提交改动；--base <分支> 对比基线分支；--commit <SHA> 审某次提交。会话内对应 /review。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'apply',
          aliases: ['a'],
          argSpec: '[taskId]',
          example: 'codex apply',
          en: 'Apply the latest diff generated by a Codex cloud chat to the local tree',
          i18n: {
            zh: {
              summary: '把 Codex 云端任务的改动应用到本地',
              detail: '在云端（ChatGPT 里的 Codex）跑完任务后，用它把生成的 diff 落到本地工作区。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'login',
          example: 'codex login',
          en: 'Authenticate using ChatGPT OAuth, device auth, API key, or access token',
          i18n: {
            zh: {
              summary: '登录（ChatGPT 账号或 API Key）',
              detail: '默认走浏览器 OAuth；--device-auth 用设备码（适合远程机器）；--with-api-key 从标准输入读 API Key。codex login status 可查登录状态。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'logout',
          example: 'codex logout',
          en: 'Remove stored authentication credentials',
          i18n: { zh: { summary: '退出登录，清除本地凭证' } },
        },
        {
          kind: 'subcommand',
          name: 'mcp',
          example: 'codex mcp list',
          en: 'Manage Model Context Protocol servers (list / add / remove / auth)',
          i18n: {
            zh: {
              summary: '管理 MCP 服务器（添加/列出/删除/授权）',
              detail: '接入外部工具和数据源。stdio 型直接跟命令行，HTTP 型用 --url，支持 OAuth 与 Bearer Token。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'mcp-server',
          example: 'codex mcp-server',
          en: 'Run Codex itself as an MCP server over stdio',
          i18n: {
            zh: {
              summary: '把 Codex 本身作为 MCP 服务器运行',
              detail: '让其他支持 MCP 的应用把 Codex 当作工具来调用。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'cloud',
          example: 'codex cloud list',
          en: 'Browse or execute Codex cloud chats from the terminal (experimental)',
          i18n: { zh: { summary: '在终端里浏览/发起云端任务（实验性）' } },
        },
        {
          kind: 'subcommand',
          name: 'sandbox',
          argSpec: '<command...>',
          example: 'codex sandbox ls -la',
          en: 'Run arbitrary commands inside Codex-provided sandboxes',
          i18n: {
            zh: {
              summary: '在 Codex 沙箱里运行任意命令',
              detail: '不经过模型，直接用 Codex 的沙箱机制跑命令，方便验证某个命令在沙箱里到底能不能执行。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'completion',
          argSpec: '<shell>',
          example: 'codex completion zsh',
          en: 'Generate shell completion scripts for Bash, Zsh, Fish, or PowerShell',
          i18n: { zh: { summary: '生成 shell 补全脚本' } },
        },
        {
          kind: 'subcommand',
          name: 'update',
          example: 'codex update',
          en: 'Check for and apply a Codex CLI update',
          i18n: { zh: { summary: '检查并安装更新' } },
        },
        {
          kind: 'subcommand',
          name: 'doctor',
          example: 'codex doctor',
          en: 'Generate a diagnostic report for installation, config, auth, and runtime',
          i18n: { zh: { summary: '生成诊断报告（安装/配置/登录/运行环境）', detail: '出问题时先跑它，--json 可输出脱敏的机器可读报告方便提交反馈。' } },
        },
      ],
    },
    {
      id: 'slash-commands',
      i18n: { zh: { title: '会话内斜杠命令' } },
      entries: [
        {
          kind: 'slash',
          name: '/model',
          example: '/model',
          en: 'Choose the active model and reasoning effort',
          i18n: { zh: { summary: '切换模型和推理力度' } },
        },
        {
          kind: 'slash',
          name: '/permissions',
          example: '/permissions',
          en: 'Set approval and sandbox behavior',
          i18n: {
            zh: {
              summary: '调整审批与沙箱策略',
              detail: '会话中随时切换权限组合（旧版本中此命令叫 /approvals）。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/new',
          example: '/new',
          en: 'Start a new chat in the same session',
          i18n: { zh: { summary: '开一个新对话（清掉当前上下文）' } },
        },
        {
          kind: 'slash',
          name: '/init',
          example: '/init',
          en: 'Generate an AGENTS.md scaffold for this repository',
          i18n: {
            zh: {
              summary: '为当前仓库生成 AGENTS.md 项目说明',
              detail: 'AGENTS.md 是 Codex 的项目级记忆文件，每次会话自动加载，写入构建命令、代码规范、注意事项等。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/compact',
          example: '/compact',
          en: 'Summarize the visible chat to free up tokens',
          i18n: {
            zh: {
              summary: '压缩对话：总结历史、释放上下文空间',
              detail: '对话太长、上下文快满时用，把之前的内容浓缩成摘要接着聊。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/diff',
          example: '/diff',
          en: 'Show the Git diff, including untracked files',
          i18n: { zh: { summary: '查看当前 Git 改动（含未跟踪文件）' } },
        },
        {
          kind: 'slash',
          name: '/mention',
          argSpec: '<file>',
          example: '/mention src/main.ts',
          en: 'Attach a file to the chat',
          i18n: { zh: { summary: '把文件附加进对话', detail: '直接输入 @ 也能触发文件搜索与附加。' } },
        },
        {
          kind: 'slash',
          name: '/status',
          example: '/status',
          en: 'Display session configuration and usage',
          i18n: { zh: { summary: '查看会话配置与用量（模型、沙箱、token 等）' } },
        },
        {
          kind: 'slash',
          name: '/usage',
          example: '/usage',
          en: 'View account token usage and limits',
          i18n: { zh: { summary: '查看账号用量与限额' } },
        },
        {
          kind: 'slash',
          name: '/review',
          example: '/review',
          en: 'Ask Codex to review the working tree changes',
          i18n: { zh: { summary: '让 Codex 审查当前改动' } },
        },
        {
          kind: 'slash',
          name: '/plan',
          example: '/plan',
          en: 'Switch to plan mode',
          i18n: { zh: { summary: '切换到规划模式：先出方案再动手' } },
        },
        {
          kind: 'slash',
          name: '/resume',
          example: '/resume',
          en: 'Resume a saved chat',
          i18n: { zh: { summary: '挑选并恢复历史会话' } },
        },
        {
          kind: 'slash',
          name: '/fork',
          example: '/fork',
          en: 'Fork the current chat',
          i18n: { zh: { summary: '把当前对话分叉成新会话' } },
        },
        {
          kind: 'slash',
          name: '/clear',
          example: '/clear',
          en: 'Clear the terminal and start a new chat',
          i18n: { zh: { summary: '清屏并开始新对话' } },
        },
        {
          kind: 'slash',
          name: '/mcp',
          example: '/mcp',
          en: 'List configured MCP tools',
          i18n: { zh: { summary: '查看已配置的 MCP 工具' } },
        },
        {
          kind: 'slash',
          name: '/skills',
          example: '/skills',
          en: 'Browse and use skills',
          i18n: { zh: { summary: '浏览并使用技能（skills）' } },
        },
        {
          kind: 'slash',
          name: '/hooks',
          example: '/hooks',
          en: 'View and manage lifecycle hooks',
          i18n: { zh: { summary: '查看/管理生命周期钩子' } },
        },
        {
          kind: 'slash',
          name: '/personality',
          example: '/personality',
          en: 'Choose the assistant communication style',
          i18n: { zh: { summary: '选择回复风格/性格' } },
        },
        {
          kind: 'slash',
          name: '/ps',
          example: '/ps',
          en: 'Show background terminals and recent output',
          i18n: { zh: { summary: '查看后台终端及其最新输出', detail: '配合 /stop 可以停掉后台跑着的命令。' } },
        },
        {
          kind: 'slash',
          name: '/copy',
          example: '/copy',
          en: 'Copy the latest completed output to the clipboard',
          i18n: { zh: { summary: '复制最近一条回复到剪贴板（Ctrl+O 同效）' } },
        },
        {
          kind: 'slash',
          name: '/feedback',
          example: '/feedback',
          en: 'Send logs to the maintainers',
          i18n: { zh: { summary: '向官方发送日志反馈问题' } },
        },
        {
          kind: 'slash',
          name: '/logout',
          example: '/logout',
          en: 'Sign out of the current account',
          i18n: { zh: { summary: '退出当前账号' } },
        },
        {
          kind: 'slash',
          name: '/quit',
          aliases: ['/exit'],
          example: '/quit',
          en: 'Exit the Codex CLI',
          i18n: { zh: { summary: '退出 Codex CLI' } },
        },
      ],
    },
    {
      id: 'shortcuts',
      i18n: { zh: { title: '快捷键与输入技巧' } },
      entries: [
        {
          kind: 'interactive',
          name: '@',
          argSpec: '<file>',
          example: '@src/app.ts 这个文件在干嘛？',
          en: 'Search and attach files to the conversation',
          i18n: { zh: { summary: '输入 @ 搜索并引用文件' } },
        },
        {
          kind: 'interactive',
          name: '!',
          argSpec: '<command>',
          example: '! git status',
          en: 'Run a local shell command directly',
          i18n: { zh: { summary: '行首输入 !：直接执行 shell 命令' } },
        },
        {
          kind: 'shortcut',
          name: 'Tab',
          en: 'Queue a follow-up message while Codex is working',
          i18n: {
            zh: {
              summary: '任务进行中按 Tab：把后续指令排队',
              detail: '不打断当前任务，等它做完再处理你排队的消息；直接按 Enter 则是立刻插入新指令。',
            },
          },
        },
        {
          kind: 'shortcut',
          name: 'Esc Esc',
          en: 'With an empty composer, edit a previous message and fork the chat',
          i18n: {
            zh: {
              summary: '双击 Esc：回到之前某条消息重新编辑并分叉',
              detail: '相当于"回退重来"：选一条历史消息改掉重发，对话从那里分叉。',
            },
          },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+R',
          en: 'Search prompt history',
          i18n: { zh: { summary: '搜索输入历史' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+O',
          en: 'Copy the latest output',
          i18n: { zh: { summary: '复制最近一条输出' } },
        },
        {
          kind: 'shortcut',
          name: '↑ / ↓',
          en: 'Restore draft history in the composer',
          i18n: { zh: { summary: '上下翻看历史输入草稿' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+C',
          en: 'Close the session',
          i18n: { zh: { summary: '中断/关闭会话' } },
        },
        {
          kind: 'interactive',
          name: '/',
          example: '/',
          en: 'Open the slash command palette',
          i18n: { zh: { summary: '行首输入 /：打开斜杠命令面板', detail: '快捷键布局可用 /keymap 自定义，/vim 可开启 Vim 按键模式。' } },
        },
      ],
    },
  ],
};
