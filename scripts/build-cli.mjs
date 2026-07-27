import { build } from 'esbuild';

await build({
  entryPoints: ['cli/index.ts'],
  outfile: 'packages/cli/dist/agent-l10n.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node18',
  sourcemap: true,
});
