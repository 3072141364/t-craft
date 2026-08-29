import type { AgentToolResult, CustomToolFactory } from "@oh-my-pi/pi-coding-agent";

/**
 * obsidian 自定义工具：把 obsidian CLI(Obsidian Terminal 插件)暴露给模型。
 * 数组传参(pi.exec argv)无 shell 注入风险；需要 Obsidian 应用 + Terminal 插件在跑。
 * obsidian 单 vault 时自动解析活动 vault。
 *
 * 语义约定：
 * - CLI 对"文件不存在/命令未知/属性缺失"等错误一律 exit 0 并把 `Error:` 写到 stdout（stderr 恒空），
 *   故不能靠 exit code / stderr 判错。这里按 stdout 内容分类：
 *   `Error:` 前缀 → isError（非抛错的失败，模型能感知）；环境级(CLI 未启用/连不上 vault) → throw 可操作错误。
 * - "No matches found" 等零结果 → useless（压缩可安全 elide）。
 * - 高风险命令(破坏性/不可逆/任意执行/状态变更) → approval 走**用户确认**(Approve/Deny)；
 *   读命令/常规写命令按 tier 放行。
 */
const MAX_OUTPUT_CHARS = 100_000;
const TIMEOUT_MS = 30_000;

/** 只读/查询/列举/打开类命令：tier=read（各审批模式通常直接放行）。 */
const READ_COMMANDS: Record<string, true> = {
  read: true,
  files: true,
  file: true,
  folder: true,
  folders: true,
  outline: true,
  wordcount: true,
  vault: true,
  vaults: true,
  version: true,
  recents: true,
  "daily:read": true,
  "daily:path": true,
  "random:read": true,
  tag: true,
  tags: true,
  aliases: true,
  properties: true,
  "property:read": true,
  search: true,
  "search:context": true,
  "search:open": true,
  links: true,
  backlinks: true,
  unresolved: true,
  orphans: true,
  deadends: true,
  bases: true,
  "base:query": true,
  "base:views": true,
  bookmarks: true,
  templates: true,
  "template:read": true,
  history: true,
  "history:list": true,
  "history:open": true,
  "history:read": true,
  diff: true,
  "sync:status": true,
  "sync:history": true,
  "sync:read": true,
  "sync:deleted": true,
  plugins: true,
  "plugins:enabled": true,
  plugin: true,
  themes: true,
  theme: true,
  snippets: true,
  "snippets:enabled": true,
  commands: true,
  hotkey: true,
  hotkeys: true,
  help: true,
  workspace: true,
  tabs: true,
  open: true,
  "tab:open": true,
  random: true,
  daily: true,
  "dev:console": true,
  "dev:css": true,
  "dev:dom": true,
  "dev:errors": true,
};

/** 高风险命令：破坏性/不可逆/任意执行/状态变更 → 需要用户确认。 */
const HIGH_RISK_COMMANDS: Record<string, true> = {
  delete: true,
  move: true,
  rename: true,
  "property:remove": true,
  "sync:restore": true,
  "history:restore": true,
  command: true,
  reload: true,
  restart: true,
  sync: true,
  "plugins:restrict": true,
  "plugin:install": true,
  "plugin:uninstall": true,
  "plugin:enable": true,
  "plugin:disable": true,
  "plugin:reload": true,
  "theme:install": true,
  "theme:set": true,
  "theme:uninstall": true,
  "snippet:enable": true,
  "snippet:disable": true,
  eval: true,
  "dev:debug": true,
  "dev:mobile": true,
  "dev:cdp": true,
};

/** 环境级失败：CLI 未启用 / 连不上 vault。这些不是命令本身的错误，应抛可操作异常。 */
function isEnvironmentFailure(output: string): string | undefined {
  const o = output.toLowerCase();
  if (o.includes("command line interface is not enabled")) {
    return "Obsidian CLI is not enabled. Enable it in Obsidian: Settings > General > Advanced > \"Command line interface\".";
  }
  if (o.includes("failed to connect") || o.includes("could not connect") || o.includes("vault not found")) {
    return `Obsidian connection/vault error: ${output.slice(0, 200)}`;
  }
  return undefined;
}

/** 把一条 obsidian 调用的 stdout 归一为稳定的工具结果(带截断/错误/零结果标注)。 */
function classifyOutput(output: string): AgentToolResult<unknown> {
  let out = (output || "").trim();

  const envFailure = isEnvironmentFailure(out);
  if (envFailure) throw new Error(envFailure);

  // CLI 把错误写到 stdout 且 exit 0 → 标记为工具错误，模型能感知并纠偏。
  if (/^\s*error[:\s]/i.test(out)) {
    return { content: [{ type: "text", text: out }], isError: true };
  }

  if (/^no (matches|files|results|links|backlinks|tags|tasks|notes|items)\b|^no results found/i.test(out)) {
    return { content: [{ type: "text", text: out }], useless: true };
  }

  if (out.length > MAX_OUTPUT_CHARS) {
    const truncated = out.slice(0, MAX_OUTPUT_CHARS);
    out = `${truncated}\n…\n(output truncated; narrow with limit= or format=json)`;
  }

  return { content: [{ type: "text", text: out || "(no output)" }] };
}

function describeCommand(args: unknown): string {
  if (!args || typeof args !== "object" || !("command" in args)) return "";
  const command = args.command;
  if (typeof command !== "string") return "";
  if (!("args" in args) || typeof args.args !== "object" || args.args === null) {
    return `obsidian ${command}`;
  }
  const opts = Object.entries(args.args);
  return `obsidian ${command}${opts.length ? ` ${opts.map(([k, v]) => `${k}=${String(v)}`).join(" ")}` : ""}`;
}

const factory: CustomToolFactory = (pi) => ({
  name: "ob-cli",
  label: "Obsidian",
  strict: true,
  loadMode: "essential",
  approval: (args) => {
    const command =
      args && typeof args === "object" && "command" in args && typeof args.command === "string" ? args.command : "";
    if (HIGH_RISK_COMMANDS[command]) {
      return { tier: "exec", policy: "prompt", reason: `obsidian ${command} is high-risk and requires user approval` };
    }
    return READ_COMMANDS[command] ? { tier: "read" } : { tier: "write" };
  },
  formatApprovalDetails: describeCommand,
  description:
    "Run an Obsidian CLI command against the vault. Requires the Obsidian app + Terminal plugin running (CLI enabled). Use `help <command>` to see a subcommand's options. obsidian auto-resolves the active vault when only one exists. Common arg options: path (exact folder/note.md), file (resolve by name like wikilinks), limit, format=json|tsv|csv|text, total, verbose. Subcommands:\n- Read/query: read, files, file, folder, folders, outline, wordcount, vault, vaults, version, recents, daily:read, daily:path, random:read, tag, tags, aliases, properties, property:read\n- Search/link-graph: search, search:context, search:open, links, backlinks, unresolved, orphans, deadends\n- Create/edit: create, append, prepend, delete, rename, move, property:set, property:remove, task, tasks, daily, daily:append, daily:prepend, template:insert\n- Bases: bases, base:create, base:query, base:views\n- Bookmarks/templates: bookmark, bookmarks, templates, template:read\n- Open/UI: open, tab:open, tabs, random, workspace\n- Versions/sync: history, history:list, history:open, history:read, history:restore, diff, sync, sync:status, sync:open, sync:history, sync:read, sync:restore, sync:deleted\n- Plugins/themes/snippets: plugins, plugins:enabled, plugin, plugin:install, plugin:enable, plugin:disable, plugin:reload, plugin:uninstall, plugins:restrict, themes, theme, theme:install, theme:set, theme:uninstall, snippets, snippets:enabled, snippet:enable, snippet:disable\n- Commands/hotkeys: commands, command, hotkey, hotkeys\n- Maintenance: reload, restart\n- Developer (dev:*): dev:cdp, dev:console, dev:css, dev:debug, dev:dom, dev:errors, dev:mobile, dev:screenshot, devtools, eval",
  parameters: pi.zod.object({
    command: pi.zod
      .string()
      .describe(
        "Obsidian CLI subcommand (see tool description for the full list). Use `help <command>` for its options.",
      ),
    args: pi.zod
      .record(pi.zod.string(), pi.zod.string())
      .optional()
      .describe(
        'CLI options as key=value, e.g. { query, path, file, limit, format, name, content }. "path" is exact; "file" resolves by name like wikilinks. Quote values with spaces: name="My Note". Use \\n/\\t in content values.',
      ),
    vault: pi.zod
      .string()
      .optional()
      .describe("Vault name to target (only if multiple vaults; default = active)"),
  }),

  async execute(_toolCallId, params, _onUpdate, _ctx, signal) {
    const argv: string[] = [];
    if (params.vault) argv.push(`vault=${params.vault}`);
    argv.push(params.command);
    for (const [k, v] of Object.entries(params.args ?? {})) argv.push(`${k}=${v}`);

    let result;
    try {
      result = await pi.exec("obsidian", argv, { signal, timeout: TIMEOUT_MS });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/timeout|timed out/i.test(msg)) {
        throw new Error(`obsidian ${params.command} timed out after ${TIMEOUT_MS / 1000}s`);
      }
      throw new Error(`obsidian process failed: ${msg}`);
    }
    if (result.killed) throw new Error("obsidian call was cancelled");
    if (result.code !== 0) {
      throw new Error(result.stderr || result.stdout || `obsidian ${params.command} failed`);
    }
    return classifyOutput(result.stdout);
  },
});

export default factory;
