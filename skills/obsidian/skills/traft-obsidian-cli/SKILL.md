---
name: traft-obsidian-cli
description: Obsidian CLI 命令行技能——在需要与 Obsidian 应用交互（打开文件、切换主题、调试插件、同步控制）时激活；纯文件读写走文件系统工具更快。
---


# START

Obsidian CLI 通过 `obsidian <command> [参数=值] [标志]` 调用，需要 Obsidian 应用在运行。

## 何时用 vs 何时不用

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

**核心原则**：文件内容的读写永远走文件系统工具。`obsidian` 命令只用于跟 Obsidian 应用交互的操作。

## 基础

```bash
# 格式
obsidian <command> [参数=值] [标志]

# 参数：name=value，值含空格用引号
obsidian search query="TODO"

# 标志：无值开关，出现即启用
obsidian open file=Note newtab

# 指定仓库
obsidian vault="My Vault" daily

# 复制输出到剪贴板
obsidian read --copy
```

## 常用命令速查

### 文件操作（只读）

```bash
obsidian read file=文件名          # 读文件
obsidian file path="project/...md" # 文件信息
obsidian files folder=project      # 列目录文件
obsidian open file=Note newtab     # 在 Obsidian 中打开
```

### 日记

```bash
obsidian daily                    # 打开日记
obsidian daily:read               # 读日记
obsidian daily:append content="..." # 追加
```

### 搜索

```bash
obsidian search query="keyword"   # 全文搜索
obsidian search:context query="TODO" limit=20  # 带上下文的搜索
```

### 标签 & 属性

```bash
obsidian tags counts              # 标签统计
obsidian tag name=#tag verbose    # 标签详情
obsidian properties               # 属性列表
obsidian property:read name=status file=Note
```

### 任务

```bash
obsidian tasks todo               # 所有未完成的任务
obsidian task file=Note line=8 done  # 标记完成
```

### 链接分析

```bash
obsidian orphans                  # 无入链文件
obsidian unresolved               # 未解析的 wiki 链接
obsidian backlinks file=Note      # 反向链接
```

### 插件 & 主题

```bash
obsidian plugins                  # 插件列表
obsidian plugin:reload id=my-plugin # 重载插件
obsidian themes                   # 主题列表
obsidian theme:set name="Blue Topaz" # 切换主题
```

### 同步

```bash
obsidian sync:status              # 同步状态
obsidian sync on / off            # 暂停/恢复同步
```

### 历史版本

```bash
obsidian diff file=Note from=2 to=1 # 版本对比
obsidian history:restore file=Note version=2 # 恢复
```

### 开发者

```bash
obsidian devtools                 # 开/关 DevTools
obsidian eval code="app.vault.getFiles().length" # 执行 JS
obsidian dev:screenshot path=screen.png # 截图
obsidian dev:console limit=20     # 控制台日志
```

### 其他

```bash
obsidian help                     # 帮助
obsidian help read                # 特定命令帮助
obsidian vault                    # vault 信息
obsidian vault info=path          # vault 路径
obsidian wordcount file=Note      # 字数统计
obsidian workspace:save name=dev  # 保存工作区
```

## 本 vault

vault 路径用 `obsidian vault info=path` 获取。结构：`project/`（项目文档）`area/`（知识领域）`weekly/`（周报）`archive/`（归档）`meta/`（派生数据）`resource/`（参考）。

## 参数约定

- **指定文件**：`file=文件名`（模糊匹配，类似 wiki 链接）或 `path=完整路径`（从 vault 根开始）
- **多行内容**：`\n` 换行，`\t` 制表符
- **输出格式**：追加 `format=json|csv|tsv|md`（部分命令支持）
- **数量统计**：追加 `total`
- **详细输出**：追加 `verbose`


# RULES

## ALWAYS DO
- 纯文件读写任务（搜索、读内容、写内容、列出文件）→ 走文件系统工具（`read`/`write`/`grep`/`glob`），更快且不受 Obsidian 进程状态影响。
- 需要与 Obsidian 应用交互（打开文件、切换主题、插件控制、同步、版本恢复、调试）→ 走 `obsidian` 命令。
- 查 vault 路径：`obsidian vault info=path`。
- 重命名 vault 文档后，用 `grep` 全库搜索并替换所有 `[[旧名]]` 引用。

## NEVER DO
- 不要用 `obsidian create` / `obsidian append` 写 vault 文档——用 `write` 工具直接写路径，frontmatter hook 会自动校验。
- 不要用 `obsidian search` 做全文搜索——`grep` 更快。
- 不要用 `obsidian read` 读文件——`read` 工具直接读路径。


# 完整命令表

## 文件操作

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

## 日记

| 命令 | 用途 | 示例 |
|------|------|------|
| `daily` | 打开日记 | `obsidian daily` |
| `daily:read` | 读日记 | `obsidian daily:read` |
| `daily:append` | 追加日记 | `obsidian daily:append content="- [ ] 买咖啡"` |
| `daily:prepend` | 日记开头插入 | `obsidian daily:prepend content="## 今日计划"` |
| `daily:path` | 日记路径 | `obsidian daily:path` |

## 搜索

| 命令 | 用途 | 示例 |
|------|------|------|
| `search` | 全文搜索 | `obsidian search query="overlay"` |
| `search:context` | 带上下文搜索 | `obsidian search:context query="TODO"` |
| `search:open` | 打开搜索视图 | `obsidian search:open query="mount"` |

## 标签 & 属性

| 命令 | 用途 | 示例 |
|------|------|------|
| `tags` | 列出标签 | `obsidian tags counts` |
| `tag` | 标签信息 | `obsidian tag name=#tag verbose` |
| `properties` | 列出属性 | `obsidian properties` |
| `property:set` | 设置属性 | `obsidian property:set name=status value=定稿 type=text` |
| `property:read` | 读属性 | `obsidian property:read name=status` |
| `property:remove` | 删属性 | `obsidian property:remove name=status` |
| `aliases` | 别名 | `obsidian aliases active` |

## 任务

| 命令 | 用途 | 示例 |
|------|------|------|
| `tasks` | 列出任务 | `obsidian tasks todo` |
| `task` | 切换任务状态 | `obsidian task ref="Note.md:8" done` |

## 链接

| 命令 | 用途 | 示例 |
|------|------|------|
| `backlinks` | 反向链接 | `obsidian backlinks file=Note` |
| `links` | 出链 | `obsidian links file=Note` |
| `unresolved` | 未解析链接 | `obsidian unresolved` |
| `orphans` | 无入链文件 | `obsidian orphans` |
| `deadends` | 无出链文件 | `obsidian deadends` |
| `outline` | 文件标题结构 | `obsidian outline file=Note format=tree` |

## 插件 & 主题

| 命令 | 用途 | 示例 |
|------|------|------|
| `plugins` | 列出插件 | `obsidian plugins` |
| `plugin:reload` | 重载插件 | `obsidian plugin:reload id=my-plugin` |
| `themes` | 列出主题 | `obsidian themes` |
| `theme:set` | 切换主题 | `obsidian theme:set name="Blue Topaz"` |
| `snippets` | 列出 CSS 片段 | `obsidian snippets` |
| `snippet:enable` | 启用片段 | `obsidian snippet:enable name=custom` |

## 同步

| 命令 | 用途 | 示例 |
|------|------|------|
| `sync:status` | 同步状态 | `obsidian sync:status` |
| `sync` | 暂停/恢复同步 | `obsidian sync on / off` |
| `sync:history` | 同步版本历史 | `obsidian sync:history file=Note` |
| `sync:deleted` | 已删除文件 | `obsidian sync:deleted` |

## 历史版本

| 命令 | 用途 | 示例 |
|------|------|------|
| `diff` | 文件版本比较 | `obsidian diff file=Note from=2 to=1` |
| `history` | 本地历史版本 | `obsidian history file=Note` |
| `history:restore` | 恢复版本 | `obsidian history:restore file=Note version=2` |

## 数据库

| 命令 | 用途 | 示例 |
|------|------|------|
| `bases` | 列出 `.base` 文件 | `obsidian bases` |
| `base:query` | 查询数据库 | `obsidian base:query file=xxx format=json` |

## 开发者

| 命令 | 用途 | 示例 |
|------|------|------|
| `devtools` | 开/关 DevTools | `obsidian devtools` |
| `eval` | 执行 JS | `obsidian eval code="app.vault.getFiles().length"` |
| `dev:screenshot` | 截图 | `obsidian dev:screenshot path=screen.png` |
| `dev:console` | 控制台日志 | `obsidian dev:console limit=20` |
| `dev:dom` | DOM 查询 | `obsidian dev:dom selector=.view-content text` |

## 其他

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