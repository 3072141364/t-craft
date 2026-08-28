import type { CustomToolFactory } from "@oh-my-pi/pi-coding-agent";

/**
 * obsidian 自定义工具：把 obsidian CLI(Obsidian Terminal 插件)暴露给模型。
 * 数组传参(pi.exec argv)无 shell 注入风险；需要 Obsidian 应用 + Terminal 插件在跑。
 * obsidian 单 vault 时自动解析活动 vault。
 */
const factory: CustomToolFactory = (pi) => ({
  name: "obsidian",
  label: "Obsidian",
  description:
    "Run an Obsidian CLI command against the vault. Vault ops: search / read / create / append / prepend, tags, links / backlinks / unresolved, properties (frontmatter) read·set·remove, task status, file / rename / move, outline, base:query, history / sync. Requires the Obsidian app + Terminal plugin running. obsidian auto-resolves the active vault when only one exists.",
  parameters: pi.zod.object({
    command: pi.zod
      .string()
      .describe(
        "Obsidian CLI subcommand, e.g. search, search:context, read, create, append, prepend, file, files, tags, tag, links, backlinks, unresolved, properties, property:read, property:set, task, tasks, outline, rename, move, folder, folders, base:query, history:read.",
      ),
    args: pi.zod
      .record(pi.zod.string())
      .optional()
      .describe(
        'CLI options as key=value, e.g. { query, path, file, limit, format, name, content }. "path" is exact; "file" resolves by name like wikilinks.',
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

    const result = await pi.exec("obsidian", argv, { signal });
    if (result.killed) throw new Error("obsidian call was cancelled");
    if (result.code !== 0) {
      throw new Error(result.stderr || result.stdout || `obsidian ${params.command} failed`);
    }
    return {
      content: [{ type: "text", text: (result.stdout || "").trim() || "(no output)" }],
    };
  },
});

export default factory;
