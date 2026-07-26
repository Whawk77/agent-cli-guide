import type { AgentDef } from '../data/types';
import type { SimState } from '../lib/simEngine';
import { locale } from '../i18n/ui';

export default function SessionStatusBar({ agent, state }: { agent: AgentDef; state: SimState }) {
  const fields = agent.session?.statusFields ?? [];
  if (fields.length === 0) return null;
  return (
    <div className="status-bar">
      <span className="status-agent">{agent.name}</span>
      {fields.map((f) => (
        <span key={f.key} className="status-field">
          <span className="status-label">{f.label[locale]}</span>
          <span className="status-value">{state[f.key] ?? f.initial}</span>
        </span>
      ))}
    </div>
  );
}
