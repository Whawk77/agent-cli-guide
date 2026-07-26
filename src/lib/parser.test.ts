import { describe, expect, it } from 'vitest';
import { claudeCode } from '../data/claude-code';
import { agents } from '../data';
import { applySuggestion, detectOtherAgent, isHelpRequest, parse, suggest } from './parser';

describe('parse', () => {
  it('识别 binary + flag', () => {
    const tokens = parse('claude --model opus', claudeCode);
    expect(tokens).toHaveLength(3);
    expect(tokens[0].kind).toBe('binary');
    expect(tokens[1].kind).toBe('entry');
    expect(tokens[1].entry?.name).toBe('--model');
    expect(tokens[2].kind).toBe('arg');
  });

  it('识别短别名与 --flag=value', () => {
    const tokens = parse('claude -p --output-format=json', claudeCode);
    expect(tokens[1].entry?.name).toBe('--print');
    expect(tokens[2].entry?.name).toBe('--output-format');
  });

  it('识别斜杠命令（仅行首）', () => {
    const tokens = parse('/compact 保留代码', claudeCode);
    expect(tokens[0].kind).toBe('entry');
    expect(tokens[0].entry?.name).toBe('/compact');
  });

  it('未收录的斜杠命令标记为 unknown-slash', () => {
    const tokens = parse('/nonexistent', claudeCode);
    expect(tokens[0].kind).toBe('unknown-slash');
  });

  it('识别子命令', () => {
    const tokens = parse('claude mcp list', claudeCode);
    expect(tokens[1].entry?.name).toBe('mcp');
    expect(tokens[2].kind).toBe('arg');
  });

  it('未知 flag 标记为 unknown-flag', () => {
    const tokens = parse('claude --no-such-flag', claudeCode);
    expect(tokens[1].kind).toBe('unknown-flag');
  });

  it('空输入返回空数组', () => {
    expect(parse('   ', claudeCode)).toEqual([]);
  });
});

describe('isHelpRequest', () => {
  it('单独输入 binary 视为求助', () => {
    expect(isHelpRequest('claude', claudeCode)).toBe(true);
  });

  it('--help / -h 视为求助', () => {
    expect(isHelpRequest('claude --help', claudeCode)).toBe(true);
    expect(isHelpRequest('claude -h', claudeCode)).toBe(true);
  });

  it('普通命令不是求助', () => {
    expect(isHelpRequest('claude --model opus', claudeCode)).toBe(false);
  });
});

describe('suggest / applySuggestion', () => {
  it('斜杠前缀给出斜杠命令建议', () => {
    const s = suggest('/co', claudeCode);
    expect(s.length).toBeGreaterThan(0);
    expect(s.every((x) => x.entry?.kind === 'slash')).toBe(true);
  });

  it('- 前缀给出 flag 建议', () => {
    const s = suggest('claude --mo', claudeCode);
    expect(s.some((x) => x.entry?.name === '--model')).toBe(true);
  });

  it('应用建议替换最后一个词', () => {
    const s = suggest('claude --mo', claudeCode);
    const applied = applySuggestion('claude --mo', s.find((x) => x.entry?.name === '--model')!);
    expect(applied).toBe('claude --model ');
  });

  it('输入 binary 前缀提示 binary', () => {
    const s = suggest('cla', claudeCode);
    expect(s[0]?.insert).toBe('claude');
  });
});

describe('detectOtherAgent', () => {
  it('检测其他 agent 的 binary', () => {
    const others = agents.filter((a) => a.id !== claudeCode.id);
    if (others.length > 0) {
      const other = others[0];
      expect(detectOtherAgent(`${other.binary} --help`, claudeCode, agents)?.id).toBe(other.id);
    }
    expect(detectOtherAgent('claude --help', claudeCode, agents)).toBeUndefined();
  });
});
