import type { AgentDef } from './types';

export const claudeCode: AgentDef = {
  id: 'claude-code',
  name: 'Claude Code',
  binary: 'claude',
  vendor: 'Anthropic',
  homepage: 'https://docs.claude.com/en/docs/claude-code',
  install: 'npm install -g @anthropic-ai/claude-code',
  prompt: '$',
  tagline: {
    zh: 'Anthropic 官方终端编程助手，直接在命令行里读写代码、执行任务。',
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
          argSpec: '<model>',
          example: 'claude --model opus',
          en: 'Model for the current session (e.g. opus, sonnet, haiku)',
          i18n: {
            zh: {
              summary: '指定本次会话使用的模型',
              detail: '可以用别名（opus / sonnet / haiku）或完整模型名（如 claude-sonnet-5）。不指定时使用账号默认模型。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--continue',
          aliases: ['-c'],
          example: 'claude --continue',
          en: 'Continue the most recent conversation in this directory',
          i18n: {
            zh: {
              summary: '继续当前目录里最近一次的对话',
              detail: '恢复上下文接着聊，不会新开会话。适合关掉终端后回来继续干活。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--resume',
          aliases: ['-r'],
          argSpec: '[sessionId]',
          example: 'claude --resume',
          en: 'Resume a conversation — opens an interactive picker or takes a session ID',
          i18n: {
            zh: {
              summary: '恢复历史会话（可从列表挑选）',
              detail: '不带参数时弹出会话列表让你选；也可以直接跟会话 ID。和 --continue 的区别：--continue 只恢复最近一次。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--print',
          aliases: ['-p'],
          argSpec: '"<prompt>"',
          example: 'claude -p "解释这个仓库的结构"',
          en: 'Non-interactive mode: print the response and exit (for scripts and pipelines)',
          i18n: {
            zh: {
              summary: '非交互模式：输出结果后直接退出',
              detail: '适合写脚本或管道，比如 git diff | claude -p "帮我写提交信息"。配合 --output-format 可输出 JSON。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--permission-mode',
          argSpec: '<mode>',
          example: 'claude --permission-mode plan',
          en: 'Start in a specific permission mode: default, acceptEdits, plan, bypassPermissions',
          i18n: {
            zh: {
              summary: '以指定权限模式启动',
              detail: 'default 每次询问；acceptEdits 自动接受文件编辑；plan 只读规划模式（不改任何东西）；bypassPermissions 跳过所有确认（危险，慎用）。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--allowedTools',
          argSpec: '"<tools>"',
          example: 'claude --allowedTools "Bash(git *) Edit"',
          en: 'Tools allowed to run without permission prompts',
          i18n: {
            zh: {
              summary: '免确认放行的工具白名单',
              detail: '例如 "Bash(git *)" 表示所有 git 命令免确认。与之相对还有 --disallowedTools 黑名单。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--add-dir',
          argSpec: '<path>',
          example: 'claude --add-dir ../backend',
          en: 'Grant access to additional working directories',
          i18n: {
            zh: {
              summary: '额外授权访问其他目录',
              detail: '默认只能访问启动目录。跨仓库/跨目录干活时用它把别的路径加进来，会话中也可用 /add-dir。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--dangerously-skip-permissions',
          example: 'claude --dangerously-skip-permissions',
          en: 'Skip all permission prompts (use only in isolated environments)',
          i18n: {
            zh: {
              summary: '跳过所有权限确认（危险）',
              detail: '完全自动执行、不再询问。只建议在容器/沙箱等隔离环境里使用。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--output-format',
          argSpec: '<format>',
          example: 'claude -p "hi" --output-format json',
          en: 'Output format for print mode: text, json, stream-json',
          i18n: {
            zh: {
              summary: '设置 -p 模式的输出格式',
              detail: 'text 纯文本（默认）；json 结构化结果；stream-json 逐事件流式输出，适合程序集成。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--append-system-prompt',
          argSpec: '"<text>"',
          example: 'claude --append-system-prompt "回答一律用中文"',
          en: 'Append custom text to the system prompt',
          i18n: {
            zh: {
              summary: '在系统提示词后追加自定义内容',
              detail: '不替换官方系统提示，只是在后面加你的规则，比如固定回复语言、代码风格要求。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--mcp-config',
          argSpec: '<file>',
          example: 'claude --mcp-config ./mcp.json',
          en: 'Load MCP servers from a JSON file',
          i18n: {
            zh: {
              summary: '从 JSON 文件加载 MCP 服务器',
              detail: 'MCP（Model Context Protocol）用于接入外部工具/数据源。也可以用 claude mcp add 交互式添加。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--verbose',
          example: 'claude --verbose',
          en: 'Verbose logging — show full turn-by-turn output',
          i18n: {
            zh: {
              summary: '显示详细日志',
              detail: '逐轮展开完整的工具调用与输出，排查问题时很有用。会话中按 Ctrl+O 也能切换。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--version',
          aliases: ['-v'],
          example: 'claude --version',
          en: 'Print the version number',
          i18n: { zh: { summary: '查看版本号' } },
        },
        {
          kind: 'flag',
          name: '--help',
          aliases: ['-h'],
          example: 'claude --help',
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
          name: 'mcp',
          example: 'claude mcp list',
          en: 'Configure and manage MCP servers (add / list / remove)',
          i18n: {
            zh: {
              summary: '管理 MCP 服务器（添加/列出/删除）',
              detail: '例如 claude mcp add 交互式添加、claude mcp list 查看已配置的服务器。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'config',
          example: 'claude config list',
          en: 'Manage configuration values (get / set / list)',
          i18n: {
            zh: {
              summary: '查看和修改配置项',
              detail: '如 claude config set --global theme dark。多数设置也可以在会话中用 /config 改。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'update',
          example: 'claude update',
          en: 'Check for and install updates',
          i18n: { zh: { summary: '检查并安装更新' } },
        },
        {
          kind: 'subcommand',
          name: 'doctor',
          example: 'claude doctor',
          en: 'Diagnose installation and environment issues',
          i18n: { zh: { summary: '诊断安装与环境问题', detail: '安装出问题、命令找不到时先跑它。' } },
        },
        {
          kind: 'subcommand',
          name: 'setup-token',
          example: 'claude setup-token',
          en: 'Set up a long-lived authentication token for non-interactive use',
          i18n: { zh: { summary: '配置长期认证令牌（供脚本/CI 使用）' } },
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
          example: '/help',
          en: 'Show available commands and usage help',
          i18n: { zh: { summary: '查看可用命令和帮助' } },
        },
        {
          kind: 'slash',
          name: '/clear',
          example: '/clear',
          en: 'Clear conversation history and start fresh',
          i18n: {
            zh: {
              summary: '清空对话历史，重新开始',
              detail: '换新任务时用它清掉无关上下文，省 token 也更聚焦。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/compact',
          argSpec: '[instructions]',
          example: '/compact',
          en: 'Compact the conversation, keeping a summary of prior context',
          i18n: {
            zh: {
              summary: '压缩对话：保留摘要、释放上下文空间',
              detail: '对话太长时用。可附加说明告诉它保留什么，如 /compact 保留所有代码改动。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/model',
          example: '/model',
          en: 'View or switch the model mid-session',
          i18n: { zh: { summary: '会话中查看/切换模型' } },
        },
        {
          kind: 'slash',
          name: '/init',
          example: '/init',
          en: 'Generate a CLAUDE.md guide for this codebase',
          i18n: {
            zh: {
              summary: '为当前代码库生成 CLAUDE.md 项目说明',
              detail: 'CLAUDE.md 是项目级记忆文件，每次会话自动加载，写入构建命令、代码规范等。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/memory',
          example: '/memory',
          en: 'Edit memory files (CLAUDE.md)',
          i18n: { zh: { summary: '编辑记忆文件（CLAUDE.md）' } },
        },
        {
          kind: 'slash',
          name: '/config',
          example: '/config',
          en: 'Open the settings panel',
          i18n: { zh: { summary: '打开设置面板（主题、模型等）' } },
        },
        {
          kind: 'slash',
          name: '/permissions',
          example: '/permissions',
          en: 'View or update tool permissions',
          i18n: { zh: { summary: '查看/修改工具权限规则' } },
        },
        {
          kind: 'slash',
          name: '/mcp',
          example: '/mcp',
          en: 'Manage MCP server connections and OAuth',
          i18n: { zh: { summary: '管理 MCP 服务器连接与登录' } },
        },
        {
          kind: 'slash',
          name: '/agents',
          example: '/agents',
          en: 'Manage custom subagents',
          i18n: { zh: { summary: '管理自定义子代理（subagent）' } },
        },
        {
          kind: 'slash',
          name: '/hooks',
          example: '/hooks',
          en: 'Configure hooks that run around tool calls',
          i18n: { zh: { summary: '配置钩子（在工具调用前后自动执行命令）' } },
        },
        {
          kind: 'slash',
          name: '/review',
          example: '/review',
          en: 'Request a code review of changes',
          i18n: { zh: { summary: '让 Claude 审查代码改动' } },
        },
        {
          kind: 'slash',
          name: '/cost',
          example: '/cost',
          en: 'Show token usage and cost for this session',
          i18n: { zh: { summary: '查看本次会话的 token 用量与费用' } },
        },
        {
          kind: 'slash',
          name: '/usage',
          example: '/usage',
          en: 'Show plan usage limits and rate limit status',
          i18n: { zh: { summary: '查看订阅套餐的用量与限额' } },
        },
        {
          kind: 'slash',
          name: '/context',
          example: '/context',
          en: 'Visualize what is occupying the context window',
          i18n: { zh: { summary: '可视化查看上下文窗口占用情况' } },
        },
        {
          kind: 'slash',
          name: '/status',
          example: '/status',
          en: 'Show account, model and connectivity status',
          i18n: { zh: { summary: '查看账号、模型与连接状态' } },
        },
        {
          kind: 'slash',
          name: '/login',
          example: '/login',
          en: 'Log in or switch Anthropic accounts',
          i18n: { zh: { summary: '登录/切换 Anthropic 账号' } },
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
          name: '/resume',
          example: '/resume',
          en: 'Pick and resume a past conversation',
          i18n: { zh: { summary: '挑选并恢复历史会话' } },
        },
        {
          kind: 'slash',
          name: '/rewind',
          example: '/rewind',
          en: 'Rewind the conversation and/or code to an earlier point',
          i18n: {
            zh: {
              summary: '回退对话和/或代码到之前的检查点',
              detail: '改崩了可以整体回滚。双击 Esc 也能打开回退面板。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/export',
          example: '/export',
          en: 'Export the conversation to a file or clipboard',
          i18n: { zh: { summary: '导出当前对话到文件/剪贴板' } },
        },
        {
          kind: 'slash',
          name: '/statusline',
          example: '/statusline',
          en: 'Customize the terminal status line',
          i18n: { zh: { summary: '自定义终端底部状态栏' } },
        },
        {
          kind: 'slash',
          name: '/output-style',
          example: '/output-style',
          en: 'Switch the assistant output style',
          i18n: { zh: { summary: '切换回复风格（如解释型/简洁型）' } },
        },
        {
          kind: 'slash',
          name: '/vim',
          example: '/vim',
          en: 'Toggle vim keybindings for the input editor',
          i18n: { zh: { summary: '输入框启用/关闭 Vim 按键模式' } },
        },
        {
          kind: 'slash',
          name: '/terminal-setup',
          example: '/terminal-setup',
          en: 'Configure terminal integration (e.g. Shift+Enter newline)',
          i18n: { zh: { summary: '配置终端集成（如 Shift+Enter 换行）' } },
        },
        {
          kind: 'slash',
          name: '/ide',
          example: '/ide',
          en: 'Connect to an IDE for context sharing',
          i18n: { zh: { summary: '连接 IDE（VS Code/JetBrains）共享上下文' } },
        },
        {
          kind: 'slash',
          name: '/install-github-app',
          example: '/install-github-app',
          en: 'Set up the Claude GitHub App for @claude mentions on PRs/issues',
          i18n: { zh: { summary: '安装 GitHub 应用，在 PR/issue 里 @claude' } },
        },
        {
          kind: 'slash',
          name: '/add-dir',
          argSpec: '<path>',
          example: '/add-dir ../docs',
          en: 'Grant access to an additional directory mid-session',
          i18n: { zh: { summary: '会话中追加可访问目录' } },
        },
        {
          kind: 'slash',
          name: '/bug',
          example: '/bug',
          en: 'Report a bug to Anthropic',
          i18n: { zh: { summary: '向 Anthropic 反馈问题' } },
        },
        {
          kind: 'slash',
          name: '/doctor',
          example: '/doctor',
          en: 'Check the health of your installation',
          i18n: { zh: { summary: '检查安装健康状态' } },
        },
        {
          kind: 'slash',
          name: '/exit',
          example: '/exit',
          en: 'Exit Claude Code',
          i18n: { zh: { summary: '退出 Claude Code（Ctrl+D 同效）' } },
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
          en: 'Cycle permission modes: default → auto-accept edits → plan mode',
          i18n: {
            zh: {
              summary: '循环切换权限模式（默认 → 自动接受编辑 → 规划模式）',
              detail: '规划模式（plan mode）下 Claude 只读不改，先给方案再动手，强烈推荐大改动前用。',
            },
          },
        },
        {
          kind: 'shortcut',
          name: 'Esc',
          en: 'Interrupt Claude mid-action',
          i18n: { zh: { summary: '随时打断正在执行的操作' } },
        },
        {
          kind: 'shortcut',
          name: 'Esc Esc',
          en: 'Open the rewind panel to restore an earlier checkpoint',
          i18n: { zh: { summary: '双击 Esc：打开回退面板，恢复到之前的检查点' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+C',
          en: 'Cancel current input or generation',
          i18n: { zh: { summary: '取消当前输入/生成' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+D',
          en: 'Exit Claude Code',
          i18n: { zh: { summary: '退出 Claude Code' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+L',
          en: 'Clear the terminal screen (keeps conversation)',
          i18n: { zh: { summary: '清屏（对话上下文仍保留）' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+R',
          en: 'Reverse search command history',
          i18n: { zh: { summary: '反向搜索输入历史' } },
        },
        {
          kind: 'shortcut',
          name: '↑ / ↓',
          en: 'Navigate input history',
          i18n: { zh: { summary: '上下翻看输入历史' } },
        },
        {
          kind: 'interactive',
          name: '!',
          argSpec: '<command>',
          example: '! git status',
          en: 'Bash mode: run a shell command directly, output goes into context',
          i18n: {
            zh: {
              summary: '行首输入 !：直接执行 shell 命令',
              detail: '命令输出会进入对话上下文，Claude 能看到结果。',
            },
          },
        },
        {
          kind: 'interactive',
          name: '@',
          argSpec: '<file>',
          example: '@src/main.ts 这个文件在干嘛？',
          en: 'Mention a file to include it in context (with fuzzy path completion)',
          i18n: { zh: { summary: '输入 @ 引用文件（带路径模糊补全）' } },
        },
        {
          kind: 'interactive',
          name: '#',
          argSpec: '<note>',
          example: '# 这个项目用 pnpm 而不是 npm',
          en: 'Quickly add a note to memory (CLAUDE.md)',
          i18n: { zh: { summary: '行首输入 #：把一条笔记快速存入记忆' } },
        },
      ],
    },
  ],
};
