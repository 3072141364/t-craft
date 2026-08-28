---
name: traft-graph
description: 技术图绘制--架构/流程/时序/UML/C4/网络拓扑等,由 fireworks-tech-graph 生成(SVG 默认,PNG 落盘)。何时激活:要画技术图/架构图/流程图/时序图/UML/C4/系统图;写方案配图、周报配图、文章思路图时。
---

# traft-graph 技术图绘制

把自然语言描述的技术图需求交给 **fireworks-tech-graph**(外部 plugin,需随 marketplace 安装)。本技能只做**路由 + 落盘约定**,不自造图。

## 前置(跨电脑首次)

- fireworks-tech-graph 需已安装;未装则提示:`/marketplace install fireworks-tech-graph@t-craft`(同一 marketplace,`/marketplace add <owner>/t-craft` 后)。
- 动手前读 `skill://fireworks-tech-graph`,拿它支持的图型/风格与生成方式,**不凭记忆**。

## 执行

1. **收敛意图**:把含糊的"画个架构图"理成一段能生成图的自然语言描述--组件、边界、箭头语义、分层。图型/风格让 fireworks 按描述选。
2. **生成**:按 `skill://fireworks-tech-graph` 流程跑(默认 SVG;要进 obsidian 就转 PNG)。
3. **落盘约定**(涉及 vault 方案/周报时):
   - PNG 存 `projects/<项目>/assets/`,嵌入 `![[图名.png]]`。
   - 不落盘就留在对话内展示。

## RULES

### ALWAYS DO
- 生成前向用户确认图的意图与范围,一张图不塞十几个组件;太复杂先拆多张。
- 优先 fireworks-tech-graph;不用 mermaid 硬写(它优先,除非 fireworks 无此图型)。

### NEVER DO
- 不自己手写 SVG/ASCII 图冒充技术图。
- 不安装 fireworks 之外的图工具(有需求在讨论后再说)。
