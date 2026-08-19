---
name: web-guidelines
description: 轻量前端入口——两类产物:①demo / 小型 SaaS(能跑能验证,简单高效)②汇报展示单页报告(图文并茂、表现力强,如"P1-22 效率提升")。何时用:要快速搭个能验证的小应用 / 后台界面,或做一页数据汇报 / 效率报告时。按场景路由到三篇附属:做 demo/SaaS 读 app-ui-design.md、要表现力/不像模板读 design-craft.md、数据报告页读 report-rendering.md。不做营销页 / 品牌站 / 大平台,不含重型 React 性能与 UI 审查规范。
---

# 轻量前端入口

t-craft 的前端定位是**轻量、够用、表现力**——不做大平台、营销页、品牌站。两类产物:

1. **demo / 小型 SaaS**:能跑、能验证的小应用或后台界面,简单高效优先。
2. **汇报展示单页报告**:一页数据 / 效率汇报(如"P1-22 效率提升"),图文并茂、表现力强。

## 场景路由(按产物读对应附属)

| 你要做 | 读哪篇 | 拿什么 |
|--------|--------|--------|
| demo / 小 SaaS / 后台界面 | [references/app-ui-design.md](references/app-ui-design.md) | 组件基底选型(shadcn 首选 / antd 后台)+ 设计 token(中性色/状态色/密度/暗色)+ 表格/表单/三态/快捷键交互骨架 |
| 汇报单页 / 要表现力 / 不想像模板 | [references/design-craft.md](references/design-craft.md) | 钉主题、两遍法、避开默认样式簇、文案即设计材料 |
| 数据报告页(效率提升 / 测试 / 评估) | [references/report-rendering.md](references/report-rendering.md) | 结论金字塔、图表选型跟结论走、打印 / 导出友好 |

做**汇报单页**通常两篇一起用:design-craft 定表现力基调 + report-rendering 定数据呈现。

## 快速起手(简单高效优先)

- **优先单文件**:demo / 汇报单页能用单文件 HTML(内联 CSS/JS 或 CDN 引组件)就别起脚手架,能跑最重要。
- **需要交互组件再上框架**:小 SaaS 需要表格 / 表单 / 路由时,按 app-ui-design 选基底。
- **先出能看的版本**:汇报类先出一版完整页面给用户看,再按 design-craft 两遍法打磨表现力。

## 项目约定发现

- 读项目 `CLAUDE.md` / `package.json`:已有前端栈(React/Vue/原生)、组件库、构建工具,匹配既有栈,不擅自引新依赖。
- 以项目实际文件为准。

## 附:参考来源

提炼整合自 anthropics/skills(frontend-design)、vercel-labs/agent-skills(web-design-guidelines);应用型 UI 与报告渲染自研(参考 shadcn/ui、Ant Design)。
