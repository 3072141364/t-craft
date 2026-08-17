# Vault 结构与约定

## vault 发现

vault 路径不自动探测,从显式配置读;读不到就问用户。

1. **env `OBSIDIAN_VAULT`**:vault 根绝对路径。**跨机器推荐**--每台机器在 shell 配置(~/.bashrc / ~/.zshrc)设一次,所有项目共用。
2. **`.claude/skills-config.json`**(约定的"写死"位置):读 `obsidian-kb.vault`。同段可写 `projectsFolder` 覆盖默认。
3. **项目 CLAUDE.md**:写明的 vault 路径,等同 skills-config.json。
4. **都没有 -> 问用户**:AskUserQuestion 要路径,本次记住,建议写进配置。

不做 obsidian 注册表探测、不扫 `.obsidian/` 标记--显式配置或问用户,二选一。

skills-config.json 示例(仅当约定偏离默认时才需写):

```json
{
  "obsidian-kb": {
    "vault": "/home/wz/文档/default",
    "projectsFolder": "projects"
  }
}
```

## vault 结构(由 `scripts/init_vault.sh` 生成;目录统一英文)

```
<vault>/
├── INDEX.md                          # vault 首页(嵌入 cards.base)
├── cards.base                        # Obsidian Bases:按 card_type / 进行中需求 / project 动态汇总
├── tags-cheatsheet.md                # 标签真源(扁平无前缀,seed 生成)
├── emoji-cheatsheet.md               # emoji 对照(seed 生成)
├── tasks-status-cheatsheet.md        # checkbox 扩展符号对照(seed 生成)
├── people.md                         # 人员花名册(seed 生成,随用随加)
├── projects/                         # 项目开发(按项目)
│   └── <项目名>/
│       ├── README.md                 # 项目 MOC:简介 + 链向 wiki 与各需求
│       ├── reference.md              # 该项目核心通用外部资料链接
│       ├── wiki/                     # 项目级知识(不随单一需求走)
│       │   ├── dev-setup.md          #   开发环境搭建
│       │   ├── api-docs.md           #   API 文档
│       │   └── roadmap.md            #   路线图
│       ├── workflow/                 # 项目特定流程(可照着执行)
│       │   ├── release.md            #   发版流程
│       │   ├── test.md               #   测试流程
│       │   └── build-image.md        #   制作镜像
│       ├── assets/                   # 图/截图等附件
│       └── requirements/             # 一需求一文件夹
│           └── <需求名>/
│               ├── prd.md            #   需求规格(阶段② project-doc 产出)
│               ├── adr.md            #   本需求关键设计决策
│               ├── test.md           #   测试计划 + 结论(阶段④)
│               ├── review.md         #   评估审查报告(阶段④)
│               └── progress.md       #   状态真源(status 接 dev-flow 六阶段)
├── papers/                           # 论文阅读(一论文一卡;归 research-skills 的 paper-study 管理)
│   ├── reading-list.md               #   待读队列 + 已读索引
│   └── <论文名>.md                    #   frontmatter: card_type:论文 / status:待读|在读|已读
├── tech/                             # 技术学习(按主题分目录)
│   └── <主题>/                       #   如 pytorch、cuda、vector-db
│       └── <学习笔记>.md              #   概念 + 实践 + 踩坑(自由格式)
├── weekly/                           # 周报(三流汇总:开发/论文/技术)
│   └── 周记 <YYYY>-W<ww>.md
├── misc/                             # 零散卡(平铺,靠标签找,不建子目录)
│   └── <零散卡>.md                    #   不属于 projects/papers/tech/weekly 的杂项
└── archive/                          # 已完成项目
```

> 没有 `common/` 也没有 `templates/`:**跨项目可复用知识沉淀到 skill 仓库**,**卡片模板在 skill 仓库**(`obsidian-kb/assets/templates/`),vault 放三条工作流(项目/论文/技术)+ 周报 + 杂项。init 脚本建顶层空壳;`projects/` 内的 `wiki/`/`assets/`/`reference.md` 按需建;`requirements/<需求名>/` 由 brainstorm(阶段①)/tcraft-project-doc(阶段②)按需创建。

## 四类组织

- **需求 = 文件夹**(过程单元):一需求一文件夹,固定五个产出物(prd/adr/test/review/progress)。`progress.md` 的 `status` 是状态真源(接 dev-flow 六阶段)。
- **项目知识 = 卡片**(`projects/<名>/wiki/`):开发环境搭建、API、roadmap、部署运维、项目技术笔记。`card_type` 决定类型,一卡一事。
- **跨项目可复用知识 = skill 仓库**(不进 vault):术语、通用机制、规范、通用踩坑经验,沉淀到 skill 仓库(如 `code-guidelines` 的附属文档),随插件跨机器生效。判断标准:"换个项目还用得上吗?" 用得上 → skill 仓库;只对本项目成立 → 项目 `wiki/` 或需求文件夹。
- **零散卡 = misc**(`misc/`):不属于 projects/papers/tech/weekly 任何体系的杂项卡,**平铺不建子目录,靠标签管理**。判断标准:先想归哪类,都归不上才进 misc。

### card_type ↔ 默认位置(项目知识卡;按需扩充)

| card_type | 装什么 | 默认位置 | 文件名 |
|-----------|--------|---------|--------|
| 论文 | 论文阅读卡(走 research-skills 的 paper-study,笔记骨架见其 references/note.md) | `papers/` | `<论文名>.md` |
| 技术 | 技术学习笔记(概念+实践+踩坑) | `tech/<主题>/` | `<主题/笔记>.md` |
| wiki | 知识词条(概念/背景解释,项目级) | `projects/<名>/wiki/` | — |
| 流程 | 项目特定规范操作(发版/测试/镜像,可照着执行) | `projects/<名>/workflow/` | `<流程名>.md` |
| 周记 | 周报(三流汇总) | `weekly/` | `周记 <YYYY>-W<ww>.md` |

> 术语等通用概念定义不放 vault,进 skill 仓库。卡片模板在 skill 仓库 `assets/templates/`(需求级 prd/progress/adr/test/review + 知识卡 weekly);论文卡模板在 research-skills 的 paper-study `assets/templates/paper.md`。按需从技能仓库取用。

## 需求文件夹约定

- 需求名用英文短名(如 `export-pdf`、`e2-radar-adapter`),文件夹即需求名。
- 五个固定文件名(小写):`prd.md` / `adr.md` / `test.md` / `review.md` / `progress.md`。固定名让 dev-flow / project-doc 知道往哪写、从哪读。
- `progress.md` frontmatter `status`:`①头脑风暴 → ②方案 → ③实现 → ④验证 → ⑤发布 → ⑥沉淀`,dev-flow 每流转一阶段改一次。**它是需求状态真源**,规则见附属文档 `references/progress.md`。
- 需求内可复用的设计/踩坑,阶段⑥提炼为 skill 仓库知识;需求文件夹保留完整历史。
- 项目完成 -> `projects/<名>/` 整体进 `archive/`。

## 项目级约定

- **项目 reference.md**:每个项目下建 `projects/<名>/reference.md`(模板在 `assets/reference.md`),记录该项目**核心通用**的外部资料链接,分内部资料(飞书 wiki/Artifactory/Harbor/内部系统)与外部资料(官方文档/开源项目)。需求相关的资料归对应需求,不进 reference。随用随补。
- **项目 README.md**:MOC,简介 + 链向 wiki 与各需求。
- **wiki/**:项目知识性内容(开发环境搭建、API、roadmap、部署运维),跨需求复用,不进任何单一需求文件夹。
- **workflow/**:项目**特定**的可照着执行的流程(发版、测试、制作镜像等),一流程一张。判断标准:**跨项目也能用 → 提炼进 skill 仓库,不进 vault**;只对本项目成立 → `workflow/`。

## 周报与需求进度

- **周报**(`weekly/周记 <YYYY>-W<ww>.md`):记录本周三流(开发/论文/技术)的「事情」,是事情流水 + 沉淀指针。规则见附属文档 `references/weekly.md`。
- **需求进度**(`requirements/<需求名>/progress.md`):需求的**状态真源**,接 dev-flow 六阶段。规则见附属文档 `references/progress.md`。
- **分工**:周报记事情,progress 记状态;周报引用需求只链 progress,不重复维护状态。

## cards.base(Obsidian Bases)

vault 根的 `cards.base` 是动态数据库视图,自动汇总(视图:按 card_type / 进行中需求 / 按项目),无需手维护链接。`INDEX.md` 用 `![[cards.base]]` 嵌入它当首页。「进行中需求」视图按 `requirements/*/progress.md` 的 `status` 过滤,所有进行中的需求一眼可见。改 frontmatter(`card_type`/`project`/`status`)即自动反映到 Base。

## 命名约定

| 类型 | 格式 | 示例 |
|------|------|------|
| 目录 | 英文小写(项目名可中文) | `projects/<项目名>/` |
| 需求文件夹 | 英文短名 | `export-pdf` |
| 需求文档 | 固定名 | `prd.md` / `progress.md` |
| 周记 | `weekly/周记 <YYYY>-W<两位周>.md` | `周记 2026-W32.md` |
| 论文 | `papers/<论文名>.md`(笔记骨架见 research-skills 的 paper-study) | `attention-is-all-you-need.md` |
| 零散卡 | `misc/<名>.md`(平铺,靠标签) | `some-random-note.md` |
| 项目首页 | `README.md` | - |

## 标签与 emoji

- **扁平无前缀**:小写 + 连字符,直接写 `t-craft`、`my-project` 这类,不加 `projects/`、`类型/`、`状态/` 等层级前缀。
- **完整标签与 emoji 对照见 vault 根的 `tags-cheatsheet.md` / `emoji-cheatsheet.md`**(init 生成);emoji 向附属文档 emoji-helper.md 查询,不进标签本身。

## 初始化与迁移

- `scripts/init_vault.sh <vault>` 幂等:建英文目录(`projects/`、`papers/`、`tech/`、`weekly/`、`misc/`、`archive/`)、铺种子速查表与 `cards.base`(vault 根)、建 `INDEX.md`;已存在跳过,不覆盖不删除。**不复制模板进 vault**(模板在 skill 仓库)。
- 旧版中文目录 vault(项目/通用/日程/模板/归档)迁移:按英文名对应移动(`项目`→`projects`、`归档`→`archive`、`日程/周报`→`weekly`)。`通用/` 下的跨项目知识卡提炼进 skill 仓库(去项目化后),或并入相关项目 `wiki/`;`模板/` 丢弃(vault 不用模板,模板在 skill 仓库);`日程/日记` 按需迁入 `daily/`(可选)。需求卡平铺(如 `feat-xxx.md`)迁入 `requirements/<需求名>/` 结构。跨机器记录路径用 env `OBSIDIAN_VAULT`。
