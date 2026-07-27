# @agent-l10n/cli

Agent CLI 的非官方、本地优先开源本地化层。

```bash
agent-l10n codex --help
agent-l10n explain /permissions
agent-l10n doctor
agent-l10n codex
```

当前版本提供中英双语帮助、命令解释、官方 CLI 检测和安全透传。

在 macOS 上直接运行 `agent-l10n codex`，按 `/` 后会原位显示 Codex
`0.146.0-alpha.3.1` 实机公开菜单的中文说明。翻译器只精确匹配已验证的
界面短语，不修改命令输入、模型回答、Shell 输出或官方 CLI 文件。

随时可以关闭界面翻译：

```bash
agent-l10n --passthrough codex
```

项目主页：https://github.com/Whawk77/agent-cli-guide
