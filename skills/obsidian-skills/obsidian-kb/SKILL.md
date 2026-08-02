---
name: obsidian-kb
description: 连通代码项目与 Obsidian 知识库:初始化 vault(给定路径,空仓库一键建目录与卡片模板)、把项目方案/升级文档从代码仓库分离沉淀为 Obsidian 卡片、检索 vault、按情境沉淀各类卡片(问题修复/决策/踩坑/术语等)、维护标签。当用户要初始化 obsidian 仓库/setup vault(给了 vault 路径要求建结构)、写技术方案/架构方案/设计方案(记到 Obsidian 而非代码仓库)、写升级文档/迁移指南、查 Obsidian 笔记/查 vault/查"之前怎么做的"、把 bug 修复或决策或踩坑或通用概念沉淀成卡片、整理或维护标签时使用。卡片是概念/模板(card_type),不是文件夹--一篇内聚有信息量的笔记就是一张卡,住在它该住的位置。工作中识别到可沉淀的改动/决策/踩坑/概念时,主动提示建卡。以直接读写 vault markdown 为主(零依赖),检测到 obsidian CLI 时增强检索与反链。项目特定约定(vault 路径、文件夹结构、标签规范)运行时从配置/CLAUDE.md 发现,不硬编码。
---

# Obsidian KB

把代码项目和 Obsidian 知识库连起来:**方案、升级文档活在 Obsidian,代码仓库只留指针**;把工作中产生的可沉淀内容做成卡片,并维护标签让知识可检索。还能在空 vault 上一键初始化目录与模板。

设计意图:代码仓库适合放代码与面向消费者的 CHANGELOG,不适合放长方案、升级指南、经验沉淀--它们会让 README/docs 越积越重,且跨项目复用难。Obsidian vault 是磁盘上的 markdown 文件夹,天然承载这些,还能用 wikilink/tag 互链。本 skill 是这条"代码 ↔ 知识库"的桥梁,并能在新机器上初始化 vault。

## 卡片的概念

**卡片 = 概念/模板,不是文件夹。** 一篇内聚、有一定信息量的笔记就是一张卡:

- `card_type`(frontmatter)决定这是什么卡、用哪个模板、正文骨架。
- 文件夹决定卡片住在哪(项目/通用/日程)--**没有"卡片"文件夹**。
- 一卡一事:一张卡围绕一个东西(一个问题、一次会议、一周、一个术语、一个决策),内聚、独立可懂,带 frontmatter + 双链。

card_type 与默认位置:

| card_type | 装什么 | 默认位置 |
|-----------|--------|---------|
| 方案 | 设计方案(长篇论证) | `项目/<名>/方案/` |
| 升级 | 升级/迁移文档 | `项目/<名>/升级/` |
| 问题修复 | bug 完整修复方案 | `项目/<名>/修复/` |
| 会议 | 会议记录 | `项目/<名>/会议/` 或 `日程/` |
| 周记 | 周报 | `日程/周报/` |
| 日记 | daily note | `日程/日记/` |
| 术语 | 通用概念定义 | `通用/术语/` |
| 决策 | 选型/取舍 + 理由 | `项目/` 或 `通用/` |
| 踩坑 | 错误 + 根因 + 解法 | `项目/` 或 `通用/` |
| 模式 | 可复用做法 | `通用/` |
| 事实 | 不显然的系统约束 | `通用/` |

模板见 vault 的 `模板/`(由初始化生成)。vault 根的 `卡片库.base`(Obsidian Bases)按 card_type/project/status 动态汇总所有卡,`INDEX.md` 嵌入它当首页。完整 vault 结构见 `references/vault-conventions.md`。

## 何时触发

- **初始化 vault**:用户给 obsidian 路径,要求初始化/建结构(空仓库或新机器)。
- **写方案**:写技术/架构/设计方案,或设计讨论中说"把方案记下来"。
- **写升级文档**:写升级/迁移指南(详细步骤,区别于 CHANGELOG 短条目)。
- **查 vault**:问"之前怎么做的/有没有相关笔记/查 obsidian 里有没有 X"。
- **沉淀卡片**:用户要求,或本 skill 主动识别到可沉淀内容时提示。
- **维护标签**:整理标签/看有哪些标签/统一标签。

## 前置:发现 vault 与项目约定(不硬编码)

vault 路径不靠自动探测,从显式配置读;读不到就直接问用户。

1. **读显式配置**(找到任一即用):
   - env `OBSIDIAN_VAULT`(vault 根绝对路径;**跨机器推荐**:每台机器在 shell 配置里设一次)。
   - 项目 `.claude/skills-config.json` 的 `obsidian-kb.vault`(约定的"写死"位置;同段可写 `projectsFolder`/`cardsFolder`/`tagPrefix` 覆盖默认)。
   - 项目 CLAUDE.md 里写明的 vault 路径。
2. **读项目 CLAUDE.md**:取文件夹结构、标签规范等项目约定。若引用了规范文档,一并读。
3. **都没有 -> 直接问用户**:用 AskUserQuestion 问 vault 在哪,本次会话记住;建议写进 `.claude/skills-config.json` 或 env 以免再问。

不做 obsidian 注册表探测、不扫 `.obsidian/` 标记。发现细节见 `references/vault-conventions.md`。以文件实际内容为准。

## 联通方式:文件读写为主,CLI 增强

vault 是磁盘上的 markdown 文件夹,默认直接读写,零依赖,Obsidian 不用开着:

- **读**:`Read` 读笔记;`rg`/`grep` 检索。
- **写**:`Write`/`Edit`,**写入前展示草稿给用户确认**(本仓库铁律)。

**增强**:若 `obsidian` CLI 可用(`obsidian help` 能跑),优先用它做文件操作做不好的事:`obsidian search`/`tags`/`backlinks`/`property:set`。检测到就用,没有就文件操作兜底(不阻塞)。详见 `references/vault-conventions.md`。

## 模块零:初始化 vault

用户给路径(或读配置)要求初始化时,把空仓库或部分初始化的 vault 建成可用结构。

1. **确认 vault 路径**:用户给了就用;没给则按「前置」发现,仍没有就问。
2. **跑初始化脚本**(幂等,不覆盖已有内容、不删除任何东西):
   ```bash
   bash <skill>/scripts/init_vault.sh "<vault 路径>"
   ```
   脚本建目录(`项目/`、`通用/{术语,AI,工具,规范,环境}`、`日程/{周报,日记}`、`模板/`、`归档/`)、复制卡片模板到 `模板/`、建 `INDEX.md`。已存在的跳过。
3. **记录路径**(跨机器关键):提示用户二选一--
   - 跨机器推荐:shell 配置加 `export OBSIDIAN_VAULT="<路径>"`(每台机器设自己的)。
   - 单项目:`.claude/skills-config.json` 写 `{"obsidian-kb":{"vault":"<路径>"}}`。
   可代用户写入当前项目的 skills-config.json(确认后)。
4. **报告**:列出建了什么、跳过了什么;若 vault 已有零散内容(如顶层 `AI/xxx.md`),提示是否迁入 `通用/` 对应主题,不擅自搬。

## 模块一:方案沉淀(方案卡片)

把设计方案写成方案卡片,代码仓库只留指针。

1. 确认主题与项目(从 git 仓库目录名/CLAUDE.md 推断,不确定就问)。
2. 起草方案卡片:`card_type: 方案` + 正文 背景->目标->候选方案->权衡->决策->后续。结构是建议--价值在把"为什么这么定"写清,而非填模板。
3. 目标路径 `项目/<名>/方案/<方案名>.md`。
4. 展示草稿确认后写入。
5. 代码仓库留指针(README 或 docs 一行 `> 方案见 Obsidian: [[<方案名>]]`),方案正文不进代码仓库。
6. wikilink 互链已有相关笔记/卡片。
7. 需要配图(架构 / 流程 / 泳道 / C4)时,按「与 fireworks-tech-graph 联动」生成 PNG、存 `项目/<名>/附件/`、嵌入 `![[图.png]]`。

## 模块二:升级文档(升级卡片)

升级文档面向集成方讲详细步骤,与面向消费者的 CHANGELOG 短条目是两回事--前者进 Obsidian,后者仍由 `changelog`(本 plugin 内)维护。

1. 读版本真源确认版本号(`version.json`/`pyproject.toml`/`package.json`)。
2. 起草升级卡片:`card_type: 升级` + 正文 影响范围->破坏性变更->升级步骤->回滚。
3. 目标路径 `项目/<名>/升级/<版本>.md`。
4. 展示确认后写入,与 CHANGELOG 条目、相关方案互链。

## 模块三:文档查询

只读检索,不修改 vault。

1. 发现 vault(见前置)。
2. 检索:有 CLI 用 `obsidian search query="..."`;无 CLI 用 `rg -l -i "<词>" <vault>` 再 `Read`。
3. 沿链接扩展:看核心笔记链向谁、谁链向它(CLI `backlinks`;无 CLI `rg "[[<笔记名>]]"`)。
4. 汇总返回:标题 + 路径 + 一两句摘要 + wikilink。不倾倒全文,省 token。

## 模块四:卡片沉淀

### 触发
- **显式**:用户说"记成卡片/沉淀/写进知识库"。
- **主动提示**(本 skill 唯一主动场景):识别到可沉淀内容时,一句话提示"这点值得建张<类型>卡,要我现在写到 Obsidian 吗?"。同意才动,不同意跳过,不纠缠。

### 识别信号 -> card_type
- bug 修复(现象+根因+解法)-> **问题修复** 卡。
- 选型/取舍 + 理由 -> **决策** 卡。
- 报错/陷阱 + 根因 + 解法 -> **踩坑** 卡。
- 通用概念/术语 -> **术语** 卡。
- 可跨项目复用的做法 -> **模式** 卡。
- 不显然的系统约束 -> **事实** 卡。

### 流程(同意后)
1. 选 card_type,用对应模板骨架起草;一卡一事,内聚有信息量。
2. 定位置:按 card_type 默认位置(见上表);项目相关归项目,通用归 `通用/<主题>`。
3. frontmatter 填 `card_type`/`project`/`tags`/`source`(提炼自哪),正文 + 双链到相关卡片/笔记。
4. 展示草稿确认后写入。
5. 回链:在来源处加 wikilink 指向新卡。

### 克制
主动提示克制:一次会话最多 1-2 次真正高价值的。判断标准"换个项目/过半年还有用吗"--有用才提示。

## 模块五:标签维护

**标签真源**:vault 的 `通用/规范/标签速查表.md`(init 生成)。维护前先读;新标签先加到表再用,避免同义分裂。

1. 列标签:有 CLI `obsidian tags`;无 CLI `rg -o "#[A-Za-z0-9/_-]+" <vault> | sort | uniq -c` + 扫 frontmatter `tags:`。
2. 识别问题:同义(`#bug` vs `#缺陷`)、大小写不一、层级混乱。
3. 提议归并/规范化(小写+连字符+`主题/子主题`),展示计划确认。
4. 确认后批量改:`Edit` 各笔记 inline tag 与 frontmatter `tags`。

**写笔记时标签约定**:优先 frontmatter `tags`;命名小写+连字符,层级用 `/`(`项目/t-craft`、`类型/方案`、`卡片/决策`);一卡 2-5 个,不滥用。

## 与 emoji-helper 联动

写卡片/文档时,emoji 不在本 skill 硬编码,统一向 `emoji-helper`(basic-skills plugin)查询--遵循其「其他 skill 不维护映射表」的约定。

- **card_type 图标**:每张卡标题行首带 card_type 对应 emoji。写时向 emoji-helper 查询;默认对照见 vault 的 `通用/规范/标签速查表.md`。
- **章节标题 emoji**:卡片正文章节可配语义 emoji(如问题修复卡 现象/根因/解法各配一个),向 emoji-helper 查,一处一个,不堆砌。
- **标签速查表**:vault 的 `通用/规范/标签速查表.md`(由 init 生成)列出全部标签与 emoji 对照,是标签真源;emoji 仍以 emoji-helper 查询为准。

emoji 原则遵循 emoji-helper:语义对应、一处一个、不堆砌、**不进标签本身**(Obsidian 标签不含 emoji,emoji 只作标题/章节/速查表的视觉对照)。

## 与 fireworks-tech-graph 联动(方案配图)

写方案 / 升级文档需要配图(架构图、流程图、泳道图、C4、时序等)时,调用 `fireworks-tech-graph`(外部 skill,经 t-craft marketplace 装)生成,嵌入笔记:

1. **调用 fireworks-tech-graph**:描述要画的图(如"画 X 系统架构图,含 A/B/C 组件与数据流"),让它生成 **PNG**(Obsidian 渲染最稳)。
2. **存 vault 附件**:图片存 `项目/<名>/附件/<图名>.png`(per-project 附件夹;没有就建)。
3. **嵌入笔记**:在方案卡片相应位置加 `![[<图名>.png]]`(wikilink embed)。
4. **图名带语义**:如 `认证方案-架构图.png`,便于检索。

注意:fireworks-tech-graph 需 Python + cairosvg / librsvg(详见其 README);没装就提示用户装,或退化为 mermaid 文本图(Obsidian 支持 ` ```mermaid ` 代码块)。

## 统一 frontmatter

```yaml
---
title: 
card_type: 方案          # 方案|升级|问题修复|会议|周记|日记|术语|决策|踩坑|模式|事实
project:                 # 归属项目(通用/日程类可空)
status: 草稿             # 草稿|已定|进行中|归档
date: 2026-08-02
tags: []
aliases: []
---
```

## 通用约定

- **写入前展示草稿确认**:改 vault 前展示将做的操作,不擅自执行。
- **以 vault 文件实际内容为准**:读 vault 与项目 CLAUDE.md,不凭记忆。
- **vault 路径不硬编码**:运行时从配置发现;跨机器用 env。
- **检索只读**:查询不改 vault。
- **初始化幂等**:不覆盖、不删除已有内容。
- **失败要明确**:vault 没找到/CLI 不可用/文件不存在,停止并告知。
- **与 changelog 分工**:CHANGELOG 短条目归 `changelog`(本 plugin 内);升级文档详细步骤归本 skill。
