import type { CommandEntry, EntryKind } from './types';

export type QuickEntry = readonly [
  name: string,
  argSpec: string | undefined,
  en: string,
  zh: string,
  aliases?: readonly string[],
];

/** 为低交互频率的官方命令生成一致的数据项；高频命令仍在各数据文件里保留完整说明与仿真。 */
export function quickEntries(
  kind: EntryKind,
  binary: string,
  rows: readonly QuickEntry[],
): CommandEntry[] {
  return rows.map(([name, argSpec, en, zh, aliases]) => ({
    kind,
    name,
    ...(aliases?.length ? { aliases: [...aliases] } : {}),
    ...(argSpec ? { argSpec } : {}),
    example: `${kind === 'slash' ? '' : `${binary} `}${name}${argSpec ? ` ${argSpec}` : ''}`,
    en,
    i18n: { zh: { summary: zh } },
  }));
}
