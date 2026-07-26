import type { AgentDef, CommandEntry } from '../data/types';
import { locale, t } from '../i18n/ui';

interface Props {
  agent: AgentDef;
  onPick: (entry: CommandEntry) => void;
}

export default function Sidebar({ agent, onPick }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">{t.sidebarTitle}</div>
      {agent.categories.map((cat) => (
        <details key={cat.id} open className="cat">
          <summary>{cat.i18n[locale].title}</summary>
          <ul>
            {cat.entries.map((e) => (
              <li key={e.name}>
                <button className="cat-entry" onClick={() => onPick(e)} title={t.tryIt}>
                  <code>{e.name}</code>
                  <span>{e.i18n[locale].summary}</span>
                </button>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </aside>
  );
}
