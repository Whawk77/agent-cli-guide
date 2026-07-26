import type { AgentDef } from '../data/types';
import { locale, t } from '../i18n/ui';

export default function HelpView({ agent }: { agent: AgentDef }) {
  return (
    <div className="help-view">
      <div className="help-usage">
        {t.helpUsage}: <code>{agent.binary} [options] [command]</code>
      </div>
      {agent.categories.map((cat) => (
        <div key={cat.id} className="help-cat">
          <div className="help-cat-title">{cat.i18n[locale].title}</div>
          {cat.entries.map((e) => (
            <div key={e.name} className="help-row">
              <code className="help-row-name">
                {e.name}
                {e.aliases?.length ? `, ${e.aliases.join(', ')}` : ''}
                {e.argSpec ? ` ${e.argSpec}` : ''}
              </code>
              <span className="help-row-zh">{e.i18n[locale].summary}</span>
              <span className="help-row-en">{e.en}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
