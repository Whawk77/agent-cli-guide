# AgentL10n 本地化层设计

## 当前阶段

MVP 提供三项能力：

1. `agent-l10n <agent> --help`：从统一命令目录生成中英双语帮助。
2. `agent-l10n explain [agent] <command>`：解释命令、参数、别名和示例。
3. `agent-l10n <agent> [args...]`：启动真实官方 CLI，完整透传标准输入输出、终端信号和退出码。

网页学习站与 CLI 包装器直接导入 `src/data/`，因此修正命令或翻译后两端会同时更新。

## 运行边界

MVP 不解析或重绘官方 TUI。启动真实 CLI 时仅执行：

```text
参数解析 → 版本检测 → 子进程启动 → stdio 继承 → 信号转发 → 退出码转发
```

环境变量 `AGENT_L10N_ACTIVE=1` 用于阻止包装器嵌套递归，不包含用户数据。

## 下一阶段：PTY 旁注层

下一阶段新增独立的 `terminal-core`，但继续保持默认安全透传：

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

遇到未知版本时按以下顺序降级：

```text
完整旁注 → 静态命令解释 → 完全透传
```

任何本地化失败都不能阻止官方 CLI 启动。
