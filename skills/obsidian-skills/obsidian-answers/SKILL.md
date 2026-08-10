---
name: obsidian-answers
description: 已知答案的固定问题先查索引直接答,查不到再搜 vault,搜到反问是否记进索引。当用户问"X命令是什么""X怎么做""之前查过的X""构建/发版/部署/初始化怎么搞"等答案是某篇文档已有的固定操作约定类问题时使用——先查 <vault>/项目/<项目名>/answer-index.jsonl,命中就 Read 对应文档段直接答,跳过 grep;未命中转 obsidian-query 搜,搜到后反问要不要记进索引,下次直接答。也可被其他 skill(obsidian-kb 模块二)调用作一层缓存。机制通用,索引内容放 vault 随 vault 跨机器,skill 仓库零项目特定信息。
---

# Obsidian Answers(已知答案索引 + 自动学习)

固定/常问问题(命令、流程、约定类)的**索引缓存**:答案已在某篇文档里,但每次 grep 一遍 vault 才找到太慢。把"问题→文档"映射记进索引,下次命中直接 Read 那篇文档答,跳过搜索;查不到再搜,搜到反问要不要记,形成"查→命中直接答 / 未命中→搜→学"闭环。

设计意图:obsidian-query 解决"从零搜"(grep+summary 3-tier 读),但没缓存——同一个固定问题每次都从头搜。本 skill 补一层**已知答案索引**,把高频固定问题的"问题→文档路径→章节"记下来,命中 1 次 Read 直接答,省掉粗筛+分级读的整条链路。索引内容是项目特定的(哪个问题→哪篇文档),放 vault 项目文件夹随 vault 跨机器同步;机制是通用的(查索引→命中答→未命中搜→学),放本 skill。

## 何时触发

- **固定/常问的操作约定问题**:用户问"X命令是什么""X怎么做""构建/发版/部署/初始化/打包怎么搞""之前查过的X"——答案是某篇文档已写好的固定操作。
- **被其他 skill 调用**:obsidian-kb 模块二查文档前先调本 skill,命中跳过搜索。
- 意图触发:用户没说 skill 名,只要意图是"查一个固定操作/约定/命令"就触发。

**不触发**:
- 开放性排查/分析("这个 bug 怎么查""这段逻辑有没有问题")——答案不在某篇文档,走 obsidian-query 搜或读代码。
- 写卡/沉淀(走 obsidian-kb)。
- 纯代码理解(走 code-intelligence)。
- vault 路径未配置且用户不愿提供(停止,不猜)。

## 前置:发现 vault、项目、索引文件(不硬编码)

三层发现,跟 obsidian-kb / obsidian-query 一致:

1. **发现 vault 路径**:env `OBSIDIAN_VAULT` / `.claude/skills-config.json` 的 `obsidian-kb.vault` / 项目 CLAUDE.md。读不到直接问用户(AskUserQuestion),不猜、不扫盘。细节见 obsidian-kb 的 `references/vault-conventions.md`。
2. **发现项目名**:当前 git 仓库目录名 → 匹配 vault `项目/` 下文件夹;匹配不到读 CLAUDE.md 推断;都没有问用户。
3. **定位索引文件**:`<vault>/项目/<项目名>/answer-index.jsonl`。不存在则首次写时创建(目录已在 init_vault 建好)。

以 vault 文件实际内容为准,不凭记忆。

## 索引条目格式(jsonl,一行一条)

```json
{"q":"构建镜像命令","tags":["build","docker","镜像"],"doc":"项目/<项目名>/workflow/<发版流程文档>.md","section":"重建镜像","summary":"bash script/build.sh(默认不带后缀),build后手动push","hits":0,"updated":"2026-08-10"}
```

| 字段 | 说明 |
|------|------|
| `q` | 问题关键词短语(用户会怎么问的浓缩),匹配用 |
| `tags` | 关键词数组,匹配用(词维度补充 q) |
| `doc` | vault 相对路径(到 .md 文件) |
| `section` | 章节标题/锚点定位(可空,空则读全文) |
| `summary` | 一行答案摘要(快速预览 + 防重复判重) |
| `hits` | 命中次数,写时 0,每次命中 +1 |
| `updated` | 最后更新日期(YYYY-MM-DD) |

## 核心:查询流程

### Step 1:查索引(命中优先)

Read 整个 `answer-index.jsonl`(条目量小,几十条级别)。把用户问题拆关键词,与每条的 `q` + `tags` 做文本包含匹配:

- 拆词:把问题切成关键词(`构建镜像命令` → `构建` `镜像` `命令`)。
- 匹配:每条统计命中词数,按命中数降序。
- **高置信**(命中 ≥2 词或 q 高度重合):取最高分条目。
- **低置信 / 无命中**:转 Step 3。

```bash
# 读索引(不存在则首次查时降级到搜索)
cat "<vault>/项目/<项目名>/answer-index.jsonl" 2>/dev/null || echo "__NO_INDEX__"
```

### Step 2:命中 → Read 文档段直接答

取命中条目的 `doc`,Read 对应 `section` 段(无 section 读全文)。**基于文档实际内容回答,不凭 `summary` 硬答**——索引的 summary 只是预览,文档可能已更新,以实际内容为准(防过时)。答末附来源:

```markdown
> 来源:[[<文档名>]] · `<section>`
```

`hits` +1(命中次数刷新,用 Edit 改 jsonl 对应行)。冷条目维护见后。

### Step 3:未命中 → 转调 obsidian-query 搜

索引无命中或低置信,转调 `obsidian-query`(同 plugin)做 3-tier 省 token 搜索:粗筛 → 按 summary 分级读 → 沿链接扩展。本 skill 不重复实现搜索逻辑。

返回结果按 obsidian-query 的分级格式(强/弱/无关)。

### Step 4:搜到 → 学习闭环(反问要不要记)

obsidian-query 搜到、回答完后,**反问用户**:

> 这条值得记进索引吗?下次问类似问题直接答,跳过搜索。

- **同意**:提炼 `q`(问题浓缩)+ `tags`(关键词)+ `doc`/`section`(搜索命中的文档)+ `summary`(一行答案摘要),展示草稿确认后写 jsonl。
- **不同意**:跳过,不写。
- **重复检测**:写前扫现有索引,若已有条目 `doc`+`section` 重合或 `q` 高度相似,改为**更新**(合并 tags、刷新 doc/section/summary、hits 归零),不新建重复条目。

## 被其他 skill 调用(底层能力)

obsidian-kb 模块二、其他 skill 查文档前可先调本 skill:

1. 调本 skill 查索引。
2. **命中**:返回 `doc`+`section`+`summary`,调用方直接 Read 对应段,跳过搜索。
3. **未命中**:返回"未命中",调用方自行走 obsidian-query 搜;搜到后可再调本 skill 的"学习"步骤记索引。

调用方约定:本 skill 返回结构化结果(命中条目或"未命中"),不替调用方组织回答。

## 索引维护

- **重复检测**:每次写前扫现有索引,`doc`+`section` 重合或 `q` 高度相似 → 更新而非新建。
- **失效检测**:命中后 Read doc 失败(文件移动/删除/section 不存在)→ 标记该条失效,转 obsidian-query 搜重建,搜到更新 doc/section,搜不到提示用户该条已失效。
- **冷条目清理**(可选,用户触发):`hits`=0 且 `updated` 超 3 个月 → 提示是否删除;不自动删。
- **不维护内容正确性**:索引只存"问题→文档路径",不存答案正文(正文每次读 doc 实际内容),文档更新不影响索引有效性。

## 写索引的防噪声约定(对应"反问确认")

- **只记固定问题**:开放性排查、一次性问题不记(用户多半会拒绝,自然过滤)。
- **summary 一行**:供快速预览和重复判重,不是答案本身(答案每次读 doc)。
- **q 浓缩成关键词短语**:不记完整原句,便于关键词匹配("构建镜像命令"而非"那个镜像怎么构建来着")。
- **tags 补词维度**:q 没覆盖的同义词/英文词放 tags(如 q="构建镜像",tags 加 `["docker","build","image"]`)。

## 与其他 skill 的关系

- **obsidian-query**:本 skill 未命中时转调它搜;它是纯搜索无缓存,本 skill 是其上层的命中缓存层。两者互补:query 解决"从零搜",answers 解决"已搜过的直接答"。
- **obsidian-kb**:模块二查文档前可先调本 skill;本 skill 的学习步骤(写 jsonl)与 obsidian-kb 的写卡(写 .md)不冲突,各管各的存储。
- **brainstorm / spec-doc**:查旧方案/约定时可先调本 skill,命中省一次搜索。

## 通用约定

- **查询只读**:查索引、读 doc 不改 vault(写索引除外,且写前确认)。
- **以 doc 实际内容为准**:命中后读 doc 实际内容回答,不凭 summary 硬答(防过时);doc 路径失效则重建。
- **写索引前展示草稿确认**:反问后提炼草稿,用户同意才写 jsonl。
- **vault/项目名读不到 → 停止问用户**:不猜路径、不扫盘。
- **失败要明确**:索引文件读不到(首次查询,不存在)→ 降级到 obsidian-query 搜,不报错;doc Read 失败 → 标记失效重建。
- **零项目特定信息**:本 skill 仓库不含任何具体项目、命令、路径;所有项目特定内容在 vault 的 answer-index.jsonl。

## 附:参考来源

- 索引缓存 + 学习闭环:用户自创思路("固定问题优先查指定文档,自动记录,脱敏项目沉淀进 skill")。
- vault 发现 + 三层项目约定:本仓库 obsidian-kb / obsidian-query,`references/vault-conventions.md`。
- 项目约定发现三层写法:本仓库 karpathy-guidelines / git-flow / make-shortcut skill。
