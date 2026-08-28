import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";

/**
 * traft 插件扩展入口（no-op）。
 * 存在意义：让插件以"扩展包"形式加载，触发 omp-plugins 发现 tools/ 等兄弟目录
 * （obsidian 自定义工具在 tools/obsidian/index.ts）。不在此注册工具
 * （扩展 registerTool 用 typebox TSchema，与 CustomToolFactory 不同）。
 */
export default function traftExtension(_pi: ExtensionAPI) {
  // 无需注册任何东西；工具见 tools/obsidian/index.ts
}
