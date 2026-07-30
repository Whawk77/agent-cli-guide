import type { AgentDef } from './types';
import { quickEntries } from './helpers';

export const pi: AgentDef = {
  id: 'pi',
  name: 'pi',
  binary: 'pi',
  vendor: 'Earendil Works',
  homepage: 'https://pi.dev',
  install: 'npm install -g @earendil-works/pi-coding-agent',
  release: {
    version: '0.83.0',
    channel: 'latest',
    verifiedAt: '2026-07-30',
    source: 'https://registry.npmjs.org/@earendil-works%2fpi-coding-agent/latest',
  },
  prompt: '$',
  tagline: {
    zh: 'Mario Zechner 打造的极简终端编程代理：无内置系统提示套路、支持会话树与多模型切换，一切皆可扩展。',
  },
  coverage: 'core',
  session: {
    prompt: '>',
    banner: [
      { text: 'pi v0.83.0', style: 'accent', note: { zh: 'pi 的横幅就这么朴素——极简是它的设计哲学' } },
      { text: '{model} · thinking: {thinking}', style: 'dim', note: { zh: '当前模型与思考深度（状态栏同步显示）' } },
      { text: '~/my-project · session: {session}', style: 'dim', note: { zh: '会话默认存为 JSONL 文件，可随意拷贝迁移' } },
    ],
    statusFields: [
      {
        key: 'model',
        label: { zh: '模型' },
        initial: 'claude-sonnet-4-5',
        options: ['claude-sonnet-4-5', 'gpt-5.1', 'gemini-3-pro', 'qwen3-coder'],
      },
      {
        key: 'thinking',
        label: { zh: '思考深度' },
        initial: 'medium',
        options: ['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'],
      },
      { key: 'context', label: { zh: '上下文' }, initial: '1%' },
      { key: 'session', label: { zh: '会话' }, initial: '(未命名)' },
    ],
    chatReply: [
      { text: '⠿ working…', style: 'dim' },
      {
        text: 'Let me read the relevant files and make that change.',
        note: { zh: '真实的 pi 会用 read/edit/bash 等工具直接干活；途中你随时回车就能插话转向' },
      },
    ],
    exitInputs: ['exit', '/exit', '/quit'],
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
          argSpec: '"<prompt>"',
          example: 'pi -p "解释这个仓库的结构"',
          en: 'Print the response and exit (non-interactive, for scripts)',
          i18n: {
            zh: {
              summary: '非交互模式：输出结果后直接退出',
              detail: '适合脚本和管道场景。配合 --mode json 可以拿到结构化的事件流输出。',
            },
          },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '(model response printed to stdout)', style: 'dim', note: { zh: '结果直接打印到标准输出，随后退出——适合脚本和管道' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'flag',
          name: '--mode',
          argSpec: '<json|rpc>',
          example: 'pi -p "hi" --mode json',
          en: 'Output mode: json emits events as JSON lines; rpc speaks a JSON protocol over stdin/stdout',
          i18n: {
            zh: {
              summary: '切换输出模式：JSON 事件流或 RPC 协议',
              detail: 'json 模式把每个事件按行输出 JSON，适合日志和程序解析；rpc 模式通过 stdin/stdout 走 JSON 协议双向通信，可以把 pi 当后端嵌进自己的应用。',
            },
          },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '{"type":"session_start","sessionId":"0199a1b2-4c3d"}', style: 'dim', note: { zh: '每个事件一行 JSON，程序可以逐行解析' } },
                  { text: '{"type":"message_start","role":"assistant"}', style: 'dim' },
                  { text: '{"type":"text_delta","text":"Hello!"}', style: 'dim', note: { zh: '模型输出以增量事件流出' } },
                  { text: '{"type":"message_end","usage":{"input":1204,"output":56}}', style: 'dim', note: { zh: '结束事件附带 token 用量；rpc 模式则在 stdin/stdout 上双向收发这类 JSON' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'flag',
          name: '--model',
          argSpec: '<pattern>',
          example: 'pi --model sonnet',
          en: 'Model pattern or ID; supports provider/id and an optional :thinking suffix',
          i18n: {
            zh: {
              summary: '指定模型（支持模式匹配）',
              detail: '可以写模型 ID、provider/id 或模糊匹配的模式，还能加 :thinking 后缀直接指定思考深度，如 --model "gpt-5:high"。',
            },
          },
          simulate: { effects: [{ type: 'state', patch: { model: '{arg}' } }] },
        },
        {
          kind: 'flag',
          name: '--provider',
          argSpec: '<name>',
          example: 'pi --provider anthropic',
          en: 'Select the LLM provider (anthropic, openai, google, ...)',
          i18n: {
            zh: {
              summary: '指定 LLM 提供商',
              detail: 'pi 内置多提供商支持（Anthropic、OpenAI、Google 等），也支持自定义 provider 和本地 llama.cpp 模型。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--api-key',
          argSpec: '<key>',
          example: 'pi --provider openai --api-key sk-...',
          en: 'API key for the provider, overriding environment variables',
          i18n: { zh: { summary: '直接传入 API key（覆盖环境变量）' } },
        },
        {
          kind: 'flag',
          name: '--thinking',
          argSpec: '<level>',
          example: 'pi --thinking high',
          en: 'Set thinking level: off, minimal, low, medium, high, xhigh, max',
          i18n: {
            zh: {
              summary: '设置模型的思考（推理）深度',
              detail: '从 off 到 max 共七档。会话中可在 /settings 里调整，或按 Shift+Tab 循环切换。',
            },
          },
          simulate: { effects: [{ type: 'state', patch: { thinking: '{arg}' } }] },
        },
        {
          kind: 'flag',
          name: '--models',
          argSpec: '<patterns>',
          example: 'pi --models "sonnet,gpt-5,gemini"',
          en: 'Comma-separated model patterns for Ctrl+P cycling',
          i18n: {
            zh: {
              summary: '定义 Ctrl+P 循环切换的常用模型列表',
              detail: '逗号分隔多个模型模式，会话中按 Ctrl+P 就能在这批模型之间快速轮换，跨提供商对比很方便。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--list-models',
          argSpec: '[search]',
          example: 'pi --list-models claude',
          en: 'List available models, optionally filtered by a search term',
          i18n: { zh: { summary: '列出可用模型（可带关键词过滤）' } },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'anthropic/claude-sonnet-4-5', note: { zh: '格式是 provider/model-id' } },
                  { text: 'anthropic/claude-opus-4-5', style: 'dim' },
                  { text: 'openai/gpt-5.1', style: 'dim' },
                  { text: 'google/gemini-3-pro', style: 'dim' },
                  { text: 'llamacpp/qwen3-coder', style: 'dim', note: { zh: '本地 llama.cpp 模型也在同一目录里' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'flag',
          name: '--continue',
          aliases: ['-c'],
          example: 'pi -c',
          en: 'Resume the most recent session',
          i18n: { zh: { summary: '接着最近一次会话继续' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [{ text: 'Resuming session 0199a1b2 (24 messages)…', style: 'dim', note: { zh: '恢复最近一次会话（仿真）' } }],
              },
              { type: 'state', patch: { context: '38%' } },
            ],
          },
        },
        {
          kind: 'flag',
          name: '--resume',
          aliases: ['-r'],
          example: 'pi -r',
          en: 'Browse and select a past session interactively',
          i18n: { zh: { summary: '打开会话列表，挑一个恢复' } },
        },
        {
          kind: 'flag',
          name: '--session',
          argSpec: '<path|id>',
          example: 'pi --session ./mysession.jsonl',
          en: 'Use a specific session file or partial UUID',
          i18n: {
            zh: {
              summary: '指定要使用的会话文件或 ID',
              detail: '会话是纯 JSONL 文件，可以随意拷贝、进版本库、跨机器迁移。ID 支持只写前几位。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--fork',
          argSpec: '<path|id>',
          example: 'pi --fork ./mysession.jsonl',
          en: 'Create a new session forked from an existing one',
          i18n: { zh: { summary: '从已有会话分叉出一个新会话' } },
        },
        {
          kind: 'flag',
          name: '--name',
          aliases: ['-n'],
          argSpec: '<name>',
          example: 'pi -n "重构认证模块"',
          en: 'Set the session display name at startup',
          i18n: { zh: { summary: '启动时就给会话起好名字', detail: '会话中也可以用 /name 改名。' } },
          simulate: { effects: [{ type: 'state', patch: { session: '{arg}' } }] },
        },
        {
          kind: 'flag',
          name: '--no-session',
          example: 'pi --no-session',
          en: 'Ephemeral mode — do not save the session to disk',
          i18n: { zh: { summary: '临时模式：本次会话不落盘' } },
        },
        {
          kind: 'flag',
          name: '--tools',
          aliases: ['-t'],
          argSpec: '<list>',
          example: 'pi --tools read,bash',
          en: 'Allow only the listed built-in / extension / custom tools',
          i18n: {
            zh: {
              summary: '只启用指定的工具',
              detail: '内置工具有 read、bash、edit、write、grep、find、ls。相关选项：--exclude-tools（-xt）排除某些工具、--no-builtin-tools（-nbt）只关内置工具、--no-tools（-nt）关掉全部工具（纯聊天）。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--extension',
          aliases: ['-e'],
          argSpec: '<source>',
          example: 'pi -e ./my-extension.ts',
          en: 'Load an extension from a path, npm package, or git repo (repeatable)',
          i18n: {
            zh: {
              summary: '加载扩展（本地路径 / npm / git 均可）',
              detail: '扩展是 pi 的核心定制机制，用 TypeScript 写工具、命令甚至 TUI 组件。可重复传入多个。--no-extensions 则禁用扩展自动发现。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--skill',
          argSpec: '<path>',
          example: 'pi --skill ./skills/review',
          en: 'Load a skill from a path (repeatable)',
          i18n: { zh: { summary: '加载指定技能（skill），可重复传入', detail: '--no-skills 则禁用技能自动发现。类似的还有 --prompt-template / --theme 及对应的 --no-* 开关。' } },
        },
        {
          kind: 'flag',
          name: '--system-prompt',
          argSpec: '"<text>"',
          example: 'pi --system-prompt "You are a Rust expert"',
          en: 'Replace the default system prompt entirely',
          i18n: {
            zh: {
              summary: '整个替换默认系统提示词',
              detail: '只想追加而不是替换的话，用 --append-system-prompt。pi 的默认系统提示极简，替换成本很低。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--no-context-files',
          aliases: ['-nc'],
          example: 'pi --no-context-files',
          en: 'Skip AGENTS.md / CLAUDE.md context file discovery',
          i18n: { zh: { summary: '不自动加载 AGENTS.md / CLAUDE.md 上下文文件' } },
        },
        {
          kind: 'flag',
          name: '--approve',
          aliases: ['-a'],
          example: 'pi -a',
          en: 'Trust project-local files for this run (-na to ignore them instead)',
          i18n: {
            zh: {
              summary: '本次运行临时信任项目本地配置',
              detail: 'pi 默认不自动加载项目目录里的扩展/技能，需要确认。-a 临时信任、-na（--no-approve）临时忽略，/trust 则永久信任。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--export',
          argSpec: '<in> [out]',
          example: 'pi --export ./mysession.jsonl session.html',
          en: 'Export a session file to a self-contained HTML page',
          i18n: { zh: { summary: '把会话文件导出为独立 HTML 页面' } },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [{ text: '✓ Exported mysession.jsonl → session.html', style: 'ok', note: { zh: '生成单文件 HTML，双击就能回看整个会话' } }],
              },
            ],
          },
        },
        {
          kind: 'flag',
          name: '--verbose',
          example: 'pi --verbose',
          en: 'Force verbose startup logging',
          i18n: { zh: { summary: '启动时输出详细日志（排查扩展/配置加载问题）' } },
        },
        {
          kind: 'flag',
          name: '--version',
          aliases: ['-v'],
          example: 'pi --version',
          en: 'Show the version number',
          i18n: { zh: { summary: '查看版本号' } },
          simulate: {
            preventSession: true,
            effects: [{ type: 'print', lines: [{ text: '0.83.0', note: { zh: '打印版本号后直接退出，不进入会话' } }] }],
          },
        },
        {
          kind: 'flag',
          name: '--help',
          aliases: ['-h'],
          example: 'pi --help',
          en: 'Display help',
          i18n: { zh: { summary: '显示帮助信息' } },
        },
        ...quickEntries('flag', 'pi', [
          ['--append-system-prompt', '<text-or-file>', 'Append text or file contents to the system prompt', '向系统提示词追加文本或文件内容'],
          ['--exclude-tools', '<tools>', 'Disable a comma-separated list of tools', '按逗号分隔的黑名单禁用工具', ['-xt']],
          ['--no-approve', undefined, 'Ignore project-local files for this run', '本次运行不信任并忽略项目级本地资源', ['-na']],
          ['--no-builtin-tools', undefined, 'Disable built-in tools while keeping extension tools', '禁用内置工具但保留扩展和自定义工具', ['-nbt']],
          ['--no-extensions', undefined, 'Disable automatic extension discovery', '禁用扩展自动发现与加载', ['-ne']],
          ['--no-prompt-templates', undefined, 'Disable prompt template discovery and loading', '禁用提示词模板发现与加载', ['-np']],
          ['--no-skills', undefined, 'Disable skill discovery and loading', '禁用技能发现与加载', ['-ns']],
          ['--no-themes', undefined, 'Disable theme discovery and loading', '禁用主题发现与加载'],
          ['--no-tools', undefined, 'Disable built-in and extension tools by default', '默认禁用全部内置与扩展工具', ['-nt']],
          ['--offline', undefined, 'Disable network operations during startup', '启动时禁止联网操作'],
          ['--prompt-template', '<path>', 'Load a prompt template file or directory', '加载提示词模板文件或目录'],
          ['--session-dir', '<dir>', 'Choose the session storage and lookup directory', '指定会话存储与检索目录'],
          ['--session-id', '<id>', 'Use an exact project session ID, creating it if needed', '使用指定项目会话 ID，不存在则创建'],
          ['--theme', '<path>', 'Load a theme file or directory', '加载主题文件或目录'],
        ]),
      ],
    },
    {
      id: 'subcommands',
      i18n: { zh: { title: '子命令' } },
      entries: [
        {
          kind: 'subcommand',
          name: 'install',
          argSpec: '<source>',
          example: 'pi install git:github.com/badlogic/pi-doom',
          en: 'Install a pi package (extensions, skills, prompts, themes) from npm or git; add -l for project-local',
          i18n: {
            zh: {
              summary: '安装 pi 扩展包（npm 或 git 来源）',
              detail: '如 pi install npm:@foo/pi-tools。加 -l 只装到当前项目而不是全局。',
            },
          },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Installing git:github.com/badlogic/pi-doom…', style: 'dim' },
                  { text: '✓ Installed pi-doom (1 extension)', style: 'ok', note: { zh: '装完即用，扩展/技能/主题都能这样分发' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'subcommand',
          name: 'remove',
          aliases: ['uninstall'],
          argSpec: '<source>',
          example: 'pi remove npm:@foo/pi-tools',
          en: 'Remove an installed package',
          i18n: { zh: { summary: '卸载已安装的扩展包' } },
        },
        {
          kind: 'subcommand',
          name: 'update',
          argSpec: '[source|self|pi]',
          example: 'pi update --all',
          en: 'Update pi itself and/or installed packages; --models refreshes model catalogs',
          i18n: {
            zh: {
              summary: '更新 pi 本体和扩展包',
              detail: '--all 全部更新；--self 只更新 pi；--extensions 只更新扩展包；--models 刷新模型目录。',
            },
          },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'pi 0.83.0 → up to date', style: 'ok' },
                  { text: '✓ Updated 2 packages', style: 'ok', note: { zh: '本体与扩展包一条命令全部更新' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'subcommand',
          name: 'list',
          example: 'pi list',
          en: 'List installed packages',
          i18n: { zh: { summary: '列出已安装的扩展包' } },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'global:', style: 'accent' },
                  { text: '  npm:@foo/pi-tools    2 tools, 1 command', style: 'dim' },
                  { text: 'project:', style: 'accent', note: { zh: '全局与项目级安装分开列出' } },
                  { text: '  git:github.com/badlogic/pi-doom    1 extension', style: 'dim' },
                ],
              },
            ],
          },
        },
        {
          kind: 'subcommand',
          name: 'config',
          example: 'pi config',
          en: 'Enable or disable resources provided by installed packages',
          i18n: { zh: { summary: '启用/禁用扩展包提供的各项资源' } },
        },
        {
          kind: 'subcommand',
          name: 'auth',
          argSpec: '<print-api-key|print-bearer-token>',
          example: 'pi auth print-bearer-token --provider openai-codex --model gpt-5.5',
          en: 'Print an API key or refreshed OAuth bearer token for an external client',
          i18n: {
            zh: {
              summary: '为外部客户端输出 API Key 或刷新后的 OAuth Bearer Token',
              detail: '0.83.0 新增。支持 print-api-key 与 print-bearer-token；输出含敏感凭证，不要写入日志。',
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
          name: '/model',
          example: '/model',
          en: 'Switch models mid-session',
          i18n: {
            zh: {
              summary: '会话中切换模型',
              detail: '换模型不丢上下文，可以随时在不同提供商的模型之间横跳。Ctrl+L 打开选择器，Ctrl+P 在常用模型间快速轮换。',
            },
          },
          simulate: {
            effects: [
              {
                type: 'panel',
                panel: {
                  title: { zh: '选择模型（点击切换，状态栏会跟着变）' },
                  stateKey: 'model',
                  items: [
                    { value: 'claude-sonnet-4-5', label: 'anthropic/claude-sonnet-4-5', note: { zh: '换模型不丢上下文' } },
                    { value: 'gpt-5.1', label: 'openai/gpt-5.1', note: { zh: '跨提供商随意横跳' } },
                    { value: 'gemini-3-pro', label: 'google/gemini-3-pro' },
                    { value: 'qwen3-coder', label: 'llamacpp/qwen3-coder', note: { zh: '本地 llama.cpp 模型（配合 /llama 管理）' } },
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
          name: '/settings',
          example: '/settings',
          en: 'Adjust thinking level, theme, message delivery and transport',
          i18n: { zh: { summary: '打开设置（思考深度、主题等）', detail: '思考深度也可以直接按 Shift+Tab 循环切换。' } },
          simulate: {
            effects: [
              {
                type: 'panel',
                panel: {
                  title: { zh: '设置（仿真只演示思考深度一项，点击调整）' },
                  stateKey: 'thinking',
                  items: [
                    { value: 'off', label: 'thinking: off', note: { zh: '不思考，响应最快' } },
                    { value: 'low', label: 'thinking: low' },
                    { value: 'medium', label: 'thinking: medium', note: { zh: '默认档位' } },
                    { value: 'high', label: 'thinking: high' },
                    { value: 'max', label: 'thinking: max', note: { zh: '最深推理，最费 token' } },
                  ],
                },
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/login',
          example: '/login',
          en: 'Manage OAuth / API-key credentials for providers',
          i18n: { zh: { summary: '登录提供商账号（OAuth 或 API key）', detail: '支持用 Claude Pro/Max、ChatGPT 等订阅账号登录。/logout 退出。' } },
        },
        {
          kind: 'slash',
          name: '/llama',
          example: '/llama',
          en: 'Download, load and unload local llama.cpp router models',
          i18n: { zh: { summary: '管理本地 llama.cpp 模型（下载/加载/卸载）', detail: '让 pi 直接驱动本地开源模型，无需任何云端 API。' } },
        },
        {
          kind: 'slash',
          name: '/new',
          example: '/new',
          en: 'Start a new session',
          i18n: { zh: { summary: '开启一个新会话' } },
          simulate: {
            effects: [
              { type: 'clear' },
              { type: 'state', patch: { context: '0%', session: '(未命名)' } },
              { type: 'print', lines: [{ text: 'Started a new session.', style: 'dim', note: { zh: '屏幕已清空，上下文归零（看状态栏）' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/resume',
          example: '/resume',
          en: 'Browse and resume previous sessions',
          i18n: { zh: { summary: '浏览并恢复历史会话' } },
        },
        {
          kind: 'slash',
          name: '/session',
          example: '/session',
          en: 'Show session file, ID, message count, tokens and cost',
          i18n: { zh: { summary: '查看当前会话信息（文件、token、费用）' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'file:     ~/.pi/sessions/0199a1b2-4c3d.jsonl', style: 'dim', note: { zh: '会话就是一个 JSONL 文件' } },
                  { text: 'name:     {session}', style: 'dim' },
                  { text: 'messages: 24 · tokens: 48.2k · cost: $0.31', note: { zh: '消息数、token 用量与费用一目了然' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/name',
          argSpec: '<name>',
          example: '/name 重构认证模块',
          en: 'Set a display name for the current session',
          i18n: { zh: { summary: '给当前会话起个名字' } },
          simulate: {
            effects: [{ type: 'print', lines: [{ text: 'Usage: /name <name>', style: 'dim', note: { zh: '带上名字再试试，如 /name 重构认证模块' } }] }],
            argEffects: [
              { type: 'state', patch: { session: '{args}' } },
              { type: 'print', lines: [{ text: '✓ Session named "{session}"', style: 'ok', note: { zh: '改名成功，状态栏与 /resume 列表里都会显示' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/tree',
          example: '/tree',
          en: 'Navigate the session tree and continue from any point',
          i18n: {
            zh: {
              summary: '查看会话树，从任意节点继续',
              detail: 'pi 的会话是树形结构：每次分叉都是一个分支。/tree 里可以回到任意历史节点接着聊，走错路了直接跳回去。',
            },
          },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: '● user: 帮我重构认证模块', style: 'accent' },
                  { text: '├── assistant: 我先看下现有代码…', style: 'dim' },
                  { text: '│   └── user: 改用 JWT 方案  ◀ current', style: 'ok', note: { zh: '当前所在的分支' } },
                  { text: '└── user: 先补测试再动手', style: 'dim', note: { zh: '另一条分叉——选中任意节点即可从那里继续' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/fork',
          example: '/fork',
          en: 'Create a new session branching from a previous user message',
          i18n: { zh: { summary: '从之前某条消息分叉出新会话' } },
          simulate: {
            effects: [
              { type: 'state', patch: { session: '(fork)' } },
              {
                type: 'print',
                lines: [{ text: '✓ Forked into new session 0199b3c4', style: 'ok', note: { zh: '原会话保持不动，新分支独立成一个会话文件' } }],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/clone',
          example: '/clone',
          en: 'Duplicate the active branch into a new session',
          i18n: { zh: { summary: '把当前分支复制成一个新会话' } },
        },
        {
          kind: 'slash',
          name: '/compact',
          argSpec: '[prompt]',
          example: '/compact',
          en: 'Manually compress the context, optionally with custom instructions',
          i18n: {
            zh: {
              summary: '手动压缩上下文',
              detail: '上下文快满时把历史压成摘要。可以附加提示告诉它压缩时保留什么重点。',
            },
          },
          simulate: {
            effects: [
              { type: 'state', patch: { context: '4%' } },
              { type: 'compact', summary: { zh: '此前的对话已折叠为摘要，上下文占用大幅下降（看状态栏）' } },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/copy',
          example: '/copy',
          en: 'Copy the last assistant message to the clipboard',
          i18n: { zh: { summary: '复制最后一条回复到剪贴板' } },
        },
        {
          kind: 'slash',
          name: '/export',
          argSpec: '[file]',
          example: '/export',
          en: 'Export the session to HTML or JSONL',
          i18n: { zh: { summary: '导出会话为 HTML 或 JSONL 文件' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [{ text: '✓ Exported to pi-session-2026-07-27.html', style: 'ok', note: { zh: '单文件 HTML，发给别人直接就能看（仿真）' } }],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/import',
          argSpec: '<file>',
          example: '/import ./session.jsonl',
          en: 'Import and resume a session from a JSONL file',
          i18n: { zh: { summary: '从 JSONL 文件导入并恢复会话' } },
        },
        {
          kind: 'slash',
          name: '/share',
          example: '/share',
          en: 'Upload the session as a private GitHub gist with an HTML link',
          i18n: { zh: { summary: '把会话上传为私有 GitHub gist 并生成可看的链接' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Uploading session as private gist…', style: 'dim' },
                  { text: '✓ https://pi.dev/session/#gist=abc123', style: 'ok', note: { zh: '私有 gist + 可分享的 HTML 查看链接（仿真）' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/trust',
          example: '/trust',
          en: 'Permanently save the trust decision for this project',
          i18n: {
            zh: {
              summary: '永久信任当前项目的本地配置',
              detail: 'pi 默认不自动加载项目目录里的扩展/技能等文件，需要你确认。启动时也可以用 -a 临时信任、-na 临时忽略。',
            },
          },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [{ text: '✓ Project trusted — local extensions, skills and prompts will load.', style: 'ok', note: { zh: '此决定已持久保存，之后启动不再询问' } }],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/reload',
          example: '/reload',
          en: 'Reload keybindings, extensions, skills, prompts, themes and context files',
          i18n: { zh: { summary: '热重载扩展、技能、主题等所有自定义内容', detail: '改完扩展代码不用重启 pi，/reload 一下就生效。' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [{ text: '✓ Reloaded 2 extensions, 3 skills, 1 theme, keybindings', style: 'ok', note: { zh: '开发扩展时的高频操作：改代码 → /reload 即生效' } }],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/scoped-models',
          example: '/scoped-models',
          en: 'Enable/disable which models Ctrl+P cycles through',
          i18n: { zh: { summary: '管理 Ctrl+P 轮换的模型清单' } },
        },
        {
          kind: 'slash',
          name: '/hotkeys',
          example: '/hotkeys',
          en: 'Display all keyboard shortcuts',
          i18n: { zh: { summary: '查看全部快捷键' } },
        },
        {
          kind: 'slash',
          name: '/changelog',
          example: '/changelog',
          en: 'Show the version history',
          i18n: { zh: { summary: '查看版本更新日志' } },
        },
        {
          kind: 'slash',
          name: '/quit',
          example: '/quit',
          en: 'Exit pi',
          i18n: { zh: { summary: '退出 pi' } },
          simulate: {
            effects: [{ type: 'exitSession', lines: [{ text: 'Session saved to ~/.pi/sessions/0199a1b2-4c3d.jsonl', style: 'dim', note: { zh: '退出前会话已自动落盘' } }] }],
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
          name: 'Enter',
          en: 'Queue a steering message — delivered after the current tool call, interrupting remaining ones',
          i18n: {
            zh: {
              summary: '发送"转向"消息：当前工具执行完就插话',
              detail: 'pi 的特色交互——agent 干活途中随时输入并回车，消息会在下一个工具调用后送达，及时纠偏而不必打断重来。送达时机可在 /settings 里调整。',
            },
          },
        },
        {
          kind: 'shortcut',
          name: 'Alt+Enter',
          en: 'Queue a follow-up message, delivered after the agent finishes all work',
          i18n: { zh: { summary: '排队一条后续消息，等 agent 全部干完再发' } },
        },
        {
          kind: 'shortcut',
          name: 'Esc',
          en: 'Abort the current run and restore queued messages to the editor',
          i18n: { zh: { summary: '中止当前执行，排队的消息退回输入框' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+L',
          en: 'Open the model selector',
          i18n: { zh: { summary: '打开模型选择器（等同 /model）' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+P',
          en: 'Cycle through your scoped favorite models (Shift+Ctrl+P cycles backward)',
          i18n: { zh: { summary: '在常用模型之间循环切换', detail: '模型清单由 --models 或 /scoped-models 定义；Shift+Ctrl+P 反向轮换。' } },
        },
        {
          kind: 'shortcut',
          name: 'Shift+Tab',
          en: 'Cycle the thinking level',
          i18n: { zh: { summary: '循环切换思考深度（off → … → max）' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+O',
          en: 'Collapse or expand tool output',
          i18n: { zh: { summary: '折叠/展开工具输出' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+T',
          en: 'Collapse or expand thinking blocks',
          i18n: { zh: { summary: '折叠/展开思考过程' } },
        },
        {
          kind: 'shortcut',
          name: 'Shift+Enter',
          en: 'Insert a newline for multi-line input',
          i18n: { zh: { summary: '输入换行（多行消息）', detail: 'Windows Terminal 下用 Ctrl+Enter。' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+G',
          en: 'Open the message in an external editor',
          i18n: { zh: { summary: '调用外部编辑器写长消息' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+X',
          en: 'Copy the last assistant message (or the selected one in /tree)',
          i18n: { zh: { summary: '复制最后一条回复（/tree 里复制选中消息）' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+V',
          en: 'Paste images from the clipboard (Alt+V on Windows)',
          i18n: { zh: { summary: '粘贴剪贴板图片（Windows 用 Alt+V）' } },
        },
        {
          kind: 'shortcut',
          name: 'Alt+Up',
          en: 'Pull queued messages back into the editor',
          i18n: { zh: { summary: '把已排队的消息取回输入框修改' } },
        },
        {
          kind: 'interactive',
          name: '@',
          argSpec: '<file>',
          example: '@src/main.ts 这个文件在干嘛？',
          en: 'Fuzzy-search project files and include them in the message',
          i18n: { zh: { summary: '输入 @ 模糊搜索并引用项目文件' } },
        },
        {
          kind: 'interactive',
          name: '!',
          argSpec: '<command>',
          example: '! git status',
          en: 'Run a shell command and send its output to the model',
          i18n: { zh: { summary: '行首输入 !：执行 shell 命令并把输出发给模型' } },
        },
        {
          kind: 'interactive',
          name: '!!',
          argSpec: '<command>',
          example: '!! ls -la',
          en: 'Run a shell command without sending the output to the model',
          i18n: { zh: { summary: '行首输入 !!：只执行命令，输出不进上下文' } },
        },
      ],
    },
  ],
};
