import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * traft 扩展入口：注册 obsidian 自定义工具(把 obsidian CLI 暴露给模型)。
 * 数组传参(execFile argv),无 shell 注入风险；需要 Obsidian 应用 + Terminal 插件在跑。
 */
export default function traftExtension(pi: ExtensionAPI) {
  const z = pi.zod;

  pi.registerTool({
    name: "obsidian",
    label: "Obsidian",
    description:
      "Run an Obsidian CLI command against the vault. Vault ops: search / read / create / append / prepend, tags, links / backlinks / unresolved, properties (frontmatter) read·set·remove, task status, file / rename / move, outline, base:query, history / sync. Requires the Obsidian app + Terminal plugin running. obsidian auto-resolves the active vault when only one exists.",
    parameters: z.object({
      command: z
        .string()
        .describe(
          "Obsidian CLI subcommand, e.g. search, search:context, read, create, append, prepend, file, files, tags, tag, links, backlinks, unresolved, properties, property:read, property:set, task, tasks, outline, rename, move, folder, folders, base:query, history:read.",
        ),
      args: z
        .record(z.string())
        .optional()
        .describe(
          'CLI options as key=value, e.g. { query, path, file, limit, format, name, content }. "path" is exact; "file" resolves by name like wikilinks.',
        ),
      vault: z
        .string()
        .optional()
        .describe("Vault name to target (only if multiple vaults; default = active)"),
    }),

    async execute(_toolCallId, params, signal, _onUpdate, _ctx) {
      const argv: string[] = [];
      if (params.vault) argv.push(`vault=${params.vault}`);
      argv.push(params.command);
      for (const [k, v] of Object.entries(params.args ?? {})) argv.push(`${k}=${v}`);

      try {
        const r = await execFileAsync("obsidian", argv, { signal });
        return {
          content: [{ type: "text", text: (r.stdout || "").trim() || "(no output)" }],
        };
      } catch (e: unknown) {
        const err = e as { stderr?: string; killed?: boolean; message?: string };
        if (err?.stderr) throw new Error(err.stderr);
        if (err?.killed) throw new Error("obsidian call was cancelled");
        throw new Error(err?.message || "obsidian failed");
      }
    },
  });
}
