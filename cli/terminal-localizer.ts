import { StringDecoder } from 'node:string_decoder';

export interface TerminalTranslationRule {
  source: string;
  target: string;
  /** TUI 把一句话折成两行时，仅在前段命中后才允许替换的后段 */
  followup?: TerminalTranslationRule;
}

function isCombining(codePoint: number): boolean {
  return (
    (codePoint >= 0x0300 && codePoint <= 0x036f)
    || (codePoint >= 0x1ab0 && codePoint <= 0x1aff)
    || (codePoint >= 0x1dc0 && codePoint <= 0x1dff)
    || (codePoint >= 0x20d0 && codePoint <= 0x20ff)
    || (codePoint >= 0xfe20 && codePoint <= 0xfe2f)
  );
}

function isWide(codePoint: number): boolean {
  return (
    codePoint >= 0x1100
    && (
      codePoint <= 0x115f
      || codePoint === 0x2329
      || codePoint === 0x232a
      || (codePoint >= 0x2e80 && codePoint <= 0xa4cf)
      || (codePoint >= 0xac00 && codePoint <= 0xd7a3)
      || (codePoint >= 0xf900 && codePoint <= 0xfaff)
      || (codePoint >= 0xfe10 && codePoint <= 0xfe19)
      || (codePoint >= 0xfe30 && codePoint <= 0xfe6f)
      || (codePoint >= 0xff00 && codePoint <= 0xff60)
      || (codePoint >= 0xffe0 && codePoint <= 0xffe6)
      || (codePoint >= 0x1f300 && codePoint <= 0x1faff)
      || (codePoint >= 0x20000 && codePoint <= 0x3fffd)
    )
  );
}

export function terminalWidth(text: string): number {
  let width = 0;
  for (const character of text) {
    const codePoint = character.codePointAt(0) ?? 0;
    if (codePoint === 0 || isCombining(codePoint)) continue;
    width += isWide(codePoint) ? 2 : 1;
  }
  return width;
}

/**
 * TUI 会按原始英文的单元格宽度计算光标位置。译文必须占用完全相同的
 * 终端列数，否则下一次局部重绘会出现残字或错位。
 */
export function fitToTerminalWidth(target: string, width: number): string {
  let result = '';
  let used = 0;

  for (const character of target) {
    const characterWidth = terminalWidth(character);
    if (used + characterWidth > width) break;
    result += character;
    used += characterWidth;
  }

  return result + ' '.repeat(Math.max(0, width - used));
}

export function fixedWidthRules(rules: TerminalTranslationRule[]): TerminalTranslationRule[] {
  return rules.map((rule) => ({
    source: rule.source,
    target: fitToTerminalWidth(rule.target, terminalWidth(rule.source)),
    followup: rule.followup ? fixedWidthRules([rule.followup])[0] : undefined,
  }));
}

/**
 * 保留可能位于字节块末尾的半条英文，以便与下一块拼接后再匹配。
 * 未命中的内容逐字节等价输出；只有 adapter 中的精确短语会被替换。
 */
export class StreamingTerminalLocalizer {
  private readonly decoder = new StringDecoder('utf8');
  private pending = '';
  private followup?: { rule: TerminalTranslationRule; budget: number };

  constructor(private readonly rules: TerminalTranslationRule[]) {}

  push(chunk: Buffer | string): string {
    this.pending += typeof chunk === 'string' ? chunk : this.decoder.write(chunk);
    this.pending = this.replaceCompleteRules(this.pending);

    const retainedLength = this.longestRulePrefixSuffix(this.pending);
    if (retainedLength === 0) {
      const output = this.pending;
      this.pending = '';
      return output;
    }

    const output = this.pending.slice(0, -retainedLength);
    this.pending = this.pending.slice(-retainedLength);
    return output;
  }

  flush(): string {
    this.pending += this.decoder.end();
    const output = this.replaceCompleteRules(this.pending);
    this.pending = '';
    return output;
  }

  private replaceCompleteRules(input: string): string {
    let output = input;
    for (const rule of this.rules) {
      if (!output.includes(rule.source)) continue;
      output = output.split(rule.source).join(rule.target);
      if (rule.followup) {
        this.followup = { rule: rule.followup, budget: 4_096 };
      }
    }

    if (this.followup) {
      const { rule } = this.followup;
      const index = output.indexOf(rule.source);
      if (index >= 0) {
        output = `${output.slice(0, index)}${rule.target}${output.slice(index + rule.source.length)}`;
        this.followup = undefined;
      } else {
        this.followup.budget -= output.length;
        if (this.followup.budget <= 0) this.followup = undefined;
      }
    }
    return output;
  }

  private longestRulePrefixSuffix(input: string): number {
    let longest = 0;
    const candidates = this.followup
      ? [...this.rules, this.followup.rule]
      : this.rules;
    for (const rule of candidates) {
      const maxLength = Math.min(input.length, rule.source.length - 1);
      for (let length = maxLength; length > longest; length -= 1) {
        if (input.endsWith(rule.source.slice(0, length))) {
          longest = length;
          break;
        }
      }
    }
    return longest;
  }
}
