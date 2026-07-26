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
  session: {
    prompt: '>',
    banner: [
      { text: '◍ Grok Build', style: 'accent' },
      { text: 'model: {model} · cwd: ~/my-project', style: 'dim', note: { zh: '当前模型与工作目录' } },
      { text: 'Type /help for commands, Ctrl+P for the palette, Shift+Tab to cycle modes', style: 'dim', note: { zh: '/help 查看命令，Ctrl+P 打开命令面板，Shift+Tab 切换模式' } },
    ],
    statusFields: [
      { key: 'model', label: { zh: '模型' }, initial: 'grok-build-0.1', options: ['grok-build-0.1', 'grok-4.5'] },
      { key: 'mode', label: { zh: '会话模式' }, initial: 'normal', options: ['normal', 'plan', 'auto', 'always-approve'] },
      { key: 'subagents', label: { zh: '子代理' }, initial: 'on' },
      { key: 'context', label: { zh: '上下文' }, initial: '2%' },
    ],
    chatReply: [
      { text: 'Working…', style: 'dim' },
      {
        text: 'I will inspect the relevant files and make the change.',
        note: { zh: '真实的 Grok Build 会读你的代码、执行命令、必要时派出子代理，并把改动以 diff 展示' },
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
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '(agent response printed to stdout)', style: 'dim', note: { zh: '结果直接打印到标准输出后退出——适合脚本和 CI 管道' } },
                ],
              },
            ],
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
          simulate: { effects: [{ type: 'state', patch: { model: '{arg}' } }] },
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
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Continuing most recent session in ~/my-project…', style: 'dim', note: { zh: '恢复最近一次会话（仿真），上下文一并带回' } },
                ],
              },
              { type: 'state', patch: { context: '41%' } },
            ],
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
              detail: 'plain 纯文本；json 最后输出一个结构化结果；streaming-json 逐行输出 JSON 事件，方便程序解析。',
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
          simulate: {
            effects: [
              { type: 'state', patch: { mode: 'always-approve' } },
              { type: 'print', lines: [{ text: '⚠ Tool executions will be auto-approved.', style: 'warn', note: { zh: '免确认模式已开启（注意状态栏），慎用' } }] },
            ],
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
          name: '--plugin-dir',
          argSpec: '<path>',
          example: 'grok --plugin-dir ./my-plugins',
          en: 'Load plugins from an additional directory',
          i18n: {
            zh: {
              summary: '从额外目录加载插件',
              detail: '插件可打包技能、钩子和 MCP 配置；常规插件通过 /plugins 面板或 Marketplace 管理。',
            },
          },
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
          simulate: {
            preventSession: true,
            effects: [{ type: 'print', lines: [{ text: 'grok 0.2.93', note: { zh: '打印版本号后直接退出，不进入会话' } }] }],
          },
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
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Config      ~/.grok/config.toml, .grok/config.toml', style: 'accent' },
                  { text: 'Instructions  AGENTS.md', style: 'dim' },
                  { text: 'Skills      2 discovered (.grok/skills/)', style: 'dim' },
                  { text: 'MCP servers  1 configured', style: 'dim', note: { zh: '列出所有生效的配置来源（仿真输出）' } },
                ],
              },
            ],
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
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'No MCP servers configured.', style: 'dim' },
                  { text: 'Run `grok mcp add <name> -- <command>` to add one.', style: 'dim', note: { zh: '还没有配置 MCP 服务器；用 grok mcp add 添加' } },
                ],
              },
            ],
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
          simulate: {
            effects: [
              { type: 'state', patch: { mode: 'plan' } },
              {
                type: 'print',
                lines: [
                  { text: 'Entered plan mode.', style: 'accent', note: { zh: '状态栏模式已切到 plan' } },
                  { text: 'Only the session plan file can be edited until you approve.', style: 'dim', note: { zh: '批准前不会改任何代码，只写计划文件' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/view-plan',
          example: '/view-plan',
          en: 'View the current plan',
          i18n: { zh: { summary: '查看当前计划' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Plan: refactor login module', style: 'accent' },
                  { text: '1. Extract auth logic into auth.ts', style: 'dim' },
                  { text: '2. Add token refresh + tests', style: 'dim', note: { zh: '展示当前会话计划，可逐条评论或改写（仿真）' } },
                ],
              },
            ],
          },
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
          simulate: {
            effects: [
              { type: 'state', patch: { mode: 'auto' } },
              { type: 'print', lines: [{ text: 'Auto mode on: safe tools auto-approved.', style: 'ok', note: { zh: '安全操作免确认，危险操作仍会询问' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/always-approve',
          example: '/always-approve',
          en: 'Toggle always-approve mode: skip permission prompts for tool calls',
          i18n: { zh: { summary: '切换免确认模式：所有工具调用直接放行（慎用）' } },
          simulate: {
            effects: [
              { type: 'state', patch: { mode: 'always-approve' } },
              { type: 'print', lines: [{ text: '⚠ Always-approve on: permission prompts skipped.', style: 'warn', note: { zh: '所有工具调用直接放行，Ctrl+O 可快速开关' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/model',
          aliases: ['/m'],
          argSpec: '<name>',
          example: '/model grok-4.5',
          en: 'Switch the active model within the TUI',
          i18n: { zh: { summary: '会话中切换模型', detail: '自定义模型可在 ~/.grok/config.toml 的 [model.xxx] 段定义后按名字切换。' } },
          simulate: {
            effects: [
              {
                type: 'panel',
                panel: {
                  title: { zh: '选择模型（点击切换，状态栏会跟着变）' },
                  stateKey: 'model',
                  items: [
                    { value: 'grok-build-0.1', label: 'grok-build-0.1', note: { zh: '配套编程模型，默认' } },
                    { value: 'grok-4.5', label: 'grok-4.5', note: { zh: '同款大模型，xAI API 亦可直连' } },
                  ],
                },
              },
            ],
            argEffects: [
              { type: 'state', patch: { model: '{arg}' } },
              { type: 'print', lines: [{ text: '✓ Switched to {model}', style: 'ok', note: { zh: '已切换模型，注意状态栏' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/effort',
          example: '/effort',
          en: 'Set reasoning effort',
          i18n: { zh: { summary: '调整模型推理力度' } },
        },
        {
          kind: 'slash',
          name: '/new',
          aliases: ['/clear'],
          example: '/new',
          en: 'Start a new session',
          i18n: { zh: { summary: '开启新会话（清空当前上下文）', detail: '快捷键 Ctrl+N（按两次）同效。旧会话可用 /resume 或 /sessions 找回。' } },
          simulate: {
            effects: [
              { type: 'clear' },
              { type: 'state', patch: { context: '0%' } },
              { type: 'print', lines: [{ text: 'Started a new session.', style: 'dim', note: { zh: '屏幕已清空，上下文归零（看状态栏）' } }] },
            ],
          },
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
          name: '/sessions',
          example: '/sessions',
          en: 'Switch, rename, or close sessions',
          i18n: { zh: { summary: '会话列表：切换、重命名或关闭', detail: '快捷键 Ctrl+S 同效。' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '● my-project (current)', style: 'accent' },
                  { text: '  nightly-fix        2h ago', style: 'dim' },
                  { text: '  docs-cleanup       yesterday', style: 'dim', note: { zh: '会话列表：可切换、重命名、关闭（仿真）' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/fork',
          example: '/fork',
          en: 'Branch the current session',
          i18n: {
            zh: {
              summary: '把当前会话分叉出一个新分支',
              detail: '带着当前上下文另起一条线尝试不同方案，原会话不受影响。',
            },
          },
          simulate: {
            effects: [
              { type: 'print', lines: [{ text: 'Forked session: my-project (fork)', style: 'ok', note: { zh: '新分支带着当前全部上下文，原会话不受影响' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/rename',
          aliases: ['/title'],
          argSpec: '<title>',
          example: '/rename 登录重构',
          en: 'Rename the current session',
          i18n: { zh: { summary: '重命名当前会话' } },
        },
        {
          kind: 'slash',
          name: '/share',
          example: '/share',
          en: 'Share the session via URL',
          i18n: { zh: { summary: '生成 URL 分享当前会话' } },
          simulate: {
            effects: [
              { type: 'print', lines: [{ text: 'Share link: https://grok.com/share/xxxxxxxx', style: 'accent', note: { zh: '生成可分享的会话链接（仿真地址）' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/session-info',
          example: '/session-info',
          en: 'Display session info',
          i18n: { zh: { summary: '显示当前会话信息（ID、模型、路径等）' } },
        },
        {
          kind: 'slash',
          name: '/compact',
          argSpec: '[context]',
          example: '/compact',
          en: 'Compact conversation history',
          i18n: {
            zh: {
              summary: '压缩会话历史：折叠为摘要、释放上下文',
              detail: '可附加说明告诉它重点保留什么。长会话上下文吃紧时先压缩再继续。',
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
          name: '/context',
          example: '/context',
          en: 'Check context usage',
          i18n: { zh: { summary: '查看上下文占用情况' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '▓▓░░░░░░░░░░░░░░░░░░  {context} used', style: 'accent', note: { zh: '上下文窗口占用示意' } },
                  { text: 'Instructions   1.1%', style: 'dim' },
                  { text: 'Messages       0.9%', style: 'dim', note: { zh: '各部分占用明细（仿真）' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/rewind',
          example: '/rewind',
          en: 'Rewind to a previous turn',
          i18n: { zh: { summary: '回退到之前的某一轮', detail: '输入框为空时双击 Esc 也能打开回退。' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Rewind to:', style: 'accent' },
                  { text: '  #3  "重构登录模块"', style: 'dim' },
                  { text: '  #2  "先跑一遍测试"', style: 'dim', note: { zh: '选择要回退到的回合，之后的改动会被撤销（仿真）' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/export',
          example: '/export',
          en: 'Export the conversation',
          i18n: { zh: { summary: '导出当前对话' } },
        },
        {
          kind: 'slash',
          name: '/copy',
          argSpec: '[N]',
          example: '/copy',
          en: 'Copy a response to the clipboard',
          i18n: { zh: { summary: '复制回复到剪贴板（/copy 2 复制倒数第二条）' } },
        },
        {
          kind: 'slash',
          name: '/find',
          example: '/find',
          en: 'Search the conversation scrollback',
          i18n: { zh: { summary: '搜索会话滚动历史' } },
        },
        {
          kind: 'slash',
          name: '/transcript',
          example: '/transcript',
          en: 'View the full transcript in a pager',
          i18n: { zh: { summary: '在分页器里查看完整会话记录' } },
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
          simulate: {
            argEffects: [
              {
                type: 'print',
                lines: [
                  { text: '(btw) Answering on the side — the main task keeps running.', style: 'dim', note: { zh: '题外问题走旁路回答，主任务不中断（仿真）' } },
                ],
              },
            ],
            effects: [
              { type: 'print', lines: [{ text: 'Usage: /btw <question>', style: 'dim', note: { zh: '需要跟一个问题' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/loop',
          argSpec: '[interval] <prompt>',
          example: '/loop 5m 检查一下 CI 是否通过',
          en: 'Run a prompt on a recurring interval',
          i18n: { zh: { summary: '按固定间隔循环执行一条指令', detail: '适合轮询构建状态、盯部署这类周期性任务。/tasks 可查看运行中的循环任务。' } },
          simulate: {
            argEffects: [
              { type: 'print', lines: [{ text: '✓ Loop scheduled: every 5m — view with /tasks', style: 'ok', note: { zh: '循环任务已排期，用 /tasks 查看' } }] },
            ],
            effects: [
              { type: 'print', lines: [{ text: 'Usage: /loop [interval] <prompt>', style: 'dim' }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/tasks',
          example: '/tasks',
          en: 'List background and scheduled tasks',
          i18n: { zh: { summary: '列出后台/定时任务', detail: 'Ctrl+G 开关任务面板；Ctrl+B 可把正在跑的命令转入后台。' } },
        },
        {
          kind: 'slash',
          name: '/queue',
          example: '/queue',
          en: 'List queued prompts',
          i18n: { zh: { summary: '查看排队中的指令', detail: '当前回合还在跑时输入的指令会进入队列。Ctrl+; 开关队列面板。' } },
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
          name: '/mcps',
          example: '/mcps',
          en: 'Open the extensions modal on the MCP tab',
          i18n: {
            zh: {
              summary: '打开扩展面板的 MCP 页',
              detail: '面板里 Space 启停服务器、r 刷新、i 完成 OAuth 认证、a 添加、x 删除。快捷键 Ctrl+L 打开扩展面板。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/hooks',
          example: '/hooks',
          en: 'Open the extensions modal on the Hooks tab',
          i18n: { zh: { summary: '打开扩展面板的钩子（Hooks）页' } },
        },
        {
          kind: 'slash',
          name: '/hooks-trust',
          example: '/hooks-trust',
          en: 'Enable project-level hooks discovery from .grok/hooks/',
          i18n: { zh: { summary: '信任并启用项目级钩子（.grok/hooks/）', detail: '项目钩子会执行任意命令，确认仓库可信后再开启。' } },
        },
        {
          kind: 'slash',
          name: '/plugins',
          example: '/plugins',
          en: 'Open the extensions modal on the Plugins tab',
          i18n: { zh: { summary: '打开扩展面板的插件页' } },
        },
        {
          kind: 'slash',
          name: '/skills',
          example: '/skills',
          en: 'Open the extensions modal on the Skills tab',
          i18n: {
            zh: {
              summary: '打开扩展面板的技能页',
              detail: '可调用的技能会直接以 /<技能名> 的形式出现在斜杠命令里；重名时用 /local:<技能名> 区分。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/marketplace',
          example: '/marketplace',
          en: 'Open the extensions modal on the Marketplace tab',
          i18n: { zh: { summary: '打开扩展面板的插件市场页，浏览安装插件' } },
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
              detail: '子代理是拥有独立上下文的子会话，结束后向主会话返回摘要，默认开启。内置 general-purpose（全能力）、explore（只读检索）、plan（只出方案）三种；自定义放在 .grok/agents/ 或 ~/.grok/agents/。',
            },
          },
          simulate: {
            effects: [
              {
                type: 'panel',
                panel: {
                  title: { zh: '内置子代理类型（展示；自定义放 .grok/agents/）' },
                  items: [
                    { value: 'general-purpose', label: 'general-purpose', note: { zh: '全能力，默认子代理' } },
                    { value: 'explore', label: 'explore', note: { zh: '只读：检索/列目录/搜索，不能改代码' } },
                    { value: 'plan', label: 'plan', note: { zh: '只出实现方案，不动 shell 和文件' } },
                  ],
                },
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/personas',
          example: '/personas',
          en: 'Manage personas (behavioral overlays for agents)',
          i18n: {
            zh: {
              summary: '管理人格（persona）',
              detail: '人格是叠加在代理上的行为风格（语气、关注点），定义在 .grok/personas/*.toml 或 ~/.grok/personas/*.toml。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/memory',
          aliases: ['/mem'],
          example: '/memory',
          en: 'Browse, view, and manage memories',
          i18n: { zh: { summary: '浏览和管理记忆' } },
        },
        {
          kind: 'slash',
          name: '/remember',
          argSpec: '<note>',
          example: '/remember 本仓库提交信息一律用英文',
          en: 'Save a memory note',
          i18n: { zh: { summary: '记一条笔记到记忆里' } },
        },
        {
          kind: 'slash',
          name: '/flush',
          example: '/flush',
          en: 'Flush conversation memory to disk',
          i18n: { zh: { summary: '把会话记忆立即写入磁盘' } },
        },
        {
          kind: 'slash',
          name: '/dream',
          example: '/dream',
          en: 'Run memory consolidation',
          i18n: { zh: { summary: '执行记忆整理（合并沉淀已有记忆）' } },
        },
        {
          kind: 'slash',
          name: '/imagine',
          argSpec: '<prompt>',
          example: '/imagine 一张终端主题的壁纸',
          en: 'Generate an image',
          i18n: { zh: { summary: '生成图片' } },
        },
        {
          kind: 'slash',
          name: '/imagine-video',
          argSpec: '<prompt>',
          example: '/imagine-video 火箭发射的短片',
          en: 'Generate a video',
          i18n: { zh: { summary: '生成视频' } },
        },
        {
          kind: 'slash',
          name: '/theme',
          aliases: ['/t'],
          argSpec: '[name]',
          example: '/theme',
          en: 'Switch the color theme',
          i18n: { zh: { summary: '切换配色主题' } },
        },
        {
          kind: 'slash',
          name: '/compact-mode',
          example: '/compact-mode',
          en: 'Toggle a denser UI layout',
          i18n: { zh: { summary: '切换更紧凑的界面布局' } },
        },
        {
          kind: 'slash',
          name: '/multiline',
          aliases: ['/ml'],
          example: '/multiline',
          en: 'Toggle multiline input',
          i18n: { zh: { summary: '切换多行输入模式', detail: '多行模式下 Enter 换行、Shift+Enter 发送。Ctrl+M 同效。' } },
        },
        {
          kind: 'slash',
          name: '/vim-mode',
          example: '/vim-mode',
          en: 'Toggle vim-style scrollback navigation',
          i18n: { zh: { summary: '切换 vim 风格的滚动历史导航', detail: '开启后可用 j/k/g 等单键在滚动区移动，/ 搜索。' } },
        },
        {
          kind: 'slash',
          name: '/timestamps',
          example: '/timestamps',
          en: 'Toggle message timestamps',
          i18n: { zh: { summary: '开关消息时间戳' } },
        },
        {
          kind: 'slash',
          name: '/terminal-setup',
          example: '/terminal-setup',
          en: 'Check terminal and clipboard setup',
          i18n: { zh: { summary: '检查终端与剪贴板配置' } },
        },
        {
          kind: 'slash',
          name: '/settings',
          aliases: ['/config'],
          example: '/settings',
          en: 'Open the settings modal',
          i18n: { zh: { summary: '打开设置面板', detail: '快捷键 F2 或 Ctrl+, 同效。持久配置写在 ~/.grok/config.toml。' } },
        },
        {
          kind: 'slash',
          name: '/import-claude',
          example: '/import-claude',
          en: 'Open the Claude settings import',
          i18n: { zh: { summary: '从 Claude Code 导入设置', detail: '把已有的 Claude 配置（如 MCP、指令文件）迁移过来。' } },
        },
        {
          kind: 'slash',
          name: '/usage',
          example: '/usage',
          en: 'View credit usage',
          i18n: { zh: { summary: '查看额度用量' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Credits used today: 12%', style: 'accent' },
                  { text: 'Resets at 00:00 UTC', style: 'dim', note: { zh: '额度用量与重置时间（仿真数字）' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/privacy',
          example: '/privacy',
          en: 'Show or toggle privacy status',
          i18n: { zh: { summary: '查看/切换隐私状态' } },
        },
        {
          kind: 'slash',
          name: '/login',
          example: '/login',
          en: 'Sign in',
          i18n: { zh: { summary: '登录账号', detail: '非浏览器环境（如 SSH/CI）可改用 XAI_API_KEY 环境变量认证。' } },
        },
        {
          kind: 'slash',
          name: '/logout',
          example: '/logout',
          en: 'Sign out',
          i18n: { zh: { summary: '退出登录' } },
        },
        {
          kind: 'slash',
          name: '/feedback',
          argSpec: '[text]',
          example: '/feedback',
          en: 'Send feedback',
          i18n: { zh: { summary: '发送反馈' } },
        },
        {
          kind: 'slash',
          name: '/release-notes',
          aliases: ['/changelog'],
          example: '/release-notes',
          en: 'View release notes',
          i18n: { zh: { summary: '查看版本更新说明' } },
        },
        {
          kind: 'slash',
          name: '/home',
          example: '/home',
          en: 'Return to the welcome screen',
          i18n: { zh: { summary: '回到欢迎屏' } },
        },
        {
          kind: 'slash',
          name: '/help',
          example: '/help',
          en: 'Browse commands and shortcuts',
          i18n: { zh: { summary: '浏览全部命令和快捷键' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '/plan  /auto  /model  /new  /compact  /sessions …', style: 'accent' },
                  { text: 'Ctrl+P palette · Shift+Tab cycle modes · Ctrl+. shortcuts', style: 'dim', note: { zh: '完整列表见命令面板（Ctrl+P）与快捷键表（Ctrl+.）' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/quit',
          aliases: ['/exit'],
          example: '/quit',
          en: 'Quit the application',
          i18n: { zh: { summary: '退出 Grok Build', detail: '快捷键 Ctrl+Q 或 Ctrl+D（按两次）同效。' } },
          simulate: {
            effects: [
              { type: 'exitSession', lines: [{ text: 'Bye! Session saved to ~/.grok/sessions.', style: 'dim', note: { zh: '会话已保存，回来用 grok --continue 接着干' } }] },
            ],
          },
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
          name: 'Ctrl+.',
          aliases: ['Ctrl+X'],
          en: 'Open the keyboard shortcuts list',
          i18n: { zh: { summary: '打开快捷键列表', detail: 'Windows 或不支持 Kitty 键盘协议的终端用 Ctrl+X。' } },
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
          name: 'Ctrl+R',
          en: 'Search prompt history',
          i18n: { zh: { summary: '搜索历史输入' } },
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
          kind: 'shortcut',
          name: 'Ctrl+S',
          en: 'Open sessions',
          i18n: { zh: { summary: '打开会话列表' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+N',
          en: 'New session (press twice)',
          i18n: { zh: { summary: '新建会话（按两次确认）' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+Q',
          aliases: ['Ctrl+D'],
          en: 'Quit (press twice)',
          i18n: { zh: { summary: '退出（按两次确认）' } },
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
