import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import process from 'node:process';
import type { TerminalTranslationRule } from './terminal-localizer';
import { StreamingTerminalLocalizer } from './terminal-localizer';

export interface BinaryStatus {
  installed: boolean;
  version?: string;
  error?: string;
}

export function detectBinary(binary: string): BinaryStatus {
  const result = spawnSync(binary, ['--version'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 8_000,
  });

  if (result.error) {
    const code = (result.error as NodeJS.ErrnoException).code;
    return {
      installed: false,
      error: code === 'ENOENT' ? '未安装或不在 PATH 中' : result.error.message,
    };
  }

  const version = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim().split('\n')[0];
  return {
    installed: result.status === 0,
    version: version || undefined,
    error: result.status === 0 ? undefined : `退出码 ${result.status}`,
  };
}

export function runPassthrough(binary: string, args: string[]): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn(binary, args, {
      stdio: 'inherit',
      env: {
        ...process.env,
        AGENT_L10N_ACTIVE: '1',
      },
    });

    child.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') {
        console.error(`找不到官方 CLI：${binary}`);
        console.error(`请先安装它，或确认 ${binary} 已加入 PATH。`);
      } else {
        console.error(`启动 ${binary} 失败：${error.message}`);
      }
      resolve(127);
    });

    child.on('exit', (code, signal) => {
      if (signal) {
        resolve(128);
      } else {
        resolve(code ?? 0);
      }
    });

    forwardSignals(child);
  });
}

function forwardSignals(child: ChildProcess): () => void {
  const forwardSignal = (signal: NodeJS.Signals) => {
    if (!child.killed) child.kill(signal);
  };
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGHUP'];
  for (const signal of signals) process.on(signal, forwardSignal);

  const cleanup = () => {
    for (const signal of signals) process.off(signal, forwardSignal);
  };
  child.once('error', cleanup);
  child.once('exit', cleanup);
  return cleanup;
}

export function canRunMacOsTuiProxy(): boolean {
  return (
    process.platform === 'darwin'
    && Boolean(process.stdin.isTTY)
    && Boolean(process.stdout.isTTY)
    && existsSync('/usr/bin/script')
  );
}

/**
 * macOS 自带的 script(1) 为官方 CLI 创建真正的 PTY。父进程只读取其输出，
 * 对 adapter 已验证的固定短语做等宽替换；键盘输入仍直接交给官方 CLI。
 */
export function runMacOsLocalizedTui(
  binary: string,
  args: string[],
  rules: TerminalTranslationRule[],
): Promise<number> {
  return new Promise((resolve) => {
    const localizer = new StreamingTerminalLocalizer(rules);
    const child = spawn('/usr/bin/script', ['-q', '/dev/null', binary, ...args], {
      stdio: ['inherit', 'pipe', 'inherit'],
      env: {
        ...process.env,
        AGENT_L10N_ACTIVE: '1',
      },
    });

    child.stdout?.on('data', (chunk: Buffer) => {
      const output = localizer.push(chunk);
      if (output) process.stdout.write(output);
    });

    child.on('error', async (error: NodeJS.ErrnoException) => {
      const tail = localizer.flush();
      if (tail) process.stdout.write(tail);
      console.error(`启动中文 TUI 代理失败：${error.message}`);
      console.error('已自动降级为官方 CLI 直接透传。');
      resolve(await runPassthrough(binary, args));
    });

    child.on('exit', (code, signal) => {
      const tail = localizer.flush();
      if (tail) process.stdout.write(tail);
      resolve(signal ? 128 : (code ?? 0));
    });

    forwardSignals(child);
  });
}
