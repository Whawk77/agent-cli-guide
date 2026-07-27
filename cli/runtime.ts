import { spawn, spawnSync } from 'node:child_process';
import process from 'node:process';

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

    const forwardSignal = (signal: NodeJS.Signals) => {
      if (!child.killed) child.kill(signal);
    };
    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGHUP'];
    for (const signal of signals) process.on(signal, forwardSignal);

    child.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') {
        console.error(`找不到官方 CLI：${binary}`);
        console.error(`请先安装它，或确认 ${binary} 已加入 PATH。`);
      } else {
        console.error(`启动 ${binary} 失败：${error.message}`);
      }
      cleanup();
      resolve(127);
    });

    child.on('exit', (code, signal) => {
      cleanup();
      if (signal) {
        resolve(128);
      } else {
        resolve(code ?? 0);
      }
    });

    function cleanup() {
      for (const signal of signals) process.off(signal, forwardSignal);
    }
  });
}

