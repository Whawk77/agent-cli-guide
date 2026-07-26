import { describe, expect, it } from 'vitest';
import { claudeCode } from '../data/claude-code';
import { executeSession, executeShell, initialState, interpolate } from './simEngine';

const init = () => initialState(claudeCode);

describe('executeShell（进入仿真会话）', () => {
  it('裸 binary 进入会话并打印横幅', () => {
    const res = executeShell('claude', claudeCode)!;
    expect(res.nextMode).toBe('session');
    expect(res.blocks.some((b) => b.type === 'banner')).toBe(true);
    expect(res.nextState.model).toBe('sonnet');
  });

  it('启动参数注入初始状态：--model opus --permission-mode plan', () => {
    const res = executeShell('claude --model opus --permission-mode plan', claudeCode)!;
    expect(res.nextMode).toBe('session');
    expect(res.nextState.model).toBe('opus');
    expect(res.nextState.mode).toBe('plan');
  });

  it('--model=opus 等号写法同样生效', () => {
    const res = executeShell('claude --model=opus', claudeCode)!;
    expect(res.nextState.model).toBe('opus');
  });

  it('--version 打印后留在 shell（preventSession）', () => {
    const res = executeShell('claude --version', claudeCode)!;
    expect(res.nextMode).toBe('shell');
    expect(res.blocks[0].type).toBe('sim-print');
  });

  it('--help 交回原有翻译帮助逻辑（返回 null）', () => {
    expect(executeShell('claude --help', claudeCode)).toBeNull();
  });

  it('未知 flag 交回原有逻辑（返回 null）', () => {
    expect(executeShell('claude --no-such-flag', claudeCode)).toBeNull();
  });

  it('非 binary 开头返回 null', () => {
    expect(executeShell('ls -la', claudeCode)).toBeNull();
  });
});

describe('executeSession', () => {
  it('exit 与 /exit 退出会话并重置状态', () => {
    for (const cmd of ['exit', '/exit', '/quit']) {
      const res = executeSession(cmd, claudeCode, { ...init(), model: 'opus' });
      expect(res.nextMode).toBe('shell');
      expect(res.nextState.model).toBe('sonnet');
    }
  });

  it('/model 无参弹出绑定 model 的面板', () => {
    const res = executeSession('/model', claudeCode, init());
    const panel = res.blocks.find((b) => b.type === 'sim-panel');
    expect(panel && panel.type === 'sim-panel' && panel.panel.stateKey).toBe('model');
  });

  it('/model opus 走 argEffects：改状态并打印确认', () => {
    const res = executeSession('/model opus', claudeCode, init());
    expect(res.nextState.model).toBe('opus');
    const print = res.blocks.find((b) => b.type === 'sim-print');
    expect(print && print.type === 'sim-print' && print.lines[0].text).toContain('opus');
  });

  it('/clear 清屏并把上下文归零', () => {
    const res = executeSession('/clear', claudeCode, { ...init(), context: '38%' });
    expect(res.clear).toBe(true);
    expect(res.nextState.context).toBe('0%');
  });

  it('/compact 产生折叠摘要块', () => {
    const res = executeSession('/compact', claudeCode, init());
    expect(res.compact).toBe(true);
    expect(res.blocks.some((b) => b.type === 'compacted')).toBe(true);
  });

  it('/status 打印中插值当前状态', () => {
    const res = executeSession('/status', claudeCode, { ...init(), model: 'haiku' });
    const print = res.blocks.find((b) => b.type === 'sim-print');
    expect(print && print.type === 'sim-print' && print.lines.map((l) => l.text).join('\n')).toContain('haiku');
  });

  it('无 simulate 的斜杠命令回退解释卡片', () => {
    const res = executeSession('/hooks', claudeCode, init());
    expect(res.blocks[0].type).toBe('cards-fallback');
  });

  it('未收录斜杠命令报仿真错误', () => {
    const res = executeSession('/nonexistent', claudeCode, init());
    expect(res.blocks[0].type).toBe('sim-error');
  });

  it('/help 显示翻译版帮助', () => {
    const res = executeSession('/help', claudeCode, init());
    expect(res.blocks[0].type).toBe('help-fallback');
  });

  it('普通文本产生 chat 块', () => {
    const res = executeSession('帮我修这个 bug', claudeCode, init());
    expect(res.blocks[0].type).toBe('chat');
    expect(res.nextMode).toBe('session');
  });
});

describe('interpolate', () => {
  it('替换状态键与参数', () => {
    expect(interpolate('m={model} a={arg}', { model: 'opus', arg: 'x' })).toBe('m=opus a=x');
  });

  it('未知键保留原样便于发现笔误', () => {
    expect(interpolate('{unknown}', { model: 'opus' })).toBe('{unknown}');
  });
});
