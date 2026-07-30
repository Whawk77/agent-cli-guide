# Agent CLI 指南 — 边敲边学的终端模拟器

一个纯静态网页，帮助非英语母语的开发者快速上手各类 AI Agent CLI：

- 🖥️ **模拟终端**：直接在网页里敲命令（如 `claude --model opus`、`/compact`），实时逐词显示中文解读
- 🎮 **仿真会话**：敲 `claude` 回车真的会"进入"仿真会话——欢迎横幅、会话提示符、底部状态栏；`/model opus` 真的切模型、`/clear` 真的清屏、`/compact` 把历史折叠成摘要，边玩边理解每个命令的实际效果
- 📖 **命令菜单树**：侧边栏按「CLI 选项 / 子命令 / 斜杠命令 / 快捷键」分类浏览，点击即插入终端
- 🔍 **全局搜索**：按命令名、英文原文或中文含义跨工具搜索
- ⌨️ **自动补全**：Tab 补全、↑↓ 历史、`--help` 输出整份翻译版帮助菜单

## 已收录

| 工具 | binary | 官方版本 | 收录程度 |
| --- | --- | --- | --- |
| Claude Code (Anthropic) | `claude` | `2.1.220` | 全量 |
| Codex CLI (OpenAI) | `codex` | `0.146.0` 稳定版 | 全量 |
| Gemini CLI (Google) | `gemini` | `0.53.0` 稳定版 | 全量 |
| Grok Build (xAI) | `grok` | `0.2.114` 稳定版 | 核心命令 |
| pi (Earendil Works) | `pi` | `0.83.0` | 核心命令 |
| Aider | `aider` | `0.86.2` | 核心命令 |
| Cursor CLI | `cursor-agent` | `2026.07.23-e383d2b` | 核心命令 |

以上版本于 `2026-07-30` 从各工具的官方注册表、稳定版指针或安装脚本核验。运行 `npm run check:releases` 可实时检查七项是否仍为官方最新版。

界面语言：中文（数据结构已为多语言预留，欢迎贡献其他语言翻译）。

## 开发

```bash
npm install
npm run dev      # 本地开发
npm run test     # 解析器单元测试
npm run check:releases # 对照官方版本源检查七套 CLI
npm run build    # 产出静态文件到 dist/
```

## AgentL10n 本地化层（v0.2 预览）

仓库现在包含一个可运行的真实 CLI 包装器。它与网页共用同一份命令目录和中文翻译，不修改或重新分发官方 CLI。

### 本地安装

```bash
npm install
npm run build:cli
cd packages/cli
npm link
```

安装完成后：

```bash
# 中英双语 Codex 命令帮助
agent-l10n codex --help

# 解释单个命令；省略 agent 时默认使用 Codex
agent-l10n explain /permissions
agent-l10n explain claude /model

# 启动真实官方 CLI；macOS 上 Codex 的 / 菜单会原位显示中文
agent-l10n codex

# 完全关闭翻译，查看官方原始界面
agent-l10n --passthrough codex --version

# 查看本机安装了哪些官方 CLI
agent-l10n doctor
```

v0.2 已加入 macOS Codex 中文 TUI 预览：按 `/` 后，`0.146.0` 稳定版公开的 8 条菜单说明会原位替换为中文。它只匹配已验证的固定界面短语；模型回答、Shell 输出和未知文案保持原样。其他平台与其他 Agent 暂时自动降级为安全透传。

### 安全原则

- 官方命令和参数原样传递，不自动翻译成中文命令。
- 不修改官方 CLI 文件，不保存登录凭据。
- 不上传终端内容，不启用遥测。
- 中文译文保持与英文相同的终端列宽，避免扰乱官方 TUI。
- 未安装官方 CLI 时只显示安装提示，不替用户自动安装。
- 包装器异常时可以随时用 `--passthrough` 完全透传。

更完整的架构和贡献约定见 [本地化层设计](docs/localization-layer.md)。

## 官方文档变化自动跟进

`.github/workflows/check-docs.yml` 每周一会同时检查两件事：抓取 `scripts/doc-sources.json` 里的官方文档页并与快照对比；读取 `scripts/tool-releases.json` 指向的官方发行源并核对版本号。

- **默认（免费）**：发现变化时自动开 issue，列出变动的页面
- **全自动模式**：在仓库 Settings → Secrets and variables → Actions 里配置 `ANTHROPIC_API_KEY` 后，发现变化会直接让 Claude 抓取新文档、更新数据文件并开 PR 供你审核（有 API 调用费用）

手动触发：Actions 页面选 "Check official docs for updates" → Run workflow。本地可运行 `npm run check:releases` 核验版本；更新数据后运行 `node scripts/check-docs.mjs --update` 刷新全部快照；只更新单个工具时可用 `node scripts/check-docs.mjs --agent grok --update`。

Grok Build 除文档页外还跟踪官方仓库中的 CLI 参数定义和 TUI 内置命令注册表，文档尚未发布但已经进入新版二进制的命令也能被发现。

## 数据贡献

所有命令数据在 `src/data/*.ts`，每个工具一个文件，schema 见 `src/data/types.ts`。要点：

- `en` 保留官方英文原文，翻译写在 `i18n.zh`（新增语言就是加一个 locale key）
- 每条命令一行中文摘要（`summary`），重要命令补充 `detail` 和可执行的 `example`
- 只收录官方文档里真实存在的命令

## 部署

纯静态产物，任选其一：

- **GitHub Pages**：仓库已带 `.github/workflows/deploy.yml`，推到 `main` 自动部署（需在仓库 Settings → Pages 里把 Source 设为 GitHub Actions）
- **Cloudflare Pages**：新建项目指向仓库，构建命令 `npm run build`，输出目录 `dist`
