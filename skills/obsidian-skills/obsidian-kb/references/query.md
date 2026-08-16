
# 文档查询(query)

> obsidian-kb 的附属文档:vault 省 token 查询(3-tier 读)。查 vault / 旧方案 / 历史笔记时读本文。

Obsidian vault 的**省 token 查询** skill:不每次读全文,按相关性分级读。核心机制——每文档维护 frontmatter `summary` 字段(一行全文概述),查询时按 summary 判相关性,三级读:

- **无关**:跳过,不读。
- **弱相关**:只读 summary,判断是否要用。
- **强相关**:精读全文。

设计意图:naive 查询会读一堆全文,token 爆炸且噪声多。按 summary 先判相关性,只精读真正相关的,省 token 又准。summary 是写卡时维护的(由 obsidian-kb 模块一/三写卡流程负责),本文只读用它判定。

## 何时触发

**显式 + 意图匹配**。以下场景触发:

- 用户说"查 vault""查 obsidian""之前怎么做的""有没有相关笔记""查旧方案""找一下笔记里有没有 X"等。
- brainstorm 深挖需求时联动查旧方案(阶段①)。
- project-doc 写方案时查相关旧方案/踩坑(阶段②)。
- project-doc review(阶段④)查历史评估/方案对照。

**不触发**:

- 写笔记/沉淀卡片(走 obsidian-kb)。
- 只是看代码/闲聊。
- vault 路径未配置且用户不愿提供(停止,不猜测)。

## 前置:发现 vault 与项目约定(不硬编码)

vault 路径与联通方式同 obsidian-kb,细节见 `references/vault-conventions.md`:

1. **发现 vault 路径**:从 `OBSIDIAN_VAULT` env / `.claude/skills-config.json` 的 `obsidian-kb.vault` / 项目 CLAUDE.md 读。读不到就**直接问用户**(AskUserQuestion),不猜、不扫盘。
2. **读项目 CLAUDE.md**:取文件夹结构、标签规范;若引用规范文档一并读。
3. **联通方式**:文件操作为主(`rg`/`Read`),检测到 `obsidian` CLI(`obsidian help` 能跑)时优先用 `obsidian search`/`backlinks` 增强,无 CLI 文件操作兜底,不阻塞。

以文件实际内容为准,不凭记忆。

## 核心:3-tier 查询流程

只读检索,不修改 vault。

### Step 1:粗筛(缩小候选范围)

按查询意图,用标签/关键词/card_type 缩小候选,不全文扫描:

- **按 card_type**:若查询明显属某类(查方案→`card_type: 方案`,查术语→`card_type: 术语`),先按类型过滤。
- **按 tags**:用 frontmatter `tags` 过滤(如查 t-craft 相关 → `#t-craft`,扁平无前缀)。
- **按关键词**:用 `rg`/`obsidian search` 检索标题 + summary + 正文关键词。

```bash
# 无 CLI:检索含关键词的笔记
rg -l -i "<词>" <vault>
# 检索 frontmatter tags/card_type
rg -l "card_type: 方案" <vault>
rg -l "#t-craft" <vault>
# 有 CLI
obsidian search query="<词>"
```

产出:**候选笔记列表**(标题 + 路径)。这一步不读全文,只列候选。

### Step 2:按 summary 判相关性(3-tier 读)

对每个候选,读 frontmatter `summary` 字段(一行全文概述),判三级:

| 级别 | 判定 | 动作 |
|---|---|---|
| **无关** | summary 与查询无关 | 跳过,不读全文 |
| **弱相关** | summary 有部分相关 | 只读 summary,判断是否要用,不读全文 |
| **强相关** | summary 高度相关 | 精读全文 |

判相关性靠读 summary 这一行(几十字),而非全文(可能上千字),省 token。

**summary 缺失时**:若笔记无 summary 字段(老笔记/未维护),退化为读首段或前几行判相关性,并在结果里标注"该笔记缺 summary,建议补"(提示用户/obsidian-kb 维护)。

### Step 3:沿链接扩展(可选)

对强相关笔记,看其链向谁、谁链向它,发现更多相关:

- **有 CLI**:`obsidian backlinks`。
- **无 CLI**:`rg -l "\[\[<笔记名>\]\]" <vault>`(找谁链向它);读笔记正文里的 `[[...]]`(看它链向谁)。

新发现的笔记按 Step 2 分级读。

### Step 4:汇总返回

不倾倒全文,分级返回:

```markdown
## 查询结果:<查询意图>

### 强相关(精读全文)
- [[需求名]] `projects/<名>/requirements/<需求名>/prd.md`
  summary: <一行概述>
  摘要:<几句关键点>

### 弱相关(只读 summary)
- [[术语名]] 通用知识进 skill 仓库;项目知识 `projects/<名>/wiki/术语名.md`
  summary: <一行概述>
  (判断是否要用,需要再精读)

### 无关跳过
N 篇(列出标题供参考,不读)
```

强相关附几句摘要;弱相关只给 summary;无关只列标题。token 消耗从大到小分级,无关的不浪费。

## summary 维护约定

- **每张卡 frontmatter 维护 `summary: 一行全文概述`**,写卡时即守(由 obsidian-kb 模块一/三写卡流程负责,本文不维护)。
- summary 一行,概括这张卡讲什么、关键结论,便于查询时判相关性。
- 本文只读 summary 做判定;缺失时退化读首段并提示补充。

## 与其他 skill 的关系

- **obsidian-kb**:负责写卡 + 维护 summary + 沉淀;obsidian-query 负责查。obsidian-kb 模块二(文档查询)调用本文做 3-tier 查询。
- **brainstorm**(阶段①):深挖需求时联动查旧方案,用本文省 token 读。
- **project-doc**(阶段②):写方案时查相关旧方案/踩坑。
- **project-doc review**(阶段④):查历史评估/方案对照。

## 通用约定

- **只读不改 vault**:查询不修改任何笔记。
- **省 token 是核心约束**:无关跳过,弱相关只读 summary,强相关才精读。不倾倒全文。
- **以项目文件实际内容为准**:vault 路径/约定从配置/CLAUDE.md 读,不凭记忆。
- **失败要明确**:读不到 vault 路径且用户未提供 → 停止并提示,不猜测路径。
- **summary 缺失退化**:无 summary 的笔记退化读首段,标注提示补充。

## 附:参考来源

- summary + 3-tier 读策略:用户自创思路(见 MEMORY.md「偏好」),mattpocock 无对应,弱参考。
- 检索 + 沿链接扩展 + CLI 增强:本仓库 obsidian-kb 模块三 + + `references/vault-conventions.md`。
- 项目约定发现三层写法:本仓库 code-guidelines / git-guidelines skill。
