/**
 * ops-log hook：obsidian vault 文档操作后，追加一条记录到 vault `meta/log.md`。
 * - 命中工具：write / edit。
 * - 仅记录落在 vault 根下、非派生(meta/) 的 .md 操作；日志本身写 meta/log.md，不再触发记录。
 * - 日志行：`- YYYY-MM-DD HH:mm  [op] 相对路径  [一句话结果摘要]`。
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, isAbsolute,        } from "node:path";

interface ExecResult {
  stdout: string;
  stderr: string;
  code: number;
  killed: boolean;
}

interface ToolResultEvent {
  type: "tool_result";
  toolName: string;
  toolCallId: string;
  input: Record<string, unknown>;
  content: { type: "text"; text: string }[];
  isError?: boolean;
}

interface HookApi {
  exec(command: string, args: string[], options?: { timeout?: number }): Promise<ExecResult>;
  on(event: "tool_result", handler: (e: ToolResultEvent) => unknown): void;
}

let cachedVaultPath: string | undefined;

function nowStamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
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

function isInVault(abs: string, vault: string): boolean {
  if (!vault) return false;
  const v = vault.endsWith("/") ? vault : `${vault}/`;
  return abs === vault || abs.startsWith(v);
}

/** 从工具输入抽取目标路径与操作类型。 */
function target(input: Record<string, unknown>, toolName: string): { path: string; op: string } | undefined {
  if (toolName === "write" || toolName === "edit") {
    const p = typeof input.path === "string" ? input.path : undefined;
    return p ? { path: p, op: toolName } : undefined;
  }
  return undefined;
}

function summarize(content: { type: "text"; text: string }[]): string {
  const t = content
    .map(c => c.text)
    .join(" ")
    .trim()
    .replace(/\s+/g, " ");
  return t.length > 60 ? `${t.slice(0, 60)}…` : (t || "-");
}

export default function registerOpsLogHook(api: HookApi): void {
  api.on("tool_result", async (event) => {
    const t = target(event.input, event.toolName);
    if (!t || !t.path.toLowerCase().endsWith(".md")) return undefined;
    const vault = await vaultPath(api);
    if (!isInVault(t.path, vault)) return undefined;
    const rel = t.path.startsWith(vault)
      ? t.path.slice(vault.length).replace(/^[/\\]+/, "")
      : t.path;
    if (rel.startsWith("meta/") || rel.startsWith(".vault-meta/")) return undefined;

    // 只记录成功的修改
    if (event.isError) return undefined;

    const logPath = join(vault, "meta", "log.md");
    const line = `- ${nowStamp()}  [${t.op}] ${rel}  ${event.isError ? "失败" : summarize(event.content)}`;
    try {
      mkdirSync(join(vault, "meta"), { recursive: true });
      const existing = existsSync(logPath) ? readFileSync(logPath, "utf8") : "";
      // 保留已有日志再追加；空文件先写标题行
      const content = existing.length
        ? `${existing}${existing.endsWith("\n") ? "" : "\n"}${line}\n`
        : `# 操作日志\n\n${line}\n`;
      writeFileSync(logPath, content);
    } catch {
      // 日志写失败不影响操作
    }
    return undefined;
  });
}
