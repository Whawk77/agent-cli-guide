#!/usr/bin/env node

import process from 'node:process';
import { agents } from '../src/data';
import {
  findAgent,
  findEntry,
  formatAgentHelp,
  formatEntry,
  formatRootHelp,
  parseCliArgs,
} from './core';
import { CODEX_TUI_VERIFIED_VERSION, codexTerminalRules } from './adapters/codex';
import {
  canRunMacOsTuiProxy,
  detectBinary,
  runMacOsLocalizedTui,
  runPassthrough,
} from './runtime';

const VERSION = '0.2.0';

async function main() {
  let options;
  try {
    options = parseCliArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 2;
    return;
  }

  if (options.action === 'version') {
    console.log(`agent-l10n ${VERSION}`);
    return;
  }

  if (options.action === 'list') {
    for (const agent of agents) {
      console.log(`${agent.binary.padEnd(10)} ${agent.name.padEnd(16)} ${agent.coverage === 'full' ? '全量目录' : '核心目录'}`);
    }
    return;
  }

  if (options.action === 'doctor') {
    console.log('AgentL10n 环境检查\n');
    for (const agent of agents) {
      const status = detectBinary(agent.binary);
      const icon = status.installed ? '✓' : '○';
      console.log(`${icon} ${agent.binary.padEnd(10)} ${status.version ?? status.error ?? '未知'}`);
    }
    console.log('\n说明：○ 只表示本机未检测到对应官方 CLI，不影响使用其他工具。');
    return;
  }

  const agent = findAgent(agents, options.agentId);

  if (options.action === 'help') {
    if (agent && options.mode === 'passthrough') {
      process.exitCode = await runPassthrough(agent.binary, options.forwardedArgs);
      return;
    }
    if (!agent) {
      console.log(formatRootHelp(agents));
      return;
    }
    console.log(formatAgentHelp(agent));
    return;
  }

  if (!agent) {
    console.error(`暂不支持 Agent：${options.agentId ?? '(空)'}`);
    console.error(`可用：${agents.map((item) => item.binary).join(', ')}`);
    process.exitCode = 2;
    return;
  }

  if (options.action === 'explain') {
    const entry = findEntry(agent, options.command);
    if (!entry) {
      console.error(`${agent.name} 中没有找到命令：${options.command ?? '(空)'}`);
      console.error(`提示：运行 agent-l10n ${agent.binary} --help 查看完整目录。`);
      process.exitCode = 2;
      return;
    }
    console.log(`${agent.name}\n${formatEntry(entry)}`);
    return;
  }

  if (process.env.AGENT_L10N_ACTIVE === '1') {
    console.error('检测到 AgentL10n 嵌套启动，已阻止递归。');
    process.exitCode = 2;
    return;
  }

  if (options.mode === 'annotate') {
    const status = detectBinary(agent.binary);
    if (!status.installed) {
      console.error(`找不到 ${agent.binary}：${status.error}`);
      console.error(`安装命令：${agent.install}`);
      process.exitCode = 127;
      return;
    }

    if (agent.id === 'codex' && options.forwardedArgs.length === 0 && canRunMacOsTuiProxy()) {
      const verified = status.version?.includes(CODEX_TUI_VERIFIED_VERSION);
      console.error(
        `[AgentL10n] Codex 中文 TUI 预览`
        + ` · ${verified ? `已验证 ${CODEX_TUI_VERIFIED_VERSION}` : `兼容匹配（基准 ${CODEX_TUI_VERIFIED_VERSION}）`}`,
      );
      console.error('[AgentL10n] 按 / 查看中文菜单；仅替换已知界面短语，--passthrough 可关闭。\n');
      process.exitCode = await runMacOsLocalizedTui(agent.binary, options.forwardedArgs, codexTerminalRules);
      return;
    }

    console.error(`[AgentL10n] ${agent.name} ${status.version ?? ''} · 安全透传模式`);
    console.error('[AgentL10n] 当前运行方式不支持 TUI 原位翻译，已自动降级为官方输出。\n');
  }

  process.exitCode = await runPassthrough(agent.binary, options.forwardedArgs);
}

void main();
