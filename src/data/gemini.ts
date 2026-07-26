import type { AgentDef } from './types';

export const gemini: AgentDef = {
  id: 'gemini',
  name: 'Gemini CLI',
  binary: 'gemini',
  vendor: 'Google',
  homepage: 'https://github.com/google-gemini/gemini-cli',
  install: 'npm install -g @google/gemini-cli',
  prompt: '$',
  tagline: {
    zh: 'Google 开源的终端 AI 代理，把 Gemini 模型接进命令行，读代码、跑命令、装扩展一站搞定。',
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
          example: 'gemini -m flash',
          en: 'Model to use — aliases auto, pro, flash, flash-lite or a concrete model name',
          i18n: {
            zh: {
              summary: '指定本次会话使用的模型',
              detail: '可以用别名：auto（默认，自动选 Pro 系）、pro（复杂推理）、flash（快而均衡）、flash-lite（最快），也可以写完整模型名如 gemini-2.5-pro。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--prompt',
          aliases: ['-p'],
          argSpec: '"<prompt>"',
          example: 'gemini -p "总结一下 README.md"',
          en: 'Non-interactive mode: run the prompt, print the result, and exit',
          i18n: {
            zh: {
              summary: '非交互模式：执行提示词后直接退出',
              detail: '适合脚本和管道，比如 cat logs.txt | gemini -p "找出报错原因"。有 stdin 输入时提示词会附加在后面。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--prompt-interactive',
          aliases: ['-i'],
          argSpec: '"<prompt>"',
          example: 'gemini -i "这个项目是干嘛的？"',
          en: 'Execute the prompt, then continue in interactive mode',
          i18n: {
            zh: {
              summary: '先执行提示词，然后留在交互模式继续聊',
              detail: '和 -p 的区别：-p 输出完就退出，-i 会带着结果进入 REPL 接着干活。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--resume',
          aliases: ['-r'],
          argSpec: '<session>',
          example: 'gemini -r latest',
          en: 'Resume a previous session — "latest", an index number, or a session ID',
          i18n: {
            zh: {
              summary: '恢复历史会话',
              detail: '用 "latest" 恢复最近一次，或用 --list-sessions 查到的序号/会话 ID。还可以顺带给新提示词：gemini -r latest "继续检查类型错误"。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--list-sessions',
          example: 'gemini --list-sessions',
          en: 'List available sessions for the current project and exit',
          i18n: { zh: { summary: '列出当前项目的历史会话后退出' } },
        },
        {
          kind: 'flag',
          name: '--sandbox',
          aliases: ['-s'],
          example: 'gemini --sandbox',
          en: 'Run in a sandboxed environment for safer execution',
          i18n: {
            zh: {
              summary: '在沙箱环境中运行（更安全）',
              detail: '把模型执行的命令隔离在沙箱（如 Docker/Podman 或 macOS Seatbelt）里，防止误伤系统。放开权限跑任务前建议先开它。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--approval-mode',
          argSpec: '<mode>',
          example: 'gemini --approval-mode plan',
          en: 'Approval mode for tool execution: default, auto_edit, yolo, plan',
          i18n: {
            zh: {
              summary: '以指定审批模式启动',
              detail: 'default 每次询问；auto_edit 自动批准文件编辑；yolo 全部自动批准（危险）；plan 只读规划模式。会话中按 Shift+Tab 也能循环切换。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--yolo',
          aliases: ['-y'],
          example: 'gemini --yolo',
          en: 'Deprecated: auto-approve all actions (use --approval-mode=yolo)',
          i18n: {
            zh: {
              summary: '自动批准所有操作（已弃用，危险）',
              detail: '官方已建议改用 --approval-mode=yolo。只在容器/沙箱等隔离环境里使用，最好搭配 --sandbox。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--include-directories',
          argSpec: '<dirs>',
          example: 'gemini --include-directories ../backend,../docs',
          en: 'Additional directories to include in the workspace',
          i18n: {
            zh: {
              summary: '把额外目录加入工作区',
              detail: '逗号分隔或重复传参。跨仓库干活时用它，会话中也可以用 /directory add 追加。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--worktree',
          aliases: ['-w'],
          argSpec: '[name]',
          example: 'gemini -w fix-login',
          en: 'Start Gemini in a new git worktree (requires experimental.worktrees setting)',
          i18n: {
            zh: {
              summary: '在新的 git worktree 里启动（隔离改动）',
              detail: '不传名字会自动生成。需要在 settings.json 里开启 experimental.worktrees: true。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--extensions',
          aliases: ['-e'],
          argSpec: '<names>',
          example: 'gemini -e my-extension',
          en: 'List of extensions to use (all enabled if not provided)',
          i18n: { zh: { summary: '只启用指定的扩展', detail: '不传则启用全部已安装扩展。配合 --list-extensions 查看可用扩展。' } },
        },
        {
          kind: 'flag',
          name: '--output-format',
          aliases: ['-o'],
          argSpec: '<format>',
          example: 'gemini -p "hi" -o json',
          en: 'Output format of the CLI: text, json, stream-json',
          i18n: {
            zh: {
              summary: '设置输出格式',
              detail: 'text 纯文本（默认）；json 结构化结果；stream-json 逐事件流式输出。主要配合 -p 做脚本集成。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--debug',
          aliases: ['-d'],
          example: 'gemini --debug',
          en: 'Run in debug mode with verbose logging',
          i18n: { zh: { summary: '调试模式：输出详细日志', detail: '排查连接、认证、MCP 等问题时用。会话中按 F12 可打开调试控制台。' } },
        },
        {
          kind: 'flag',
          name: '--version',
          aliases: ['-v'],
          example: 'gemini --version',
          en: 'Show CLI version number and exit',
          i18n: { zh: { summary: '查看版本号' } },
        },
        {
          kind: 'flag',
          name: '--help',
          aliases: ['-h'],
          example: 'gemini --help',
          en: 'Show help information',
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
          example: 'gemini mcp list',
          en: 'Configure MCP servers (add / remove / list)',
          i18n: {
            zh: {
              summary: '管理 MCP 服务器（添加/删除/列出）',
              detail: '如 gemini mcp add github npx -y @modelcontextprotocol/server-github；HTTP 服务加 --transport http；--scope user 装到用户级；--include-tools 限定可用工具。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'extensions',
          example: 'gemini extensions list',
          en: 'Manage extensions (install / uninstall / list / update / enable / disable / link / new)',
          i18n: {
            zh: {
              summary: '管理扩展（安装/卸载/更新/启停）',
              detail: '可以从 Git 仓库或本地路径安装：gemini extensions install <url>。开发扩展时用 link 做软链、new 从模板创建。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'skills',
          example: 'gemini skills list',
          en: 'Manage Agent Skills (list / install / link / enable / disable / uninstall)',
          i18n: {
            zh: {
              summary: '管理 Agent Skills（技能包）',
              detail: 'Skills 是按需加载的专项能力/工作流。gemini skills install 可从 Git、路径或文件安装，enable/disable 支持 --all。',
            },
          },
        },
        {
          kind: 'subcommand',
          name: 'update',
          example: 'gemini update',
          en: 'Update Gemini CLI to the latest version',
          i18n: { zh: { summary: '更新到最新版本' } },
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
          aliases: ['/?'],
          example: '/help',
          en: 'Display help information, including available commands and usage',
          i18n: { zh: { summary: '查看可用命令和帮助' } },
        },
        {
          kind: 'slash',
          name: '/clear',
          example: '/clear',
          en: 'Clear the terminal screen and visible session history',
          i18n: {
            zh: {
              summary: '清屏并清掉可见的会话记录',
              detail: '快捷键 Ctrl+L 同效。注意它清的是屏幕显示；要压缩上下文省 token 用 /compress。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/compress',
          example: '/compress',
          en: 'Replace the entire chat context with a summary to save tokens',
          i18n: {
            zh: {
              summary: '把整个对话上下文压缩成摘要',
              detail: '对话太长、上下文快满时用。保留任务概要，释放 token 空间，相当于 Claude Code 的 /compact。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/resume',
          aliases: ['/chat'],
          example: '/resume',
          en: 'Browse and resume previous sessions; manage tagged chat checkpoints',
          i18n: {
            zh: {
              summary: '浏览/恢复历史会话，管理手动存档',
              detail: '所有对话自动保存，直接 /resume 打开会话浏览器（可搜索、排序、删除）。子命令 save <tag> / resume <tag> / list / delete <tag> / share [文件名] 管理手动打标签的存档。/chat 是它的别名。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/memory',
          argSpec: '<show|refresh|list>',
          example: '/memory show',
          en: 'Manage hierarchical instructional memory loaded from GEMINI.md files',
          i18n: {
            zh: {
              summary: '管理 GEMINI.md 记忆（查看/刷新/列出）',
              detail: 'GEMINI.md 是项目/全局层级的上下文文件。show 查看拼接后的完整内容，refresh 改完文件后重新加载，list 列出生效的文件路径。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/init',
          example: '/init',
          en: 'Analyze the current directory and generate a tailored GEMINI.md context file',
          i18n: {
            zh: {
              summary: '分析当前项目，自动生成 GEMINI.md',
              detail: '生成后每次会话自动加载，写入项目约定、构建命令等，相当于 Claude Code 的 CLAUDE.md。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/mcp',
          example: '/mcp list',
          en: 'Manage configured MCP servers (list / desc / schema / auth / enable / disable / reload)',
          i18n: {
            zh: {
              summary: '管理 MCP 服务器连接',
              detail: 'list 列出服务器和工具（默认）；desc/schema 看详细描述和参数；auth <server> 走 OAuth 登录；reload 重连并重新发现工具。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/tools',
          argSpec: '[desc]',
          example: '/tools',
          en: 'Display the list of tools currently available to the model',
          i18n: { zh: { summary: '查看当前可用的工具列表', detail: '/tools desc 显示每个工具给模型看的完整描述。' } },
        },
        {
          kind: 'slash',
          name: '/model',
          example: '/model set flash',
          en: 'Manage model configuration (manage opens a dialog; set switches model)',
          i18n: { zh: { summary: '会话中查看/切换模型', detail: '/model manage 打开配置面板；/model set <名称> [--persist] 直接切换，加 --persist 持久保存。' } },
        },
        {
          kind: 'slash',
          name: '/stats',
          example: '/stats',
          en: 'Display detailed statistics for the current session',
          i18n: {
            zh: {
              summary: '查看本次会话的统计信息',
              detail: '默认显示会话维度（时长、工具调用、性能）；/stats model 看 token 用量和配额；/stats tools 看各工具使用情况。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/restore',
          argSpec: '[tool_call_id]',
          example: '/restore',
          en: 'Restore project files to the state before a tool was executed',
          i18n: {
            zh: {
              summary: '把文件恢复到某次工具执行前的状态',
              detail: '用于撤销模型的文件改动。不带参数会列出可恢复的检查点。需要先在 settings.json 里启用 checkpointing。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/rewind',
          example: '/rewind',
          en: 'Navigate backward through history; revert chat state and/or file changes',
          i18n: {
            zh: {
              summary: '回退对话和/或代码改动',
              detail: '改崩了可以整体回滚：预览每次交互的提示词和文件变化，选择只回退对话、只回退代码或两者都回退。双击 Esc 也能打开。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/plan',
          example: '/plan',
          en: 'Switch to Plan Mode (read-only) and view the current plan',
          i18n: {
            zh: {
              summary: '进入只读规划模式，查看当前方案',
              detail: '规划模式下只读不改，先出方案再动手。/plan copy 把已批准的方案复制到剪贴板。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/settings',
          example: '/settings',
          en: 'Open the settings editor to view and modify Gemini CLI settings',
          i18n: { zh: { summary: '打开设置编辑器', detail: '带校验和提示地修改 .gemini/settings.json，比手改安全。部分设置需重启生效。' } },
        },
        {
          kind: 'slash',
          name: '/theme',
          example: '/theme',
          en: 'Open a dialog to change the visual theme',
          i18n: { zh: { summary: '切换界面主题配色' } },
        },
        {
          kind: 'slash',
          name: '/auth',
          example: '/auth',
          en: 'Open a dialog to change the authentication method',
          i18n: { zh: { summary: '切换登录/认证方式', detail: '在 Google 账号登录、Gemini API Key、Vertex AI 等认证方式间切换。' } },
        },
        {
          kind: 'slash',
          name: '/directory',
          aliases: ['/dir'],
          argSpec: '<add|show>',
          example: '/directory add ../backend',
          en: 'Manage workspace directories for multi-directory support',
          i18n: { zh: { summary: '管理多目录工作区', detail: 'add 追加目录（可逗号分隔多个），show 查看所有已加入的目录。受限沙箱下不可用，改用启动参数 --include-directories。' } },
        },
        {
          kind: 'slash',
          name: '/agents',
          example: '/agents list',
          en: 'Manage local and remote subagents (list / reload / enable / disable / config)',
          i18n: { zh: { summary: '管理子代理（subagent）', detail: '子代理放在 ~/.gemini/agents 和 .gemini/agents。config 可调某个代理的模型、温度和执行限制。' } },
        },
        {
          kind: 'slash',
          name: '/skills',
          example: '/skills list',
          en: 'Manage Agent Skills (list / enable / disable / reload)',
          i18n: { zh: { summary: '管理 Agent Skills（启停/重载）' } },
        },
        {
          kind: 'slash',
          name: '/extensions',
          example: '/extensions list',
          en: 'Manage extensions (list / install / enable / disable / update / restart)',
          i18n: { zh: { summary: '管理扩展（列出/安装/启停/更新）' } },
        },
        {
          kind: 'slash',
          name: '/commands',
          argSpec: '<list|reload>',
          example: '/commands list',
          en: 'Manage custom slash commands loaded from .toml files',
          i18n: {
            zh: {
              summary: '管理自定义斜杠命令',
              detail: '自定义命令是 .toml 文件，放在 ~/.gemini/commands/（用户级）或项目 .gemini/commands/。改完用 /commands reload 热加载，不用重启。',
            },
          },
        },
        {
          kind: 'slash',
          name: '/hooks',
          example: '/hooks list',
          en: 'Manage hooks that intercept CLI behavior at lifecycle events',
          i18n: { zh: { summary: '管理钩子（在生命周期事件上拦截/定制行为）', detail: '子命令：list、enable/disable <名称>、enable-all/disable-all。' } },
        },
        {
          kind: 'slash',
          name: '/ide',
          example: '/ide status',
          en: 'Manage IDE integration (enable / disable / install / status)',
          i18n: { zh: { summary: '管理 IDE 集成（VS Code 等）', detail: '/ide install 安装 IDE 伴侣插件，让 Gemini 感知编辑器里打开的文件。' } },
        },
        {
          kind: 'slash',
          name: '/shells',
          aliases: ['/bashes'],
          example: '/shells',
          en: 'Toggle the background shells view to manage long-running processes',
          i18n: { zh: { summary: '查看/管理后台运行的 shell 进程', detail: '长时间任务可以丢到后台跑，用它查看和管理。Ctrl+B 切换当前后台 shell 的显示。' } },
        },
        {
          kind: 'slash',
          name: '/vim',
          example: '/vim',
          en: 'Toggle vim mode for the input area (NORMAL and INSERT modes)',
          i18n: { zh: { summary: '输入框启用/关闭 Vim 按键模式', detail: '支持 hjkl 移动、dd/cw 等编辑命令和数字前缀（如 3h、5w）。偏好会存进 settings.json。' } },
        },
        {
          kind: 'slash',
          name: '/bug',
          argSpec: '[标题]',
          example: '/bug 输入框卡死',
          en: 'File an issue about Gemini CLI on GitHub',
          i18n: { zh: { summary: '一键去 GitHub 提 bug', detail: '/bug 后面写的文字会成为 issue 标题。' } },
        },
        {
          kind: 'slash',
          name: '/quit',
          aliases: ['/exit'],
          example: '/quit',
          en: 'Exit Gemini CLI (--delete also wipes session history and temp files)',
          i18n: {
            zh: {
              summary: '退出 Gemini CLI',
              detail: '/quit --delete 退出并永久删除本次会话的历史和临时文件，适合注重隐私的一次性任务。',
            },
          },
        },
      ],
    },
    {
      id: 'shortcuts',
      i18n: { zh: { title: '输入技巧与快捷键' } },
      entries: [
        {
          kind: 'interactive',
          name: '@',
          argSpec: '<path>',
          example: '@src/main.ts 解释这个文件',
          en: 'Inject file or directory contents into the prompt (git-aware filtering)',
          i18n: {
            zh: {
              summary: '输入 @ 引用文件/目录内容',
              detail: '@ 目录会递归读取其中的文件；默认自动跳过 git 忽略的内容（node_modules、.env 等）。路径含空格用反斜杠转义。',
            },
          },
        },
        {
          kind: 'interactive',
          name: '!',
          argSpec: '<command>',
          example: '!git status',
          en: 'Execute a shell command directly; a lone ! toggles persistent shell mode',
          i18n: {
            zh: {
              summary: '行首输入 !：直接执行 shell 命令',
              detail: '单独输入 ! 可切换到常驻 shell 模式，之后输入的每行都当命令执行，再按 ! 或 Esc 退出。子进程里会设置 GEMINI_CLI=1 环境变量。',
            },
          },
        },
        {
          kind: 'shortcut',
          name: 'Shift+Tab',
          en: 'Cycle approval modes: default → auto_edit → plan',
          i18n: {
            zh: {
              summary: '循环切换审批模式（默认 → 自动接受编辑 → 规划模式）',
              detail: '规划模式只读不改；代理忙碌时会跳过规划模式。',
            },
          },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+Y',
          en: 'Toggle YOLO (auto-approval) mode for tool calls',
          i18n: { zh: { summary: '切换 YOLO 模式（自动批准所有工具调用，慎用）' } },
        },
        {
          kind: 'shortcut',
          name: 'Esc Esc',
          en: 'Clear the input if not empty; otherwise browse and rewind past interactions',
          i18n: { zh: { summary: '双击 Esc：清空输入框；输入为空时打开回退（rewind）面板' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+C',
          en: 'Cancel the current request, or quit the CLI when input is empty',
          i18n: { zh: { summary: '取消当前请求；输入为空时再按可退出' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+D',
          en: 'Exit the CLI when the input buffer is empty',
          i18n: { zh: { summary: '输入为空时退出 Gemini CLI' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+L',
          en: 'Clear the terminal screen and redraw the UI',
          i18n: { zh: { summary: '清屏并重绘界面（上下文保留）' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+R',
          en: 'Reverse search through input history',
          i18n: { zh: { summary: '反向搜索输入历史（Tab 采纳匹配项）' } },
        },
        {
          kind: 'shortcut',
          name: '↑ / ↓',
          en: 'Navigate prompt history when at the top/bottom of the input',
          i18n: { zh: { summary: '上下翻看输入历史' } },
        },
        {
          kind: 'shortcut',
          name: '?',
          en: 'On an empty prompt: toggle the shortcuts panel above the input',
          i18n: { zh: { summary: '空输入时按 ?：显示/隐藏快捷键速查面板' } },
        },
        {
          kind: 'shortcut',
          name: 'Tab',
          en: 'Queue the current prompt to run after the current task finishes',
          i18n: {
            zh: {
              summary: '把当前输入排队，等任务完成后再执行',
              detail: '代理干活时你可以先把下一条指令打好按 Tab 排队。连按两次 Tab 还能在精简/完整 UI 之间切换。',
            },
          },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+Enter',
          aliases: ['Shift+Enter', 'Ctrl+J'],
          en: 'Insert a newline without submitting',
          i18n: { zh: { summary: '换行而不发送', detail: '也可以在行尾输入 \\ 再按 Enter 换行。部分终端（如 macOS 自带 Terminal）不支持 Shift+Enter，可跑 /terminal-setup 配置。' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+G',
          en: 'Open the current prompt or plan in an external editor',
          i18n: { zh: { summary: '用外部编辑器编辑当前输入/方案', detail: '长提示词或修改实施方案时很好用，编辑器由 /editor 选择。' } },
        },
      ],
    },
  ],
};
