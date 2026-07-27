import { describe, expect, it } from 'vitest';
import { codexTerminalRules } from './adapters/codex';
import {
  fitToTerminalWidth,
  StreamingTerminalLocalizer,
  terminalWidth,
} from './terminal-localizer';

describe('terminal localizer', () => {
  it('中英文替换前后占用相同终端列数', () => {
    for (const rule of codexTerminalRules) {
      expect(terminalWidth(rule.target)).toBe(terminalWidth(rule.source));
    }
  });

  it('译文过长时按终端列安全截断', () => {
    const fitted = fitToTerminalWidth('中文 translation', 8);
    expect(terminalWidth(fitted)).toBe(8);
  });

  it('能识别跨输出块拆开的 Codex 菜单文案', () => {
    const localizer = new StreamingTerminalLocalizer(codexTerminalRules);
    const first = localizer.push('  /model  choose what model and reas');
    const second = localizer.push('oning effort to use\r\n');
    const output = first + second + localizer.flush();

    expect(output).toContain('/model');
    expect(output).toContain('选择模型与推理力度');
    expect(output).not.toContain('choose what model');
  });

  it('未验证的终端内容原样通过', () => {
    const localizer = new StreamingTerminalLocalizer(codexTerminalRules);
    const input = '\u001b[31mShell output: choose a file\u001b[0m\r\n';
    const output = localizer.push(input) + localizer.flush();
    expect(output).toBe(input);
  });

  it('覆盖当前实机公开的八条菜单说明', () => {
    expect(codexTerminalRules.length).toBeGreaterThanOrEqual(8);
    const sources = codexTerminalRules.map((rule) => rule.source);
    expect(sources).toEqual(expect.arrayContaining([
      'choose what model and reasoning effort to use',
      'choose what Codex is allowed to do',
      'approve one retry of a recent auto-review denial',
    ]));
  });

  it('只在 /ide 前段命中后翻译窄终端的换行后段', () => {
    const localizer = new StreamingTerminalLocalizer(codexTerminalRules);
    const ansiCursorMove = '\u001b[19;18H';
    const output = localizer.push(
      `include current selection, open files, and other context from${ansiCursorMove}your IDE`,
    ) + localizer.flush();

    expect(output).toContain('引入当前选区、打开文件及其他上下文');
    expect(output).toContain(`${ansiCursorMove}来自 IDE`);

    const unrelated = new StreamingTerminalLocalizer(codexTerminalRules);
    expect(unrelated.push('Please configure your IDE.') + unrelated.flush()).toBe('Please configure your IDE.');
  });
});
