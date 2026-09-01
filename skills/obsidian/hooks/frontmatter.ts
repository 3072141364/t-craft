/**
 * frontmatter hook：对 obsidian vault 文档的**所有修改操作**校验并同步 YAML frontmatter。
 * - 命中：`write`（整篇）、`edit`（局部改）。
 * - 仅当目标落在 vault 根下（.md）时生效；非 vault 文档不拦。
 * - `write`：校验必填字段，并通过改写输入把 `updated` 刷新为今天。
 * - `edit`：读目标文档，确保 contains 必填 frontmatter；缺失则拦截。
 *
 * 说明：omp 未从 `@oh-my-pi/pi-coding-agent` 导出 hook 类型，这里用局部结构化类型对齐
 * HookAPI / ToolCallEvent / ToolCallEventResult，避免依赖未导出类型与 `any`。
 */

import { readFileSync, existsSync } from "node:fs";
import { join, isAbsolute,    } from "node:path";

interface ExecResult {
  stdout: string;
  stderr: string;
  code: number;
  killed: boolean;
}

interface ToolCallEvent {
  type: "tool_call";
  toolName: string;
  toolCallId: string;
  input: Record<string, unknown>;
}

interface ToolCallEventResult {
  block?: boolean;
  reason?: string;
  input?: Record<string, unknown>;
}

interface HookApi {
  exec(command: string, args: string[], options?: { timeout?: number }): Promise<ExecResult>;
  on(
    event: "tool_call",
    handler: (e: ToolCallEvent) => ToolCallEventResult | undefined | Promise<ToolCallEventResult | undefined>,
  ): void;
}

const REQUIRED_KEYS = ["title", "type", "created", "updated", "confidence", "status", "tags", "summary"] as const;
const PROJECT_DOC_TYPES: Record<string, true> = { prd: true, adr: true, test: true, review: true, progress: true };
const REQUIREMENT_TYPES: Record<string, true> = { prd: true };
// 知识类文档：area/(知识领域) 目录 + 实际知识类型（术语/wiki/技术）——必填 source+authority
const KNOWLEDGE_TYPES: Record<string, true> = { 术语: true, wiki: true, 技术: true };
const TASK_TYPES: Record<string, true> = { 任务: true };
const WRITE_TOOLS: Record<string, true> = { write: true, edit: true };

let cachedVaultPath: string | undefined;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

async function vaultPath(api: HookApi): Promise<string> {
  if (cachedVaultPath) return cachedVaultPath;
  try {
    const r = await api.exec("obsidian", ["vault", "info=path"], { timeout: 5000 });
    if (r.code === 0 && r.stdout.trim()) cachedVaultPath = r.stdout.trim();
  } catch {
    cachedVaultPath = undefined;
  }
  return cachedVaultPath ?? "";
}

function inVault(abs: string, vault: string): boolean {
  if (!vault) return false;
  const v = vault.endsWith("/") ? vault : `${vault}/`;
  return abs === vault || abs.startsWith(v);
}

function extractFrontmatter(content: string): string | undefined {
  if (!content.startsWith("---")) return undefined;
  const end = content.indexOf("\n---\n", 3);
  return end === -1 ? undefined : content.slice(4, end);
}

function hasYamlKey(block: string, key: string): boolean {
  return new RegExp(`^\\s${key}\\s*:`, "m").test(block) || new RegExp(`^${key}\\s*:`, "m").test(block);
}

/** 校验 frontmatter 必填。返回问题描述，null 通过。 */
function validateFrontmatter(content: string, relPath: string): string | undefined {
  // 派生数据（meta/log、ledgers、retrieval）无需 frontmatter
  if (relPath.startsWith("meta/") || relPath.startsWith(".vault-meta/")) return undefined;
  const block = extractFrontmatter(content);
  if (!block) return "缺少 YAML frontmatter（文档须以 `---` 开头）。";
  const missing = REQUIRED_KEYS.filter(k => !hasYamlKey(block, k));
  if (missing.length) return `frontmatter 缺少必填字段：${missing.join(", ")}。`;
  const isProjectDoc =
    relPath.startsWith("project/") || !!PROJECT_DOC_TYPES[(block.match(/^type\s*:\s*(\S+)/m)?.[1] ?? "").trim()];
  if (isProjectDoc && !hasYamlKey(block, "project")) return "项目文档须含 `project`（项目归属名）。";
  const type = (block.match(/^type\s*:\s*(\S+)/m)?.[1] ?? "").trim();
  if (REQUIREMENT_TYPES[type]) {
    const reqMissing = ["requester", "deadline"].filter(k => !hasYamlKey(block, k));
    if (reqMissing.length) return `需求文档缺必填：${reqMissing.join(", ")}。`;
  }
  // 任务文档(type 任务)：须 priority/owner/project/start/doneTime + tags 含 task
  if (TASK_TYPES[type]) {
    const taskMissing = ["priority", "owner", "project", "start", "doneTime"].filter(k => !hasYamlKey(block, k));
    if (taskMissing.length) return `任务文档缺必填：${taskMissing.join(", ")}。`;
    const tagsRaw = block.match(/^tags:\s*\[(.*)\]/m)?.[1] ?? block.match(/^tags:\s*\n((?:\s*-\s*.+)+)/m)?.[1] ?? "";
    if (!/task/.test(tagsRaw)) return "任务文档 tags 须包含 `task`。";
  }
  // 溯源：area/(知识领域) 或知识类型(术语/wiki/技术)须 authority+source；高置信度主张须 source
  const isKnowledge = relPath.startsWith("area/") || !!KNOWLEDGE_TYPES[type];
  if (isKnowledge) {
    const provMissing = ["authority", "source"].filter(k => !hasYamlKey(block, k));
    if (provMissing.length) return `${relPath.startsWith("area/") ? "领域知识" : "知识"}文档缺溯源字段：${provMissing.join(", ")}。`;
  }
  const conf = Number(block.match(/^confidence\s*:\s*(\d+)/m)?.[1] ?? 0);
  // 高置信度须有 source：仅知识/研究类文档(事实性主张)；任务/项目/需求不做此要求
  if (isKnowledge && conf >= 90 && !hasYamlKey(block, "source")) return "置信度≥90 的知识主张须含 `source`（来源）。";
  return undefined;
}

/** 把 content 的 frontmatter `updated` 刷新为今天；无则插入。返回新 content。 */
function refreshUpdated(content: string): string {
  const block = extractFrontmatter(content);
  if (!block) return content;
  const todayVal = today();
  const block2 = hasYamlKey(block, "updated") ? block.replace(/^(\s*updated\s*:\s*)(.+)$/m, `$1${todayVal}`) : `${block}\nupdated: ${todayVal}`;
  return content.replace(`---\n${block}\n---`, `---\n${block2}\n---`);
}

const WRITE_FULL = "write";

export default function registerFrontmatterHook(api: HookApi): void {
  api.on("tool_call", async (event) => {
    if (!WRITE_TOOLS[event.toolName]) return undefined;
    const input = event.input;

    // ---------- write：整篇写入，校验 + 刷新 updated ----------
    if (event.toolName === WRITE_FULL) {
      const path = typeof input.path === "string" ? input.path : undefined;
      const content = typeof input.content === "string" ? input.content : undefined;
      if (!path || !content) return undefined;
      if (!path.toLowerCase().endsWith(".md")) return undefined;
      const vault = await vaultPath(api);
      if (!inVault(path, vault)) return undefined;
      const rel = path.startsWith(vault) ? path.slice(vault.length).replace(/^[/\\]+/, "") : path;
      const problem = validateFrontmatter(content, rel);
      if (problem) return { block: true, reason: `obsidian 文档 frontmatter 校验未通过：${problem} 补齐后再写。` };
      // 刷新 updated（改写输入，工具执行读到的就是新内容）
      const refreshed = refreshUpdated(content);
      if (refreshed !== content) return { input: { ...input, content: refreshed } };
      return undefined;
    }

    // ---------- edit：局部改，读现有文档确保有 frontmatter ----------
    if (event.toolName === "edit") {
      const path = typeof input.path === "string" ? input.path : undefined;
      if (!path || !path.toLowerCase().endsWith(".md")) return undefined;
      const vault = await vaultPath(api);
      if (!inVault(path, vault)) return undefined;
      const exists = existsSync(path) && readFileSync(path, "utf8");
      if (typeof exists !== "string" || !exists) {
        return { block: true, reason: "obsidian 文档不存在或不可读，无法校验 frontmatter；请用 write/create 并补齐 frontmatter。" };
      }
      const rel = path.startsWith(vault) ? path.slice(vault.length).replace(/^[/\\]+/, "") : path;
      const problem = validateFrontmatter(exists, rel);
      if (problem) return { block: true, reason: `obsidian 文档 frontmatter 校验未通过：${problem} 先补齐再编辑。` };
      return undefined;
    }

    return undefined;
  });
}
