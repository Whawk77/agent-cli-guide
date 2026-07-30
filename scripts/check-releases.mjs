#!/usr/bin/env node
import { appendFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const releases = JSON.parse(readFileSync(join(root, 'scripts/tool-releases.json'), 'utf8'));
const agentArgIndex = process.argv.indexOf('--agent');
const selectedAgent = agentArgIndex >= 0 ? process.argv[agentArgIndex + 1] : null;

if (agentArgIndex >= 0 && (!selectedAgent || !Object.hasOwn(releases, selectedAgent))) {
  console.error(`Unknown or missing agent after --agent. Available: ${Object.keys(releases).join(', ')}`);
  process.exit(2);
}

async function fetchText(url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: 'application/json,text/plain;q=0.9,*/*;q=0.8',
          'user-agent': 'agent-cli-guide-release-checker (+https://github.com/Whawk77/agent-cli-guide)',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }
  throw lastError;
}

function extractVersion(text, extract) {
  if (extract.type === 'text') return text.trim().split(/\s+/)[0];
  if (extract.type === 'regex') {
    const match = text.match(new RegExp(extract.pattern));
    if (!match?.[1]) throw new Error(`pattern did not match: ${extract.pattern}`);
    return match[1];
  }
  if (extract.type === 'json') {
    let value = JSON.parse(text);
    for (const key of extract.path) value = value?.[key];
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`JSON path did not resolve to a version: ${extract.path.join('.')}`);
    }
    return value.trim();
  }
  throw new Error(`unsupported extractor: ${extract.type}`);
}

const results = [];
for (const [id, release] of Object.entries(releases)) {
  if (selectedAgent && id !== selectedAgent) continue;
  try {
    const latest = extractVersion(await fetchText(release.source), release.extract);
    results.push({
      id,
      name: release.name,
      expected: release.version,
      latest,
      current: latest === release.version,
      source: release.source,
    });
  } catch (error) {
    results.push({
      id,
      name: release.name,
      expected: release.version,
      current: false,
      source: release.source,
      error: String(error?.message ?? error),
    });
  }
}

console.log(JSON.stringify(results, null, 2));
if (process.env.GITHUB_OUTPUT) {
  const outdated = results.filter((result) => !result.current && !result.error);
  appendFileSync(process.env.GITHUB_OUTPUT, `outdated=${outdated.length > 0}\n`);
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    `summary<<EOF\n${outdated
      .map((result) => `- **${result.name}**: ${result.expected} -> ${result.latest} (${result.source})`)
      .join('\n')}\nEOF\n`,
  );
}
if (results.some((result) => result.error)) process.exit(2);
if (results.some((result) => !result.current)) process.exit(1);
