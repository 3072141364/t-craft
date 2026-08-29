import { readdirSync, readFileSync, statSync } from "node:fs";
import type { Dirent } from "node:fs";
import { join, resolve, relative } from "node:path";
import { homedir } from "node:os";
import type { AgentToolResult, CustomToolFactory } from "@oh-my-pi/pi-coding-agent";

/**
 * ob-query：对 vault 做本地确定性 BM25 检索。
 * - 索引对象：vault 下所有 .md（排除 .obsidian/ 等隐藏目录），可按 folder 过滤。
 * - 分词：CJK → bigram；连续 [a-z0-9] → 词（覆盖中文/英文混合笔记）。
 * - BM25(k1=1.5, b=0.75)，只读、离线、有界。空库返回诚实提示而非伪造结果。
 * - 检索输出是"待读证据"，不是答案本身；模型综合须注明出处，禁止编造。
 */

const MAX_FILES = 5000;
const MAX_FILE_BYTES = 1_000_000;
const DEFAULT_TOP = 5;
const MAX_TOP = 20;
const SNIPPET_CHARS = 120;

interface Doc {
  path: string;
  text: string;
  tokens: string[];
}

interface Bm25Index {
  n: number;
  df: Map<string, number>;
  dl: number[];
  tfs: Map<string, number>[];
  avgdl: number;
  k1: number;
  b: number;
}

interface DocMeta {
  summary?: string;
  confidence?: string;
  status?: string;
  type?: string;
  project?: string;
  tags?: string[];
}

interface TopHit {
  path: string;
  score: number;
  snippet: string;
  meta: DocMeta;
}

function tokenize(text: string): string[] {
  const lower = text.toLowerCase();
  const tokens: string[] = [];
  const wordRe = /[a-z0-9]+/g;
  const cjkRe = /[\u4e00-\u9fff]+/g;
  let m: RegExpExecArray | null;
  wordRe.lastIndex = 0;
  while ((m = wordRe.exec(lower))) tokens.push(m[0]);
  cjkRe.lastIndex = 0;
  while ((m = cjkRe.exec(lower))) {
    const run = m[0];
    if (run.length === 1) tokens.push(run);
    else for (let i = 0; i < run.length - 1; i++) tokens.push(run.slice(i, i + 2));
  }
  return tokens;
}

function listMdFiles(vaultRoot: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    if (out.length >= MAX_FILES) return;
    let entries: Dirent[];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (out.length >= MAX_FILES) return;
      if (e.name.startsWith(".") || e.name === "node_modules") continue;
      if (e.isDirectory()) {
        walk(join(dir, e.name));
      } else if (e.isFile() && e.name.toLowerCase().endsWith(".md")) {
        out.push(join(dir, e.name));
      }
    }
  };
  walk(vaultRoot);
  return out;
}

function loadDocs(vaultRoot: string, folder?: string): Doc[] {
  const docs: Doc[] = [];
  for (const abs of listMdFiles(vaultRoot)) {
    try {
      const st = statSync(abs);
      if (st.size > MAX_FILE_BYTES) continue;
      const rel = relative(vaultRoot, abs).split(/[\\/]/).join("/");
      if (folder && !rel.startsWith(`${folder.replace(/\/$/, "")}/`)) continue;
      const text = readFileSync(abs, "utf8");
      docs.push({ path: rel, text, tokens: tokenize(text) });
    } catch {
      // 跳过不可读文件
    }
  }
  return docs;
}

function buildIndex(docs: Doc[]): Bm25Index {
  const n = docs.length;
  const df = new Map<string, number>();
  const dl: number[] = [];
  const tfs: Map<string, number>[] = [];
  let sumdl = 0;
  for (const d of docs) {
    const tf = new Map<string, number>();
    for (const t of d.tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
    dl.push(d.tokens.length);
    sumdl += d.tokens.length;
    tfs.push(tf);
  }
  return { n, df, dl, tfs, avgdl: n ? sumdl / n : 0, k1: 1.5, b: 0.75 };
}

function scoreQuery(index: Bm25Index, qTokens: string[]): number[] {
  const scores = new Array<number>(index.n).fill(0);
  for (const q of new Set(qTokens)) {
    const nq = index.df.get(q) ?? 0;
    if (nq === 0) continue;
    const idf = Math.log(1 + (index.n - nq + 0.5) / (nq + 0.5));
    for (let i = 0; i < index.n; i++) {
      const tf = index.tfs[i].get(q) ?? 0;
      if (tf === 0) continue;
      const denom = tf + index.k1 * (1 - index.b + (index.b * index.dl[i]) / (index.avgdl || 1));
      scores[i] += (idf * tf * (index.k1 + 1)) / denom;
    }
  }
  return scores;
}

function extractMeta(text: string): DocMeta {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const block = m[1];
  const get = (k: string) => block.match(new RegExp(`^${k}\\s*:\\s*(.+)$`, "m"))?.[1].trim();
  const tagsStr = block.match(/^tags:\s*\n((?:\s*-\s*.+)+)/m)?.[1];
  return {
    summary: get("summary"),
    confidence: get("confidence"),
    status: get("status"),
    type: get("type"),
    project: get("project"),
    tags: tagsStr ? tagsStr.split("\n").map(s => s.replace(/^\s*-\s*/, "").trim()).filter(Boolean) : [],
  };
}

function snippetFor(text: string, qTokens: string[]): string {
  const lower = text.toLowerCase();
  let best = -1;
  for (const t of qTokens) {
    if (t.length < 2) continue;
    const at = lower.indexOf(t);
    if (at >= 0 && (best === -1 || at < best)) best = at;
  }
  const start = best >= 0 ? Math.max(0, best - Math.floor(SNIPPET_CHARS / 3)) : 0;
  const piece = text.slice(start, start + SNIPPET_CHARS).replace(/\s+/g, " ").trim();
  if (!piece) return "(空)";
  return `${start > 0 ? "…" : ""}${piece}${start + SNIPPET_CHARS < text.length ? "…" : ""}`;
}

async function resolveVault(pi: Parameters<CustomToolFactory>[0], vault?: string): Promise<string> {
  if (vault) return resolve(vault);
  const env = process.env.OBSIDIAN_VAULT_PATH || process.env.OBSIDIAN_VAULT;
  if (env) return resolve(env);
  try {
    const r = await pi.exec("obsidian", ["vault", "info=path"], { timeout: 5000 });
    if (r.code === 0 && r.stdout.trim()) return resolve(r.stdout.trim());
  } catch {
    // 回退默认路径
  }
  return resolve(join(homedir(), "文档", "default"));
}

const factory: CustomToolFactory = (pi) => ({
  name: "ob-query",
  label: "Vault 检索",
  strict: true,
  loadMode: "essential",
  description:
    "Local deterministic BM25 search over the Obsidian vault's markdown (project / research / weekly / archive / misc). Returns ranked file paths, scores, and context snippets. Retrieval output is evidence for the model to read and synthesize — it is not an answer by itself. Use to find where a concept / decision / requirement / note is written across the vault. Ground it: cite the path, never invent a quote or locator.",
  parameters: pi.zod.object({
    query: pi.zod.string().describe("Search query (Chinese or English keywords)."),
    vault: pi.zod.string().optional().describe("Absolute vault path. Default: active Obsidian vault (or ~/文档/default)."),
    folder: pi.zod
      .string()
      .optional()
      .describe('Restrict to a vault subfolder, e.g. "project", "research", "weekly", "archive", "misc".'),
    top: pi.zod.number().optional().describe(`Max results (default ${DEFAULT_TOP}, max ${MAX_TOP}).`),
  }),

  async execute(_toolCallId, params, _onUpdate, _ctx, signal) {
    if (signal?.aborted) throw new Error("ob-query cancelled");
    const query = (params.query ?? "").trim();
    if (!query) return { content: [{ type: "text", text: "query is required." }], isError: true };
    const top = Math.min(Math.max(params.top ?? DEFAULT_TOP, 1), MAX_TOP);

    const vaultRoot = await resolveVault(pi, params.vault);
    const docs = loadDocs(vaultRoot, params.folder);
    if (docs.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No markdown documents indexed under ${params.folder ? `folder "${params.folder}" in ` : ""}vault "${vaultRoot}". Add notes first.`,
          },
        ],
        useless: true,
      };
    }

    const qTokens = tokenize(query);
    const index = buildIndex(docs);
    const scores = scoreQuery(index, qTokens);
    const hits: TopHit[] = docs
      .map((d, i) => {
        const meta = extractMeta(d.text);
        return { path: d.path, score: scores[i], snippet: meta.summary || snippetFor(d.text, qTokens), meta };
      })
      .filter(h => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, top);

    if (hits.length === 0) {
      return { content: [{ type: "text", text: `No matches for "${query}" in vault "${vaultRoot}".` }], useless: true };
    }

    const lines = hits.map((h, i) => {
      const metaLine = [
        h.meta.type && `type:${h.meta.type}`,
        h.meta.confidence && `置信:${h.meta.confidence}`,
        h.meta.status && `状态:${h.meta.status}`,
        h.meta.project && `项目:${h.meta.project}`,
        h.meta.tags?.length && `#${h.meta.tags.join(" #")}`,
      ]
        .filter(Boolean)
        .join(" · ");
      return `${i + 1}. ${h.path}  (score ${h.score.toFixed(2)})\n   ${metaLine ? `[${metaLine}]\n   ` : ""}${h.snippet}`;
    });
    return { content: [{ type: "text", text: `检索 "${query}"（${hits.length} 条）:\n\n${lines.join("\n\n")}` }] };
  },
});

export default factory;
