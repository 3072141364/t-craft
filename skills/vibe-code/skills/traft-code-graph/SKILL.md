---
name: traft-code-graph
description: 技术图绘制--架构/流程/时序/UML/C4/网络拓扑等,由 archify 生成(HTML+SVG 默认,可导出 PNG/SVG/WebM)。何时激活:要画技术图/架构图/流程图/时序图/UML/C4/系统图;写方案配图、周报配图、文章思路图时。
---

# traft-code-graph 技能

技术图绘制：把自然语言描述的技术图需求交给 **archify**（`npx skills` 安装的第三方技能）。本技能只做**路由 + 落盘约定**，不自造图。

**职责边界**：
- 负责：收敛图意图、路由到 `skill://archify` 生成、落盘约定（HTML+SVG 默认，PNG 等导出落盘）。
- 不负责：手写 SVG/ASCII 冒充技术图、安装图工具（archify 走 `npx skills`，不走 marketplace）。超出边界直接说明，不硬接。

## 1. 触发条件（TRIGGER）

| 场景 | 触发信号(关键词/典型句式) | 是否触发 |
| --- | --- | --- |
| 画技术图 | "画个架构图"、"画个流程图/时序图" | 触发 |
| 专业图型 | "UML 图"、"C4 图"、"网络拓扑" | 触发 |
| 配图 | "写方案配个图"、"周报配图"、"文章思路图" | 触发 |
| 纯文字写作 | "写段文档" | 不触发 |
| 闲聊/泛泛提问 | "随便聊聊" | 不触发，交给默认回复 |

## 2. 规则（RULES）

### 2.1 务必执行(ALWAYS DO)
1. 生成前向用户确认图的意图与范围；一张图不塞十几个组件，太复杂先拆多张。
2. 优先 archify；不用 mermaid 硬写（archify 支持粘贴 Mermaid 输入，除非 archify 无此图型）。
3. 动手前读 `skill://archify`，按它的工作流生成，**不凭记忆**。
4. 图需要反映真实代码时，先查仓库证据再生成（archify 支持基于 repo 实据）。

### 2.2 禁止执行(NEVER DO)
1. 不自己手写 SVG/ASCII 图冒充技术图。
2. 不安装图工具（archify 走 `npx skills`，不走 marketplace）。

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：图意图描述（或可粘贴的 Mermaid 输入）；图须反映真实代码时需仓库上下文；archify 已安装。
- 缺失时：
  - 意图含糊 → 先按 Step 1 收敛，不直接生成。
  - archify 未安装 → 提示 `npx skills add tt-a1i/archify -g`（git: `https://github.com/tt-a1i/archify`），安装后再画。

## 3. 知识底座（CONTEXT）

- **archify（`skill://archify`，`npx skills` 安装）能力**：
  - 图型：架构 / 工作流 / 时序 / 数据流 / 生命周期 / 状态机；接受自然语言需求或粘贴的 Mermaid（flowchart / sequenceDiagram / stateDiagram）。
  - 输出：可探索的独立 HTML（内联 SVG），暗/亮主题，可选 trace 动效；可导出 PNG / JPEG / WebP / SVG / WebM。
  - 实据：图须对应真实代码时，先检查仓库证据。
- **落盘约定**（涉及 vault 方案/周报时）：导出 PNG 存 `projects/<项目>/assets/`，嵌入 `![[图名.png]]`；HTML 也可存 assets/；不落盘就留在对话内展示。
- **约定变更时同步更新本节。**

## 4. 工作流程（WORKFLOW）

### Step 1: 收敛意图
- 动作：把含糊的"画个架构图"理成一段能生成图的描述——组件、边界、箭头语义、分层；图型让 archify 按描述选。
- IF 图太复杂 → 拆多张，与用户确认。
- 完成标志：意图与范围经用户确认。

### Step 2: 生成
- 动作：读 `skill://archify`，按其工作流生成（默认 HTML + 内联 SVG）。
- 完成标志：图生成成功、结构正确。

### Step 3: 落盘（按需）
- IF 涉及 vault 方案/周报 → 导出 PNG 存 `projects/<项目>/assets/`，嵌入 `![[图名.png]]`。
- ELSE → 留在对话内展示（或交付 HTML）。
- 完成标志：图已交付（落盘或对话展示）。

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
```text
图: <描述>
格式: HTML+SVG（默认）/ PNG（落盘）
位置: 对话展示 / projects/<项目>/assets/<图名>.png
```

### 5.2 字段要求

| 字段 | 写作要求 |
|----|------|
| 图 | 一句话描述生成结果 |
| 位置 | 落盘给全局路径；对话展示则注明 |

### 5.3 交付前自检
- [ ] 意图与范围已与用户确认
- [ ] 按 `skill://archify` 流程生成，未手写 SVG/ASCII 冒充
- [ ] 落盘路径符合约定

## 6. 示例

### 6.1 好的示例
**输入**：给订单导出方案配个时序图
**输出**：
```text
图: 订单导出异步任务时序图（前端→后端→任务队列→导出服务）
格式: PNG
位置: projects/order/assets/order-export-sequence.png
```

### 6.2 差的示例
**输入**：画个架构图
**输出**：手写 ASCII 框图直接贴给用户。
（违反 2.2①——不手写 ASCII 冒充技术图，应走 archify）
