---
description: Web/前端总入口。按当前对话意图路由到 web-guidelines 的各条线:⑤应用型 UI(后台/仿真/本地工具)→ 读 app-ui-design.md;①设计方法论(新界面/改样式/视觉方向)→ 读 design-methodology.md;②React 性能(写/改 React/Next.js 代码)→ 读 react-performance.md;③UI 审查(review 我的 UI/可访问性/UX)→ 读 ui-review.md;④品牌设计语言(仿某站点风格/营销页)→ 读 design-language.md;参考仿造(照着截图/某风格做)→ 读 reference-hunting.md。`/tcraft-web 工具|设计|react|审查|语言|参考` 可指定。
argument-hint: [工具 | 设计 | react | 审查 | 语言 | 参考]
---

触发 **web-guidelines** skill 的前端流程。这是前端四条线的显式入口;不指定则按对话意图自动路由。

## 参数

- 无参数:按当前对话意图自动路由(应用/工具 UI / 设计新界面 / React 编码 / UI 审查 / 品牌语言)。
- `工具` / `app`:做后台、仿真平台、本地工具等应用型界面 → 读 `app-ui-design.md`(组件基底 shadcn/antd + token + 密度/状态/暗色)。**这是做 app 的主线**。
- `设计`:做新 UI 或改样式 → 读 `design-methodology.md`(先钉主题、两遍法、避开 AI 默认三样式)。
- `react`:写 / 改 React、Next.js 组件、取数、性能优化 → 读 `react-performance.md`(70 条规则 8 类,先 CRITICAL)。
- `审查`:review UI / 可访问性 / UX → 读 `ui-review.md`(WebFetch 拉 vercel 最新规则,按 file:line 出报告)。
- `语言`:做营销页 / 仿某站点风格 / 要品牌设计语言 → 读 `design-language.md`,先让用户从 `design-styles.json`(74 款)选定风格,再拉对应 DESIGN.md。
- `参考`:照着某个风格 / 截图做 → 读 `reference-hunting.md`(读图提取设计语言 → token → 仿造)。

## 执行

读 web-guidelines skill 的 `SKILL.md`(路径 `../web-guidelines/SKILL.md`)定线,再读对应 reference(路径 `../web-guidelines/references/*.md`)。

1. **前置:项目约定发现**——读项目 CLAUDE.md / 既有 DESIGN.md,确认技术栈(React/Vue/原生)、UI 库(shadcn/Tailwind/MUI)、既有设计 token。
2. **定位**:按上表参数或意图定走哪条线;「工具」类先选组件基底再定 token,「设计」类先钉主题再动手。
3. **执行**:设计 → 两遍法(规划 → 对照 brief 审查 → 构建);React → 按优先级对照规则;审查 → 拉最新规则逐条对照;语言 → 拉 DESIGN.md 照 token 生成。
4. **交付**:设计产物给用户审;审查结果按 `file:line` 报告;可沉淀的通用设计约定 → 项目 DESIGN.md 或经 obsidian-kb 沉淀。

## 约定

- **先钉主题再设计**:brief 没定就自己定主体/受众/单页职责,不套默认模板。
- **以文件实际内容为准**:匹配项目既有组件与样式,不另起炉灶。
- **设计语言按需拉取**:只拉当前任务要的那个站点 DESIGN.md,不整库拷贝。
