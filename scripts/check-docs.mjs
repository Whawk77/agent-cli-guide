#!/usr/bin/env node
/**
 * 检测各 CLI 官方文档是否发生变化。
 *
 * 用法：
 *   node scripts/check-docs.mjs            # 对比快照，输出变化清单（JSON）
 *   node scripts/check-docs.mjs --update   # 重写快照基线
 *
 * 退出码：0 无变化 / 1 有变化 / 2 执行出错
 * 在 GitHub Actions 中会把 changed 列表写入 $GITHUB_OUTPUT。
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const sources = JSON.parse(readFileSync(join(root, 'scripts/doc-sources.json'), 'utf8'));
const snapDir = join(root, 'docs-snapshots');
const update = process.argv.includes('--update');

/** 去 HTML/脚本、压缩空白，降低无关改动（时间戳、样式）带来的误报 */
function normalize(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchHash(url) {
  const res = await fetch(url, {
    headers: { 'user-agent': 'agent-cli-guide-doc-checker (+https://github.com/Whawk77/agent-cli-guide)' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = normalize(await res.text());
  if (text.length < 200) throw new Error('page too small — likely an error/robot page');
  return createHash('sha256').update(text).digest('hex');
}

const changed = [];
const errors = [];
mkdirSync(snapDir, { recursive: true });

for (const [agent, urls] of Object.entries(sources)) {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const snapFile = join(snapDir, `${agent}-${i}.hash`);
    try {
      const hash = await fetchHash(url);
      const prev = existsSync(snapFile) ? readFileSync(snapFile, 'utf8').trim() : null;
      if (update || prev === null) {
        writeFileSync(snapFile, hash + '\n');
        if (prev !== null && prev !== hash) changed.push({ agent, url });
      } else if (prev !== hash) {
        changed.push({ agent, url });
      }
    } catch (e) {
      errors.push({ agent, url, error: String(e.message ?? e) });
    }
  }
}

const result = { changed, errors };
console.log(JSON.stringify(result, null, 2));

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `changed=${changed.length > 0}\n`);
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    `summary<<EOF\n${changed.map((c) => `- **${c.agent}**: ${c.url}`).join('\n')}\nEOF\n`,
  );
}

// 网络抖动不算失败；仅在全部源都抓不到时报错
if (errors.length > 0 && changed.length === 0 && errors.length === Object.values(sources).flat().length) {
  process.exit(2);
}
process.exit(changed.length > 0 ? 1 : 0);
