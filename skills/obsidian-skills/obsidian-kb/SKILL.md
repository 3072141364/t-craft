---
name: obsidian-kb
description: 项目知识大脑——读写用户 Obsidian 知识库(vault),横贯开发线与调研线的沉淀+快答双向入口。何时用:①**你问项目操作/约定/配置**(命令/发版/镜像/"X 怎么配")——自动先查 vault 知识库直接答,未命中再搜并学习,不必等显式命令;②要**沉淀/落盘**方案/需求/知识卡/项目 wiki/踩坑,或我干完活主动提醒你沉淀时;③查旧方案/历史、写周报、维护标签/emoji。这些默认行为都不知道 vault 在哪、结构如何,必须走本 skill。项目知识进 vault(按 projects/<名>/{wiki,workflow,requirements} 目录隔离),跨项目可复用知识进 skill 仓库。vault 路径/结构/标签规范运行时从 CLAUDE.md 发现,不硬编码。
---

# Obsidian KB(项目知识大脑)

t-craft 的**项目知识大脑**,横贯开发线与调研线,是知识的**双向入口**:

- **写入(沉淀)**:方案 / 需求 / 项目 wiki / 配置写法 / 踩坑,按目录隔离体系落 vault,代码仓库只留指针。**干完活主动提醒沉淀**(见模块三)。
- **读取(快答)**:你问项目操作 / 约定 / 配置,**自动先查 vault 知识库直接答**,未命中再搜并学习(见模块五)。

四个职能:编辑/管理 vault、快速问答、随时落盘/查询/建知识体系、周报。还能在空 vault 上一键初始化目录与模板。

设计意图:代码仓库适合放代码与面向消费者的 CHANGELOG,不适合放长方案、经验沉淀、项目特定流程、约定俗成——它们会让 README/docs 越积越重,且跨项目复用难。Obsidian vault 是磁盘上的 markdown 文件夹,天然承载这些,还能用 wikilink/tag 互链、按 `projects/<名>/{wiki,workflow,requirements}` 目录隔离,自然长成**项目 wiki**。本 skill 是"代码 ↔ 知识库"的桥梁:开发中随时沉淀、随时快答、维护周报。

**附属文档**(渐进披露,用到才读):

- [references/query.md](references/query.md) -- 文档查询(模块二):summary + 3-tier 省 token 读。查 vault 时读。
- [references/answers.md](references/answers.md) -- 快速问答(模块五):answer-index 已知答案索引 + 学习闭环。高频固定问题先查它。
- [references/weekly.md](references/weekly.md) -- 周报规则(模块四)。
- [references/progress.md](references/progress.md) -- 需求进度规则(状态真源,接 dev-flow)。
- [references/emoji-helper.md](references/emoji-helper.md) -- emoji 选择与应用(含速查表 emoji-cheatsheet.md)。配 emoji 时读。
- [references/vault-conventions.md](references/vault-conventions.md) -- vault 结构总纲。

## 卡片的概念

两类组织,互不冲突:

- **知识 = 卡片**:概念/模板。`card_type`(frontmatter)决定类型与骨架,文件夹决定位置。一卡一事,内聚有信息量,带 frontmatter + 双链。
- **需求 = 文件夹**:过程单元。一需求一文件夹,固定五个产出物(prd/adr/test/review/progress),`progress.md` 的 `status` 是状态真源(接 dev-flow 六阶段)。

卡片住在 `projects/`(项目知识卡)、`papers/`(论文卡,归 research-skills 的 paper-study 管理)、`tech/`(技术学习)、`weekly/`(周记)、`misc/`(零散卡,平铺靠标签);跨项目可复用知识沉淀到 skill 仓库,不进 vault。

card_type 与默认位置(按需扩充,不强求每类都有模板):

| card_type | 装什么 | 默认位置 | 文件名 |
|-----------|--------|---------|--------|
| 论文 | 论文阅读卡(走 research-skills 的 paper-study 管理) | `papers/` | `<论文名>.md` |
| 技术 | 技术学习笔记(概念+实践+踩坑) | `tech/<主题>/` | `<笔记>.md` |
| wiki | 知识词条(概念/背景解释,项目级) | `projects/<名>/wiki/` | — |
| 流程 | 项目特定规范操作(发版/测试/镜像,可照着执行) | `projects/<名>/workflow/` | `<流程名>.md` |
| 周记 | 周报(三流汇总) | `weekly/` | `周记 <YYYY>-W<ww>.md` |

> 术语等通用概念定义不放 vault,进 skill 仓库。需求(方案)文档走需求文件夹:`projects/<名>/requirements/<需求名>/{prd,adr,test,review,progress}.md`。论文卡走 research-skills 的 paper-study(模板在其 `assets/templates/paper.md`)。不属于任何体系的零散卡放 `misc/`,平铺不建子目录,靠标签找。

**需求文件夹**:每个需求一个文件夹 `projects/<名>/requirements/<需求名>/`,内含固定五个产出物:
- `prd.md` — 需求规格(阶段②,project-doc 产出)
- `adr.md` — 本需求关键设计决策
- `test.md` — 测试计划 + 结论(阶段④)
- `review.md` — 评估审查报告(阶段④)
- `progress.md` — 状态真源(status 接 dev-flow 六阶段)

需求名按命名约定(见 [references/vault-conventions.md](references/vault-conventions.md#%E5%91%BD%E5%90%8D%E7%BA%A6%E5%AE%9A))。需求类型(feat/bugfix/debug/hotfix/refactor/docs/chore...)记在 prd.md 的 `type` 字段,不进文件夹名。

**跨项目可复用知识**(如 overlayfs 原理、通用排障经验)不进 vault,沉淀到 skill 仓库。wiki 卡归 `projects/<名>/wiki/`(项目知识,非需求)。

**项目 reference.md**:每个项目下建 `projects/<名>/reference.md`(模板在 `assets/reference.md`),记录该项目**核心通用**的外部资料链接,分内部资料(飞书 wiki/Artifactory/Harbor/内部系统)与外部资料(官方文档/开源项目)。需求相关的资料归对应需求卡,不进 reference。随用随补,不强求一次建全。

**项目目录结构**:每个项目下固定:
- `projects/<名>/wiki/` — 项目知识性内容(开发环境搭建/API/roadmap,跨需求复用)
- `projects/<名>/workflow/` — 项目特定流程(发版/测试/镜像,可照着执行)
- `projects/<名>/requirements/` — 一需求一文件夹(见上)
- `projects/<名>/assets/` — 附件(方案图/截图)
- `projects/<名>/reference.md` — 外部资料链接
- `projects/<名>/README.md` — 项目 MOC

新建项目时(用户开始往某项目沉淀内容)主动建;init 脚本只建 `projects/` 空壳,项目内结构按需建。

模板在 skill 仓库 `assets/templates/`(需求级 prd/progress/adr/test/review + 知识卡 weekly),不从 vault 取;建需求/卡片时按需从技能仓库复制。vault 根的 `cards.base`(Obsidian Bases)按 card_type / 进行中需求 / project 动态汇总,`INDEX.md` 嵌入它当首页。完整 vault 结构见 `references/vault-conventions.md`。

## 何时触发

**四职能都触发**:

- **编辑/管理 vault**:初始化 vault / 写方案 / 记流程 / 写 wiki / 沉淀卡片 / 维护标签。
- **快速问答**:问高频固定操作约定("X 命令是什么""怎么发版""怎么做镜像")。
- **查询**:查 vault / 查旧方案 / 之前怎么做的 / 找笔记里有没有 X。
- **周报**:建本周周报/周记/复盘本周、维护任务列表与工作清单(周报内维护)。
- **emoji**:问"该用哪个 emoji"、给 commit / 卡片 / 周报配 emoji -- 按附属文档 emoji-helper.md。

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
   脚本建目录(`projects/`、`papers/`、`tech/`、`weekly/`、`misc/`、`archive/`)、铺种子速查表与 `cards.base`(vault 根)、建 `INDEX.md`。已存在的跳过。**不复制模板进 vault**(模板在 skill 仓库)。
3. **记录路径**(跨机器关键):提示用户二选一--
   - 跨机器推荐:shell 配置加 `export OBSIDIAN_VAULT="<路径>"`(每台机器设自己的)。
   - 单项目:`.claude/skills-config.json` 写 `{"obsidian-kb":{"vault":"<路径>"}}`。
   可代用户写入当前项目的 skills-config.json(确认后)。
4. **报告**:列出建了什么、跳过了什么;若 vault 已有零散内容(如顶层 `AI/xxx.md`),提示归入项目 `wiki/` 或提炼进 skill 仓库,不擅自搬。

## 模块一:需求方案落盘

把需求/方案从代码仓库分离,落盘到 Obsidian 需求文件夹,代码仓库只留指针。

1. 确认需求与项目(从 git 仓库目录名/CLAUDE.md 推断,不确定就问;需求名按 [命名约定](references/vault-conventions.md#%E5%91%BD%E5%90%8D%E7%BA%A6%E5%AE%9A))。
2. 建需求文件夹 `projects/<名>/requirements/<需求名>/`,起草 `prd.md`(从 skill 仓库复制模板 `obsidian-kb/assets/templates/prd.md`):frontmatter `type`(feat/bugfix/...)+ `status`(①→⑥)+ 正文按读者分章:用户读(需求背景/方案设计/项目收益/行动清单/验收标准)+ AI 须知(范围外/代码变更清单/测试决策)。候选方案/权衡是头脑风暴过程,不进文档;只记最终方案 + 优缺点。
3. 同步建 `progress.md`(从 skill 仓库复制模板 `obsidian-kb/assets/templates/progress.md`),`status` 为当前阶段;规则见附属文档 [references/progress.md](references/progress.md)。
4. 展示草稿确认后写入。
5. 代码仓库留指针(README 或 docs 一行 `> 方案见 Obsidian: [[<需求名>]]`),方案正文不进代码仓库。
6. wikilink 互链已有相关笔记/卡片。
7. 需要配图(架构 / 流程 / 泳道 / C4)时,按「与 fireworks-tech-graph 联动」生成 PNG、存 `projects/<名>/assets/`、嵌入 `![[图.png]]`。
8. 记项目特定流程(发版/测试/镜像等)时,存 `projects/<名>/workflow/<流程名>.md`(流程卡)。

## 模块二:文档查询

只读检索,不修改 vault。**按附属文档 [references/query.md](references/query.md) 做 3-tier 省 token 查询**:按标签/关键词粗筛 → 读 frontmatter `summary` 判相关性(无关跳过/弱相关只读 summary/强相关精读全文)→ 沿链接扩展 → 分级返回,不倾倒全文。

query.md 是查询的完整规则(summary 维护约定、3-tier 流程、CLI 增强),本模块只做入口。查 vault / 旧方案 / 历史笔记时先走这里;高频固定问题先走模块五(快速问答)查索引,命中直接答,未命中再转本模块搜。

## 模块三:卡片沉淀

### 触发
- **显式**:用户说"记成卡片/沉淀/写进知识库"。
- **主动提示**(本 skill 的主动场景,干完活别让知识流失):识别到可沉淀内容时,一句话提示"这点值得建张<类型>卡,要我现在写到 Obsidian 吗?"。同意才动,不同意跳过,不纠缠。

  **何时主动提醒**(三类高价值时机):
  1. **一个阶段完成**:dev-flow 某阶段收尾、一个需求做完——问要不要把方案/决策/结论沉淀。
  2. **解决一个非显然问题**:排查掉一个绕的 bug、试出一个可行方案——问要不要记进 wiki/技术卡(踩坑最值钱)。
  3. **发现一个项目约定 / 配置写法**:摸清项目某个约定俗成、某段配置怎么写、某命令怎么用——问要不要记进项目 `wiki/` 或 `workflow/`,下次能被快问快答命中。

  判断闸门仍是"换个项目/过半年还有用吗"——有用才提示(见下「克制」)。落盘前必展示草稿确认(不打扰)。

### 识别信号 -> card_type
- 跨项目通用概念/术语(一句话能下定义)-> 提炼进 **skill 仓库**(不进 vault)。
- 一段项目**特定**的可照着执行的规范操作(发版/测试/镜像,有先后顺序、可复现)-> **流程** 卡,存 `workflow/`;跨项目通用流程 -> 提炼进 skill 仓库。
- 一个概念/背景的科普性解释(带前因后果、不只下定义)-> **wiki** 卡。
- 技术原理/工具机制/排障经验(事实+实践)-> **技术** 卡。
- 需求类设计(开发新功能、修 bug)-> 需求文件夹的 prd.md;跨需求可复用的决策/经验 -> 提炼为 **技术/wiki** 卡。

> card_type 按需扩充,不强求每类有模板。当前模板:prd/progress/adr/test/review(需求级)+ weekly(知识卡),流程/wiki/技术等按需起草即可;论文卡模板在 research-skills 的 paper-study。

### 流程(同意后)
1. 选 card_type,用对应模板骨架起草;一卡一事,内聚有信息量。
2. 定位置:按 card_type 默认位置(见上表);项目相关归项目 `wiki/` / `workflow/`;跨项目可复用知识提炼进 skill 仓库(去项目化后),不进 vault。
3. frontmatter 填 `card_type`/`project`/`tags`/`source`(提炼自哪)+ `summary`(一行全文概述,供查询 3-tier 用),正文 + 双链到相关卡片/笔记。
4. 展示草稿确认后写入。
5. 回链:在来源处加 wikilink 指向新卡。

### 跨项目可复用知识 → skill 仓库(铁律)

vault 只放项目 / 时间维内容。**跨项目可复用**的知识(术语、通用机制、规范、通用踩坑经验)不进 vault,沉淀到 skill 仓库——本仓库 `code-guidelines` 的附属文档或对应 skill,让它随插件跨机器、跨项目生效。

- 判断标准:**"换个项目/换个系统,这条知识还用得上吗?"** 用得上 → 提炼进 skill 仓库;只对本项目成立 → 项目 `wiki/` / `workflow/` 或需求文件夹。
- **不写项目耦合内容当通用知识**:路径、环境变量、UUID、自研工具、项目参数——既不能跨项目复用,又污染项目。
- **去项目化**:从项目工作中提炼通用知识时,剥离项目路径/工具/命名,只留通用机制与原理,写进 skill 仓库(如 code-guidelines 附属文档)。项目里怎么用,写项目 wiki 卡。

### 克制
主动提示克制:一次会话最多 1-2 次真正高价值的。判断标准"换个项目/过半年还有用吗"--有用才提示。

## 模块四:周报(任务列表 + 工作清单)

周报记「事情」(开发/论文/技术三流),需求进度归 progress.md。完整规则见附属文档 [references/weekly.md](references/weekly.md)。要点:

- 位置 `weekly/周记 <YYYY>-W<ww>.md`,章节三流 + 问题/沉淀/下周。
- **任务列表与工作清单都在周报内维护**:「本周事项」就是最近工作清单(正在做/待办/本周完成),不另建独立文件。
- todo 格式与状态符号(Tasks 扩展)见 weekly.md,不在此重复。
- **分工铁律**:周报只链需求的 progress.md(`[[projects/<名>/requirements/<需求名>/progress]]`),不重复维护需求状态;状态更新走 progress.md。

## 模块五:快速问答(默认行为,自动触发)

**这是知识大脑的读取入口,默认开启**:你一问项目操作/约定/配置("X 命令是什么""怎么发版""怎么做镜像""X 怎么配"),我**自动先查 vault 知识库**再答,**不必等你敲 `/tcraft-obsidian-query` 或说"查 vault"**——自动识别到"这是个项目固定操作/约定问题"就查。完整规则见附属文档 [references/answers.md](references/answers.md)。要点:

- 索引 `projects/<名>/answer-index.jsonl`:**先查索引**,命中 Read 对应文档段直接答(附来源 `[[文档名]]`),跳过搜索。
- 未命中 → 转**模块二**(query.md)3-tier 搜,搜到**反问要不要记进索引**(学习闭环:问得越多、答得越快)。
- 索引只存"问题→文档路径→章节",答案每次读 doc 实际内容(防过时)。
- 写索引前展示草稿确认;只记固定问题,开放性排查(如"这 bug 怎么查")不走这里,走代码理解/搜索。

## 模块六:标签维护

**标签真源**:vault 根的 `tags-cheatsheet.md`(init 生成)。维护前先读;新标签先加到表再用,避免同义分裂。

1. 列标签:有 CLI `obsidian tags`;无 CLI `rg -o "#[A-Za-z0-9/_-]+" <vault> | sort | uniq -c` + 扫 frontmatter `tags:`。
2. 识别问题:同义(`#bug` vs `#缺陷`)、大小写不一、前缀冗余(如 `项目/xxx`、`类型/xxx` 应拍平为 `xxx`)。
3. 提议归并/规范化(小写+连字符,**扁平无前缀**),展示计划确认。
4. 确认后批量改:`Edit` 各笔记 inline tag 与 frontmatter `tags`。

**写笔记时标签约定**:优先 frontmatter `tags`;命名小写+连字符,**扁平无前缀**(直接写 `t-craft`、`my-project` 这类,不加 `项目/`、`类型/` 等层级前缀);一卡 2-5 个,不滥用。

## 与 emoji-helper 联动

写卡片/文档/周报时,emoji 不在本 skill 硬编码,统一按附属文档 [references/emoji-helper.md](references/emoji-helper.md) 查询(完整速查表 emoji-cheatsheet.md 同目录)。vault 根的 `emoji-cheatsheet.md`(init 生成)是常用集对照,可覆盖。

emoji 原则:语义对应、一处一个、不堆砌、**不进标签本身**(Obsidian 标签不含 emoji,emoji 只作标题/章节/速查表的视觉对照)。card_type 图标每张卡标题行首带一个;章节标题可配语义 emoji。

## 与 fireworks-tech-graph 联动(方案配图)

写方案需要配图(架构图、流程图、泳道图、C4、时序等)时,调用 `fireworks-tech-graph`(外部 skill,经 t-craft marketplace 装)生成,嵌入笔记:

1. **调用 fireworks-tech-graph**:描述要画的图(如"画 X 系统架构图,含 A/B/C 组件与数据流"),让它生成 **PNG**(Obsidian 渲染最稳)。
2. **存 vault 附件**:图片存 `projects/<名>/assets/<图名>.png`(per-project 附件夹;没有就建)。
3. **嵌入笔记**:在需求 prd 相应位置加 `![[<图名>.png]]`(wikilink embed)。
4. **图名带语义**:如 `认证方案-架构图.png`,便于检索。

注意:fireworks-tech-graph 需 Python + cairosvg / librsvg(详见其 README);没装就提示用户装,或退化为 mermaid 文本图(Obsidian 支持 ` ```mermaid ` 代码块)。

## 统一 frontmatter

```yaml
---
title: 
card_type: wiki          # wiki|技术|周记;论文卡走 research-skills;术语等通用知识进 skill 仓库;需求类用 requirements/ 文件夹
project:                 # 归属项目(papers/tech/weekly 类可空)
status: 草稿             # 草稿|定稿|进行中|归档
date: 2026-08-02
tags: []
aliases: []
---
```

## 通用约定

- **写入前展示草稿确认**:改 vault 前展示将做的操作,不擅自执行。
- **以 vault 文件实际内容为准**:读 vault 与项目 CLAUDE.md,不凭记忆。
- **vault 路径不硬编码**:运行时从配置发现;跨机器用 env。
- **检索只读**:查询不改 vault(写 answer-index 除外,写前确认)。
- **初始化幂等**:不覆盖、不删除已有内容。
- **失败要明确**:vault 没找到/CLI 不可用/文件不存在,停止并告知。
- **与 git-guidelines 分工**:CHANGELOG 短条目归 `git-guidelines`(code-skills plugin 内,CHANGELOG 为其附属文档);长方案/设计文档归本 skill 落 vault。
