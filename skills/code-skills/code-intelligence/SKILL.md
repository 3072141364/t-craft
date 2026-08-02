---
name: code-intelligence
description: 凡是需要读、导航、理解现有代码时都用此 skill--找符号、追踪谁调用谁、理解某功能怎么实现、梳理项目结构、评估改动的影响范围。按问题类型路由到最合适的工具与命令:日常调用/导入/定义用 codegraph,执行流/影响/taint/重构用 gitnexus,实时引用/定义用 LSP,纯文本用 grep。粒度从轻到重选命令以省 token,工具对得上关系类型才准。任何代码库探索或"代码怎么跑的"问题都触发本 skill,即使用户没点名具体工具--它替你选对的、最省的。索引陈旧或查询空时用 `codegraph sync` 和 `gitnexus analyze --index-only` 刷新。
---

# Code Intelligence:代码阅读与结构分析的路由

## 核心思路

理解代码(定位符号、追踪调用、搞清功能、梳理结构)优先用已索引工具,别直接 grep--一次图查询顶十几次 grep + read。**按问题类型选工具 + 命令**:命令粒度越轻越省 token,工具对得上关系类型才准。

决策:识别问题类型 -> 查下表选命令 -> 答了就停;codegraph 答不了再建议 gitnexus(让用户拍板);索引陈旧就刷新;没索引或要精确行编辑就退回 grep / read / LSP。

codegraph CLI 与 MCP 工具(`codegraph_explore` 等)输出一致,哪个可用用哪个。

## 需求 -> 工具(按问题选命令)

| 问题 | 首选 | 命令 / 动作 | 省 token / 准 的点 |
|------|------|------------|-------------------|
| "X 是什么 / 定义在哪"(要源码) | codegraph | `node <name>` | 单符号源码 + 位置 |
| 找符号位置(不要源码) | codegraph | `query <名> -k function\|class` | 只回位置,最轻 |
| "谁调用 X" | codegraph | `callers <symbol>` | 只回调用方列表 |
| "X 调用什么" | codegraph | `callees <symbol>` | 只回被调列表 |
| "X 这块怎么运作" | codegraph | `explore "<X>"` | 源码 + 调用路径一次拿全--主力 |
| 改 X 影响什么(快瞥) | codegraph | `impact <symbol>` | 浅、省,探索用 |
| 改动文件的测试覆盖 | codegraph | `affected [files...]` | 受影响测试文件 |
| 项目结构 / 索引状态 | codegraph | `files` / `status` | 一次拿树 / 过期检查 |
| 改 X 影响什么(深 / 要编辑) | gitnexus | 读 `gitnexus-impact-analysis` | 带置信度,准 |
| 端到端执行流 / "怎么跑通" | gitnexus | 读 `gitnexus-exploring` | codegraph 没有流程 |
| taint / 安全数据流 | gitnexus | 读 `gitnexus-taint-analysis` | 只有 gitnexus 有 PDG |
| PDG / 控制数据依赖 | gitnexus | 读 `gitnexus-pdg-query` | 语句级依赖 |
| 改名 / 抽取 / 重构 | gitnexus | 读 `gitnexus-refactoring` | 跨文件协调 |
| PR 审查 | gitnexus | 读 `gitnexus-pr-review` | - |
| "此刻这个符号的所有引用" | LSP | `findReferences` | 免索引、永远最新 |
| 跳定义(实时) | LSP | `goToDefinition` | 以当前文件为准 |
| 字符串 / 配置 / TODO | grep | `rg` | 图查询杀鸡用牛刀 |

## 省 token 与提准确率

**省 token:**

- **粒度从轻到重**:`query`(位置) < `callers` / `callees`(列表) < `node`(单符号源码) < `explore`(一片源码 + 路径) < gitnexus(最重)。问"谁调用"就用 `callers`,别 `explore`。
- **图已给源码就别再 `read`** 同一文件(除非要编辑;Edit 前才必须 read)。
- **理解一片:先 `callers` / `callees` 摸结构,再按需 `explore` / `read`**,别一上来 `explore` 一堆。
- **gitnexus 最重**,只在 codegraph 答不了时建议,且**让用户拍板**,别自动跑。

**提准确率:**

- **按关系类型选工具**:调用 / 导入 / 定义 -> codegraph;执行流 / taint / PDG -> gitnexus;实时引用 / 定义 -> LSP。**用错工具 = 空结果或错答**(拿 codegraph 查 taint 必空)。
- **"此刻 / 当前"问题用 LSP**(永远最新);图索引可能陈旧。
- **改动前的影响检查用 gitnexus**;codegraph `impact` 是快瞥,别据它下改动结论。
- **没索引**(`.codegraph/` / `.gitnexus/` 都没有)**或刷新无效** -> 直接 grep / read / LSP。

## 环境与安装

路由的工具要先装好。**一键初始化**(nvm + Node + codegraph + gitnexus):

```bash
bash <skill>/scripts/setup_env.sh
```

### codegraph + gitnexus(nvm + Node)

| 工具 | 安装 | 验证 |
|------|------|------|
| codegraph | `npm install -g codegraph` | `codegraph --version` |
| gitnexus | `npm install -g gitnexus`(或临时用 `npx gitnexus`) | `gitnexus --version` |

gitnexus 子 skill(exploring / impact-analysis / taint-analysis 等 9 个)由完整 `gitnexus analyze` 生成(`--index-only` 不生成);`setup_env.sh` 首次会在当前 git 仓库自动跑一次装上。

没有 Node 就先装 nvm:`curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash` 再 `nvm install --lts`。`setup_env.sh` 自动处理这一步。

### LSP(Claude 官方插件)

LSP 不手动装语言服务器,统一用 Claude 官方 `*-lsp` 插件(在 `claude-plugins-official` marketplace)。先加 marketplace(只需一次):

```
/plugin marketplace add anthropics/claude-plugins-official
```

再按语言装插件 + 其语言服务器二进制:

| 语言 | 官方插件 | 语言服务器二进制 |
|------|---------|----------------|
| Python | `/plugin install pyright-lsp@claude-plugins-official` | `npm i -g pyright`(或 `pip install pyright`) |
| C/C++ | `/plugin install clangd-lsp@claude-plugins-official` | `apt install clangd` / `brew install llvm` + `compile_commands.json`(CMake `-DCMAKE_EXPORT_COMPILE_COMMANDS=ON`,软链到根) |
| TS/JS | `/plugin install typescript-lsp@claude-plugins-official` | `npm i -g typescript-language-server typescript` |
| 其他 | gopls-lsp / rust-analyzer-lsp / jdtls-lsp(Java)/ kotlin-lsp / ruby-lsp / csharp-lsp / lua-lsp / swift-lsp / php-lsp | 见各插件 README |

只装你用的语言,不必全装。装完重启 Claude Code 让 LSP 生效。

## gitnexus 深挖(建议,不自动升级)

codegraph 答不了时上 gitnexus:端到端执行流、带置信度的影响、taint / 数据流、跨文件重构 / 改名、PR 审查。codegraph 显浅时,告诉用户 gitnexus 能加什么,**让他们拍板**再跑。

gitnexus 基于 MCP(`query` / `context` / `impact` / `trace` / `detect_changes` / `rename` / `cypher` / `explain` / `pdg_query` + `gitnexus://repo/{name}/...` 资源)。别凭记忆用--**读对应子 skill**(在 `~/.claude/skills/gitnexus-*`)拿工作流:

| 深度任务 | 子 skill |
|---------|----------|
| 架构 / "X 怎么工作"(执行流) | `gitnexus-exploring` |
| 影响范围 / "改 X 会坏什么" | `gitnexus-impact-analysis` |
| 追 bug / "为什么 X 失败" | `gitnexus-debugging` |
| taint / 安全数据流 | `gitnexus-taint-analysis` |
| PDG / 控制数据依赖 | `gitnexus-pdg-query` |
| 改名 / 抽取 / 重构 | `gitnexus-refactoring` |
| PR 审查 | `gitnexus-pr-review` |
| 工具 / 资源 / schema 参考 | `gitnexus-guide` |
| 索引 / 状态 / 清理 / wiki CLI | `gitnexus-cli` |

会话先读 `gitnexus://repo/<当前仓库名>/context`(统计 + 陈旧警告;仓库名取 git 仓库目录名或已索引名)。

> **编辑是另一个上下文。** 本 skill 路由*读 / 理解*。任务转向*编辑*某符号、要真正影响检查时,找 `gitnexus-impact-analysis`--codegraph `impact` 是快瞥,替代不了。

## 保持索引新鲜

编辑后索引过期;查询对"确定存在的代码"返回空,几乎都是索引早于代码。刷新后重试一次,别每次都重建。

| 工具 | 增量刷新(首选) | 全量重建(少用) |
|------|----------------|------------------|
| codegraph | `codegraph sync` | `codegraph index` |
| gitnexus | `node .gitnexus/run.cjs analyze --index-only` | `node .gitnexus/run.cjs analyze`(或 `npx gitnexus analyze`) |

`--index-only` 只刷图,**不**重生成上下文文件、**也不装/更新 gitnexus 子 skill**;要装子 skill 用完整 `gitnexus analyze`。还没有 `node .gitnexus/run.cjs`(新克隆 / `git clean`)就用 `npx gitnexus analyze` 生成。gitnexus 刷新后 MCP 仍服务旧索引 -> 重启 Claude Code 重新加载。
