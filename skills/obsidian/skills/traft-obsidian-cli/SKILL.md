---
name: traft-obsidian-cli
description: Obsidian CLI 命令行技能——在需要与 Obsidian 应用交互（打开文件、切换主题、调试插件、同步控制）时激活；纯文件读写走文件系统工具更快。何时触发:"打开这个文件到 Obsidian"、"换主题"、"重载插件"、"同步状态"、"恢复文件版本"。
---

# traft-obsidian-cli 技能

通过 `obsidian <command> [参数=值] [标志]` 与 Obsidian 应用交互，需 Obsidian 应用在运行。

**职责边界**：
- 负责：与 Obsidian 应用交互的操作——打开文件、切换主题、插件/片段控制、同步控制、版本恢复、JS 调试、截图、vault 信息。
- 不负责：纯文件读写（读/写内容、全文搜索、列文件、查 frontmatter）——走文件系统工具（`read`/`write`/`grep`/`glob`）更快且不受 Obsidian 进程状态影响。

## 1. 触发条件（TRIGGER）

| 场景 | 触发信号(关键词/典型句式) | 是否触发 |
| --- | --- | --- |
| 打开文件到 Obsidian | "把这个文件在 Obsidian 打开"、"打开 xxx 笔记" | 触发 |
| 应用控制 | "换个主题"、"重载/禁用插件"、"同步状态怎么样" | 触发 |
| 版本/调试 | "恢复这个文件上一版"、"执行段 JS 调试"、"截个图" | 触发 |
| 查 vault 信息 | "vault 路径是什么"、"仓库结构" | 触发 |
| 纯文件读写 | "读一下 xxx 内容"、"搜索 TODO"、"列一下 project 下文件" | 不触发，走文件系统工具 |
| 闲聊/泛泛提问 | "随便聊聊"、"你怎么看" | 不触发，交给默认回复 |

## 2. 规则（RULES）

### 2.1 务必执行(ALWAYS DO)
1. 纯文件读写（搜索、读内容、写内容、列出文件、查标签/属性）→ 走文件系统工具（`read`/`write`/`grep`/`glob`），不用 obsidian CLI。
2. 需要与 Obsidian 应用交互（打开文件、切换主题、插件控制、同步、版本恢复、调试）→ 走 `obsidian` 命令。
3. 查 vault 路径用 `obsidian vault info=path`。
4. 重命名 vault 文档后，用 `grep` 全库搜索并替换所有 `[[旧名]]` 引用。

### 2.2 禁止执行(NEVER DO)
1. 不用 `obsidian create`/`obsidian append` 写 vault 文档——用 `write` 工具直接写路径，frontmatter hook 自动校验。
2. 不用 `obsidian search` 做全文搜索——`grep` 更快。
3. 不用 `obsidian read` 读文件——`read` 工具直接读路径。

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：Obsidian 应用已运行、目标 vault（多 vault 时用 `vault="My Vault"` 指定）、命令所需参数。
- 缺失时：
  - Obsidian 未运行 → 如实告知需先启动 Obsidian 再执行，不硬跑命令。
  - vault 路径未知 → 先 `obsidian vault info=path` 获取，不猜测。

## 3. 知识底座（CONTEXT）

### 3.1 调用格式
```bash
obsidian <command> [参数=值] [标志]
# 参数：name=value，值含空格用引号      obsidian search query="TODO"
# 标志：无值开关，出现即启用            obsidian open file=Note newtab
# 指定仓库                             obsidian vault="My Vault" daily
# 复制输出到剪贴板                     obsidian read --copy
```

### 3.2 参数约定
- **指定文件**：`file=文件名`（模糊匹配，类似 wiki 链接）或 `path=完整路径`（从 vault 根开始）
- **多行内容**：`\n` 换行，`\t` 制表符
- **输出格式**：追加 `format=json|csv|tsv|md`（部分命令支持）
- **数量统计**：追加 `total`；**详细输出**：追加 `verbose`

### 3.3 本 vault
vault 路径用 `obsidian vault info=path` 获取。结构：`project/`（项目文档）、`area/`（知识领域）、`weekly/`（周报）、`archive/`（归档）、`meta/`（派生数据）、`resource/`（参考）。

### 3.4 决策表：CLI vs 文件系统工具

| 场景 | 用 obsidian CLI | 用文件系统工具 |
|------|----------------|---------------|
| 读文件内容 | ❌ | `read` 直接读路径 |
| 写文件内容 | ❌ | `write` 直接写路径 |
| 全文搜索 | ❌ | `grep -rl` |
| 列文件清单 | ❌ | `glob` 或 `find` |
| 查标签/属性 | ❌ | `grep` 扫 frontmatter |
| 打开文件到 Obsidian | ✅ `open` | — |
| 切换主题 | ✅ `theme:set` | — |
| 重载插件 | ✅ `plugin:reload` | — |
| 查看同步状态 | ✅ `sync:status` | — |
| 恢复文件版本 | ✅ `history:restore` | — |
| 执行 JS 调试 | ✅ `eval` | — |
| 截图 | ✅ `dev:screenshot` | — |
| 查 vault 路径 | ✅ `vault info=path` | — |

### 3.5 完整命令表

**文件操作**

| 命令 | 用途 | 示例 |
|------|------|------|
| `read` | 读文件（默认活动文件） | `obsidian read path="project/...md"` |
| `create` | 创建文件 | `obsidian create name="新笔记" content="# Title"` |
| `append` | 追加内容 | `obsidian append file=Note content="新行"` |
| `prepend` | 前置元数据后插入 | `obsidian prepend file=Note content="摘要:: 内容"` |
| `open` | 打开文件 | `obsidian open file=Note` |
| `delete` | 删除文件 | `obsidian delete file=Note`（默认回收站，`permanent` 永久） |
| `rename` | 重命名 | `obsidian rename file=旧名 name=新名` |
| `move` | 移动/重命名 | `obsidian move file=Note path="新路径"` |
| `file` | 文件信息 | `obsidian file path="project/...md"` |
| `files` | 列出文件 | `obsidian files folder=project` |
| `folder` | 文件夹信息 | `obsidian folder path=project` |
| `folders` | 列出文件夹 | `obsidian folders` |

**日记**

| 命令 | 用途 | 示例 |
|------|------|------|
| `daily` | 打开日记 | `obsidian daily` |
| `daily:read` | 读日记 | `obsidian daily:read` |
| `daily:append` | 追加日记 | `obsidian daily:append content="- [ ] 买咖啡"` |
| `daily:prepend` | 日记开头插入 | `obsidian daily:prepend content="## 今日计划"` |
| `daily:path` | 日记路径 | `obsidian daily:path` |

**搜索**

| 命令 | 用途 | 示例 |
|------|------|------|
| `search` | 全文搜索 | `obsidian search query="overlay"` |
| `search:context` | 带上下文搜索 | `obsidian search:context query="TODO"` |
| `search:open` | 打开搜索视图 | `obsidian search:open query="mount"` |

**标签 & 属性**

| 命令 | 用途 | 示例 |
|------|------|------|
| `tags` | 列出标签 | `obsidian tags counts` |
| `tag` | 标签信息 | `obsidian tag name=#tag verbose` |
| `properties` | 列出属性 | `obsidian properties` |
| `property:set` | 设置属性 | `obsidian property:set name=status value=定稿 type=text` |
| `property:read` | 读属性 | `obsidian property:read name=status` |
| `property:remove` | 删属性 | `obsidian property:remove name=status` |
| `aliases` | 别名 | `obsidian aliases active` |

**任务**

| 命令 | 用途 | 示例 |
|------|------|------|
| `tasks` | 列出任务 | `obsidian tasks todo` |
| `task` | 切换任务状态 | `obsidian task ref="Note.md:8" done` |

**链接**

| 命令 | 用途 | 示例 |
|------|------|------|
| `backlinks` | 反向链接 | `obsidian backlinks file=Note` |
| `links` | 出链 | `obsidian links file=Note` |
| `unresolved` | 未解析链接 | `obsidian unresolved` |
| `orphans` | 无入链文件 | `obsidian orphans` |
| `deadends` | 无出链文件 | `obsidian deadends` |
| `outline` | 文件标题结构 | `obsidian outline file=Note format=tree` |

**插件 & 主题**

| 命令 | 用途 | 示例 |
|------|------|------|
| `plugins` | 列出插件 | `obsidian plugins` |
| `plugin:reload` | 重载插件 | `obsidian plugin:reload id=my-plugin` |
| `themes` | 列出主题 | `obsidian themes` |
| `theme:set` | 切换主题 | `obsidian theme:set name="Blue Topaz"` |
| `snippets` | 列出 CSS 片段 | `obsidian snippets` |
| `snippet:enable` | 启用片段 | `obsidian snippet:enable name=custom` |

**同步**

| 命令 | 用途 | 示例 |
|------|------|------|
| `sync:status` | 同步状态 | `obsidian sync:status` |
| `sync` | 暂停/恢复同步 | `obsidian sync on / off` |
| `sync:history` | 同步版本历史 | `obsidian sync:history file=Note` |
| `sync:deleted` | 已删除文件 | `obsidian sync:deleted` |

**历史版本**

| 命令 | 用途 | 示例 |
|------|------|------|
| `diff` | 文件版本比较 | `obsidian diff file=Note from=2 to=1` |
| `history` | 本地历史版本 | `obsidian history file=Note` |
| `history:restore` | 恢复版本 | `obsidian history:restore file=Note version=2` |

**数据库**

| 命令 | 用途 | 示例 |
|------|------|------|
| `bases` | 列出 `.base` 文件 | `obsidian bases` |
| `base:query` | 查询数据库 | `obsidian base:query file=xxx format=json` |

**开发者**

| 命令 | 用途 | 示例 |
|------|------|------|
| `devtools` | 开/关 DevTools | `obsidian devtools` |
| `eval` | 执行 JS | `obsidian eval code="app.vault.getFiles().length"` |
| `dev:screenshot` | 截图 | `obsidian dev:screenshot path=screen.png` |
| `dev:console` | 控制台日志 | `obsidian dev:console limit=20` |
| `dev:dom` | DOM 查询 | `obsidian dev:dom selector=.view-content text` |

**其他**

| 命令 | 用途 | 示例 |
|------|------|------|
| `help` | 帮助 | `obsidian help` / `obsidian help read` |
| `version` | 版本 | `obsidian version` |
| `reload` | 重载窗口 | `obsidian reload` |
| `restart` | 重启应用 | `obsidian restart` |
| `vault` | 仓库信息 | `obsidian vault` |
| `vaults` | 列出已知仓库 | `obsidian vaults` |
| `wordcount` | 字数统计 | `obsidian wordcount file=Note` |
| `workspace` | 工作区树 | `obsidian workspace` |
| `workspace:save` | 保存工作区 | `obsidian workspace:save name=dev` |
| `tabs` | 打开标签页 | `obsidian tabs` |
| `recents` | 最近文件 | `obsidian recents` |
| `random` | 随机笔记 | `obsidian random folder=project` |
| `bookmarks` | 书签列表 | `obsidian bookmarks` |
| `commands` | 命令列表 | `obsidian commands` |
| `command` | 执行命令 | `obsidian command id=editor:save-file` |
| `hotkeys` | 快捷键列表 | `obsidian hotkeys` |

## 4. 工作流程（WORKFLOW）

### Step 1: 判断走哪条路
- IF 纯文件读写（读/写内容、全文搜索、列文件、查标签属性）→ 文件系统工具（`read`/`write`/`grep`/`glob`），本技能结束。
- IF 与 Obsidian 应用交互 → 继续 Step 2。
- 完成标志：已按场景选定工具，不混用。

### Step 2: 构造命令
- 动作：查 3.5 命令表选命令；补参数（`file=`/`path=`、`vault=` 指定仓库、`format=`/`verbose`/`total` 控制输出）；多 vault 先确认目标。
- IF 参数缺值 → 向用户确认，不猜测。
- 完成标志：命令参数齐全、格式符合 3.1/3.2 约定。

### Step 3: 执行并核对输出
- 动作：执行命令，检查输出是否符合预期。
- 完成标志：输出正确；异常时如实反馈（如 Obsidian 未运行）。

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
```text
obsidian <command> [参数=值] [标志]
```

### 5.2 字段要求

| 部分 | 写作要求 |
|----|------|
| `command` | 用 3.5 命令表中的命令名，不自造 |
| `参数=值` | 值含空格用引号；文件用 `file=模糊名` 或 `path=完整路径` |
| `标志` | 无值开关，出现即启用；输出控制用 `format=`/`total`/`verbose` |

### 5.3 交付前自检
- [ ] 纯文件操作没误走 obsidian CLI（已用文件系统工具）
- [ ] 命令名来自 3.5 命令表，参数符合约定
- [ ] 已确认 Obsidian 在运行 / 如实告知缺失前提

## 6. 示例

### 6.1 好的示例
**输入**：把这个方案文档在 Obsidian 里打开
**输出**：`obsidian open file=方案`（应用交互 → CLI，正确）

**输入**：搜索一下 vault 里提到 "overlay" 的地方
**输出**：用 `grep "overlay" /path/to/vault`（纯搜索 → 文件系统工具，正确）

### 6.2 差的示例
**输入**：读一下 project 下方案文档的内容
**输出**：`obsidian read path="project/方案.md"`（读内容应走 `read` 工具，CLI 慢且依赖进程状态）

**输入**：给笔记加一行内容
**输出**：`obsidian append file=Note content="新行"`（写内容应走 `write` 工具，绕过 frontmatter hook 校验）
