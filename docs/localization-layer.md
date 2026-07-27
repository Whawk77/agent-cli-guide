# AgentL10n 本地化层设计

## 当前阶段

v0.2 提供四项能力：

1. `agent-l10n <agent> --help`：从统一命令目录生成中英双语帮助。
2. `agent-l10n explain [agent] <command>`：解释命令、参数、别名和示例。
3. `agent-l10n <agent> [args...]`：启动真实官方 CLI，完整透传标准输入输出、终端信号和退出码。
4. macOS 上运行 `agent-l10n codex`：通过系统 PTY 对 Codex 的实机 `/` 菜单做原位中文翻译预览。

网页学习站与 CLI 包装器直接导入 `src/data/`，因此修正命令或翻译后两端会同时更新。

## 运行边界

普通透传模式不解析或重绘官方 TUI：

```text
参数解析 → 版本检测 → 子进程启动 → stdio 继承 → 信号转发 → 退出码转发
```

环境变量 `AGENT_L10N_ACTIVE=1` 用于阻止包装器嵌套递归，不包含用户数据。

### Codex 中文 TUI 预览

当前预览已按 Codex `0.146.0-alpha.3.1` 的实机菜单验证：

- `/model`
- `/fast`
- `/ide`
- `/permissions`
- `/keymap`
- `/vim`
- `/experimental`
- `/approve`

实现遵循三条约束：

1. 只精确匹配 adapter 中收录的官方界面英文，不翻译模型回答、Shell 输出或文件内容。
2. 中文替换后补齐到与英文完全相同的终端列宽，避免破坏 TUI 光标和局部重绘。
3. 未知文案原样通过；非 macOS、非交互终端或带启动参数时自动降级为安全透传。

若要查看未经处理的官方界面：

```bash
agent-l10n --passthrough codex
```

## 下一阶段：跨平台 PTY 旁注层

后续将把当前 macOS 精确替换预览扩展为跨平台 `terminal-core`，并继续保留安全降级：

```text
官方 CLI
  ↓ ANSI 字节流
PTY / 虚拟终端
  ↓ 只读识别
Agent 适配器
  ↓ 语义事件
中文旁注面板
```

首批语义事件：

- `model-picker`
- `permission-picker`
- `session-status`
- `context-warning`
- `update-notice`
- `authentication-error`

旁注层不得自动确认权限、修改路径、翻译 Shell 输出或改变官方 CLI 的输入内容。

## 版本策略

每个适配器需要记录：

- 已验证的 CLI 版本
- 对应上游源码提交
- 支持的语义事件
- 终端快照
- 不兼容变化

遇到未知版本或规则失配时按以下顺序降级：

```text
等宽原位翻译 → 静态命令解释 → 完全透传
```

任何本地化失败都不能阻止官方 CLI 启动。
