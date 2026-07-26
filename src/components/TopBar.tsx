import { useRef, useState } from 'react';
import type { AgentDef } from '../data/types';
import { searchEntries, type SearchHit } from '../lib/search';
import { locale, t } from '../i18n/ui';

interface Props {
  agents: AgentDef[];
  currentId: string;
  onSelect: (id: string) => void;
  onPickHit: (hit: SearchHit) => void;
  onToggleSidebar: () => void;
}

export default function TopBar({ agents, currentId, onSelect, onPickHit, onToggleSidebar }: Props) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const hits = q.trim() ? searchEntries(agents, q) : [];

  return (
    <header className="topbar">
      <button className="menu-btn" onClick={onToggleSidebar} aria-label="menu">
        ☰
      </button>
      <div className="logo">
        <span className="logo-mark">▸_</span>
        <span className="logo-text">
          {t.appTitle}
          <small>{t.appSubtitle}</small>
        </span>
      </div>
      <nav className="agent-tabs">
        {agents.map((a) => (
          <button
            key={a.id}
            className={a.id === currentId ? 'tab active' : 'tab'}
            onClick={() => onSelect(a.id)}
          >
            {a.name}
          </button>
        ))}
      </nav>
      <div className="search-box" ref={boxRef}>
        <input
          value={q}
          placeholder={t.searchPlaceholder}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {open && q.trim() && (
          <ul className="search-results">
            {hits.length === 0 && <li className="no-result">{t.searchNoResult}</li>}
            {hits.map((h) => (
              <li key={`${h.agent.id}:${h.entry.name}`}>
                <button
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQ('');
                    setOpen(false);
                    onPickHit(h);
                  }}
                >
                  <span className="hit-agent">{h.agent.name}</span>
                  <code>{h.entry.name}</code>
                  <span className="hit-zh">{h.entry.i18n[locale].summary}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="lang-badge" title="更多语言开发中">
        🌐 {t.langLabel}
      </div>
    </header>
  );
}
