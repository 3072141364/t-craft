---
name: web-guidelines
description: Web/前端技能总入口:应用/工具 UI + 前端界面设计 + React/Next.js 编码准则 + UI 审查 + 品牌设计语言。用户要「做后台/仿真平台/本地工具/数据管理界面」「做 App/工具界面」「做网页/前端界面」「设计一个页面」「改样式让界面更好看」「搭 React/Next.js 组件」「优化 React 性能」「review 我的 UI」「检查可访问性」「审查 UX」「按某站点的风格做界面」时遵循。应用/工具 UI(app-ui-design.md):组件基底选型(shadcn 首选 / antd 后台)+ token(中性色/状态色/密度/暗色)+ 交互骨架(表格/表单/三态/快捷键),做后台、仿真、本地工具等数据密集界面先读它。设计方法论(design-methodology.md):先钉主题、两遍法避开 AI 默认三样式、克制与自我批评,任何新 UI 先读。React 性能(react-performance.md):70 条规则按影响分 8 类(消除瀑布流/包体积/SSR 性能/客户端取数/重渲染/渲染/JS 微优化/高级模式),写 React/Next.js 代码时对照。UI 审查(ui-review.md):WebFetch 拉取 vercel web-interface-guidelines 最新规则,按 file:line 出报告。品牌设计语言(design-language.md):DESIGN.md 纯文本设计系统,做营销页/品牌感界面时才用,从 voltagent/awesome-design-md 拉取(74 款风格索引 design-styles.json)。本 skill 提炼整合自 anthropics/skills(frontend-design)、vercel-labs/agent-skills(react-best-practices / web-design-guidelines)、voltagent/awesome-design-md。
---

# Web / 前端准则

前端的一切都围绕「界面」:先**设计**它(方法论 + 设计语言),再**实现**它(React 编码准则),事后**审查**它(UI 评审)。四条线互相配合,不是四选一。

**来源(提炼整合,非照搬)**:本 skill 吸收以下开源项目的方法论,按 t-craft 约定重组;完整原文 / 规则清单见对应仓库,用到细节时按需回源查:

- 设计方法论 ← [anthropics/skills](https://github.com/anthropics/skills) 的 `frontend-design`
- React 性能准则 + UI 审查 ← [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) 的 `react-best-practices` / `web-design-guidelines`
- 设计语言库 ← [voltagent/awesome-design-md](https://github.com/voltagent/awesome-design-md)
- 应用型 UI ← 本 skill 自研(方法论,参考 shadcn/ui、Ant Design 等组件生态)

## 任务路由:一张表定入口

收到前端任务,先扫这张表定走哪条线(多信号命中按行序叠加):

| 任务信号 | 入口 |
|---------|------|
| 看中一个风格 / 截图 / 站点,想「照着这个风格做」 | 找参考 / 仿造 → [references/reference-hunting.md](references/reference-hunting.md)(读图提取设计语言 → token → 喂给 ⑤ 或 ④) |
| 做「应用/工具」界面:后台、仿真平台、本地工具、数据管理(数据密集、要干活) | ⑤ 应用型 UI → [references/app-ui-design.md](references/app-ui-design.md)(先选组件基底,再定 token 与交互骨架) |
| 设计新界面 / 改样式 / 「让界面更好看」/ 视觉方向、配色、字体 | ① 设计方法论 → [references/design-methodology.md](references/design-methodology.md)(先判断:品牌展示页还是应用 UI) |
| 需要品牌感 / 营销页风格(用户明确要) | ④ 品牌设计语言 → [references/design-language.md](references/design-language.md)(从 [references/design-styles.json](references/design-styles.json) 定风格 → 拉 DESIGN.md → 配 ①) |
| 写 / 改 React、Next.js 组件、页面、数据取数、做性能优化 | ② React 性能准则 → [references/react-performance.md](references/react-performance.md) |
| 「review 我的 UI」「检查可访问性」「audit 设计」「review UX」 | ③ UI 审查 → [references/ui-review.md](references/ui-review.md) |

## 五条线的分工

- **⑤ 应用型 UI**回答「做工具怎么搭骨架」——**你的主战场**。后台 / 仿真 / 本地工具这类数据密集界面:先选组件基底(shadcn 首选 / antd 后台),再定 token(中性色 / 状态色 / 密度 / 暗色)与交互骨架(表格 / 表单 / 三态 / 快捷键)。做 app 先读它。
- **① 设计方法论**回答「为什么这么设计」:先钉住主题、两遍法避免模板化、克制与自我批评。任何 UI 任务,动手前先过一遍。
- **④ 品牌设计语言**回答「品牌感长什么样」:DESIGN.md 是纯文本设计系统文档(配色 token、字体、组件、规则)。**只在做营销页 / 品牌感界面时用**——开发时先让用户从 `references/design-styles.json`(74 款风格索引)选定风格,再拉取对应站点的 DESIGN.md。做 app 时通常用不上。
- **② React 性能准则**回答「实现时别踩哪些坑」:70 条规则按影响度分 8 类,从 CRITICAL(消除瀑布流、包体积)到 LOW(微优化),写 React 代码时按优先级对照。
- **③ UI 审查**回答「事后怎么挑毛病」:不硬编码规则,而是动态拉取 vercel 的 web-interface-guidelines 最新规则,按 `file:line` 输出,和 t-craft 的「项目约定发现」一个思路。
- **找参考 / 仿造**(辅助能力,不是独立主线):看中一个风格想照着做 → `reference-hunting.md` 读图提取设计语言,把 token 喂给 ⑤ 或 ④。

## 项目约定发现

落到具体项目时,把通用原理接到该项目的约束上:技术栈(React/Vue/原生)、UI 库(shadcn/Tailwind/MUI)、已有的设计 token 与组件库、目标浏览器与移动端要求。这些**不在本 skill 硬编码**,而是:

1. **读项目 `CLAUDE.md`** / `DESIGN.md`(项目里若有):提取技术栈、设计约束、既有风格。
2. **以文件实际内容为准**:匹配既有组件与样式,不凭记忆另起炉灶。

## 与体系内其他 skill 的分工

- 设计产物要落盘 / 沉淀 → 走 `obsidian-kb`(离码文档、知识卡片)。
- 跨项目通用的设计约定要固化成规范 → 提炼进本 skill 的 references 或项目 `DESIGN.md`。
- 代码审查(业务逻辑) → 走 `/tcraft-code-review`;本 skill 的 ③ UI 审查只针对界面层。
