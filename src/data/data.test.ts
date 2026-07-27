import { describe, expect, it } from 'vitest';
import { agents } from './index';

describe('命令数据完整性', () => {
  const codexOfficialSlashCommands = [
    '/permissions', '/ide', '/keymap', '/vim', '/setup-default-sandbox', '/sandbox-add-read-dir',
    '/agent', '/apps', '/plugins', '/hooks', '/clear', '/rename', '/archive', '/delete', '/compact',
    '/copy', '/diff', '/exit', '/experimental', '/approve', '/memories', '/skills', '/import',
    '/feedback', '/init', '/logout', '/mcp', '/mention', '/model', '/fast', '/plan', '/goal',
    '/personality', '/ps', '/stop', '/fork', '/app', '/btw', '/raw', '/resume', '/new', '/review',
    '/status', '/usage', '/debug-config', '/statusline', '/title', '/theme', '/pets',
  ];

  it('收录了 7 个 agent，id 与 binary 唯一', () => {
    expect(agents.length).toBe(7);
    expect(new Set(agents.map((a) => a.id)).size).toBe(agents.length);
    expect(new Set(agents.map((a) => a.binary)).size).toBe(agents.length);
  });

  it.each(agents.map((a) => [a.name, a] as const))('%s 数据结构完整', (_name, agent) => {
    expect(agent.categories.length).toBeGreaterThan(0);
    expect(agent.tagline.zh.length).toBeGreaterThan(0);
    expect(agent.install.length).toBeGreaterThan(0);
    for (const cat of agent.categories) {
      expect(cat.entries.length).toBeGreaterThan(0);
      expect(cat.i18n.zh.title.length).toBeGreaterThan(0);
      // 同一分类内命令名不重复
      const names = cat.entries.map((e) => e.name);
      expect(new Set(names).size).toBe(names.length);
      for (const e of cat.entries) {
        expect(e.en.length).toBeGreaterThan(0);
        expect(e.i18n.zh.summary.length).toBeGreaterThan(0);
      }
    }
  });

  it.each(agents.map((a) => [a.name, a] as const))('%s 模拟规格与会话配置一致', (_name, agent) => {
    const stateKeys = new Set((agent.session?.statusFields ?? []).map((f) => f.key));
    if (agent.session) {
      expect(agent.session.banner.length).toBeGreaterThan(0);
      expect(agent.session.statusFields.length).toBeGreaterThan(0);
      expect(agent.session.chatReply.length).toBeGreaterThan(0);
      for (const f of agent.session.statusFields) expect(f.label.zh.length).toBeGreaterThan(0);
    }
    for (const cat of agent.categories) {
      for (const e of cat.entries) {
        if (!e.simulate) continue;
        // 有模拟规格的 agent 必须配置了会话（shell-only preventSession 除外）
        if (!e.simulate.preventSession) expect(agent.session).toBeDefined();
        for (const eff of [...e.simulate.effects, ...(e.simulate.argEffects ?? [])]) {
          if (eff.type === 'state') {
            for (const key of Object.keys(eff.patch)) {
              expect(stateKeys.has(key), `${agent.id} ${e.name}: state 键 ${key} 不在 statusFields 中`).toBe(true);
            }
          }
          if (eff.type === 'panel' && eff.panel.stateKey) {
            expect(stateKeys.has(eff.panel.stateKey), `${agent.id} ${e.name}: panel.stateKey 无效`).toBe(true);
          }
          if (eff.type === 'panel') {
            expect(eff.panel.title.zh.length).toBeGreaterThan(0);
            expect(eff.panel.items.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it('Codex CLI 覆盖官方内置斜杠命令全集（含别名）', () => {
    const codex = agents.find((agent) => agent.id === 'codex');
    expect(codex).toBeDefined();
    const slashEntries = codex!.categories
      .flatMap((category) => category.entries)
      .filter((entry) => entry.kind === 'slash');
    const available = new Set(slashEntries.flatMap((entry) => [entry.name, ...(entry.aliases ?? [])]));

    for (const command of codexOfficialSlashCommands) {
      expect(available.has(command), `Codex 缺少官方命令 ${command}`).toBe(true);
    }
    expect(available.has('/subagents')).toBe(true);
    expect(available.has('/side')).toBe(true);
    expect(available.has('/quit')).toBe(true);
    expect(available.has('/pet')).toBe(true);
  });
});
