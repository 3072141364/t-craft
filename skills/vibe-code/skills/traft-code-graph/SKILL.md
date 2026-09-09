---
name: traft-code-graph
description: 技术图绘制--架构/流程/时序/UML/C4/网络拓扑等,由 fireworks-tech-graph 生成(SVG 默认,PNG 落盘)。何时激活:要画技术图/架构图/流程图/时序图/UML/C4/系统图;写方案配图、周报配图、文章思路图时。
---

# traft-code-graph 技能

技术图绘制：把自然语言描述的技术图需求交给 **fireworks-tech-graph**（外部 plugin，需随 marketplace 安装）。本技能只做**路由 + 落盘约定**，不自造图。

**职责边界**：
- 负责：收敛图意图、路由到 fireworks-tech-graph 生成、落盘约定（SVG 默认，PNG 落盘）。
- 不负责：手写 SVG/ASCII 冒充技术图、安装 fireworks 之外的图工具。超出边界直接说明，不硬接。

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
2. 优先 fireworks-tech-graph；不用 mermaid 硬写（它优先，除非 fireworks 无此图型）。
3. 动手前读 `skill://fireworks-tech-graph`，拿它支持的图型/风格与生成方式，**不凭记忆**。

### 2.2 禁止执行(NEVER DO)
1. 不自己手写 SVG/ASCII 图冒充技术图。
2. 不安装 fireworks 之外的图工具（有需求在讨论后再说）。

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：fireworks-tech-graph 已安装。
- 缺失时：未装 → 提示 `/marketplace install fireworks-tech-graph@t-craft`（同一 marketplace，`/marketplace add <owner>/t-craft` 后）。

## 3. 知识底座（CONTEXT）

- **前置**：fireworks-tech-graph 需随 marketplace 安装；动手前读 `skill://fireworks-tech-graph`（图型/风格/生成方式）。
- **落盘约定**（涉及 vault 方案/周报时）：PNG 存 `projects/<项目>/assets/`，嵌入 `![[图名.png]]`；不落盘就留在对话内展示。
- **约定变更时同步更新本节。**

## 4. 工作流程（WORKFLOW）

### Step 1: 收敛意图
- 动作：把含糊的"画个架构图"理成一段能生成图的自然语言描述——组件、边界、箭头语义、分层；图型/风格让 fireworks 按描述选。
- IF 图太复杂 → 拆多张，与用户确认。
- 完成标志：意图与范围经用户确认。

### Step 2: 生成
- 动作：按 `skill://fireworks-tech-graph` 流程跑（默认 SVG）。
- 完成标志：图生成成功。

### Step 3: 落盘（按需）
- IF 涉及 vault 方案/周报 → PNG 存 `projects/<项目>/assets/`，嵌入 `![[图名.png]]`。
- ELSE → 留在对话内展示。
- 完成标志：图已交付（落盘或对话展示）。

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
```text
图: <描述>
格式: SVG（默认）/ PNG（落盘）
位置: 对话展示 / projects/<项目>/assets/<图名>.png
```

### 5.2 字段要求

| 字段 | 写作要求 |
|----|------|
| 图 | 一句话描述生成结果 |
| 位置 | 落盘给全局路径；对话展示则注明 |

### 5.3 交付前自检
- [ ] 意图与范围已与用户确认
- [ ] 未手写 SVG/ASCII 冒充
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
（违反 2.2①——不手写 ASCII 冒充技术图，应走 fireworks-tech-graph）
