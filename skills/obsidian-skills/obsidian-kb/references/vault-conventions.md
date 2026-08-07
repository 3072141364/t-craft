# Vault 结构与约定

## vault 发现

vault 路径不自动探测,从显式配置读;读不到就问用户。

1. **env `OBSIDIAN_VAULT`**:vault 根绝对路径。**跨机器推荐**--每台机器在 shell 配置(~/.bashrc / ~/.zshrc)设一次,所有项目共用。
2. **`.claude/skills-config.json`**(约定的"写死"位置):读 `obsidian-kb.vault`。同段可写 `projectsFolder`/`cardsFolder`/`tagPrefix` 覆盖默认。
3. **项目 CLAUDE.md**:写明的 vault 路径,等同 skills-config.json。
4. **都没有 -> 问用户**:AskUserQuestion 要路径,本次记住,建议写进配置。

不做 obsidian 注册表探测、不扫 `.obsidian/` 标记--显式配置或问用户,二选一。

skills-config.json 示例(仅当约定偏离默认时才需写):

```json
{
  "obsidian-kb": {
    "vault": "/home/wz/文档/default",
    "projectsFolder": "项目",
    "tagPrefix": "项目"
  }
}
```

## vault 结构(由 `scripts/init_vault.sh` 生成)

```
<vault>/
├── INDEX.md                          # vault 首页(嵌入卡片库.base)
├── 卡片库.base                       # Obsidian Bases:按 card_type/project/status 动态汇总所有卡
├── 项目/                              # 项目相关卡片(按项目)
│   └── <项目名>/
│       ├── README.md                 # 项目 MOC:简介 + 链向各卡片
│       ├── 需求/                      # 工作卡(feat-/debug-/bugfix-/tech-... 平铺)
│       ├── wiki/                     # 项目知识性内容(wiki 卡)
│       ├── reference.md              # 该项目核心通用外部资料链接
│       └── 附件/                      # 图/截图等附件(方案配图存这)
├── 通用/                              # 跨项目通用卡片
│   ├── 术语/  技术/  规范/  环境/  AI/  工具/   # 按主题
├── 日程/                              # 时间维卡片
│   └── 周报/                         # 周记卡片 周记 <YYYY>-W<ww>.md
├── 模板/                              # 卡片模板(每种 card_type 一张)
└── 归档/                              # 已完成项目
```

> init 脚本只建 `项目/` 空壳,项目内的 `需求/`/`wiki/`/`reference.md` 在开始往该项目沉淀内容时按需建。

## 卡片 = 概念/模板,不是文件夹

- `card_type`(frontmatter)决定类型与骨架;文件夹决定位置。
- 没有"卡片"文件夹--卡片住在它该住的地方。
- 一卡一事,内聚有信息量,带 frontmatter + 双链。

### card_type ↔ 默认位置(按需扩充,不强求每类有模板)

| card_type | 装什么 | 默认位置 | 文件名前缀 |
|-----------|--------|---------|-----------|
| 方案 | 设计方案(开发新功能/修复 bug) | `项目/<名>/需求/` | `feat-`/`bugfix-`/`debug-`/`hotfix-` |
| 技术 | 技术知识/实践沉淀 | 项目特定 `项目/<名>/需求/`;跨项目通用 `通用/技术/` | 项目内 `tech-`;通用不带 |
| 流程 | 规范操作记录(可照着执行) | `通用/规范/` | — |
| 术语 | 通用概念定义(类似速查表) | `通用/术语/` | — |
| wiki | 知识词条(科普性解释) | `项目/<名>/wiki/` | — |
| 周记 | 周报 | `日程/周报/` | — |

> 当前仅方案/术语/周记有模板,流程/wiki/技术等按需起草即可。项目内工作卡统一归 `需求/` 下、文件名带前缀平铺;跨项目通用技术卡放 `通用/技术/` 不带前缀。

## 卡片库 Base(Obsidian Bases)

vault 根的 `卡片库.base` 是动态数据库视图,自动按 `card_type`/`project`/`status` 汇总所有卡(视图:按类型 / 进行中 / 按项目),无需手维护链接。`INDEX.md` 用 `![[卡片库.base]]` 嵌入它当首页。改 frontmatter(`card_type`/`project`/`status`)即自动反映到 Base。

## 命名约定

| 类型 | 格式 | 示例 |
|------|------|------|
| 周记 | `周记 <YYYY>-W<两位周>.md` | `周记 2026-W32.md` |
| 项目工作卡 | `<前缀>-<名>.md`(前缀见 card_type 表) | `feat-适配e2雷达标定文件.md` |
| 通用技术卡 | `<名>.md`(不带前缀) | `overlayfs.md` |
| 术语 | `<概念名>.md` | `OBSIDIAN_VAULT.md` |
| 项目首页 | `README.md` | - |

周记周号两位补零(W01–W53),用 ISO 周一所在年的周数(Python `date.isocalendar()`)。todo 项字段格式见 SKILL.md「模块四:周报管理」。

## 标签约定

- **扁平无前缀**:小写 + 连字符,直接写 `general_process`、`t-craft`,不加 `项目/`、`类型/`、`状态/` 等层级前缀。
- 优先 frontmatter `tags`,一卡 2-5 个,不滥用。
- **完整标签与 emoji 对照见 vault 的 `通用/规范/标签速查表.md`**(init 生成,是标签真源);emoji 向 `emoji-helper` 查询,不进标签本身。

## 初始化(空 vault)

```bash
bash <skill>/scripts/init_vault.sh "<vault 路径>"
```

幂等:建目录、复制 `assets/templates/` 到 `模板/`、复制 `标签速查表.md` 与 `卡片库.base`、建 `INDEX.md`(嵌入卡片库.base);已存在跳过,不覆盖不删除。跨机器记录路径用 env `OBSIDIAN_VAULT`。

## obsidian CLI(可选增强)

检测:`obsidian help` 能跑即可用,要求 Obsidian 运行中(https://help.obsidian.md/cli )。

- `obsidian search query="词"` / `obsidian tags` / `obsidian backlinks file="名"` / `obsidian property:set file="名" key=tags value=...`
- 多 vault 用 `vault="名"`;文件用 `file="名"`(wikilink 式)或 `path="相对路径"`。

无 CLI 兜底:

| CLI | 文件操作兜底 |
|-----|------------|
| `search` | `rg -l -i "<词>" <vault>` 再 `Read` |
| `tags` | `rg -o "#[A-Za-z0-9/_-]+" <vault> \| sort \| uniq -c` + 扫 frontmatter |
| `backlinks` | `rg -F "[[<笔记名>]]" <vault>` |
| `property:set` | `Edit` frontmatter |
