import { useEffect, useMemo, useRef, useState } from 'react';
import type { AgentDef, CommandEntry } from '../data/types';
import { applySuggestion, detectOtherAgent, isHelpRequest, parse, suggest } from '../lib/parser';
import {
  executeSession,
  executeShell,
  initialState,
  type SimBlock,
  type SimState,
  type TermMode,
} from '../lib/simEngine';
import EntryCard from './EntryCard';
import HelpView from './HelpView';
import SimBlockView from './SimBlockView';
import SessionStatusBar from './SessionStatusBar';
import { locale, t } from '../i18n/ui';

export interface TermAction {
  nonce: number;
  insert?: string;
  card?: CommandEntry;
}

type Block =
  | { type: 'cmd'; text: string; prompt: string }
  | { type: 'cards'; entries: CommandEntry[]; unknown: string[] }
  | { type: 'help' }
  | { type: 'error'; text: string }
  | { type: 'sim'; sim: SimBlock };

interface Props {
  agent: AgentDef;
  agents: AgentDef[];
  action: TermAction | null;
  onSwitchAgent: (id: string) => void;
}

export default function Terminal({ agent, agents, action, onSwitchAgent }: Props) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [mode, setMode] = useState<TermMode>('shell');
  const [simState, setSimState] = useState<SimState>({});
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [sugIdx, setSugIdx] = useState(0);
  const [sugOpen, setSugOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const promptText = mode === 'session' && agent.session ? agent.session.prompt : agent.prompt;
  const tokens = useMemo(() => parse(input, agent), [input, agent]);
  const suggestions = useMemo(() => suggest(input, agent, locale, mode), [input, agent, mode]);
  const otherAgent = useMemo(
    () => (mode === 'shell' ? detectOtherAgent(input, agent, agents) : undefined),
    [input, agent, agents, mode],
  );

  // 切换 agent 时重置终端与仿真状态
  useEffect(() => {
    setBlocks([]);
    setMode('shell');
    setSimState(initialState(agent));
    setInput('');
    setHistory([]);
    setHistIdx(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent.id]);

  // 侧边栏/搜索触发的动作
  useEffect(() => {
    if (!action) return;
    if (action.card) {
      setBlocks((b) => [...b, { type: 'cards', entries: [action.card!], unknown: [] }]);
    }
    if (action.insert !== undefined) {
      setInput(action.insert);
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action?.nonce]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [blocks]);

  const insertAndFocus = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
  };

  const execute = () => {
    const text = input.trim();
    if (!text) return;
    setHistory((h) => [...h, text]);
    setHistIdx(-1);
    setInput('');
    setSugOpen(true);

    const echo: Block = { type: 'cmd', text, prompt: promptText };

    if (mode === 'session' && agent.session) {
      const res = executeSession(text, agent, simState, locale);
      const simBlocks: Block[] = res.blocks.map((sim) => ({ type: 'sim', sim }));
      if (res.clear) {
        setBlocks(simBlocks);
      } else if (res.compact) {
        setBlocks(simBlocks);
      } else {
        setBlocks((b) => [...b, echo, ...simBlocks]);
      }
      setMode(res.nextMode);
      setSimState(res.nextState);
      return;
    }

    // shell 层
    if (text === 'clear') {
      setBlocks([]);
      return;
    }
    const simRes = executeShell(text, agent, locale);
    if (simRes) {
      setBlocks((b) => [...b, echo, ...simRes.blocks.map((sim): Block => ({ type: 'sim', sim }))]);
      setMode(simRes.nextMode);
      setSimState(simRes.nextState);
      return;
    }

    const next: Block[] = [echo];
    if (isHelpRequest(text, agent)) {
      next.push({ type: 'help' });
    } else {
      const parsed = parse(text, agent);
      const entries: CommandEntry[] = [];
      for (const tk of parsed) {
        if (tk.entry && !entries.includes(tk.entry)) entries.push(tk.entry);
      }
      const unknown = parsed
        .filter((tk) => tk.kind === 'unknown-flag' || tk.kind === 'unknown-slash')
        .map((tk) => tk.text);
      if (entries.length > 0) {
        next.push({ type: 'cards', entries, unknown });
      } else {
        next.push({ type: 'error', text: `${t.unknownCommand} ${agent.binary} --help` });
      }
    }
    setBlocks((b) => [...b, ...next]);
  };

  const showSuggestions = sugOpen && suggestions.length > 0;

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(applySuggestion(input, suggestions[Math.min(sugIdx, suggestions.length - 1)]));
        setSugIdx(0);
      }
      return;
    }
    if (e.key === 'Enter') {
      if (showSuggestions && sugIdx > 0) {
        setInput(applySuggestion(input, suggestions[sugIdx]));
        setSugIdx(0);
        return;
      }
      execute();
      return;
    }
    if (e.key === 'Escape') {
      setSugOpen(false);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showSuggestions) {
        setSugIdx((i) => Math.max(0, i - 1));
      } else if (history.length > 0) {
        const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
        setHistIdx(idx);
        setInput(history[idx]);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (showSuggestions) {
        setSugIdx((i) => Math.min(suggestions.length - 1, i + 1));
      } else if (histIdx !== -1) {
        const idx = histIdx + 1;
        if (idx >= history.length) {
          setHistIdx(-1);
          setInput('');
        } else {
          setHistIdx(idx);
          setInput(history[idx]);
        }
      }
    }
  };

  const renderBlock = (b: Block, i: number) => {
    switch (b.type) {
      case 'cmd':
        return (
          <div key={i} className="block-cmd">
            <span className="prompt">{b.prompt}</span> <code>{b.text}</code>
          </div>
        );
      case 'help':
        return <HelpView key={i} agent={agent} />;
      case 'cards':
        return (
          <div key={i} className="block-cards">
            {b.entries.map((e) => (
              <EntryCard key={e.name} entry={e} onTry={insertAndFocus} />
            ))}
            {b.unknown.map((u) => (
              <div key={u} className="unknown-note">
                <code>{u}</code> — {u.startsWith('/') ? t.unknownSlash : t.unknownFlag}
              </div>
            ))}
          </div>
        );
      case 'error':
        return (
          <div key={i} className="block-error">
            {b.text}
          </div>
        );
      case 'sim':
        return (
          <SimBlockView
            key={i}
            block={b.sim}
            agent={agent}
            state={simState}
            onPanelSelect={(stateKey, value) => setSimState((s) => ({ ...s, [stateKey]: value }))}
            onTry={insertAndFocus}
          />
        );
    }
  };

  return (
    <div className="terminal">
      <div className="term-titlebar">
        <span className="dot dot-r" />
        <span className="dot dot-y" />
        <span className="dot dot-g" />
        <span className="term-title">
          {agent.name} — {t.appTitle}
          {mode === 'session' ? ' · 仿真会话中' : ''}
        </span>
      </div>
      <div className="term-scroll" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
        <div className="welcome">
          <div className="welcome-name">
            {agent.name}
            <span className={`coverage coverage-${agent.coverage}`}>
              {agent.coverage === 'full' ? t.coverageFull : t.coverageCore}
            </span>
          </div>
          <div className="welcome-tagline">{agent.tagline[locale]}</div>
          <div className="welcome-meta">
            官方版本:{' '}
            <a href={agent.release.source} target="_blank" rel="noreferrer">
              <code>v{agent.release.version}</code>
            </a>{' '}
            · {agent.release.channel === 'stable' ? '稳定版' : '最新版'} · 核验于 {agent.release.verifiedAt}
          </div>
          <div className="welcome-meta">
            {t.installLabel}: <code>{agent.install}</code>
          </div>
          <div className="welcome-meta">
            {t.homepageLabel}:{' '}
            <a href={agent.homepage} target="_blank" rel="noreferrer">
              {agent.homepage}
            </a>
          </div>
          <div className="welcome-hint">
            {t.welcomeHint1}{' '}
            <button className="inline-cmd" onClick={() => insertAndFocus(agent.binary)}>
              <code>{agent.binary}</code>
            </button>{' '}
            或{' '}
            <button className="inline-cmd" onClick={() => insertAndFocus(`${agent.binary} --help`)}>
              <code>{agent.binary} --help</code>
            </button>{' '}
            {t.welcomeHint2}
          </div>
        </div>
        {blocks.map(renderBlock)}
      </div>
      <div className="term-input-wrap">
        {showSuggestions && (
          <ul className="suggestions">
            {suggestions.map((s, i) => (
              <li
                key={s.label}
                className={i === sugIdx ? 'active' : ''}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setInput(applySuggestion(input, s));
                  setSugIdx(0);
                  inputRef.current?.focus();
                }}
              >
                <code>{s.label}</code>
                <span>{s.summary}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="term-input-row">
          <span className={mode === 'session' ? 'prompt prompt-session' : 'prompt'}>{promptText}</span>
          <input
            ref={inputRef}
            value={input}
            placeholder={mode === 'session' ? t.simSessionHint : t.inputPlaceholder}
            spellCheck={false}
            autoComplete="off"
            onChange={(e) => {
              setInput(e.target.value);
              setSugOpen(true);
              setSugIdx(0);
            }}
            onKeyDown={onKeyDown}
          />
        </div>
      </div>
      {mode === 'session' && agent.session ? (
        <SessionStatusBar agent={agent} state={simState} />
      ) : null}
      <div className="annotation">
        <div className="annotation-title">{t.annotationTitle}</div>
        {otherAgent ? (
          <button className="switch-hint" onClick={() => onSwitchAgent(otherAgent.id)}>
            {t.switchHint} {otherAgent.name} →
          </button>
        ) : null}
        {mode === 'session' && input.trim() !== '' && !input.trim().startsWith('/') ? (
          <div className="annotation-empty">{t.simChatHint}</div>
        ) : tokens.length === 0 ? (
          <div className="annotation-empty">{t.annotationEmpty}</div>
        ) : (
          <ul className="token-list">
            {tokens.map((tk, i) => (
              <li key={i} className={`token-row token-${tk.kind}`}>
                <code className="token-text">{tk.text}</code>
                <span className="token-explain">
                  {tk.kind === 'binary' && `${t.binaryToken} · ${agent.name}`}
                  {tk.kind === 'entry' && tk.entry && (
                    <>
                      <em>{t.kindLabels[tk.entry.kind]}</em> {tk.entry.i18n[locale].summary}
                    </>
                  )}
                  {tk.kind === 'arg' && t.argToken}
                  {tk.kind === 'unknown-flag' && t.unknownFlag}
                  {tk.kind === 'unknown-slash' && t.unknownSlash}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
