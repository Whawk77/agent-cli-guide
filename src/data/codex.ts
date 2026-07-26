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
  session: {
    prompt: '›',
    banner: [
      { text: '╭──────────────────────────────────────────────╮', style: 'dim' },
      { text: '│  >_ OpenAI Codex (v0.87.0)                   │', style: 'accent', note: { zh: 'Codex 启动横幅（仿真版本号）' } },
      { text: '╰──────────────────────────────────────────────╯', style: 'dim' },
      { text: 'model:      {model} {effort} · /model to change', style: 'dim', note: { zh: '当前模型与推理力度' } },
      { text: 'directory:  ~/my-project', style: 'dim' },
      { text: 'approval:   {approval} · sandbox: {sandbox}', style: 'dim', note: { zh: '审批策略与沙箱级别，可用 /permissions 调整' } },
      { text: 'To get started, describe a task or try /status', style: 'dim', note: { zh: '直接描述任务，或输入 / 打开命令面板' } },
    ],
    statusFields: [
      {
        key: 'model',
        label: { zh: '模型' },
        initial: 'gpt-5.6-sol',
        options: ['gpt-5.6-sol', 'gpt-5.6-terra', 'gpt-5.6-luna', 'gpt-5.5', 'gpt-5.3-codex-spark'],
      },
      { key: 'effort', label: { zh: '推理力度' }, initial: 'medium', options: ['low', 'medium', 'high', 'xhigh'] },
      { key: 'approval', label: { zh: '审批策略' }, initial: 'on-request', options: ['untrusted', 'on-request', 'never'] },
      {
        key: 'sandbox',
        label: { zh: '沙箱' },
        initial: 'workspace-write',
        options: ['read-only', 'workspace-write', 'danger-full-access'],
      },
      { key: 'context', label: { zh: '上下文剩余' }, initial: '97%' },
    ],
    chatReply: [
      { text: '› Working (2s · esc to interrupt)', style: 'dim' },
      { text: 'codex', style: 'accent' },
      {
        text: 'I will scan the relevant files and make the change in the sandbox.',
        note: { zh: '真实的 Codex 会读代码、在沙箱里改文件、跑命令并汇报结果' },
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
          name: '--model',
          aliases: ['-m'],
          argSpec: '<model>',
          example: 'codex --model gpt-5.6-sol',
          en: 'Override the configured model for this session',
          i18n: {
            zh: {
              summary: '指定本次会话使用的模型',
              detail: '覆盖配置文件里的默认模型。当前主推 gpt-5.6 系列（sol 旗舰 / terra 均衡 / luna 快速）。会话中用 /model 也能切换。',
            },
          },
          simulate: {
            effects: [
              { type: 'state', patch: { model: '{arg}' } },
              { type: 'print', lines: [{ text: 'model: {model}', style: 'dim', note: { zh: '以指定模型启动，注意状态栏变化' } }] },
            ],
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
          simulate: {
            effects: [
              { type: 'state', patch: { approval: '{arg}' } },
              { type: 'print', lines: [{ text: 'approval policy: {approval}', style: 'dim', note: { zh: '审批策略已注入本次会话' } }] },
            ],
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
          simulate: {
            effects: [
              { type: 'state', patch: { sandbox: '{arg}' } },
              { type: 'print', lines: [{ text: 'sandbox: {sandbox}', style: 'dim', note: { zh: '沙箱级别已注入本次会话' } }] },
            ],
          },
        },
        {
          kind: 'flag',
          name: '--full-auto',
          example: 'codex --full-auto "修复所有 lint 报错"',
          en: 'Low-friction automation preset (workspace-write sandbox); deprecated, prefer --sandbox workspace-write',
          i18n: {
            zh: {
              summary: '全自动模式：在沙箱内放手干活（已弃用）',
              detail: '相当于 workspace-write 沙箱加低打扰审批的组合预设。新版文档已不再推荐，建议改用 --sandbox workspace-write 显式声明。',
            },
          },
          simulate: {
            effects: [
              { type: 'state', patch: { sandbox: 'workspace-write' } },
              {
                type: 'print',
                lines: [
                  { text: 'sandbox: workspace-write · approvals reduced', style: 'dim', note: { zh: '注入沙箱可写 + 低打扰审批的组合' } },
                  { text: '! --full-auto is deprecated, use --sandbox workspace-write', style: 'warn', note: { zh: '官方已标记弃用' } },
                ],
              },
            ],
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
          simulate: {
            effects: [
              { type: 'print', lines: [{ text: 'web search: enabled', style: 'ok', note: { zh: '本次会话可以联网查资料' } }] },
            ],
          },
        },
        {
          kind: 'flag',
          name: '--enable',
          argSpec: '<feature>',
          example: 'codex --enable skills',
          en: 'Force-enable a feature flag for this run',
          i18n: {
            zh: {
              summary: '强制开启某个功能开关',
              detail: '与 codex features 子命令配合使用，可临时打开实验性功能。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--disable',
          argSpec: '<feature>',
          example: 'codex --disable hooks',
          en: 'Force-disable a feature flag for this run',
          i18n: { zh: { summary: '强制关闭某个功能开关' } },
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
          simulate: {
            effects: [
              { type: 'state', patch: { approval: 'never', sandbox: 'danger-full-access' } },
              {
                type: 'print',
                lines: [
                  { text: '⚠ approvals: never · sandbox: danger-full-access', style: 'warn', note: { zh: '审批与沙箱全部关闭（看状态栏），务必只在隔离环境使用' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'flag',
          name: '--version',
          example: 'codex --version',
          en: 'Print the version number',
          i18n: { zh: { summary: '查看版本号' } },
          simulate: {
            preventSession: true,
            effects: [{ type: 'print', lines: [{ text: 'codex-cli 0.87.0', note: { zh: '打印版本号后直接退出，不进入会话' } }] }],
          },
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
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'workdir: ~/my-project · model: gpt-5.6-sol · sandbox: read-only', style: 'dim', note: { zh: 'headless 运行头部：环境摘要' } },
                  { text: 'thinking  Scanning repository for TODO comments…', style: 'dim' },
                  { text: 'codex  Collected 7 TODO comments into TODO.md.', note: { zh: '任务完成后打印结果并退出，适合脚本与 CI' } },
                  { text: 'tokens used: 8,412', style: 'dim' },
                ],
              },
            ],
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
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Resuming session 7f3a19e2 (2 hours ago) …', style: 'dim', note: { zh: '恢复最近一次会话，上下文一并带回（看状态栏）' } },
                ],
              },
              { type: 'state', patch: { context: '62%' } },
            ],
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
          name: 'app',
          example: 'codex app',
          en: 'Launch the ChatGPT desktop app experience for Codex',
          i18n: { zh: { summary: '启动桌面版 Codex（ChatGPT 桌面应用）' } },
        },
        {
          kind: 'subcommand',
          name: 'archive',
          argSpec: '[sessionId]',
          example: 'codex archive',
          en: 'Archive a session without deleting it (restore with codex unarchive)',
          i18n: { zh: { summary: '归档会话（不删除，可用 unarchive 恢复）' } },
        },
        {
          kind: 'subcommand',
          name: 'unarchive',
          argSpec: '[sessionId]',
          example: 'codex unarchive',
          en: 'Restore an archived session',
          i18n: { zh: { summary: '恢复已归档的会话' } },
        },
        {
          kind: 'subcommand',
          name: 'delete',
          argSpec: '[sessionId]',
          example: 'codex delete',
          en: 'Permanently remove a saved session',
          i18n: { zh: { summary: '永久删除某个会话记录' } },
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
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Opening browser to authenticate…', style: 'dim', note: { zh: '默认跳浏览器走 ChatGPT OAuth' } },
                  { text: 'If the browser does not open, visit:', style: 'dim' },
                  { text: '  https://auth.openai.com/codex/device?code=XXXX-XXXX', style: 'accent', note: { zh: '远程机器可用 --device-auth 设备码登录' } },
                  { text: '✓ Signed in as you@example.com (Plus)', style: 'ok', note: { zh: '登录成功（仿真）' } },
                ],
              },
            ],
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
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Name      Transport  Status', style: 'accent' },
                  { text: 'github    stdio      connected', style: 'ok', note: { zh: '已连接的 MCP 服务器' } },
                  { text: 'sentry    http       needs auth', style: 'warn', note: { zh: '需要先执行 codex mcp auth sentry 完成授权' } },
                ],
              },
            ],
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
          name: 'plugin',
          example: 'codex plugin list',
          en: 'Install, list, and remove plugins; manage marketplaces with codex plugin marketplace',
          i18n: {
            zh: {
              summary: '管理插件（安装/列出/删除）',
              detail: '插件可以打包技能、hook、MCP 配置等。codex plugin marketplace 管理插件市场源，会话内用 /plugins 浏览。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'cloud',
          aliases: ['cloud-tasks'],
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
          name: 'execpolicy',
          argSpec: '<command...>',
          example: 'codex execpolicy check "rm -rf /"',
          en: 'Evaluate command execution policy rules',
          i18n: { zh: { summary: '检查某条命令会命中什么执行策略' } },
        },
        {
          kind: 'subcommand',
          name: 'features',
          example: 'codex features list',
          en: 'Manage feature flags',
          i18n: { zh: { summary: '查看/管理功能开关', detail: '配合 --enable / --disable 临时开关某个实验性功能。' } },
        },
        {
          kind: 'subcommand',
          name: 'app-server',
          example: 'codex app-server',
          en: 'Launch the Codex app server for local development',
          i18n: { zh: { summary: '启动 Codex app server（本地开发用）' } },
        },
        {
          kind: 'subcommand',
          name: 'remote-control',
          example: 'codex remote-control',
          en: 'Start remote control for the app server',
          i18n: { zh: { summary: '为 app server 开启远程控制' } },
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
          simulate: {
            preventSession: true,
            effects: [
              { type: 'print', lines: [{ text: '✓ Codex CLI is up to date (0.87.0)', style: 'ok', note: { zh: '已是最新版本' } }] },
            ],
          },
        },
        {
          kind: 'subcommand',
          name: 'doctor',
          example: 'codex doctor',
          en: 'Generate a diagnostic report for installation, config, auth, and runtime',
          i18n: {
            zh: {
              summary: '生成诊断报告（安装/配置/登录/运行环境）',
              detail: '出问题时先跑它，--json 可输出脱敏的机器可读报告方便提交反馈。',
            },
          },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '✓ Installation: codex 0.87.0 (npm)', style: 'ok' },
                  { text: '✓ Auth: signed in with ChatGPT (Plus)', style: 'ok' },
                  { text: '✓ Config: ~/.codex/config.toml parsed OK', style: 'ok' },
                  { text: '! Sandbox: seatbelt profile outdated, run codex update', style: 'warn', note: { zh: '发现问题会给出修复建议' } },
                ],
              },
            ],
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
          name: '/model',
          argSpec: '[model]',
          example: '/model',
          en: 'Choose the active model and reasoning effort',
          i18n: { zh: { summary: '切换模型和推理力度', detail: '面板里可分别选模型与 low/medium/high/xhigh 推理档位。' } },
          simulate: {
            effects: [
              {
                type: 'panel',
                panel: {
                  title: { zh: '选择模型（点击切换，状态栏会跟着变）' },
                  stateKey: 'model',
                  items: [
                    { value: 'gpt-5.6-sol', label: 'gpt-5.6-sol', note: { zh: '旗舰模型，复杂任务首选' } },
                    { value: 'gpt-5.6-terra', label: 'gpt-5.6-terra', note: { zh: '日常均衡之选' } },
                    { value: 'gpt-5.6-luna', label: 'gpt-5.6-luna', note: { zh: '最快最省' } },
                    { value: 'gpt-5.5', label: 'gpt-5.5', note: { zh: '上一代旗舰' } },
                    { value: 'gpt-5.3-codex-spark', label: 'gpt-5.3-codex-spark', note: { zh: '纯文本研究预览（Pro 用户）' } },
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
          name: '/permissions',
          example: '/permissions',
          en: 'Set approval and sandbox behavior',
          i18n: {
            zh: {
              summary: '调整审批与沙箱策略',
              detail: '会话中随时切换权限组合（旧版本中此命令叫 /approvals）。',
            },
          },
          simulate: {
            effects: [
              {
                type: 'panel',
                panel: {
                  title: { zh: '审批策略（点击切换）' },
                  stateKey: 'approval',
                  items: [
                    { value: 'untrusted', label: 'untrusted', note: { zh: '只放行可信命令，其余先问你' } },
                    { value: 'on-request', label: 'on-request', note: { zh: '模型需要时申请（推荐）' } },
                    { value: 'never', label: 'never', note: { zh: '从不询问，靠沙箱兜底' } },
                  ],
                },
              },
              {
                type: 'panel',
                panel: {
                  title: { zh: '沙箱级别（点击切换）' },
                  stateKey: 'sandbox',
                  items: [
                    { value: 'read-only', label: 'read-only', note: { zh: '只读' } },
                    { value: 'workspace-write', label: 'workspace-write', note: { zh: '可写工作目录（最常用）' } },
                    { value: 'danger-full-access', label: 'danger-full-access', note: { zh: '不设防（危险）' } },
                  ],
                },
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/new',
          example: '/new',
          en: 'Start a new chat in the same session',
          i18n: { zh: { summary: '开一个新对话（清掉当前上下文）' } },
          simulate: {
            effects: [
              { type: 'clear' },
              { type: 'state', patch: { context: '100%' } },
              { type: 'print', lines: [{ text: 'Started a new chat.', style: 'dim', note: { zh: '屏幕清空，上下文回到 100%（看状态栏）' } }] },
            ],
          },
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
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '⏺ Exploring repository structure…', style: 'dim' },
                  { text: '✓ Wrote AGENTS.md (build commands, code style, testing notes)', style: 'ok', note: { zh: '生成项目说明文件，之后每次会话自动加载' } },
                ],
              },
            ],
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
          simulate: {
            effects: [
              { type: 'state', patch: { context: '99%' } },
              { type: 'compact', summary: { zh: '此前的对话已折叠为摘要，上下文剩余大幅回升（看状态栏）' } },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/diff',
          example: '/diff',
          en: 'Show the Git diff, including untracked files',
          i18n: { zh: { summary: '查看当前 Git 改动（含未跟踪文件）' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'diff --git a/src/main.ts b/src/main.ts', style: 'accent', note: { zh: '标准 git diff 输出，含未跟踪文件' } },
                  { text: '+ export function retryWithBackoff() {', style: 'ok' },
                  { text: '-   throw new Error("TODO")', style: 'warn', note: { zh: '绿色为新增、红色为删除（仿真片段）' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/mention',
          argSpec: '<file>',
          example: '/mention src/main.ts',
          en: 'Attach a file to the chat',
          i18n: { zh: { summary: '把文件附加进对话', detail: '直接输入 @ 也能触发文件搜索与附加。' } },
          simulate: {
            effects: [
              { type: 'print', lines: [{ text: 'Usage: /mention <file> (or type @ to search)', style: 'dim', note: { zh: '不带参数时提示用法' } }] },
            ],
            argEffects: [
              { type: 'print', lines: [{ text: '✓ Attached {arg} to the conversation', style: 'ok', note: { zh: '文件内容已附加进上下文' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/status',
          example: '/status',
          en: 'Display session configuration and usage',
          i18n: { zh: { summary: '查看会话配置与用量（模型、沙箱、token 等）' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '📂 Workspace', style: 'accent' },
                  { text: '  path: ~/my-project · AGENTS.md: loaded', style: 'dim', note: { zh: '工作区与已加载的项目说明' } },
                  { text: '🛡 Permissions', style: 'accent' },
                  { text: '  approval: {approval} · sandbox: {sandbox}', style: 'dim', note: { zh: '当前审批与沙箱组合' } },
                  { text: '🧠 Model', style: 'accent' },
                  { text: '  {model} · reasoning {effort}', style: 'dim', note: { zh: '当前模型与推理力度' } },
                  { text: '📊 Token usage', style: 'accent' },
                  { text: '  12.4K used · context left: {context}', style: 'dim', note: { zh: '上下文窗口剩余空间' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/usage',
          example: '/usage',
          en: 'View account token usage and limits',
          i18n: { zh: { summary: '查看账号用量与限额' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Usage limits (ChatGPT Plus)', style: 'accent' },
                  { text: '  5h limit     [██████░░░░] 62% used · resets 14:32', note: { zh: '滚动 5 小时窗口的用量' } },
                  { text: '  Weekly limit [███░░░░░░░] 31% used · resets Mon 09:00', note: { zh: '每周限额' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/review',
          example: '/review',
          en: 'Ask Codex to review the working tree changes',
          i18n: { zh: { summary: '让 Codex 审查当前改动' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '⏺ Reviewing uncommitted changes…', style: 'dim' },
                  { text: 'P1  src/auth.ts:42 — token refresh can loop forever on 401', style: 'warn', note: { zh: 'P1 为高优先级问题' } },
                  { text: 'P2  src/api.ts:18 — fetch error is silently swallowed', style: 'warn' },
                  { text: '2 findings · reply "fix them" to apply fixes', style: 'dim', note: { zh: '可以直接让 Codex 顺手修掉' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/plan',
          example: '/plan',
          en: 'Switch to plan mode',
          i18n: { zh: { summary: '切换到规划模式：先出方案再动手' } },
          simulate: {
            effects: [
              { type: 'state', patch: { sandbox: 'read-only' } },
              {
                type: 'print',
                lines: [
                  { text: '⏸ Plan mode on — Codex will propose a plan before editing.', style: 'ok', note: { zh: '规划模式：只读不改，先出方案（看状态栏沙箱变为 read-only）' } },
                ],
              },
            ],
          },
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
          simulate: {
            effects: [
              { type: 'clear' },
              { type: 'state', patch: { context: '100%' } },
              { type: 'print', lines: [{ text: 'Terminal cleared. New chat started.', style: 'dim', note: { zh: '清屏并重置上下文' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/mcp',
          example: '/mcp',
          en: 'List configured MCP tools',
          i18n: { zh: { summary: '查看已配置的 MCP 工具' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'MCP servers', style: 'accent' },
                  { text: '  github    connected · 12 tools', style: 'ok', note: { zh: '已连接并列出可用工具数' } },
                  { text: '  postgres  connected · 5 tools', style: 'ok' },
                  { text: '  sentry    needs auth — run codex mcp auth sentry', style: 'warn', note: { zh: '未授权的服务器会提示补登录' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/skills',
          example: '/skills',
          en: 'Browse and use skills',
          i18n: { zh: { summary: '浏览并使用技能（skills）' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Skills', style: 'accent' },
                  { text: '  deploy-checklist   .codex/skills (repo)', note: { zh: '仓库级技能' } },
                  { text: '  release-notes      ~/.codex/skills (user)', note: { zh: '用户级技能，输入 $技能名 或让 Codex 自行调用' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/plugins',
          example: '/plugins',
          en: 'Browse installed plugins',
          i18n: { zh: { summary: '浏览已安装的插件', detail: '插件用 codex plugin install 安装，可打包技能、hook、MCP 配置。' } },
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
          simulate: {
            effects: [
              {
                type: 'panel',
                panel: {
                  title: { zh: '选择回复风格（仿真展示）' },
                  items: [
                    { value: 'default', label: 'default', note: { zh: '默认风格' } },
                    { value: 'friendly', label: 'friendly', note: { zh: '更亲切健谈' } },
                    { value: 'efficient', label: 'efficient', note: { zh: '简洁直接，少客套' } },
                  ],
                },
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/agent',
          aliases: ['/subagents'],
          example: '/agent',
          en: 'Switch the active agent thread',
          i18n: { zh: { summary: '切换当前活跃的 agent 线程（子代理）' } },
        },
        {
          kind: 'slash',
          name: '/btw',
          aliases: ['/side'],
          example: '/btw 顺便问下这个报错是啥意思',
          en: 'Start an ephemeral side chat without touching the main thread',
          i18n: { zh: { summary: '开一个临时侧聊，不影响主对话上下文' } },
        },
        {
          kind: 'slash',
          name: '/goal',
          example: '/goal 完成登录页重构并通过测试',
          en: 'Set or view the current task goal',
          i18n: { zh: { summary: '设置/查看本次任务目标', detail: '给长任务钉一个目标，Codex 会围绕它保持方向。' } },
        },
        {
          kind: 'slash',
          name: '/rename',
          argSpec: '[title]',
          example: '/rename 登录页重构',
          en: 'Rename the current chat',
          i18n: { zh: { summary: '重命名当前会话，方便日后 resume 时辨认' } },
        },
        {
          kind: 'slash',
          name: '/archive',
          example: '/archive',
          en: 'Archive the current session',
          i18n: { zh: { summary: '归档当前会话（可用 codex unarchive 恢复）' } },
        },
        {
          kind: 'slash',
          name: '/delete',
          example: '/delete',
          en: 'Permanently delete the current session',
          i18n: { zh: { summary: '永久删除当前会话' } },
        },
        {
          kind: 'slash',
          name: '/ide',
          example: '/ide',
          en: 'Include context from the connected IDE',
          i18n: { zh: { summary: '接入 IDE 上下文（当前打开的文件/选区）' } },
        },
        {
          kind: 'slash',
          name: '/app',
          example: '/app',
          en: 'Continue the current session in the desktop app',
          i18n: { zh: { summary: '把当前会话转到桌面版继续' } },
        },
        {
          kind: 'slash',
          name: '/apps',
          example: '/apps',
          en: 'Browse and insert apps',
          i18n: { zh: { summary: '浏览并插入 apps（应用连接器）' } },
        },
        {
          kind: 'slash',
          name: '/memories',
          example: '/memories',
          en: 'Configure memory settings',
          i18n: { zh: { summary: '配置记忆（memories）功能' } },
        },
        {
          kind: 'slash',
          name: '/import',
          example: '/import',
          en: 'Import an external agent setup',
          i18n: { zh: { summary: '导入其他 agent 工具的配置（如迁移已有设置）' } },
        },
        {
          kind: 'slash',
          name: '/approve',
          example: '/approve',
          en: 'Approve one retry of a recent auto review denial',
          i18n: { zh: { summary: '放行一次刚被自动审查拦下的操作' } },
        },
        {
          kind: 'slash',
          name: '/experimental',
          example: '/experimental',
          en: 'Toggle experimental features',
          i18n: { zh: { summary: '开关实验性功能' } },
        },
        {
          kind: 'slash',
          name: '/fast',
          example: '/fast',
          en: 'Toggle the Fast service tier',
          i18n: { zh: { summary: '切换 Fast 服务档（更快的推理通道）' } },
        },
        {
          kind: 'slash',
          name: '/raw',
          example: '/raw',
          en: 'Toggle raw scrollback output',
          i18n: { zh: { summary: '切换原始滚动输出模式（方便复制长输出）' } },
        },
        {
          kind: 'slash',
          name: '/keymap',
          example: '/keymap',
          en: 'Remap keyboard shortcuts',
          i18n: { zh: { summary: '自定义快捷键布局' } },
        },
        {
          kind: 'slash',
          name: '/vim',
          example: '/vim',
          en: 'Toggle Vim keybindings in the composer',
          i18n: { zh: { summary: '开关输入框的 Vim 按键模式' } },
        },
        {
          kind: 'slash',
          name: '/setup-default-sandbox',
          example: '/setup-default-sandbox',
          en: 'Configure the default sandbox on Windows',
          i18n: { zh: { summary: '配置 Windows 默认沙箱' } },
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
          name: '/stop',
          example: '/stop',
          en: 'Cancel background work',
          i18n: { zh: { summary: '停止后台运行的命令/任务' } },
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
          name: '/exit',
          aliases: ['/quit'],
          example: '/exit',
          en: 'Exit the Codex CLI',
          i18n: { zh: { summary: '退出 Codex CLI' } },
          simulate: {
            effects: [
              {
                type: 'exitSession',
                lines: [
                  { text: 'Session saved. Resume anytime with codex resume --last.', style: 'dim', note: { zh: '会话已保存，可用 codex resume --last 恢复' } },
                ],
              },
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
