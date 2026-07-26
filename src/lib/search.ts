import type { AgentDef, CommandEntry } from '../data/types';
import { flattenEntries } from './parser';
import { locale } from '../i18n/ui';

export interface SearchHit {
  agent: AgentDef;
  entry: CommandEntry;
}

/** 跨所有 agent 搜索：命令名、别名、英文原文、中文翻译 */
export function searchEntries(agents: AgentDef[], query: string, limit = 20): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const hits: SearchHit[] = [];
  for (const agent of agents) {
    for (const entry of flattenEntries(agent)) {
      const zh = entry.i18n[locale];
      const haystack = [entry.name, ...(entry.aliases ?? []), entry.en, zh.summary, zh.detail ?? '']
        .join('\n')
        .toLowerCase();
      if (haystack.includes(q)) {
        hits.push({ agent, entry });
        if (hits.length >= limit) return hits;
      }
    }
  }
  return hits;
}
