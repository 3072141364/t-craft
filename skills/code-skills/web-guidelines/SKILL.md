---
name: web-guidelines
description: Web/前端技能总入口:SaaS 平台/应用 UI + 报告渲染 + React/Next.js 编码准则 + UI 审查。用户要「做后台管理/SaaS 平台/本地工具/数据管理界面」「做 App/工具界面」「做网页/前端界面」「改样式让界面更好看」「渲染报告/出测试报告/评估报告/数据报告页」「搭 React/Next.js 组件」「优化 React 性能」「review 我的 UI」「检查可访问性」「审查 UX」时遵循。应用型 UI(app-ui-design.md):组件基底选型(shadcn 首选 / antd 后台)+ token(中性色/状态色/密度/暗色)+ 交互骨架(表格/表单/三态/快捷键),做数据密集的功能型界面先读它。设计与文案(design-craft.md):钉主题、两遍法、避开默认样式簇、文案即设计材料——任何界面/报告动手前过一遍,保证逻辑清晰、表现力强、不像模板。报告渲染(report-rendering.md):结论金字塔、图表选型跟结论走、打印/导出友好。React 性能(react-performance.md):70 条规则按影响分 8 类,写 React/Next.js 代码时对照。UI 审查(ui-review.md):WebFetch 拉取 vercel web-interface-guidelines 最新规则,按 file:line 出报告。本 skill 面向应用/工具型界面与报告(功能密集),不做营销页/品牌站。提炼整合自 anthropics/skills(frontend-design)、vercel-labs/agent-skills(react-best-practices / web-design-guidelines);应用型 UI 与报告渲染自研(参考 shadcn/ui、Ant Design 组件生态)。
---

# Web / 前端准则(SaaS 平台 / 应用 / 报告)

前端的一切围绕两种产物:**界面**(SaaS 平台/工具,用的)与**报告**(数据/结论,读的)。先**搭骨架**(应用型 UI),定**审美与文案**(设计准则),再**实现**(React 编码准则),事后**审查**(UI 评审)。几条线互相配合,不是多选一。

**定位**:本 skill 服务**功能密集的产物**——SaaS 平台、后台管理、本地工具、数据管理界面,以及测试/评估/数据分析类**报告页**。设计目标是密度、清晰、状态、效率、表现力,不是品牌记忆点;不做营销页。

**来源(提炼整合,非照搬)**:

- 设计与文案准则 ← [anthropics/skills](https://github.com/anthropics/skills) 的 `frontend-design` + [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) 的工程纪律(均取对应用/报告成立的部分)
- React 性能准则 + UI 审查 ← [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) 的 `react-best-practices` / `web-design-guidelines`
- 应用型 UI + 报告渲染 ← 本 skill 自研(方法论,参考 shadcn/ui、Ant Design 等组件生态)

## 任务路由:一张表定入口

收到前端任务,先扫这张表定走哪条线(多信号命中按行序叠加;无论走哪条,动手前都过一遍 ② 设计与文案):

| 任务信号 | 入口 |
|------|------|
| 做应用/工具界面:后台管理、SaaS 平台、本地工具、数据管理;「改样式让界面更好看」「视觉方向、配色、密度」 | ① 应用型 UI → [references/app-ui-design.md](references/app-ui-design.md)(先选组件基底,再定 token 与交互骨架)——**界面默认入口** |
| 渲染报告:测试报告、评估报告、数据分析、审查结果、汇总页 | ④ 报告渲染 → [references/report-rendering.md](references/report-rendering.md)(结论金字塔 + 图表选型 + 打印/导出)——**报告默认入口** |
| 任何新界面/新报告动手前;「怎么不像模板」「文案怎么写」 | ② 设计与文案 → [references/design-craft.md](references/design-craft.md)(钉主题、两遍法、避默认样式簇、文案即材料)——**通用前置** |
| 写 / 改 React、Next.js 组件、页面、数据取数、做性能优化 | ③ React 性能准则 → [references/react-performance.md](references/react-performance.md) |
| 「review 我的 UI」「检查可访问性」「audit 设计」「review UX」 | ⑤ UI 审查 → [references/ui-review.md](references/ui-review.md) |

## 五条线的分工

- **① 应用型 UI**回答「界面怎么搭骨架」——**SaaS 主战场**。后台管理 / SaaS / 本地工具这类数据密集界面:先选组件基底(shadcn 首选 / antd 后台),再定 token(中性色 / 状态色 / 密度 / 暗色)与交互骨架(表格 / 表单 / 三态 / 快捷键)。做界面先读它;「让界面更好看」也先读它——工具 UI 的好看是密度、层级、一致性,不是装饰。
- **② 设计与文案**回答「怎么不像模板、表现力从哪来」:钉主题、结构即信息、字体三角色、两遍法、避开应用/报告自己的默认样式簇、文案即设计材料。界面与报告共用,动手前过一遍。
- **④ 报告渲染**回答「报告怎么组织」:结论前置、逐层下钻、图表选型跟结论走、打印/导出友好。报告是「读的」,交互密度远低于界面,信息密度要求更高。
- **③ React 性能准则**回答「实现时别踩哪些坑」:70 条规则按影响度分 8 类,从 CRITICAL(消除瀑布流、包体积)到 LOW(微优化),写 React 代码时按优先级对照。
- **⑤ UI 审查**回答「事后怎么挑毛病」:不硬编码规则,而是动态拉取 vercel 的 web-interface-guidelines 最新规则,按 `file:line` 输出,和 t-craft 的「项目约定发现」一个思路。

## 项目约定发现

落到具体项目时,把通用原理接到该项目的约束上:技术栈(React/Vue/原生)、UI 库(shadcn/Tailwind/MUI)、已有的设计 token 与组件库、目标浏览器与移动端要求。这些**不在本 skill 硬编码**,而是:

1. **读项目 `CLAUDE.md`** / `DESIGN.md`(项目里若有):提取技术栈、设计约束、既有风格。
2. **以文件实际内容为准**:匹配既有组件与样式,不凭记忆另起炉灶。

## 与体系内其他 skill 的分工

- 设计产物要落盘 / 沉淀 → 走 `obsidian-kb`(离码文档、知识卡片)。
- 跨项目通用的设计约定要固化成规范 → 提炼进本 skill 的 references 或项目 `DESIGN.md`。
- 代码审查(业务逻辑) → 走 `/tcraft-code-review`;本 skill的 ⑤ UI 审查只针对界面层。
