import type { AgentDef, SimLine } from '../data/types';
import type { SimBlock, SimState } from '../lib/simEngine';
import EntryCard from './EntryCard';
import HelpView from './HelpView';
import { locale, t } from '../i18n/ui';

function Lines({ lines }: { lines: SimLine[] }) {
  return (
    <div className="sim-print">
      {lines.map((l, i) => (
        <div key={i} className={`sim-line sim-${l.style ?? 'plain'}`}>
          <span className="sim-text">{l.text}</span>
          {l.note?.[locale] ? <span className="sim-note">· {l.note[locale]}</span> : null}
        </div>
      ))}
    </div>
  );
}

interface Props {
  block: SimBlock;
  agent: AgentDef;
  state: SimState;
  onPanelSelect: (stateKey: string, value: string) => void;
  onTry: (text: string) => void;
}

export default function SimBlockView({ block, agent, state, onPanelSelect, onTry }: Props) {
  switch (block.type) {
    case 'sim-print':
      return <Lines lines={block.lines} />;
    case 'banner':
      return (
        <div className="session-banner">
          <Lines lines={block.lines} />
          <div className="sim-line sim-dim">
            <span className="sim-note">{t.simSessionHint}</span>
          </div>
        </div>
      );
    case 'sim-panel': {
      const { panel } = block;
      return (
        <div className="sim-panel">
          <div className="sim-panel-title">
            {panel.title[locale]}
            {panel.stateKey ? <span className="sim-panel-hint">{t.simPanelHint}</span> : null}
          </div>
          <ul>
            {panel.items.map((item) => {
              const active = panel.stateKey ? state[panel.stateKey] === item.value : false;
              return (
                <li key={item.value}>
                  <button
                    className={active ? 'panel-item active' : 'panel-item'}
                    disabled={!panel.stateKey}
                    aria-pressed={panel.stateKey ? active : undefined}
                    onClick={() => panel.stateKey && onPanelSelect(panel.stateKey, item.value)}
                  >
                    <span className="panel-check">{active ? '❯' : ' '}</span>
                    <code>{item.label}</code>
                    {item.note?.[locale] ? <span className="panel-note">{item.note[locale]}</span> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    case 'chat':
      return (
        <div className="sim-chat">
          <div className="sim-line sim-dim">
            <span className="sim-note">{t.simChatHint}</span>
          </div>
          <Lines lines={block.reply} />
          <div className="sim-line sim-dim">
            <span className="sim-note">{t.simDisclaimer}</span>
          </div>
        </div>
      );
    case 'sim-error':
      return (
        <div className="block-error">
          {block.text} <span className="sim-note">{t.simUnknownHint}</span>
        </div>
      );
    case 'compacted':
      return (
        <div className="block-compacted">
          {t.simCompacted} {block.summary}
        </div>
      );
    case 'exit-note':
      return <div className="sim-line sim-dim">{t.simExitNote}</div>;
    case 'cards-fallback':
      return (
        <div className="block-cards">
          {block.entries.map((e) => (
            <EntryCard key={e.name} entry={e} onTry={onTry} />
          ))}
        </div>
      );
    case 'help-fallback':
      return <HelpView agent={agent} />;
  }
}
