import type { CommandEntry } from '../data/types';
import { locale, t } from '../i18n/ui';

export default function EntryCard({ entry, onTry }: { entry: CommandEntry; onTry: (text: string) => void }) {
  const zh = entry.i18n[locale];
  return (
    <div className="entry-card">
      <div className="entry-card-head">
        <span className={`kind-badge kind-${entry.kind}`}>{t.kindLabels[entry.kind]}</span>
        <code className="entry-name">
          {entry.name}
          {entry.argSpec ? ` ${entry.argSpec}` : ''}
        </code>
        {entry.aliases?.length ? (
          <span className="entry-aliases">
            {t.aliases}: {entry.aliases.join(', ')}
          </span>
        ) : null}
      </div>
      <div className="entry-zh">{zh.summary}</div>
      <div className="entry-en">
        {t.original}: {entry.en}
      </div>
      {zh.detail ? <div className="entry-detail">{zh.detail}</div> : null}
      {entry.kind === 'shortcut' ? (
        <div className="entry-example-note">{t.shortcutNote}</div>
      ) : entry.example ? (
        <button className="entry-example" onClick={() => onTry(entry.example!)}>
          <span className="entry-example-label">{t.example}</span> <code>{entry.example}</code>
        </button>
      ) : null}
    </div>
  );
}
