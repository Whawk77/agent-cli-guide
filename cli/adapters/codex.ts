import { fixedWidthRules, type TerminalTranslationRule } from '../terminal-localizer';

/**
 * 取自 Codex 0.146.0-alpha.3.1 的实机 `/` 菜单。
 *
 * 这里刻意使用精确英文匹配：上游改文案时宁可保留英文，也不能误改模型输出、
 * Shell 输出或审批提示。
 */
export const CODEX_TUI_VERIFIED_VERSION = '0.146.0-alpha.3.1';

const menuRules: TerminalTranslationRule[] = [
  {
    source: 'choose what model and reasoning effort to use',
    target: '选择模型与推理力度',
  },
  {
    source: '1.5x speed, increased usage',
    target: '1.5 倍速度，用量增加',
  },
  {
    source: 'include current selection, open files, and other context from your IDE',
    target: '引入 IDE 当前选区、打开文件及其他上下文',
  },
  {
    source: 'choose what Codex is allowed to do',
    target: '设置 Codex 可执行的操作与权限',
  },
  {
    source: 'remap TUI shortcuts',
    target: '重新映射 TUI 快捷键',
  },
  {
    source: 'toggle Vim mode for the composer',
    target: '切换输入框的 Vim 模式',
  },
  {
    source: 'toggle experimental features',
    target: '开关实验性功能',
  },
  {
    source: 'approve one retry of a recent auto-review denial',
    target: '批准重试最近被自动审查拒绝的操作',
  },
];

export const codexTerminalRules = fixedWidthRules(menuRules);
