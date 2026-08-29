import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { AgentToolResult, CustomToolFactory } from "@oh-my-pi/pi-coding-agent";

/**
 * emoji 工具：单一 emoji 速查来源（不再分散在多个 reference md）。
 * - 数据源：同目录 `emoji-cheatsheet.md`（含 vault 专属 + 通用 + Gitmoji）。
 * - 用法：`section` 按类别返回整张表；`query` 按 emoji/含义搜索；都不给列出可用类别。
 * - emoji 只作标题/章节视觉对照，不进 Obsidian 标签。
 */

const SECTION_KEY: Record<string, string> = {
  vault: "type 图标(每篇文档标题行首)",
  weekly: "周报字段 emoji",
  section: "章节语义 emoji(正文章节标题可选)",
  person: "人名 emoji",
  status: "状态与标记",
  gitmoji: "提交类型(Gitmoji)",
  module: "模块与功能",
  object: "对象与类型",
  action: "动作与操作",
  feedback: "情绪与反馈",
  time: "时间与进度",
  security: "安全与警告",
  platform: "平台与环境",
  decoration: "装饰与分隔",
  gesture: "常见手势",
};

interface Section {
  heading: string;
  body: string;
}

function readSections(): Section[] {
  try {
    // 数据与工具同目录（tools/emoji/emoji-cheatsheet.md），工具拥有，不依赖技能参考文件。
    const text = readFileSync(fileURLToPath(new URL("./emoji-cheatsheet.md", import.meta.url)), "utf8");
    const sections: Section[] = [];
    let current: Section | undefined;
    for (const line of text.split("\n")) {
      const m = line.match(/^## (.+)$/);
      if (m) {
        if (current) sections.push(current);
        current = { heading: m[1].trim(), body: "" };
      } else if (current) {
        current.body += `${line}\n`;
      }
    }
    if (current) sections.push(current);
    return sections;
  } catch {
    return [];
  }
}

function matchSection(sections: Section[], key: string): Section | undefined {
  const target = SECTION_KEY[key.trim().toLowerCase()];
  return sections.find(s => (target ? s.heading === target : s.heading.toLowerCase().includes(key.trim().toLowerCase())));
}

const factory: CustomToolFactory = (pi) => ({
  name: "ob-emoji",
  label: "Emoji 速查",
  strict: true,
  loadMode: "essential",
  description:
    "Single emoji lookup source for t-craft. Returns the emoji table for a category (vault card-type icon, weekly fields, section/person, status, gitmoji commit type, module/object/action/feedback/time/security, platform/decor/gesture) or searches by emoji/meaning. Use for any emoji convention; emoji are visual markers only — never in Obsidian tags (tags exclude emoji).",
  parameters: pi.zod.object({
    section: pi.zod
      .string()
      .optional()
      .describe(
        'Category, e.g. "vault", "weekly", "gitmoji", "status", "module", "security", or the full section name. Omit with query to search.',
      ),
    query: pi.zod.string().optional().describe("Search text (emoji or meaning keyword) to find matching entries."),
  }),

  async execute(_toolCallId, params, _onUpdate, _ctx, signal) {
    if (signal?.aborted) throw new Error("emoji cancelled");
    const sections = readSections();
    if (sections.length === 0) {
      return { content: [{ type: "text", text: "emoji 速查表读取失败（同目录 emoji-cheatsheet.md 缺失）。" }], isError: true };
    }

    // 查询
    const query = (params.query ?? "").trim();
    if (query) {
      const hits = sections.flatMap(s =>
        s.body
          .split("\n")
          .filter(l => l.trim() && (l.toLowerCase().includes(query.toLowerCase()) || l.includes(query)))
          .map(l => l.trim()),
      );
      const unique = Array.from(new Set(hits)).slice(0, 30);
      return {
        content: [{ type: "text", text: unique.length ? `匹配 "${query}"：\n${unique.join("\n")}` : `未找到与 "${query}" 相关的 emoji。` }],
        useless: unique.length === 0,
      };
    }

    // 按类别
    const section = (params.section ?? "").trim();
    if (section) {
      const hit = matchSection(sections, section);
      if (!hit) {
        return {
          content: [{ type: "text", text: `未找到类别 "${section}"。可用：${Object.keys(SECTION_KEY).join(" / ")}` }],
          isError: true,
        };
      }
      const lines = hit.body
        .split("\n")
        .map(l => l.replace(/^[ \t]+/, ""))
        .filter(l => l.trim());
      return { content: [{ type: "text", text: `## ${hit.heading}\n${lines.join("\n")}` }] };
    }

    // 都无 → 列可用类别
    return {
      content: [{ type: "text", text: `可用 emoji 类别：\n${Object.entries(SECTION_KEY).map(([k, v]) => `- ${k} → ${v}`).join("\n")}` }],
    };
  },
});

export default factory;
