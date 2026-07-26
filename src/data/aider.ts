import type { AgentDef } from './types';

export const aider: AgentDef = {
  id: 'aider',
  name: 'Aider',
  binary: 'aider',
  vendor: 'Aider AI',
  homepage: 'https://aider.chat',
  install: 'python -m pip install aider-install && aider-install',
  prompt: '$',
  tagline: {
    zh: '老牌开源终端 AI 结对编程工具，深度集成 Git，每次改动自动提交、随时可回退。',
  },
  coverage: 'core',
  session: {
    prompt: '>',
    banner: [
      { text: 'aider v0.86.2', style: 'accent' },
      { text: 'Main model: {model} with diff edit format', style: 'dim', note: { zh: '主模型与编辑格式（aider 按模型自动选格式）' } },
      { text: 'Git repo: .git with 312 files', style: 'dim', note: { zh: '自动检测 Git 仓库——AI 的每次改动都会自动提交' } },
      { text: 'Repo-map: using 4096 tokens, auto refresh', style: 'dim', note: { zh: '仓库地图：自动生成的代码库结构摘要，供模型参考' } },
    ],
    statusFields: [
      { key: 'model', label: { zh: '模型' }, initial: 'sonnet', options: ['sonnet', 'gpt-4o', 'deepseek', 'o3-mini'] },
      { key: 'mode', label: { zh: '编辑模式' }, initial: 'code', options: ['code', 'ask', 'architect', 'context', 'help'] },
      { key: 'files', label: { zh: '已加入文件' }, initial: '0' },
      { key: 'tokens', label: { zh: '上下文 tokens' }, initial: '2.4k' },
    ],
    chatReply: [
      { text: 'Ok, I will make that change.', style: 'dim' },
      { text: 'Applied edit to src/main.py', style: 'ok', note: { zh: '真实的 aider 会用搜索替换块直接改文件' } },
      { text: 'Commit 7d2f9a1 refactor: apply requested change', style: 'dim', note: { zh: '每次改动自动 git 提交，随时 /undo 回退' } },
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
          name: '--model',
          argSpec: '<model>',
          example: 'aider --model sonnet',
          en: 'Specify the model to use for the main chat',
          i18n: {
            zh: {
              summary: '指定主对话使用的模型',
              detail: '支持别名（如 sonnet、gpt-4o、deepseek）或完整模型名。Aider 支持几乎所有主流模型，API key 通过环境变量或 --api-key 提供。',
            },
          },
          simulate: { effects: [{ type: 'state', patch: { model: '{arg}' } }] },
        },
        {
          kind: 'flag',
          name: '--architect',
          example: 'aider --architect',
          en: 'Use architect edit format for the main chat',
          i18n: {
            zh: {
              summary: '启用 architect 双模型模式',
              detail: '推理强的模型负责设计方案，另一个 editor 模型负责落地改代码。在难题上效果最好，配合 --editor-model 指定编辑模型。',
            },
          },
          simulate: { effects: [{ type: 'state', patch: { mode: 'architect' } }] },
        },
        {
          kind: 'flag',
          name: '--weak-model',
          argSpec: '<model>',
          example: 'aider --weak-model gpt-4o-mini',
          en: 'Specify the model to use for commit messages and chat history summarization',
          i18n: {
            zh: {
              summary: '指定写提交信息、总结历史用的轻量模型',
              detail: '这些杂活不需要强模型，换个便宜的能省不少钱。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--editor-model',
          argSpec: '<model>',
          example: 'aider --architect --editor-model sonnet',
          en: 'Specify the model to use for editor tasks',
          i18n: { zh: { summary: '指定 architect 模式下负责改代码的模型' } },
        },
        {
          kind: 'flag',
          name: '--reasoning-effort',
          argSpec: '<value>',
          example: 'aider --reasoning-effort high',
          en: 'Set the reasoning_effort API parameter for models that support it',
          i18n: { zh: { summary: '设置推理力度参数（支持的模型才生效）', detail: '取值随模型而定：数字或 low / medium / high。会话中可用 /reasoning-effort 调整。' } },
        },
        {
          kind: 'flag',
          name: '--thinking-tokens',
          argSpec: '<value>',
          example: 'aider --thinking-tokens 8k',
          en: 'Set the thinking token budget for models that support it',
          i18n: { zh: { summary: '设置思考 token 预算（如 8096、8k、0.5M）', detail: '会话中可用 /think-tokens 调整，设 0 关闭。' } },
        },
        {
          kind: 'flag',
          name: '--no-auto-commits',
          example: 'aider --no-auto-commits',
          en: 'Disable auto commit of LLM changes (auto-commit is on by default)',
          i18n: {
            zh: {
              summary: '关闭自动 git 提交',
              detail: 'Aider 默认每次 AI 改动都自动 commit（好处是 /undo 可以一键回退）。想自己控制提交节奏就加这个。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--watch-files',
          example: 'aider --watch-files',
          en: 'Enable watching files for AI coding comments',
          i18n: {
            zh: {
              summary: '监听文件里的 AI 注释指令',
              detail: '在任意编辑器里写 “# 把这个函数改成异步 AI!” 这样以 AI! 结尾的注释并保存，aider 会自动检测并执行。相当于把 aider 接进你的 IDE。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--file',
          argSpec: '<file>',
          example: 'aider --file src/main.py',
          en: 'Specify a file to edit (can be used multiple times)',
          i18n: { zh: { summary: '启动时直接把文件加入会话（可编辑，可多次使用）' } },
          simulate: {
            effects: [
              { type: 'print', lines: [{ text: 'Added {arg} to the chat', style: 'ok', note: { zh: '启动即加入会话，AI 可直接编辑它' } }] },
              { type: 'state', patch: { files: '1' } },
            ],
          },
        },
        {
          kind: 'flag',
          name: '--read',
          argSpec: '<file>',
          example: 'aider --read CONVENTIONS.md',
          en: 'Specify a read-only file (can be used multiple times)',
          i18n: {
            zh: {
              summary: '以只读方式加入参考文件',
              detail: '常用来挂代码规范文件（如 CONVENTIONS.md），让 AI 参考但不去改它。',
            },
          },
          simulate: {
            effects: [
              { type: 'print', lines: [{ text: 'Added {arg} to the chat (read-only)', style: 'dim', note: { zh: 'AI 可以看，但不会改它' } }] },
            ],
          },
        },
        {
          kind: 'flag',
          name: '--message',
          aliases: ['-m', '--msg'],
          argSpec: '"<text>"',
          example: 'aider -m "给 utils.py 补上类型注解" utils.py',
          en: 'Specify a single message to send the LLM, process reply then exit',
          i18n: {
            zh: {
              summary: '非交互模式：发一条指令，处理完就退出',
              detail: '适合脚本化、批量处理。配合 --yes-always 可全程免确认。',
            },
          },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Applied edit to utils.py', style: 'ok' },
                  { text: 'Commit 3c9d1f2 feat: add type annotations', style: 'dim', note: { zh: '处理完这一条指令就退出，不进入交互会话' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'flag',
          name: '--yes-always',
          example: 'aider --yes-always -m "修复 lint 报错"',
          en: 'Always say yes to every confirmation',
          i18n: { zh: { summary: '所有确认一律自动答 yes（自动化时用）' } },
        },
        {
          kind: 'flag',
          name: '--edit-format',
          argSpec: '<format>',
          example: 'aider --edit-format diff',
          en: 'Specify what edit format the LLM should use',
          i18n: {
            zh: {
              summary: '指定模型输出改动的格式',
              detail: '常见有 whole（整文件重写）、diff（搜索替换块）、udiff 等。一般不用管，aider 会按模型自动选最优格式。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--map-tokens',
          argSpec: '<n>',
          example: 'aider --map-tokens 2048',
          en: 'Suggested number of tokens to use for repo map, use 0 to disable',
          i18n: {
            zh: {
              summary: '设置仓库地图（repo map）的 token 预算',
              detail: 'repo map 是 aider 的招牌功能：自动生成代码库结构摘要供模型参考。设为 0 可关闭。',
            },
          },
        },
        {
          kind: 'flag',
          name: '--lint',
          example: 'aider --lint',
          en: 'Lint and fix provided files, or dirty files if none provided',
          i18n: { zh: { summary: '只做一件事：lint 并修复文件，然后退出' } },
        },
        {
          kind: 'flag',
          name: '--test',
          example: 'aider --test',
          en: 'Run tests, fix problems found and then exit',
          i18n: { zh: { summary: '跑测试、自动修复失败项，然后退出', detail: '测试命令由 --test-cmd 配置，如 --test-cmd "pytest"。' } },
        },
        {
          kind: 'flag',
          name: '--commit',
          example: 'aider --commit',
          en: 'Commit all pending changes with a suitable commit message, then exit',
          i18n: { zh: { summary: '让 AI 写好提交信息、提交所有改动后退出', detail: '不进入聊天，纯当一个“自动写 commit message”工具用。' } },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Commit 8e4f2a7 fix: handle empty input in parser', style: 'ok', note: { zh: 'AI 自动生成提交信息、提交后退出' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'flag',
          name: '--dry-run',
          example: 'aider --dry-run',
          en: 'Perform a dry run without modifying files',
          i18n: { zh: { summary: '演习模式：只展示会改什么，不实际写文件' } },
        },
        {
          kind: 'flag',
          name: '--cache-prompts',
          example: 'aider --cache-prompts',
          en: 'Enable caching of prompts to reduce token costs',
          i18n: { zh: { summary: '启用提示词缓存，省钱提速（支持 Anthropic/DeepSeek 等）' } },
        },
        {
          kind: 'flag',
          name: '--subtree-only',
          example: 'aider --subtree-only',
          en: 'Only consider files in the current subtree of the git repository',
          i18n: { zh: { summary: '只关注当前子目录，不扫整个大仓库', detail: '在超大 monorepo 里进到子目录再用它，repo map 又快又准。' } },
        },
        {
          kind: 'flag',
          name: '--api-key',
          argSpec: '<provider>=<key>',
          example: 'aider --api-key openrouter=sk-xxx',
          en: 'Set an API key for a provider (e.g. --api-key provider=KEY)',
          i18n: { zh: { summary: '为指定服务商设置 API key', detail: '也可以用环境变量（OPENAI_API_KEY、ANTHROPIC_API_KEY 等）或 .env 文件。' } },
        },
        {
          kind: 'flag',
          name: '--list-models',
          argSpec: '<name>',
          example: 'aider --list-models deepseek',
          en: 'List known models which match the (partial) MODEL name',
          i18n: { zh: { summary: '按名字（可部分匹配）搜索可用模型后退出' } },
          simulate: {
            preventSession: true,
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Models which match "{arg}":', style: 'dim' },
                  { text: '- deepseek/deepseek-chat', style: 'dim' },
                  { text: '- deepseek/deepseek-reasoner', style: 'dim', note: { zh: '列出匹配的模型名后直接退出' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'flag',
          name: '--gui',
          aliases: ['--browser'],
          example: 'aider --gui',
          en: 'Run aider in your browser instead of the terminal',
          i18n: { zh: { summary: '在浏览器里运行 aider（实验性网页界面）' } },
        },
        {
          kind: 'flag',
          name: '--vim',
          example: 'aider --vim',
          en: 'Use VI editing mode in the terminal',
          i18n: { zh: { summary: '输入框启用 Vim 按键模式' } },
        },
        {
          kind: 'flag',
          name: '--dark-mode',
          example: 'aider --dark-mode',
          en: 'Use colors suitable for a dark terminal background',
          i18n: { zh: { summary: '使用适合深色终端的配色' } },
        },
        {
          kind: 'flag',
          name: '--config',
          aliases: ['-c'],
          argSpec: '<file>',
          example: 'aider -c ~/.aider.conf.yml',
          en: 'Specify the config file (default: search for .aider.conf.yml)',
          i18n: { zh: { summary: '指定 YAML 配置文件', detail: '所有命令行选项都能写进 .aider.conf.yml，免得每次敲一长串参数。' } },
        },
        {
          kind: 'flag',
          name: '--version',
          example: 'aider --version',
          en: 'Show the version number and exit',
          i18n: { zh: { summary: '打印版本号后退出' } },
          simulate: {
            preventSession: true,
            effects: [
              { type: 'print', lines: [{ text: 'aider 0.86.2', note: { zh: '只打印版本号，不进入会话' } }] },
            ],
          },
        },
      ],
    },
    {
      id: 'chat-commands',
      i18n: { zh: { title: '会话内命令' } },
      entries: [
        {
          kind: 'slash',
          name: '/add',
          argSpec: '<files>',
          example: '/add src/main.py',
          en: 'Add files to the chat so aider can edit them or review them in detail',
          i18n: {
            zh: {
              summary: '把文件加入会话，允许 AI 编辑',
              detail: 'Aider 只会改你显式加进来的文件。不用把整个仓库都加上——repo map 会自动提供其余文件的结构信息。',
            },
          },
          simulate: {
            effects: [
              { type: 'print', lines: [{ text: 'Added src/main.py to the chat', style: 'ok', note: { zh: '加入后 AI 才能编辑它（看状态栏文件数）' } }] },
              { type: 'state', patch: { files: '1', tokens: '3.1k' } },
            ],
            argEffects: [
              { type: 'print', lines: [{ text: 'Added {arg} to the chat', style: 'ok', note: { zh: '加入后 AI 才能编辑它（看状态栏文件数）' } }] },
              { type: 'state', patch: { files: '1', tokens: '3.1k' } },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/drop',
          argSpec: '[files]',
          example: '/drop src/main.py',
          en: 'Remove files from the chat session to free up context space',
          i18n: { zh: { summary: '把文件移出会话，释放上下文空间', detail: '不带参数时移除所有文件。' } },
          simulate: {
            effects: [
              { type: 'print', lines: [{ text: 'Dropping all files from the chat session.', style: 'dim', note: { zh: '不带参数时移除全部文件' } }] },
              { type: 'state', patch: { files: '0', tokens: '2.4k' } },
            ],
            argEffects: [
              { type: 'print', lines: [{ text: 'Removed {arg} from the chat', style: 'dim', note: { zh: '文件移出会话，上下文占用下降（看状态栏）' } }] },
              { type: 'state', patch: { files: '0', tokens: '2.4k' } },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/read-only',
          argSpec: '<files>',
          example: '/read-only docs/spec.md',
          en: 'Add files to the chat that are for reference only, or turn added files to read-only',
          i18n: { zh: { summary: '以只读方式加入参考文件（AI 可看不可改）' } },
          simulate: {
            argEffects: [
              { type: 'print', lines: [{ text: 'Added {arg} to the chat (read-only)', style: 'dim', note: { zh: '只读文件不计入可编辑文件，AI 仅作参考' } }] },
            ],
            effects: [
              { type: 'print', lines: [{ text: 'Added docs/spec.md to the chat (read-only)', style: 'dim', note: { zh: '只读文件不计入可编辑文件，AI 仅作参考' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/ls',
          example: '/ls',
          en: 'List all known files and indicate which are included in the chat session',
          i18n: { zh: { summary: '列出仓库文件，并标注哪些已在会话中' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Files in chat:', style: 'accent' },
                  { text: '  src/main.py', style: 'ok', note: { zh: '已加入会话、AI 可编辑的文件' } },
                  { text: 'Repo files not in the chat:', style: 'accent' },
                  { text: '  src/utils.py', style: 'dim' },
                  { text: '  tests/test_main.py', style: 'dim', note: { zh: '未加入的文件仍会通过 repo map 提供结构信息' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/ask',
          argSpec: '[question]',
          example: '/ask 这个模块的鉴权流程是怎么走的？',
          en: 'Ask questions about the code base without editing any files; with no prompt it switches to ask mode',
          i18n: {
            zh: {
              summary: '只问不改：讨论代码但不做任何修改',
              detail: '想先聊清楚方案再动手时用。不带内容则切换为 ask 模式；聊完直接说“好，就这么改”即可切回编辑。',
            },
          },
          simulate: {
            effects: [{ type: 'state', patch: { mode: 'ask' } }],
            argEffects: [
              { type: 'state', patch: { mode: 'ask' } },
              { type: 'print', lines: [{ text: 'The auth flow starts in middleware/auth.py …', style: 'dim', note: { zh: 'ask 模式只回答、不改任何文件（仿真回复）' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/code',
          argSpec: '[request]',
          example: '/code 把这个函数改成异步的',
          en: 'Ask for changes to your code; with no prompt it switches to code mode',
          i18n: { zh: { summary: '请求修改代码（默认模式）', detail: '在 /ask 或 /architect 模式下，可用它临时发一条改代码的请求，或不带内容切回 code 模式。' } },
          simulate: {
            effects: [{ type: 'state', patch: { mode: 'code' } }],
            argEffects: [
              { type: 'state', patch: { mode: 'code' } },
              {
                type: 'print',
                lines: [
                  { text: 'Applied edit to src/main.py', style: 'ok' },
                  { text: 'Commit 5b1c8d3 refactor: make function async', style: 'dim', note: { zh: 'code 模式直接改文件并自动提交（仿真）' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/architect',
          argSpec: '[request]',
          example: '/architect 重构这个模块，拆分职责',
          en: 'Enter architect/editor mode using 2 different models; with no prompt it switches to architect mode',
          i18n: { zh: { summary: '进入 architect 双模型模式：先设计再编码', detail: '一个模型出方案、另一个执行修改，适合复杂改动。' } },
          simulate: {
            effects: [{ type: 'state', patch: { mode: 'architect' } }],
            argEffects: [
              { type: 'state', patch: { mode: 'architect' } },
              {
                type: 'print',
                lines: [
                  { text: 'Proposal: split module into service + repository layers…', style: 'dim', note: { zh: '主模型先给出设计方案' } },
                  { text: 'Edit the files? (Y)es/(N)o [Yes]', style: 'accent', note: { zh: '确认后由 editor 模型落地修改' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/context',
          argSpec: '[request]',
          example: '/context',
          en: 'Enter context mode to see surrounding code context; with no prompt it switches to context mode',
          i18n: { zh: { summary: '进入 context 模式：自动找出请求涉及哪些文件', detail: '它会分析你的请求，把相关文件自动加入会话再干活。' } },
          simulate: {
            effects: [{ type: 'state', patch: { mode: 'context' } }],
          },
        },
        {
          kind: 'slash',
          name: '/chat-mode',
          argSpec: '<mode>',
          example: '/chat-mode ask',
          en: 'Switch to a new chat mode (code, ask, architect, context, help)',
          i18n: { zh: { summary: '切换默认聊天模式（code / ask / architect / context / help）' } },
          simulate: {
            effects: [
              {
                type: 'panel',
                panel: {
                  title: { zh: '选择聊天模式（点击切换）' },
                  stateKey: 'mode',
                  items: [
                    { value: 'code', label: 'code', note: { zh: '默认：直接改代码' } },
                    { value: 'ask', label: 'ask', note: { zh: '只讨论不修改' } },
                    { value: 'architect', label: 'architect', note: { zh: '双模型：先设计再编码' } },
                    { value: 'context', label: 'context', note: { zh: '自动识别需要哪些文件' } },
                    { value: 'help', label: 'help', note: { zh: '询问 aider 用法' } },
                  ],
                },
              },
            ],
            argEffects: [{ type: 'state', patch: { mode: '{arg}' } }],
          },
        },
        {
          kind: 'slash',
          name: '/commit',
          argSpec: '[message]',
          example: '/commit',
          en: 'Commit edits to the repo made outside the chat',
          i18n: { zh: { summary: '提交你在会话外手动做的改动', detail: '不给信息时由 AI 自动生成 commit message。' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Commit 8e4f2a7 fix: handle empty input in parser', style: 'ok', note: { zh: '提交信息由 AI 自动生成（仿真）' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/diff',
          example: '/diff',
          en: 'Display the diff of changes since the last message',
          i18n: { zh: { summary: '查看上一条消息以来的代码改动 diff' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'diff --git a/src/main.py b/src/main.py', style: 'dim' },
                  { text: '+async def fetch_data():', style: 'ok' },
                  { text: '-def fetch_data():', style: 'warn', note: { zh: '绿色为新增、红色为删除（仿真片段）' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/undo',
          example: '/undo',
          en: 'Undo the last git commit if it was done by aider',
          i18n: {
            zh: {
              summary: '撤销 aider 刚才的自动提交',
              detail: '这是 aider 自动提交策略的另一半：改得不满意，一个 /undo 干净回退。',
            },
          },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Removed: 7d2f9a1 refactor: apply requested change', style: 'warn', note: { zh: '只回退 aider 自己的提交，你的手动提交不受影响' } },
                  { text: 'Now at:  4a6e0c9 previous commit', style: 'dim' },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/run',
          argSpec: '<command>',
          example: '/run pytest tests/',
          en: 'Run a shell command and optionally add the output to the chat',
          i18n: { zh: { summary: '执行 shell 命令，可选择把输出喂给 AI', detail: '跑完会问你要不要把输出加入对话，比如让 AI 看报错来修 bug。' } },
          simulate: {
            argEffects: [
              {
                type: 'print',
                lines: [
                  { text: '$ {args}', style: 'dim' },
                  { text: '2 passed, 1 failed', style: 'warn' },
                  { text: 'Add command output to the chat? (Y)es/(N)o [Yes]', style: 'accent', note: { zh: '把报错喂给 AI，让它来修（仿真）' } },
                ],
              },
            ],
            effects: [
              { type: 'print', lines: [{ text: 'Usage: /run <command>', style: 'dim' }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/test',
          argSpec: '[command]',
          example: '/test pytest',
          en: 'Run a shell command and add the output to the chat on non-zero exit code',
          i18n: { zh: { summary: '跑测试；失败时自动把输出交给 AI 修复' } },
        },
        {
          kind: 'slash',
          name: '/lint',
          example: '/lint',
          en: 'Lint and fix in-chat files or all dirty files if none in chat',
          i18n: { zh: { summary: '对会话中的文件执行 lint 并自动修复' } },
        },
        {
          kind: 'slash',
          name: '/git',
          argSpec: '<args>',
          example: '/git log --oneline -5',
          en: 'Run a git command (output excluded from chat)',
          i18n: { zh: { summary: '执行 git 命令（输出不进入对话上下文）' } },
        },
        {
          kind: 'slash',
          name: '/map',
          example: '/map',
          en: 'Print out the current repository map',
          i18n: { zh: { summary: '打印当前的仓库地图（repo map）', detail: '看看 aider 眼里的代码库结构长什么样，/map-refresh 可强制重建。' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'src/main.py:', style: 'accent' },
                  { text: '  class App:', style: 'dim' },
                  { text: '    def run(self)…', style: 'dim' },
                  { text: 'src/utils.py:', style: 'accent' },
                  { text: '  def parse_config(path)…', style: 'dim', note: { zh: 'repo map：未加入会话的文件也以结构摘要形式供模型参考' } },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/map-refresh',
          example: '/map-refresh',
          en: 'Force a refresh of the repository map',
          i18n: { zh: { summary: '强制重建仓库地图' } },
          simulate: {
            effects: [
              { type: 'print', lines: [{ text: 'The repo map has been refreshed, use /map to view it.', style: 'dim' }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/web',
          argSpec: '<url>',
          example: '/web https://aider.chat/docs/',
          en: 'Scrape a webpage, convert to markdown and send in a message',
          i18n: { zh: { summary: '抓取网页转成 Markdown 喂给 AI', detail: '比如把某个库的文档页拉进来，让 AI 照着最新 API 写代码。' } },
          simulate: {
            argEffects: [
              { type: 'print', lines: [{ text: 'Scraping {arg} …', style: 'dim', note: { zh: '网页会转成 Markdown 作为消息发给模型' } }] },
            ],
            effects: [
              { type: 'print', lines: [{ text: 'Usage: /web <url>', style: 'dim' }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/paste',
          example: '/paste',
          en: 'Paste image/text from the clipboard into the chat',
          i18n: { zh: { summary: '把剪贴板里的图片/文本粘进对话', detail: '截图 UI 设计稿或报错弹窗，直接贴给支持视觉的模型看。' } },
        },
        {
          kind: 'slash',
          name: '/voice',
          example: '/voice',
          en: 'Record and transcribe voice input',
          i18n: { zh: { summary: '语音输入：录音并转写成文字（需 OpenAI key）' } },
        },
        {
          kind: 'slash',
          name: '/tokens',
          example: '/tokens',
          en: 'Report on the number of tokens used by the current chat context',
          i18n: { zh: { summary: '查看当前上下文各部分的 token 占用' } },
          simulate: {
            effects: [
              {
                type: 'print',
                lines: [
                  { text: 'Approximate context window usage, in tokens:', style: 'accent' },
                  { text: '  1,109 system messages', style: 'dim' },
                  { text: '  1,024 repository map    use --map-tokens to resize', style: 'dim' },
                  { text: '    712 src/main.py       /drop to remove', style: 'dim', note: { zh: '按文件列出占用，方便决定 /drop 谁' } },
                  { text: '  2,845 tokens total', style: 'ok' },
                  { text: '197,155 tokens remaining in context window', style: 'dim' },
                ],
              },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/clear',
          example: '/clear',
          en: 'Clear the chat history',
          i18n: { zh: { summary: '清空对话历史（文件保留在会话中）' } },
          simulate: {
            effects: [
              { type: 'clear' },
              { type: 'print', lines: [{ text: 'Chat history cleared.', style: 'dim', note: { zh: '只清历史，已加入的文件仍在（看状态栏）' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/reset',
          example: '/reset',
          en: 'Drop all files and clear the chat history',
          i18n: { zh: { summary: '一键重置：移除所有文件并清空历史' } },
          simulate: {
            effects: [
              { type: 'clear' },
              { type: 'state', patch: { files: '0', tokens: '2.4k' } },
              { type: 'print', lines: [{ text: 'All files dropped and chat history cleared.', style: 'dim', note: { zh: '= /drop + /clear，回到刚启动的状态' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/model',
          argSpec: '<model>',
          example: '/model gpt-4o',
          en: 'Switch the Main Model to a new LLM',
          i18n: { zh: { summary: '会话中切换主模型', detail: '配套还有 /editor-model、/weak-model；/models 可搜索可用模型列表。' } },
          simulate: {
            effects: [
              {
                type: 'panel',
                panel: {
                  title: { zh: '选择主模型（点击切换）' },
                  stateKey: 'model',
                  items: [
                    { value: 'sonnet', label: 'sonnet', note: { zh: 'Anthropic Claude Sonnet' } },
                    { value: 'gpt-4o', label: 'gpt-4o', note: { zh: 'OpenAI GPT-4o' } },
                    { value: 'deepseek', label: 'deepseek', note: { zh: 'DeepSeek（高性价比）' } },
                    { value: 'o3-mini', label: 'o3-mini', note: { zh: 'OpenAI 推理模型' } },
                  ],
                },
              },
            ],
            argEffects: [
              { type: 'state', patch: { model: '{arg}' } },
              { type: 'print', lines: [{ text: 'Main model: {model} with diff edit format', style: 'ok', note: { zh: '主模型已切换（看状态栏）' } }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/models',
          argSpec: '<name>',
          example: '/models deepseek',
          en: 'Search the list of available models',
          i18n: { zh: { summary: '按名字搜索可用模型列表' } },
          simulate: {
            argEffects: [
              {
                type: 'print',
                lines: [
                  { text: 'Models which match "{arg}":', style: 'dim' },
                  { text: '- deepseek/deepseek-chat', style: 'dim' },
                  { text: '- deepseek/deepseek-reasoner', style: 'dim', note: { zh: '找到名字后用 /model 切换' } },
                ],
              },
            ],
            effects: [
              { type: 'print', lines: [{ text: 'Usage: /models <partial-name>', style: 'dim' }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/editor-model',
          argSpec: '<model>',
          example: '/editor-model sonnet',
          en: 'Switch the Editor Model to a new LLM',
          i18n: { zh: { summary: '切换 architect 模式下负责改代码的 editor 模型' } },
        },
        {
          kind: 'slash',
          name: '/weak-model',
          argSpec: '<model>',
          example: '/weak-model gpt-4o-mini',
          en: 'Switch the Weak Model to a new LLM',
          i18n: { zh: { summary: '切换写提交信息、总结历史用的轻量模型' } },
        },
        {
          kind: 'slash',
          name: '/reasoning-effort',
          argSpec: '<value>',
          example: '/reasoning-effort high',
          en: 'Set the reasoning effort level (values: number or low/medium/high depending on model)',
          i18n: { zh: { summary: '调整推理力度（数字或 low/medium/high，随模型而定）' } },
          simulate: {
            argEffects: [
              { type: 'print', lines: [{ text: 'Set reasoning effort to {arg}', style: 'ok' }] },
            ],
            effects: [
              { type: 'print', lines: [{ text: 'Usage: /reasoning-effort <value>', style: 'dim' }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/think-tokens',
          argSpec: '<budget>',
          example: '/think-tokens 8k',
          en: 'Set the thinking token budget, eg: 8096, 8k, 10.5k, 0.5M, or 0 to disable',
          i18n: { zh: { summary: '设置思考 token 预算（如 8k、0.5M，0 为关闭）' } },
          simulate: {
            argEffects: [
              { type: 'print', lines: [{ text: 'Set thinking token budget to {arg}', style: 'ok' }] },
            ],
            effects: [
              { type: 'print', lines: [{ text: 'Usage: /think-tokens <budget>', style: 'dim' }] },
            ],
          },
        },
        {
          kind: 'slash',
          name: '/editor',
          aliases: ['/edit'],
          example: '/editor',
          en: 'Open an editor to write a prompt',
          i18n: { zh: { summary: '打开外部编辑器编写长提示词' } },
        },
        {
          kind: 'slash',
          name: '/copy',
          example: '/copy',
          en: 'Copy the last assistant message to the clipboard',
          i18n: { zh: { summary: '复制 AI 上一条回复到剪贴板' } },
        },
        {
          kind: 'slash',
          name: '/copy-context',
          argSpec: '[instructions]',
          example: '/copy-context',
          en: 'Copy the current chat context as markdown, suitable to paste into a web UI',
          i18n: { zh: { summary: '把当前会话上下文复制成 Markdown', detail: '适合贴到网页版 ChatGPT/Claude 等，让网页端大模型接着分析。' } },
        },
        {
          kind: 'slash',
          name: '/ok',
          example: '/ok',
          en: 'Alias for /code "Ok, please go ahead and make those changes." (any args are appended)',
          i18n: { zh: { summary: '快捷确认：“好，就这么改”', detail: '在 /ask 里聊好方案后，一个 /ok 让 AI 动手执行。' } },
        },
        {
          kind: 'slash',
          name: '/save',
          argSpec: '<file>',
          example: '/save session.txt',
          en: 'Save commands to a file that can reconstruct the current chat session',
          i18n: { zh: { summary: '把当前会话状态存成命令脚本，之后用 /load 恢复' } },
        },
        {
          kind: 'slash',
          name: '/load',
          argSpec: '<file>',
          example: '/load session.txt',
          en: 'Load and execute commands from a file',
          i18n: { zh: { summary: '从文件加载并执行命令（恢复 /save 存的会话）' } },
        },
        {
          kind: 'slash',
          name: '/multiline-mode',
          example: '/multiline-mode',
          en: 'Toggle multiline mode (swaps behavior of Enter and Meta+Enter)',
          i18n: { zh: { summary: '切换多行输入模式（对调 Enter 与 Meta+Enter 的行为）' } },
        },
        {
          kind: 'slash',
          name: '/settings',
          example: '/settings',
          en: 'Print out the current settings',
          i18n: { zh: { summary: '打印当前所有生效的设置' } },
        },
        {
          kind: 'slash',
          name: '/report',
          argSpec: '[title]',
          example: '/report',
          en: 'Report a problem by opening a GitHub Issue',
          i18n: { zh: { summary: '一键到 GitHub 提 issue（自动附上环境信息）' } },
        },
        {
          kind: 'slash',
          name: '/help',
          argSpec: '[question]',
          example: '/help 怎么关闭自动提交？',
          en: 'Ask questions about aider',
          i18n: { zh: { summary: '向 aider 提问关于它自己的用法' } },
        },
        {
          kind: 'slash',
          name: '/exit',
          aliases: ['/quit'],
          example: '/exit',
          en: 'Exit the application',
          i18n: { zh: { summary: '退出 aider（Ctrl+D 同效）' } },
          simulate: {
            effects: [
              { type: 'exitSession', lines: [{ text: 'Goodbye!', style: 'dim', note: { zh: '回到 shell；历史存于 .aider.chat.history.md' } }] },
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
          name: '↑ / ↓',
          en: 'Move up/down one line; at the edge, recall input history',
          i18n: { zh: { summary: '上下移动光标；在边界处翻看输入历史' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+↑ / Ctrl+↓',
          en: 'Scroll back/forward through previously sent messages',
          i18n: { zh: { summary: '在已发送的历史消息间前后翻页' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+R',
          en: 'Reverse search in command history',
          i18n: { zh: { summary: '反向搜索输入历史' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+X Ctrl+E',
          en: 'Open the current input in an external editor',
          i18n: { zh: { summary: '把当前输入丢进外部编辑器继续写（同 /editor）' } },
        },
        {
          kind: 'shortcut',
          name: 'Ctrl+C',
          en: 'Interrupt the current response; press twice to exit',
          i18n: { zh: { summary: '打断当前生成；连按两次退出' } },
        },
        {
          kind: 'interactive',
          name: 'AI! 注释',
          example: '# 给这个函数加上错误处理 AI!',
          en: 'With --watch-files, save a comment ending in "AI!" in any editor and aider acts on it',
          i18n: {
            zh: {
              summary: '在任意编辑器写 “…… AI!” 注释触发修改',
              detail: '需要 --watch-files。注释以 AI! 结尾表示“去改”，以 AI? 结尾表示“回答问题”。这是把 aider 融入 IDE 工作流的推荐方式。',
            },
          },
        },
        {
          kind: 'interactive',
          name: '多行输入',
          example: '{aider\n多行内容写在这里\naider}',
          en: 'Use /multiline-mode, or wrap text in {tag ... tag} blocks, to enter multi-line messages',
          i18n: { zh: { summary: '/multiline-mode 切换多行模式，或用 {tag ... tag} 包裹多行文本' } },
        },
      ],
    },
  ],
};
