import { useEffect, useRef, useState } from 'react';
import { agents } from './data';
import type { CommandEntry } from './data/types';
import TopBar from './components/TopBar';
import Sidebar from './components/Sidebar';
import Terminal, { type TermAction } from './components/Terminal';
import type { SearchHit } from './lib/search';
import { useTheme } from './lib/theme';
import { t } from './i18n/ui';

export default function App() {
  const [agentId, setAgentId] = useState(agents[0].id);
  const [action, setAction] = useState<TermAction | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { preference: themePreference, setPreference: setThemePreference } = useTheme();

  const agent = agents.find((a) => a.id === agentId) ?? agents[0];

  useEffect(() => {
    if (!sidebarOpen) return;
    sidebarRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSidebarOpen(false);
        requestAnimationFrame(() =>
          document.querySelector<HTMLButtonElement>('.menu-btn')?.focus(),
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  const insertTextFor = (entry: CommandEntry): string | undefined => {
    if (entry.kind === 'shortcut') return undefined;
    if (entry.example) return entry.example;
    if (entry.kind === 'slash') return entry.name;
    if (entry.kind === 'flag' || entry.kind === 'subcommand') return `${agent.binary} ${entry.name}`;
    return undefined;
  };

  const pickEntry = (entry: CommandEntry) => {
    setAction({ nonce: Date.now() + Math.random(), card: entry, insert: insertTextFor(entry) });
    setSidebarOpen(false);
  };

  const pickHit = (hit: SearchHit) => {
    setAgentId(hit.agent.id);
    // 切换 agent 会清空终端，延迟一拍再推送卡片
    setTimeout(() => {
      setAction({ nonce: Date.now() + Math.random(), card: hit.entry });
    }, 0);
  };

  return (
    <div className="app">
      <TopBar
        agents={agents}
        currentId={agent.id}
        onSelect={(id) => {
          setAgentId(id);
          setSidebarOpen(false);
        }}
        onPickHit={pickHit}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
        themePreference={themePreference}
        onThemeChange={setThemePreference}
      />
      <main className="main">
        <button
          className={sidebarOpen ? 'sidebar-backdrop open' : 'sidebar-backdrop'}
          aria-label={t.closeSidebar}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          id="command-sidebar"
          ref={sidebarRef}
          className={sidebarOpen ? 'sidebar-wrap open' : 'sidebar-wrap'}
          tabIndex={-1}
        >
          <Sidebar agent={agent} onPick={pickEntry} />
        </div>
        <Terminal agent={agent} agents={agents} action={action} onSwitchAgent={setAgentId} />
      </main>
    </div>
  );
}
