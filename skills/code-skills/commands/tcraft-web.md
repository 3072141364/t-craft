---
description: 轻量前端入口。触发 web-guidelines skill,按意图路由到三条线:①demo/小 SaaS/后台界面 → 读 app-ui-design.md;②要表现力/不像模板 → 读 design-craft.md;③汇报单页/数据报告(如 P1-22 效率提升)→ 读 report-rendering.md。`/tcraft-web 应用|表现|报告` 可指定。轻量为主,不做营销页/大平台。
argument-hint: [应用 | 表现 | 报告]
---

触发 **web-guidelines** skill 的轻量前端流程。两类产物:①demo / 小型 SaaS(能跑能验证)②汇报展示单页报告(图文并茂、表现力强)。不指定则按对话意图自动路由。

## 参数

- 无参数:按当前对话意图自动路由。
- `应用` / `app`:做 demo、小型 SaaS、后台界面,或「改样式让界面更好看」→ 读 `app-ui-design.md`(组件基底 shadcn/antd + token + 密度/状态/暗色 + 交互骨架)。
- `表现` / `design`:要表现力、不想像模板 → 读 `design-craft.md`(钉主题、两遍法、避默认样式簇、文案即材料)。
- `报告` / `report`:汇报单页、数据报告、效率提升/测试/评估页 → 读 `report-rendering.md`(结论金字塔 + 图表选型 + 打印/导出)。

做**汇报单页**通常 `表现` + `报告` 两条一起用。

## 执行

读 web-guidelines skill 的 `SKILL.md`(路径 `../web-guidelines/SKILL.md`)定线,再读对应 reference(路径 `../web-guidelines/references/*.md`)。

1. **前置:项目约定发现**——读项目 CLAUDE.md,确认既有技术栈(React/Vue/原生)、UI 库、设计 token,匹配既有栈不擅自引新依赖。
2. **定位**:按参数或意图定线;简单高效优先——demo/汇报单页能单文件 HTML 就别起脚手架。
3. **执行**:应用 → 组件基底 + token + 交互骨架;汇报 → 先出完整页面再按 design-craft 两遍法打磨表现力 + report-rendering 组织数据。
4. **交付**:先给能看的版本再打磨;设计决策(为什么选这套密度/暗色)可沉淀走 project-doc/obsidian-kb。

## 约定

- **以文件实际内容为准**:匹配项目既有组件与样式,不另起炉灶。
- **「好看」是密度、层级、一致性、结论清晰**,不是装饰;不搬品牌站那套(hero、签名横幅、字体堆砌)。
- **汇报报告默认会被转 PDF/截图**:打印样式是设计输入,不是事后补丁。
