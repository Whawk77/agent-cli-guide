import { describe, expect, it } from 'vitest';
import { agents } from './index';

describe('命令数据完整性', () => {
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
});
