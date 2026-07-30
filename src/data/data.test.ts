import { describe, expect, it } from 'vitest';
import releaseManifest from '../../scripts/tool-releases.json';
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
  const codexSourceOnlyOrAliasCommands = [
    '/subagents', '/side', '/quit', '/pet', '/clean',
    '/debug-m-drop', '/debug-m-update', '/rollout', '/test-approval',
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
    expect(agent.release.version.length).toBeGreaterThan(0);
    expect(agent.release.verifiedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(agent.release.source).toMatch(/^https:\/\//);
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

  it('页面版本元数据与自动核验清单一致', () => {
    for (const agent of agents) {
      const release = releaseManifest[agent.id as keyof typeof releaseManifest];
      expect(release, `${agent.id} 缺少 scripts/tool-releases.json 记录`).toBeDefined();
      expect(agent.release.version).toBe(release.version);
      expect(agent.release.channel).toBe(release.channel);
      expect(agent.release.source).toBe(release.source);
    }
  });

  it('七套 CLI 的官方根参数面已达到本轮实测数量', () => {
    const minimumCounts: Record<string, number> = {
      'claude-code': 58,
      codex: 21,
      gemini: 29,
      grok: 42,
      pi: 38,
      aider: 130,
      cursor: 43,
    };

    for (const agent of agents) {
      const available = new Set(
        agent.categories
          .flatMap((category) => category.entries)
          .filter((entry) => entry.kind === 'flag')
          .flatMap((entry) => [entry.name, ...(entry.aliases ?? [])])
          .filter((name) => name.startsWith('--')),
      );
      expect(available.size, `${agent.id} 的根参数数量落后于官方帮助`).toBeGreaterThanOrEqual(minimumCounts[agent.id]);
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
    const visibleEntries = new Set(slashEntries.map((entry) => entry.name));
    const available = new Set(slashEntries.flatMap((entry) => [entry.name, ...(entry.aliases ?? [])]));

    for (const command of codexOfficialSlashCommands) {
      expect(available.has(command), `Codex 缺少官方命令 ${command}`).toBe(true);
    }
    for (const command of codexSourceOnlyOrAliasCommands) {
      expect(visibleEntries.has(command), `Codex 侧边栏缺少源码命令/别名 ${command}`).toBe(true);
    }
  });

  it('Codex 当前菜单与 0.146.0 稳定版输出一致', () => {
    const codex = agents.find((agent) => agent.id === 'codex');
    const currentMenu = codex?.categories.find((category) => category.id === 'slash-current-menu');
    expect(currentMenu?.entries.map((entry) => entry.name)).toEqual([
      '/model',
      '/fast',
      '/ide',
      '/permissions',
      '/keymap',
      '/vim',
      '/experimental',
      '/approve',
    ]);
  });

  it('Grok Build 0.2.114 的 CLI 与 TUI 新命令已收录', () => {
    const grok = agents.find((agent) => agent.id === 'grok');
    expect(grok).toBeDefined();
    const entries = grok!.categories.flatMap((category) => category.entries);
    const byKind = (kind: 'flag' | 'subcommand' | 'slash') =>
      new Set(entries.filter((entry) => entry.kind === kind).flatMap((entry) => [entry.name, ...(entry.aliases ?? [])]));

    const flags = byKind('flag');
    for (const flag of [
      '--agent', '--agents', '--allow', '--deny', '--permission-mode', '--sandbox', '--tools',
      '--disallowed-tools', '--reasoning-effort', '--json-schema', '--prompt-json', '--prompt-file',
      '--fork-session', '--restore-code', '--worktree', '--worktree-ref', '--minimal', '--fullscreen',
    ]) {
      expect(flags.has(flag), `Grok 缺少 CLI 选项 ${flag}`).toBe(true);
    }

    const subcommands = byKind('subcommand');
    for (const command of [
      'agent', 'completions', 'dashboard', 'doctor', 'export', 'inspect', 'leader', 'login', 'logout',
      'mcp', 'memory', 'models', 'plugin', 'sessions', 'setup', 'trace', 'update', 'version', 'worktree', 'wrap',
    ]) {
      expect(subcommands.has(command), `Grok 缺少子命令 ${command}`).toBe(true);
    }

    const slash = byKind('slash');
    for (const command of [
      '/docs', '/delete', '/history', '/edit-prompt', '/expand', '/minimal', '/fullscreen', '/cd',
      '/announcements', '/workflows', '/recap', '/doctor', '/voice', '/timeline',
      '/toggle-mouse-reporting', '/jump', '/tutorial',
    ]) {
      expect(slash.has(command), `Grok 缺少 TUI 命令 ${command}`).toBe(true);
    }

    expect(grok!.session?.statusFields.find((field) => field.key === 'model')?.initial).toBe('grok-4.5');
  });
});
