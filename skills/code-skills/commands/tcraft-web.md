---
description: Web/前端总入口(SaaS 平台/应用 + 报告渲染)。按当前对话意图路由到 web-guidelines 的各条线:①应用型 UI(后台管理/SaaS 平台/本地工具/改样式/视觉方向)→ 读 app-ui-design.md;②设计与文案(任何界面/报告动手前,不像模板、文案准则)→ 读 design-craft.md;④报告渲染(测试/评估/数据报告页)→ 读 report-rendering.md;③React 性能(写/改 React/Next.js 代码)→ 读 react-performance.md;⑤UI 审查(review 我的 UI/可访问性/UX)→ 读 ui-review.md。`/tcraft-web 工具|报告|react|审查` 可指定。
argument-hint: [工具 | 报告 | react | 审查]
---

触发 **web-guidelines** skill 的前端流程。这是前端五条线的显式入口;不指定则按对话意图自动路由。面向功能密集的 SaaS 平台/应用界面与报告渲染,不做营销页。

## 参数

- 无参数:按当前对话意图自动路由(应用 UI / 报告 / React 编码 / UI 审查)。
- `工具` / `app`(界面主线):做后台管理、SaaS 平台、本地工具等应用型界面,或「改样式让界面更好看」→ 读 `app-ui-design.md`(组件基底 shadcn/antd + token + 密度/状态/暗色)。
- `报告` / `report`(报告主线):渲染测试报告、评估报告、数据分析、审查结果、汇总页 → 读 `report-rendering.md`(结论金字塔 + 图表选型 + 打印/导出)。
- `react`:写 / 改 React、Next.js 组件、取数、性能优化 → 读 `react-performance.md`(70 条规则 8 类,先 CRITICAL)。
- `审查`:review UI / 可访问性 / UX → 读 `ui-review.md`(WebFetch 拉 vercel 最新规则,按 file:line 出报告)。

无论走哪条线,**动手前都过一遍 `design-craft.md`**(钉主题、两遍法、避默认样式簇、文案即材料)。

## 执行

读 web-guidelines skill 的 `SKILL.md`(路径 `../web-guidelines/SKILL.md`)定线,再读对应 reference(路径 `../web-guidelines/references/*.md`)。

1. **前置:项目约定发现**——读项目 CLAUDE.md / 既有 DESIGN.md,确认技术栈(React/Vue/原生)、UI 库(shadcn/Tailwind/MUI)、既有设计 token。
2. **定位**:按上表参数或意图定走哪条线;界面任务先选组件基底再定 token,报告任务先定结论再组织结构。
3. **执行**:界面 → 组件基底 + token + 交互骨架;报告 → 结论金字塔 + 图表选型 + 打印友好;两者都先过 design-craft 两遍法(规划 → 审计划避默认脸 → 生成);React → 按优先级对照规则;审查 → 拉最新规则逐条对照。
4. **交付**:设计产物给用户审;报告先给结论层;审查结果按 `file:line` 报告;可沉淀的通用设计约定 → 项目 DESIGN.md 或经 obsidian-kb 沉淀。

## 约定

- **以文件实际内容为准**:匹配项目既有组件与样式,不另起炉灶。
- **界面/报告的「好看」是密度、层级、一致性、结论清晰**,不是装饰;别把品牌站那套(hero、签名横幅、个性字体堆砌)搬进来。
- **报告默认会被转 PDF**:打印样式不是事后补丁,是设计输入。
