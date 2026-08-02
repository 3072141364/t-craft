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
│       ├── 方案/                      # 方案卡片
│       ├── 升级/                      # 升级卡片
│       ├── 修复/                      # 问题修复卡片
│       ├── 会议/                      # 项目会议卡片
│       └── 附件/                      # 图/截图等附件(方案配图存这)
├── 通用/                              # 跨项目通用卡片
│   ├── 术语/                          # 术语卡片(概念词典)
│   ├── AI/  工具/  规范/  环境/       # 按主题
├── 日程/                              # 时间维卡片
│   ├── 周报/                         # 周记卡片 W<ww>-<周一YYYYMMDD>.md
│   └── 日记/                         # 日记卡片(可选)
├── 模板/                              # 卡片模板(每种 card_type 一张)
└── 归档/                              # 已完成项目
```

## 卡片 = 概念/模板,不是文件夹

- `card_type`(frontmatter)决定类型与骨架;文件夹决定位置。
- 没有"卡片"文件夹--卡片住在它该住的地方。
- 一卡一事,内聚有信息量,带 frontmatter + 双链。

### card_type ↔ 默认位置

| card_type | 装什么 | 默认位置 |
|-----------|--------|---------|
| 方案 | 设计方案 | `项目/<名>/方案/` |
| 升级 | 升级/迁移文档 | `项目/<名>/升级/` |
| 问题修复 | bug 完整修复方案 | `项目/<名>/修复/` |
| 会议 | 会议记录 | `项目/<名>/会议/` 或 `日程/` |
| 周记 | 周报 | `日程/周报/` |
| 日记 | daily note | `日程/日记/` |
| 术语 | 通用概念定义 | `通用/术语/` |
| 决策 | 选型/取舍+理由 | `项目/` 或 `通用/` |
| 踩坑 | 错误+根因+解法 | `项目/` 或 `通用/` |
| 模式 | 可复用做法 | `通用/` |
| 事实 | 不显然的系统约束 | `通用/` |

## 卡片库 Base(Obsidian Bases)

vault 根的 `卡片库.base` 是动态数据库视图,自动按 `card_type`/`project`/`status` 汇总所有卡(视图:按类型 / 进行中 / 按项目),无需手维护链接。`INDEX.md` 用 `![[卡片库.base]]` 嵌入它当首页。改 frontmatter(`card_type`/`project`/`status`)即自动反映到 Base。

## 命名约定

| 类型 | 格式 | 示例 |
|------|------|------|
| 周记 | `W<两位周>-<当周一YYYYMMDD>.md` | `W31-20260727.md` |
| 方案 | `<方案名>.md` | `日志方案.md` |
| 升级 | `<版本>.md` | `v2.0.0.md` |
| 问题修复 | `<问题简述>.md` | `obsidian-CLI检测失效.md` |
| 项目首页 | `README.md` | - |

周记周号两位补零(W01–W53),日期取 ISO 周的周一。

## 标签约定

- 小写 + 连字符,层级用 `/`。
- `项目/<名>`、`类型/方案|升级|问题修复|会议|周记|术语|决策|踩坑|模式|事实`、`状态/草稿|已定|进行中|归档`。
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
