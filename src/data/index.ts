import type { AgentDef } from './types';
import { claudeCode } from './claude-code';
import { codex } from './codex';
import { gemini } from './gemini';
import { grok } from './grok';
import { pi } from './pi';
import { aider } from './aider';
import { cursor } from './cursor';

export const agents: AgentDef[] = [claudeCode, codex, gemini, grok, pi, aider, cursor];
