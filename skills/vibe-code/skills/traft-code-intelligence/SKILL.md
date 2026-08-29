---
name: traft-code-intelligence
description: 代码查证路由--找符号、追调用、影响面、执行流时按问题类型在 gitnexus / LSP / 内置 read 工具组间选对工具，别肉眼 grep 硬挖。何时激活：写代码、改代码、理解代码、代码 review 时；具体如"谁调用了 X"，"X 是怎么工作的"，"改 X 会影响什么"，"这个函数定义在哪"。
---

# traft-code-intelligence 代码阅读与结构分析路由

理解代码(找符号、追调用、影响面、执行流)先路由再动手:**关系调用走 gitnexus,单点简单查询走 LSP,兜底内置 read 工具组**。一次图查询顶十几次 grep + read,别上来就 grep 全仓。

## 路由表(问题 -> 工具)

| 问题 | 工具 | 动作 |
|------|------|------|
| 谁调用 X / X 调用什么 | gitnexus | `gitnexus-exploring` |
| X 这块怎么运作 / 端到端执行流 | gitnexus | `gitnexus-exploring` |
| 改 X 影响什么(要结论) | gitnexus | `gitnexus-impact-analysis` |
| 追 bug / 为什么 X 失败 | gitnexus | `gitnexus-debugging` |
| taint / 安全数据流 | gitnexus | `gitnexus-taint-analysis` |
| PDG / 语句级依赖 | gitnexus | `gitnexus-pdg-query` |
| 改名 / 抽取 / 跨文件重构 | gitnexus | `gitnexus-refactoring` |
| PR 审查 | gitnexus | `gitnexus-pr-review` |
| 定义在哪 / 类型是什么 | LSP | definition / type_definition / hover |
| 此刻这个符号的所有引用(索引可能陈旧) | LSP | references |
| 文件内符号列表 / 诊断 | LSP | symbols / diagnostics |
| 单点重命名(已确认无歧义) | LSP | rename |
| 字符串 / 配置 / TODO / 批量文本 | 内置 | grep / glob |
| 读已知路径 / 批量浏览文件 | 内置 | read |

## RULES

### ALWAYS DO
- **按问题类型选工具**：关系与链路(调用 / 影响 / 执行流 / taint / PDG / 重构)-> gitnexus；单点查询(定义 / 类型 / 实时引用 / 诊断)-> LSP；文本搜索与已知路径读取 -> 内置 read 工具组。用错工具 = 空结果或错答(拿图查询查 taint 之外的错位用法必空)。
- **gitnexus 别凭记忆用**：先读对应子 skill(见路由表)拿工作流，再调 MCP 工具(query / impact / trace / pdg_query / rename / cypher / explain 等)。
- **gitnexus 会话先读上下文**：`gitnexus://repo/<仓库名>/context`(统计 + 陈旧警告；仓库名取 git 仓库目录名)。
- **索引陈旧先刷新**：查询对“确定存在的代码”返回空，几乎都是索引早于代码；增量刷新后重试一次，别每次重建。
- **粒度从轻到重**：单点 LSP / read < gitnexus 深挖；答了就停；图已给源码就别再 read 同一文件(要编辑除外)。

### NEVER DO
- 不拿 grep / read 硬挖调用链与影响面--一次图查询顶十几次。
- 不凭记忆直接调 gitnexus MCP 工具，先读对应子 skill。
- 改动结论不建立在单点快瞥上：影响面必须走 `gitnexus-impact-analysis`。
- 没索引(`.gitnexus/` 不在)不硬查图：退回 LSP / read，要上 gitnexus 先建索引。

## 环境与索引

- **首次索引**：`npx gitnexus analyze`--生成 `.gitnexus/` 并安装 gitnexus 子 skill。
- **增量刷新**(首选)：`node .gitnexus/run.cjs analyze --index-only`--只刷图、不重装子 skill；全量重建少用。
- **索引 / 状态 / 清理 / wiki**：走 `gitnexus-cli` skill。
- gitnexus 刷新后 MCP 可能仍服务旧索引 -> 重启会话重新加载。
- **LSP**：Claude 官方 `*-lsp` 插件(pyright-lsp / clangd-lsp / typescript-lsp 等)，装完重启会话生效。
- **环境安装**：没 Node 先装 nvm(`curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`,再 `nvm install --lts`);gitnexus 用 `npm install -g gitnexus`(或临时 `npx gitnexus`);LSP 插件先 `/plugin marketplace add anthropics/claude-plugins-official`(一次),再按语言装并配语言服务器二进制,装完重启会话。
