import { Languages, Menu, Monitor, Moon, Search, Sun } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import type { AgentDef } from '../data/types';
import { searchEntries, type SearchHit } from '../lib/search';
import type { ThemePreference } from '../lib/theme';
import { locale, t } from '../i18n/ui';

interface Props {
  agents: AgentDef[];
  currentId: string;
  onSelect: (id: string) => void;
  onPickHit: (hit: SearchHit) => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  themePreference: ThemePreference;
  onThemeChange: (theme: ThemePreference) => void;
}

function HighlightText({ text, query }: { text: string; query: string }) {
  const index = text.toLocaleLowerCase().indexOf(query.trim().toLocaleLowerCase());
  if (index < 0 || !query.trim()) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <mark>{text.slice(index, index + query.trim().length)}</mark>
      {text.slice(index + query.trim().length)}
    </>
  );
}

const themeOptions = [
  { value: 'system', label: t.themeSystem, Icon: Monitor },
  { value: 'light', label: t.themeLight, Icon: Sun },
  { value: 'dark', label: t.themeDark, Icon: Moon },
] as const;

export default function TopBar({
  agents,
  currentId,
  onSelect,
  onPickHit,
  onToggleSidebar,
  sidebarOpen,
  themePreference,
  onThemeChange,
}: Props) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const hits = useMemo(() => (q.trim() ? searchEntries(agents, q) : []), [agents, q]);
  const resultsOpen = open && q.trim().length > 0;
  const activeId = hits.length > 0 ? `command-search-option-${activeIndex}` : undefined;

  const pickHit = (hit: SearchHit) => {
    setQ('');
    setOpen(false);
    setActiveIndex(0);
    onPickHit(hit);
  };

  const onSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && hits.length > 0) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, hits.length - 1));
      return;
    }
    if (event.key === 'ArrowUp' && hits.length > 0) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === 'Enter' && resultsOpen && hits[activeIndex]) {
      event.preventDefault();
      pickHit(hits[activeIndex]);
      return;
    }
    if (event.key === 'Escape') {
      setOpen(false);
      setActiveIndex(0);
    }
  };

  return (
    <header className="topbar">
      <button
        className="icon-btn menu-btn"
        onClick={onToggleSidebar}
        aria-label={sidebarOpen ? t.closeSidebar : t.openSidebar}
        aria-controls="command-sidebar"
        aria-expanded={sidebarOpen}
        title={sidebarOpen ? t.closeSidebar : t.openSidebar}
      >
        <Menu size={19} aria-hidden="true" />
      </button>

      <div className="logo">
        <span className="logo-mark" aria-hidden="true">
          ▸_
        </span>
        <span className="logo-text">
          {t.appTitle}
          <small>{t.appSubtitle}</small>
        </span>
      </div>

      <nav className="agent-tabs" aria-label="Agent CLI">
        {agents.map((agent) => (
          <button
            key={agent.id}
            className={agent.id === currentId ? 'tab active' : 'tab'}
            onClick={() => onSelect(agent.id)}
            aria-current={agent.id === currentId ? 'page' : undefined}
          >
            {agent.name}
          </button>
        ))}
      </nav>

      <div className="search-box" ref={boxRef}>
        <Search className="search-icon" size={15} aria-hidden="true" />
        <input
          value={q}
          type="search"
          role="combobox"
          aria-label={t.searchLabel}
          aria-autocomplete="list"
          aria-expanded={resultsOpen}
          aria-controls="command-search-results"
          aria-activedescendant={resultsOpen ? activeId : undefined}
          placeholder={t.searchPlaceholder}
          onChange={(event) => {
            setQ(event.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onSearchKeyDown}
        />
        {resultsOpen && (
          <ul
            id="command-search-results"
            className="search-results"
            role="listbox"
            aria-label={t.searchResultsLabel}
          >
            {hits.length === 0 && (
              <li className="no-result" role="option" aria-disabled="true">
                {t.searchNoResult}
              </li>
            )}
            {hits.map((hit, index) => (
              <li
                id={`command-search-option-${index}`}
                key={`${hit.agent.id}:${hit.entry.name}:${index}`}
                className={index === activeIndex ? 'active' : ''}
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => {
                  event.preventDefault();
                  pickHit(hit);
                }}
              >
                <span className="hit-agent">{hit.agent.name}</span>
                <code>
                  <HighlightText text={hit.entry.name} query={q} />
                </code>
                <span className="hit-zh">
                  <HighlightText text={hit.entry.i18n[locale].summary} query={q} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="topbar-actions">
        <span
          className="lang-badge"
          role="img"
          title={t.languageLabel}
          aria-label={t.languageLabel}
        >
          <Languages size={16} aria-hidden="true" />
          <span>{t.langLabel}</span>
        </span>
        <div className="theme-switcher" role="group" aria-label={t.themeLabel}>
          {themeOptions.map(({ value, label, Icon }) => (
            <button
              key={value}
              className={themePreference === value ? 'theme-btn active' : 'theme-btn'}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={themePreference === value}
              onClick={() => onThemeChange(value)}
            >
              <Icon size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
