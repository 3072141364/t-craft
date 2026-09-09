---
name: traft-code-intelligence
description: 代码查证路由--找符号、追调用、影响面、执行流时按问题类型在 gitnexus / LSP / 内置 read 工具组间选对工具，别肉眼 grep 硬挖。何时激活：写代码、改代码、理解代码、代码 review 时；具体如"谁调用了 X"，"X 是怎么工作的"，"改 X 会影响什么"，"这个函数定义在哪"。
---

# traft-code-intelligence 技能

代码阅读与结构分析路由：理解代码（找符号、追调用、影响面、执行流）先路由再动手——**关系调用走 gitnexus，单点简单查询走 LSP，兜底内置 read 工具组**。一次图查询顶十几次 grep + read，别上来就 grep 全仓。

**职责边界**：
- 负责：代码查证的路由与执行——找符号、追调用、影响面、执行流、重构/审查支撑。
- 不负责：给出审查结论（`traft-code-review`）、排查 bug 根因（`traft-code-debug`）、改代码（`traft-code-implement`）。查证是它们的前置，不越界。

## 1. 触发条件（TRIGGER）

| 场景 | 触发信号(关键词/典型句式) | 是否触发 |
| --- | --- | --- |
| 找符号/定义 | "这个函数定义在哪"、"X 的类型是什么" | 触发（LSP） |
| 追调用 | "谁调用了 X"、"X 调用什么" | 触发（gitnexus） |
| 理解执行流 | "X 是怎么工作的"、"端到端流程" | 触发（gitnexus） |
| 影响面 | "改 X 会影响什么"、"动这里会坏什么" | 触发（gitnexus-impact-analysis） |
| 追 bug/重构/PR | "为什么失败"、"帮我重构"、"审 PR" | 触发（路由到 debug/refactoring/pr-review） |
| 纯文本搜索 | "搜一下 TODO/配置"、"列出某目录文件" | 不触发，内置 grep/glob/read 直接做 |
| 闲聊/泛泛提问 | "随便聊聊" | 不触发，交给默认回复 |

## 2. 规则（RULES）

### 2.1 务必执行(ALWAYS DO)
1. **按问题类型选工具**：关系与链路（调用/影响/执行流/taint/PDG/重构）-> gitnexus；单点查询（定义/类型/实时引用/诊断）-> LSP；文本搜索与已知路径读取 -> 内置 read 工具组。用错工具 = 空结果或错答。
2. **gitnexus 别凭记忆用**：先读对应子 skill（见 3.1 路由表）拿工作流，再调 MCP 工具。
3. **gitnexus 会话先读上下文**：`gitnexus://repo/<仓库名>/context`（统计 + 陈旧警告；仓库名取 git 仓库目录名）。
4. **索引陈旧先刷新**：查询对"确定存在的代码"返回空，几乎都是索引早于代码；增量刷新后重试一次，别每次重建。
5. **粒度从轻到重**：单点 LSP / read < gitnexus 深挖；答了就停；图已给源码就别再 read 同一文件（要编辑除外）。

### 2.2 禁止执行(NEVER DO)
1. 不拿 grep / read 硬挖调用链与影响面——一次图查询顶十几次。
2. 不凭记忆直接调 gitnexus MCP 工具，先读对应子 skill。
3. 改动结论不建立在单点快瞥上：影响面必须走 `gitnexus-impact-analysis`。
4. 没索引（`.gitnexus/` 不在）不硬查图：退回 LSP / read，要上 gitnexus 先建索引。

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：仓库已索引（gitnexus 类查询）或 LSP 已配置。
- 缺失时：
  - 无索引 → 按 3.2 首次索引或增量刷新；未建前退回 LSP / read。
  - LSP 未装 → 按 3.2 安装插件并重启会话。

## 3. 知识底座（CONTEXT）

### 3.1 路由表（问题 -> 工具）

| 问题 | 工具 | 动作 |
|------|------|------|
| 谁调用 X / X 调用什么 | gitnexus | `gitnexus-exploring` |
| X 这块怎么运作 / 端到端执行流 | gitnexus | `gitnexus-exploring` |
| 改 X 影响什么（要结论） | gitnexus | `gitnexus-impact-analysis` |
| 追 bug / 为什么 X 失败 | gitnexus | `gitnexus-debugging` |
| taint / 安全数据流 | gitnexus | `gitnexus-taint-analysis` |
| PDG / 语句级依赖 | gitnexus | `gitnexus-pdg-query` |
| 改名 / 抽取 / 跨文件重构 | gitnexus | `gitnexus-refactoring` |
| PR 审查 | gitnexus | `gitnexus-pr-review` |
| 定义在哪 / 类型是什么 | LSP | definition / type_definition / hover |
| 此刻这个符号的所有引用（索引可能陈旧） | LSP | references |
| 文件内符号列表 / 诊断 | LSP | symbols / diagnostics |
| 单点重命名（已确认无歧义） | LSP | rename |
| 字符串 / 配置 / TODO / 批量文本 | 内置 | grep / glob |
| 读已知路径 / 批量浏览文件 | 内置 | read |

### 3.2 环境与索引

- **首次索引**：`npx gitnexus analyze`——生成 `.gitnexus/` 并安装 gitnexus 子 skill。
- **增量刷新**（首选）：`node .gitnexus/run.cjs analyze --index-only`——只刷图、不重装子 skill；全量重建少用。
- **索引 / 状态 / 清理 / wiki**：走 `gitnexus-cli` skill；刷新后 MCP 可能仍服务旧索引 -> 重启会话重新加载。
- **LSP**：Claude 官方 `*-lsp` 插件（pyright-lsp / clangd-lsp / typescript-lsp 等），装完重启会话生效。
- **环境安装**：没 Node 先装 nvm（`curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`，再 `nvm install --lts`）；gitnexus 用 `npm install -g gitnexus`（或临时 `npx gitnexus`）；LSP 插件先 `/plugin marketplace add anthropics/claude-plugins-official`（一次），再按语言装并配语言服务器二进制，装完重启会话。
- **约定变更时同步更新本节。**

## 4. 工作流程（WORKFLOW）

### Step 1: 识别问题类型
- 动作：按 3.1 路由表判断属于关系链路 / 单点查询 / 文本搜索哪一类。
- 完成标志：问题类型明确，对应工具确定。

### Step 2: 选工具并执行
- 动作：gitnexus 类先读子 skill + 上下文；LSP 类直接查；文本类内置工具直接做。
- 完成标志：拿到查询结果（候选/证据）。

### Step 3: 核对结果
- IF 空结果且确定代码存在 → 增量刷新索引后重试一次。
- 完成标志：结果可靠（或已按 2.3 如实说明缺索引/未配置）。

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
```text
## 结论
<直接回答（定义/调用方/影响面/流程）>
## 依据
<工具 + 定位（文件:行号 / 图查询结果）>
```

### 5.2 字段要求

| 字段 | 写作要求 |
|----|------|
| 结论 | 直接回答用户问题，答了就停 |
| 依据 | 注明用哪个工具（gitnexus/LSP/read）查的，可复核 |

### 5.3 交付前自检
- [ ] 工具选择符合路由表（关系走 gitnexus、单点走 LSP）
- [ ] gitnexus 调用前读过子 skill / 上下文
- [ ] 影响面结论来自 `gitnexus-impact-analysis`，非单点快瞥
- [ ] 无索引/未配置时已如实说明并退回可用工具

## 6. 示例

### 6.1 好的示例
**输入**：谁调用了 createOrder？
**输出**：
```text
## 结论
createOrder 被 3 处调用：checkout.ts:42、admin/reimport.ts:88、test/order.test.ts:15。
## 依据
gitnexus-exploring（graph 查询，含间接调用 2 层）
```

### 6.2 差的示例
**输入**：谁调用了 createOrder？
**输出**：`grep -rn "createOrder" src/` 硬挖，漏掉符号重名/间接调用/动态分发。
（违反 2.2①——关系查询应走 gitnexus，一次图查询顶十几次 grep）
