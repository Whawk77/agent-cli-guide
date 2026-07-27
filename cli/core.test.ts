import { describe, expect, it } from 'vitest';
import { codex } from '../src/data/codex';
import {
  findAgent,
  findEntry,
  formatAgentHelp,
  parseCliArgs,
} from './core';

describe('AgentL10n CLI', () => {
  it('解析真实 CLI 透传参数', () => {
    expect(parseCliArgs(['--locale', 'zh-CN', 'codex', '--model', 'gpt-5.6-sol'])).toMatchObject({
      action: 'run',
      agentId: 'codex',
      locale: 'zh-CN',
      forwardedArgs: ['--model', 'gpt-5.6-sol'],
    });
  });

  it('拦截 agent --help 生成双语帮助', () => {
    expect(parseCliArgs(['codex', '--help'])).toMatchObject({
      action: 'help',
      agentId: 'codex',
    });
  });

  it('保留 passthrough 模式和官方 help 参数', () => {
    expect(parseCliArgs(['--passthrough', 'codex', '--help'])).toMatchObject({
      action: 'help',
      agentId: 'codex',
      mode: 'passthrough',
      forwardedArgs: ['--help'],
    });
  });

  it('explain 缺省使用 Codex', () => {
    expect(parseCliArgs(['explain', '/permissions'])).toMatchObject({
      action: 'explain',
      agentId: 'codex',
      command: '/permissions',
    });
  });

  it('查找命令和别名', () => {
    expect(findEntry(codex, '/permissions')?.name).toBe('/permissions');
    expect(findEntry(codex, '-m')?.name).toBe('--model');
  });

  it('双语帮助包含中文、英文与新增源码命令', () => {
    const output = formatAgentHelp(codex);
    expect(output).toContain('中英双语命令帮助');
    expect(output).toContain('EN:');
    expect(output).toContain('/debug-config');
    expect(output).toContain('/test-approval');
  });

  it('可按 binary 或 id 查找 Agent', () => {
    expect(findAgent([codex], 'codex')).toBe(codex);
  });
});
