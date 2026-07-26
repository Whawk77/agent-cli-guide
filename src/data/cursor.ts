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
  session: {
    prompt: '>',
    banner: [
      { text: '▌ Cursor Agent', style: 'accent' },
      { text: 'model: {model} · mode: {mode} · cwd: ~/my-project', style: 'dim', note: { zh: '当前模型、模式与工作目录' } },
      { text: 'Type /help for commands, press Ctrl+D twice to quit', style: 'dim', note: { zh: '输入 /help 查看命令，双击 Ctrl+D 退出' } },
    ],
    statusFields: [
      { key: 'model', label: { zh: '模型' }, initial: 'composer-1', options: ['auto', 'composer-1', 'gpt-5', 'sonnet-4.5', 'opus-4.5'] },
      { key: 'mode', label: { zh: '模式' }, initial: 'agent', options: ['agent', 'plan', 'ask'] },
      { key: 'autorun', label: { zh: '自动执行' }, initial: 'off', options: ['off', 'on'] },
      { key: 'sandbox', label: { zh: '沙箱' }, initial: 'enabled', options: ['enabled', 'disabled'] },
      { key: 'context', label: { zh: '上下文' }, initial: '3%' },
    ],
    chatReply: [
      { text: '● Thinking…', style: 'dim' },
      {
        text: 'I will scan the relevant files and make the change.',
        note: { zh: '真实的 Cursor Agent 会读代码、改文件、跑命令，并等待你逐条批准' },
      },
    ],
  },
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
              detail: '适合脚本和 CI 流水线，不进入交互界面。配合 --output-format 可输出 JSON，--stream-partial-output 可流式输出增量文本。',
            },
          },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '(agent response printed to stdout)', style: 'dim', note: { zh: '结果直接打印到标准输出，随后退出——适合脚本和管道' } },
                ],
              },
            ],
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
          simulate: { effects: [{ type: 'state', patch: { model: '{arg}' } }] },
        },
        {
          kind: 'flag',
          name: '--list-models',
          example: 'cursor-agent --list-models',
          en: 'List all available models',
          i18n: { zh: { summary: '列出当前账号可用的模型' } },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'auto', style: 'dim' },
                  { text: 'composer-1', style: 'accent', note: { zh: 'Cursor 自研编码模型' } },
                  { text: 'gpt-5', style: 'dim' },
                  { text: 'sonnet-4.5', style: 'dim' },
                  { text: 'opus-4.5', style: 'dim', note: { zh: '实际列表随账号套餐不同（仿真）' } },
                ],
              },
            ],
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
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Resuming most recent chat in ~/my-project…', style: 'dim', note: { zh: '恢复最近一次对话（仿真）' } },
                ],
              },
              { type: 'state', patch: { context: '38%' } },
            ],
          },
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
          simulate: { effects: [{ type: 'state', patch: { mode: '{arg}' } }] },
        },
        {
          kind: 'flag',
          name: '--plan',
          example: 'cursor-agent --plan "重构鉴权模块"',
          en: 'Shorthand for --mode=plan',
          i18n: { zh: { summary: '以规划模式启动（--mode=plan 的简写）' } },
          simulate: {
            effects: [
              { type: 'state', patch: { mode: 'plan' } },
              { type: 'print', lines: [{ text: 'Plan mode — the agent will propose a plan before editing.', style: 'ok', note: { zh: '规划模式已开启（看状态栏）' } }] },
            ],
          },
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
          simulate: {
            effects: [
              { type: 'state', patch: { autorun: 'on' } },
              { type: 'print', lines: [{ text: '⚠ Commands will run without confirmation.', style: 'warn', note: { zh: '命令不再逐条确认（注意状态栏的"自动执行"）' } }] },
            ],
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
          simulate: { effects: [{ type: 'state', patch: { sandbox: '{arg}' } }] },
        },
        {
          kind: 'flag',
          name: '--trust',
          example: 'cursor-agent --trust',
          en: 'Trust the workspace without prompting',
          i18n: { zh: { summary: '直接信任当前工作区，跳过首次确认' } },
        },
        {
          kind: 'flag',
          name: '--approve-mcps',
          example: 'cursor-agent --approve-mcps',
          en: 'Automatically approve all MCP servers',
          i18n: { zh: { summary: '自动批准加载所有 MCP 服务器' } },
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
          simulate: {
            preventSession: true,
            effects: [{ type: 'print', lines: [{ text: '2026.07.23-a1b2c3d', note: { zh: '打印版本号后直接退出，不进入会话' } }] }],
          },
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
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '✓ Logged in as you@example.com', style: 'ok', note: { zh: '当前登录账号（仿真）' } },
                  { text: 'Plan: Pro', style: 'dim' },
                ],
              },
            ],
          },
        },
        {
          kind: 'subcommand',
          name: 'about',
          example: 'cursor-agent about',
          en: 'Display version, system, and account info',
          i18n: { zh: { summary: '查看版本、系统与账号信息', detail: '会话内用 /about 同效；加 --format json 可输出结构化结果。' } },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Cursor Agent  2026.07.23-a1b2c3d', style: 'accent' },
                  { text: 'OS: darwin arm64', style: 'dim' },
                  { text: 'Account: you@example.com (Pro)', style: 'dim', note: { zh: '版本、系统与账号一览（仿真）' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'subcommand',
          name: 'models',
          example: 'cursor-agent models',
          en: 'List available models for this account',
          i18n: { zh: { summary: '列出账号可用的模型（同 --list-models）' } },
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
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '2h ago      fix login bug          8f3a12…', style: 'accent', note: { zh: '2 小时前：修登录 bug' } },
                  { text: 'yesterday   add dark mode          c21d9e…', style: 'dim' },
                  { text: '3d ago      refactor api client    9e0b44…', style: 'dim', note: { zh: '真实 CLI 里可选中回车恢复；ID 可用于 --resume（仿真列表）' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'subcommand',
          name: 'resume',
          example: 'cursor-agent resume',
          en: 'Resume the latest chat session',
          i18n: { zh: { summary: '恢复最近一次的会话' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Resuming latest chat: fix login bug (2h ago)…', style: 'dim', note: { zh: '接着最近一次会话继续（仿真）' } },
                ],
              },
              { type: 'state', patch: { context: '42%' } },
            ],
          },
        },
        {
          kind: 'subcommand',
          name: 'create-chat',
          example: 'cursor-agent create-chat',
          en: 'Create a new empty chat and print its ID',
          i18n: { zh: { summary: '创建一个空会话并返回 ID', detail: '适合脚本先建会话，再用 --resume <ID> 往里发任务。' } },
          simulate: {
            preventSession: true,
            effects: [{ type: 'print', lines: [{ text: 'b7e4c2d8-51f0-4a6e-9c3b-2d8e7f1a5c90', note: { zh: '新会话 ID，可配合 --resume 使用（仿真）' } }] }],
          },
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
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'github    ✓ connected (12 tools)', style: 'ok', note: { zh: '已连接的 MCP 服务器' } },
                  { text: 'postgres  ○ disabled', style: 'dim', note: { zh: '用 mcp enable postgres 启用（仿真列表）' } },
                ],
              },
            ],
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
              detail: 'sandbox enable/disable 开关沙箱、sandbox reset 恢复默认；sandbox run <命令> 把任意命令放进沙箱执行，可用 --allow-paths、--network 等细调权限。',
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
          simulate: {
            preventSession: true,
            effects: [{ type: 'print', lines: [{ text: '✓ Cursor Agent is up to date (2026.07.23)', style: 'ok', note: { zh: '已是最新版本（仿真）' } }] }],
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
          name: '/help',
          argSpec: '[command]',
          example: '/help',
          en: 'Show help documentation',
          i18n: { zh: { summary: '查看可用命令和帮助', detail: '/help <命令> 可看单个命令的详细说明。' } },
        },
        {
          kind: 'slash',
          name: '/model',
          argSpec: '[filter]',
          example: '/model',
          en: 'Select a model',
          i18n: { zh: { summary: '会话中挑选/切换模型' } },
          simulate: {
            effects: [
              {
                type: 'panel',
                panel: {
                  title: { zh: '选择模型（点击切换，状态栏会跟着变）' },
                  stateKey: 'model',
                  items: [
                    { value: 'auto', label: 'auto', note: { zh: '让 Cursor 自动选型' } },
                    { value: 'composer-1', label: 'composer-1', note: { zh: 'Cursor 自研编码模型，快' } },
                    { value: 'gpt-5', label: 'gpt-5', note: { zh: 'OpenAI 旗舰' } },
                    { value: 'sonnet-4.5', label: 'sonnet-4.5', note: { zh: 'Anthropic 均衡之选' } },
                    { value: 'opus-4.5', label: 'opus-4.5', note: { zh: '复杂任务的重型模型' } },
                  ],
                },
              },
            ],
            argEffects: [
              { type: 'state', patch: { model: '{arg}' } },
              { type: 'print', lines: [{ text: '✓ Switched to {model}', style: 'ok', note: { zh: '已切换模型，注意底部状态栏' } }] },
            ],
          },
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
          simulate: {
            effects: [
              { type: 'state', patch: { mode: 'plan' } },
              { type: 'print', lines: [{ text: '⏸ Plan mode — the agent will design an approach before coding.', style: 'ok', note: { zh: '规划模式已开启：先出方案再动手（看状态栏）' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/ask',
          example: '/ask',
          en: 'Toggle Ask mode for read-only questions',
          i18n: { zh: { summary: '切换到只读问答模式（不改代码）' } },
          simulate: {
            effects: [
              { type: 'state', patch: { mode: 'ask' } },
              { type: 'print', lines: [{ text: '🔍 Ask mode — explore and answer without changing code.', style: 'ok', note: { zh: '只读模式：只搜索和回答，不改任何文件' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/debug',
          argSpec: '[prompt]',
          example: '/debug',
          en: 'Toggle Debug mode or submit a prompt in Debug mode',
          i18n: { zh: { summary: '切换调试模式，或直接提交一个调试任务', detail: '调试模式针对"复现—定位—修复"流程做了优化。/logs 可查看调试日志路径。' } },
        },
        {
          kind: 'slash',
          name: '/run-everything',
          aliases: ['/auto-run'],
          argSpec: '[on|off|status]',
          example: '/run-everything status',
          en: 'Toggle automatic command execution or check its status',
          i18n: {
            zh: {
              summary: '开关"自动执行所有命令"',
              detail: '开启后命令不再逐条确认，相当于会话内版的 --force，注意风险。',
            },
          },
          simulate: {
            effects: [
              { type: 'print', lines: [{ text: 'Run everything: {autorun}', style: 'dim', note: { zh: '当前自动执行状态；用 /run-everything on 开启' } }] },
            ],
            argEffects: [
              { type: 'state', patch: { autorun: '{arg}' } },
              { type: 'print', lines: [{ text: '⚠ Run everything: {autorun}', style: 'warn', note: { zh: '自动执行已切换（看状态栏），开启时命令不再逐条确认' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/sandbox',
          example: '/sandbox',
          en: 'Configure sandbox mode and network access settings',
          i18n: { zh: { summary: '配置沙箱模式与网络访问' } },
          simulate: {
            effects: [
              {
                type: 'panel',
                panel: {
                  title: { zh: '沙箱设置（点击切换，状态栏会跟着变）' },
                  stateKey: 'sandbox',
                  items: [
                    { value: 'enabled', label: 'enabled', note: { zh: '命令在受限环境运行，默认禁网' } },
                    { value: 'disabled', label: 'disabled', note: { zh: '关闭沙箱，改用命令白名单模式' } },
                  ],
                },
              },
            ],
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
          simulate: {
            effects: [
              { type: 'state', patch: { context: '2%' } },
              { type: 'compact', summary: { zh: '此前的对话已折叠为摘要，上下文占用大幅下降（看状态栏）' } },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/rewind',
          example: '/rewind',
          en: 'Jump back to a previous message',
          i18n: { zh: { summary: '回退到之前的某条消息重新来' } },
          simulate: {
            effects: [
              {
                type: 'panel',
                panel: {
                  title: { zh: '选择要回退到的消息（仿真：真实 CLI 里回车确认）' },
                  items: [
                    { value: '1', label: '5 min ago · "refactor the auth module"', note: { zh: '5 分钟前的消息' } },
                    { value: '2', label: '20 min ago · "add unit tests"', note: { zh: '20 分钟前的消息' } },
                    { value: '3', label: 'session start', note: { zh: '会话开始' } },
                  ],
                },
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/clear',
          aliases: ['/new', '/new-chat'],
          example: '/clear',
          en: 'Start a new chat session',
          i18n: { zh: { summary: '清空当前对话，开新会话' } },
          simulate: {
            effects: [
              { type: 'clear' },
              { type: 'state', patch: { context: '0%' } },
              { type: 'print', lines: [{ text: 'Started a new chat.', style: 'dim', note: { zh: '屏幕已清空，上下文归零（看状态栏）' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/resume',
          example: '/resume',
          en: 'Open recent chats and resume one',
          i18n: { zh: { summary: '打开最近会话列表并恢复' } },
          simulate: {
            effects: [
              {
                type: 'panel',
                panel: {
                  title: { zh: '最近会话（仿真列表，真实 CLI 里回车恢复）' },
                  items: [
                    { value: '1', label: '2h ago · fix login bug (12 messages)', note: { zh: '2 小时前：修登录 bug' } },
                    { value: '2', label: 'yesterday · add dark mode (34 messages)', note: { zh: '昨天：加深色模式' } },
                    { value: '3', label: '3d ago · refactor api client (8 messages)', note: { zh: '3 天前：重构 API 客户端' } },
                  ],
                },
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/fork',
          example: '/fork',
          en: 'Fork the current chat into a new session',
          i18n: { zh: { summary: '把当前对话分叉成新会话，两边独立继续' } },
        },
        {
          kind: 'slash',
          name: '/rename',
          argSpec: '<name>',
          example: '/rename 登录bug修复',
          en: 'Rename the current chat session',
          i18n: { zh: { summary: '重命名当前会话，方便之后在列表里找' } },
        },
        {
          kind: 'slash',
          name: '/mcp',
          argSpec: '[list|list-tools] [name]',
          example: '/mcp list',
          en: 'Manage MCP servers and list tools for a server',
          i18n: { zh: { summary: '会话内查看/管理 MCP 服务器' } },
        },
        {
          kind: 'slash',
          name: '/config',
          example: '/config',
          en: 'Configure CLI settings interactively',
          i18n: { zh: { summary: '打开交互式设置面板' } },
        },
        {
          kind: 'slash',
          name: '/vim',
          example: '/vim',
          en: 'Toggle Vim keybindings',
          i18n: { zh: { summary: '开关 Vim 按键模式' } },
        },
        {
          kind: 'slash',
          name: '/shell',
          aliases: ['/sh', '/run'],
          argSpec: '[command]',
          example: '/shell git status',
          en: 'Enter Shell Mode to run commands directly',
          i18n: { zh: { summary: '进入 Shell 模式，直接执行命令' } },
        },
        {
          kind: 'slash',
          name: '/open',
          aliases: ['/cursor'],
          example: '/open',
          en: 'Open the repository’s Git root in Cursor',
          i18n: { zh: { summary: '在 Cursor 编辑器里打开当前仓库' } },
        },
        {
          kind: 'slash',
          name: '/about',
          example: '/about',
          en: 'Display CLI version, system, and account information',
          i18n: { zh: { summary: '查看版本、系统与账号信息' } },
        },
        {
          kind: 'slash',
          name: '/update',
          example: '/update',
          en: 'Update Cursor Agent to the latest version',
          i18n: { zh: { summary: '更新到最新版本' } },
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
