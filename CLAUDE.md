# t-craft 开发约定

本仓库是个人工程技能 plugin 集。一个 marketplace(`t-craft`)挂多个分类 plugin。在此仓库内开发/维护 skill 时遵循以下约定。

## 核心原则:通用方法论 + 项目约定发现

每个 skill **只含通用方法论**,跨项目复用。项目特定约定(CHANGELOG 路径、版本真源、分支模型、make 命令、规范文档位置等)**不硬编码**,而是让 skill 在运行时按三层发现:

1. **约定优于配置**:探测标准位置(根目录 `CHANGELOG.md`、`version.json` / `pyproject.toml` / `package.json`、`docs/development.md` 等)。
2. **读项目 CLAUDE.md**:从中提取项目规则;若引用了规范文档,一并读。
3. **可选描述文件**:仅当约定偏离默认时,读 `.claude/skills-config.json` 之类的显式覆盖。

发现到就用,没发现用默认并提示用户。

## 分类 = 多 plugin

每个 plugin 有自己的 source 目录(`skills/<plugin>/`),skill 放在对应 plugin 目录下;**分类靠 `.claude-plugin/marketplace.json` 的 `plugins[]`**:每个 plugin 是一个分类,`source` 指向 `skills/<plugin>`,`skills` 数组列出所属 skill(路径相对 source)。命令放 plugin 的 `commands/`(自动发现)。参照 anthropics/skills。

当前分类:

- `basic-skills`:基础工程约定(changelog / git-flow / emoji-helper / brainstorm)
- `code-skills`:代码相关(code-intelligence / karpathy-guidelines / code-format / make-shortcut / eval-report)+ 代码审查命令 `/code-review`(commands/)
- `obsidian-skills`:Obsidian 知识库(obsidian-kb / vault-query)

> `brainstorm` / `eval-report` / `vault-query` 是 **TODO 占位**(未实现),见各 SKILL.md;研发流程预设提示词见 `docs/workflow-prompts.md`。

## 目录与命名

- `skills/<plugin>/<name>/SKILL.md`:按 plugin 分目录。
- 命令:`skills/<plugin>/commands/<cmd>.md`(plugin 的 `commands/` 自动发现)。
- 目录名、skill `name`:kebab-case,小写连字符。
- 资源放该 skill 自己的 `references/`;命令的参考放 plugin 的 `references/`。

## frontmatter

```markdown
---
name: my-skill
description: 做什么 + 何时触发。适度 pushy,即使用户没说 skill 名,意图匹配就触发。
---
```

只有 `name` 和 `description` 必填。`description` 是唯一触发机制,要把「做什么」和「什么场景用」都写清。

## 新增 skill 流程

1. `cp -r template skills/<plugin>/<name>`,改 `SKILL.md`。
2. 在 `.claude-plugin/marketplace.json` 里找到该 skill 所属分类的 plugin,在其 `skills` 数组追加 `"./<name>"`(相对 plugin source)。若新分类,新增一个 plugin 条目(`source: "./skills/<plugin>"`)。
3. 若是命令(非 skill),放 `skills/<plugin>/commands/<cmd>.md`(自动发现,不列进 `skills[]`)。
4. 正文遵循「通用方法 + 项目约定发现」。
5. 重装生效:`/plugin update` 或重启 Claude Code。

## 写作风格

- 解释「为什么」而不是堆 MUST/NEVER;让模型理解意图而非死记规则。
- 以项目文件实际内容为准,不凭记忆读项目约定。
- 写入类操作(改 CHANGELOG、动版本)前展示草稿给用户确认。
