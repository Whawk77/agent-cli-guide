# Agent CLI 指南 — 边敲边学的终端模拟器

一个纯静态网页，帮助非英语母语的开发者快速上手各类 AI Agent CLI：

- 🖥️ **模拟终端**：直接在网页里敲命令（如 `claude --model opus`、`/compact`），实时逐词显示中文解读
- 🎮 **仿真会话**：敲 `claude` 回车真的会"进入"仿真会话——欢迎横幅、会话提示符、底部状态栏；`/model opus` 真的切模型、`/clear` 真的清屏、`/compact` 把历史折叠成摘要，边玩边理解每个命令的实际效果
- 📖 **命令菜单树**：侧边栏按「CLI 选项 / 子命令 / 斜杠命令 / 快捷键」分类浏览，点击即插入终端
- 🔍 **全局搜索**：按命令名、英文原文或中文含义跨工具搜索
- ⌨️ **自动补全**：Tab 补全、↑↓ 历史、`--help` 输出整份翻译版帮助菜单

## 已收录

| 工具 | binary | 收录程度 |
| --- | --- | --- |
| Claude Code (Anthropic) | `claude` | 全量 |
| Codex CLI (OpenAI) | `codex` | 全量 |
| Gemini CLI (Google) | `gemini` | 全量 |
| Grok Build (xAI) | `grok` | 核心命令 |
| pi (Earendil / Mario Zechner) | `pi` | 核心命令 |
| Aider | `aider` | 核心命令 |
| Cursor CLI | `cursor-agent` | 核心命令 |

界面语言：中文（数据结构已为多语言预留，欢迎贡献其他语言翻译）。

## 开发

```bash
npm install
npm run dev      # 本地开发
npm run test     # 解析器单元测试
npm run build    # 产出静态文件到 dist/
```

## 官方文档变化自动跟进

`.github/workflows/check-docs.yml` 每周一自动抓取 `scripts/doc-sources.json` 里各 CLI 的官方文档页，与 `docs-snapshots/` 里的快照对比：

- **默认（免费）**：发现变化时自动开 issue，列出变动的页面
- **全自动模式**：在仓库 Settings → Secrets and variables → Actions 里配置 `ANTHROPIC_API_KEY` 后，发现变化会直接让 Claude 抓取新文档、更新数据文件并开 PR 供你审核（有 API 调用费用）

手动触发：Actions 页面选 "Check official docs for updates" → Run workflow。更新数据后运行 `node scripts/check-docs.mjs --update` 刷新快照基线。

## 数据贡献

所有命令数据在 `src/data/*.ts`，每个工具一个文件，schema 见 `src/data/types.ts`。要点：

- `en` 保留官方英文原文，翻译写在 `i18n.zh`（新增语言就是加一个 locale key）
- 每条命令一行中文摘要（`summary`），重要命令补充 `detail` 和可执行的 `example`
- 只收录官方文档里真实存在的命令

## 部署

纯静态产物，任选其一：

- **GitHub Pages**：仓库已带 `.github/workflows/deploy.yml`，推到 `main` 自动部署（需在仓库 Settings → Pages 里把 Source 设为 GitHub Actions）
- **Cloudflare Pages**：新建项目指向仓库，构建命令 `npm run build`，输出目录 `dist`
