import type { Locale } from '../data/types';

/** 界面文案。新增语言时给每个 key 补对应 locale 即可。 */
const strings = {
  zh: {
    appTitle: 'Agent CLI 指南',
    appSubtitle: '边敲边学 · 中文对照',
    searchPlaceholder: '搜索命令或中文含义…',
    inputPlaceholder: '在这里敲命令试试（Tab 补全，↑↓ 历史）',
    annotationTitle: '实时解读',
    annotationEmpty: '开始输入后，这里会逐词解释你敲的命令',
    unknownFlag: '未收录的选项',
    unknownSlash: '未收录的斜杠命令',
    argToken: '参数',
    binaryToken: '可执行命令',
    unknownCommand: '没认出这条命令。试试左侧菜单、搜索，或输入',
    helpUsage: '用法',
    example: '示例',
    aliases: '别名',
    original: '原文',
    installLabel: '安装',
    homepageLabel: '官网',
    coverageCore: '收录核心命令，持续补充中',
    coverageFull: '全量收录',
    welcomeHint1: '输入命令（如',
    welcomeHint2: '）查看逐词中文解读；点击左侧菜单可直接插入命令。',
    switchHint: '这看起来是另一个工具的命令 —— 点击切换到',
    clearHint: '输入 clear 可清屏',
    searchNoResult: '没有匹配的命令',
    sidebarTitle: '命令菜单',
    langLabel: '中文',
    tryIt: '点击试一试',
    shortcutNote: '这是快捷键，在真实终端里直接按键使用',
    simExitNote: '已退出仿真会话，回到 shell。',
    simDisclaimer: '（仿真提示：本站不会真的调用模型或改动文件，仅演示真实 CLI 的行为）',
    simUnknownHint: '输入 /help 查看该工具的全部命令',
    simCompacted: '✂ 对话已压缩，摘要：',
    simPanelHint: '点击条目可切换（仿真）',
    simChatHint: '普通文本会作为消息发给 AI —— 下面是仿真回复',
    simSessionHint: '你正在仿真会话中：可输入斜杠命令，或敲 exit 退出',
    kindLabels: {
      flag: '选项',
      subcommand: '子命令',
      slash: '斜杠命令',
      shortcut: '快捷键',
      interactive: '输入技巧',
    } as Record<string, string>,
  },
};

export const locale: Locale = 'zh';

export const t = strings[locale];
