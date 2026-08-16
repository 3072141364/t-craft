---
name: paper-study
description: 论文研究管理。当用户要读论文、记论文笔记、维护待读队列、整理阅读清单、查找相关论文、把论文思路关联到项目/技术时使用。管理 vault `papers/`(一论文一卡 + reading-list),覆盖阅读工作流(待读→粗读→精读→已读)、论文笔记写法、与周报论文节联动。落盘/查询/标签等 vault 机制走 obsidian-kb(同 ecosystem,本 skill 管论文研究专属逻辑)。技术学习不走专属 skill,在 obsidian-kb 的 `tech/` 逐渐沉淀即可。
---

# Paper Study(论文研究管理)

管理**论文研究**这条工作流:vault `papers/` 一论文一卡 + 待读队列,从收集到读完,笔记与阅读状态可检索、可追溯。

设计意图:读论文是个持续过程——看到一篇先存进队列,有空粗读判价值,值得的精读记笔记,思路接到项目和手上技术。散着读会丢,专门管理才能让「读过的都变成可复用的东西」。

**附属文档**(渐进披露,用到才读):

- [references/reading-flow.md](references/reading-flow.md) -- 阅读工作流:待读队列 → 粗读 → 精读 → 已读,状态怎么流转。
- [references/note.md](references/note.md) -- 论文笔记写法:paper.md 骨架、为什么读/核心内容/与我关联/批判待验证。
- [references/reading-list.md](references/reading-list.md) 相关:队列维护在 vault `papers/reading-list.md`。

## 何时触发

- **收论文**:"看到一篇论文,先记下来""收藏这篇""加进待读"。
- **读论文**:"读这篇论文""这篇讲什么"。
- **记笔记**:"给这篇记个笔记""这篇的核心方法是什么"。
- **查论文**:"之前看过关于 X 的论文吗""相关论文有哪些"。
- **整理**:"整理阅读清单""这周读了哪些论文"。

**不触发**:

- 查 vault 其他内容(走 obsidian-kb 模块二查询)。
- 写代码/技术学习(分别走 code-skills / obsidian-kb tech/ 沉淀)。

## vault 结构(papers/)

```
papers/
├── reading-list.md         # 待读队列 + 已读索引(按状态/主题)
└── <论文名>.md              # 一论文一卡(frontmatter card_type:论文)
```

- 论文卡模板在 skill 仓库 `assets/templates/paper.md`,不从 vault 取。
- 论文卡与项目/技术互链:`[[projects/<名>]]` / `[[tech/<主题>]]`。
- 与周报联动:周报「本周论文」节链到本周读的论文卡。

## 阅读工作流(概览)

待读(reading-list)→ 粗读(abstract/结论判价值)→ 精读(记笔记,paper.md 状态「在读」→「已读」)。完整流程见 [references/reading-flow.md](references/reading-flow.md)。

## 论文笔记(概览)

一篇论文一张卡,frontmatter `status: 待读|在读|已读` + 元数据(authors/year/venue/tags);正文四节:**为什么读 / 核心内容(问题·方法·结果)/ 与我关联(项目·技术)/ 批判·待验证**。写法见 [references/note.md](references/note.md)。

## 与 obsidian-kb 的分工

- **本 skill**:论文研究专属——阅读流程、笔记骨架、待读队列、状态流转。
- **obsidian-kb**:vault 机制——落盘(wikilink/路径合规)、查询(模块二 3-tier)、标签、卡片沉淀、周报。
- 论文卡落在 `papers/`,但**落盘动作走 obsidian-kb**,保证路径/双链/标签合规。

## 技术学习(无专属 skill)

技术学习不建专属 skill:日常学习笔记直接落 obsidian-kb 的 `tech/<主题>/`(概念 + 实践 + 踩坑),随积累沉淀;提炼出的可复用方法论再进 skill 仓库。论文里学到的技术点也接到 `tech/`。

## 通用约定

- **以 vault 文件实际内容为准**:读 vault 与项目 CLAUDE.md,不凭记忆。
- **每步确认**:写卡/改状态前展示草稿给用户确认。
- **落盘走 obsidian-kb**:不自行写 vault 文件,调 obsidian-kb 保证 frontmatter/路径/双链合规。
- **失败要明确**:vault 路径读不到则停止并提示,不猜测。
