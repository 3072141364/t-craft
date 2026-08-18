# 命令速查

t-craft 的 10 个快捷命令(`/xxx`),覆盖研发流程、前端、知识体系、科研四条工作流。命令是**显式入口**(你明确叫某流程);skill 是**自动触发**(意图匹配即激活)。两者互补——命令给你掌控,skill 给你省事。

## 全览

| 命令 | 体系 | 流程 | 用途 |
|------|------|------|------|
| `/tcraft-brainstorm` | code-skills | ① 头脑风暴 | 需求深挖,产出需求要点 |
| `/tcraft-project-doc` | code-skills | ② 方案设计 | 项目文档:prd/adr/test/review |
| `/tcraft-code-review` | code-skills | ④ 验证 | 代码审查:影响面评估 / 全量评估 |
| `/tcraft-release` | code-skills | ⑤ 发布 | 提交→合并→版本升级→上线 |
| `/tcraft-dev-flow` | code-skills | 调度器 | 识别当前阶段,激活对应 skill |
| `/tcraft-web` | code-skills | 前端 | 工具 UI / 报告 / React / UI 审查 |
| `/tcraft-obsidian-kb` | obsidian-skills | vault 管理 | 初始化/落盘/沉淀/标签/问答/周报 |
| `/tcraft-obsidian-query` | obsidian-skills | 查询 | 3-tier 省 token 查 vault |
| `/tcraft-weekly` | obsidian-skills | 周报 | 建本周周报 |
| `/tcraft-paper` | research-skills | 论文研究 | 收/读/笔记/队列 |

---

## code-skills · 研发流程

### `/tcraft-brainstorm` — ① 头脑风暴
**用途**:接需求后深挖真实意图/约束/边界/风险/验收标准,查 vault 旧方案,产出需求要点。

| 用法 | 说明 |
|------|------|
| `/tcraft-brainstorm` | 对当前对话里已提到的需求深挖(没有则先问你要深挖什么) |
| `/tcraft-brainstorm <一句话需求>` | 对该需求深挖,如 `/tcraft-brainstorm 给导出加 PDF 格式` |

**产出**:需求要点(对话内)+ 建需求文件夹 + progress.md(status ①)。

### `/tcraft-project-doc` — ② 方案设计
**用途**:项目文档统一入口,把需求要点落成规格化文档到 vault。

| 用法 | 说明 |
|------|------|
| `/tcraft-project-doc` | 对当前需求落 prd |
| `/tcraft-project-doc prd\|adr\|test\|review` | 指定文档类型 |
| `/tcraft-project-doc <一句话需求>` | 对该需求落 prd |

**产出**:prd + adr(落 vault 需求文件夹),progress → ②方案。配图联动 fireworks-tech-graph。

### `/tcraft-code-review` — ④ 验证
**用途**:代码审查,双轴(Standards 规范 / Spec 需求),VCS 无关,出报告。

| 用法 | 说明 |
|------|------|
| `/tcraft-code-review` | **全量评估**(重档),未提交范围,完整四阶段双轴 |
| `/tcraft-code-review impact` | **影响面评估**(轻档),改动影响哪些模块/调用链,开发完第一步 |
| `/tcraft-code-review full` | 全量评估(同无参数) |
| `/tcraft-code-review <base..head>` | 指定范围全量评估,如 `main..HEAD` |

### `/tcraft-release` — ⑤ 发布
**用途**:验证全绿后走发布流程——提交 → 合并主分支 → 版本升级 → 打 tag 上线。

| 用法 | 说明 |
|------|------|
| `/tcraft-release` | 从当前 git 状态判断从哪步开始 |
| `/tcraft-release commit\|merge\|version\|tag` | 只做指定步骤 |

**版本升级规则**:合入主分支的发布合并,按变更类型递增 SemVer——feat→MINOR / fix→PATCH / BREAKING→MAJOR。每步确认。

### `/tcraft-dev-flow` — 调度器
**用途**:识别当前处于哪个阶段,激活对应 skill,完成后提示进下一阶段。

| 用法 | 说明 |
|------|------|
| `/tcraft-dev-flow` | 自动识别当前阶段(从 git 状态 + 对话推断,识别不了就问) |
| `/tcraft-dev-flow <阶段号或名>` | 跳到指定阶段,如 `/tcraft-dev-flow 3`、`/tcraft-dev-flow 实现` |

**六阶段**:①头脑风暴 → ②方案设计 → ③实现 → ④验证(影响面/全量测试/全量评估/修复/冒烟)→ ⑤发布 → ⑥沉淀。每阶段完成更新 progress.md。

### `/tcraft-web` — 前端总入口
**用途**:Web/前端五条线的显式入口——应用型 UI / 设计与文案 / 报告渲染 / React 性能 / UI 审查。面向 SaaS 平台/应用界面与报告渲染,不做营销页。skill 自动触发之外,想明确走某条线时用。

| 用法 | 说明 |
|------|------|
| `/tcraft-web` | 按当前对话意图自动路由(工具 UI / 报告 / React 编码 / UI 审查) |
| `/tcraft-web 工具` | 后台管理/SaaS 平台/本地工具界面,或「让界面更好看」→ 组件基底 + token + 交互骨架(**界面主线**) |
| `/tcraft-web 报告` | 测试/评估/数据报告、汇总页 → 结论金字塔 + 图表选型 + 打印友好(**报告主线**) |
| `/tcraft-web react` | 写 / 改 React、Next.js 组件、性能优化 → 70 条规则 8 类,先 CRITICAL |
| `/tcraft-web 审查` | review UI / 可访问性 / UX → 拉 vercel 最新规则,按 file:line 出报告 |

无论哪条线,动手前都过 design-craft(钉主题、两遍法、避默认样式簇、文案即材料)。

**来源**:skill 提炼自 anthropics/skills(frontend-design)、vercel-labs/agent-skills,应用 UI 与报告渲染自研(参考 shadcn/ui、Ant Design),不整库拷贝,来源已标注。

---

## obsidian-skills · 知识体系

### `/tcraft-obsidian-kb` — vault 管理入口
**用途**:vault 管理总入口,按模块路由。

| 用法 | 说明 |
|------|------|
| `/tcraft-obsidian-kb` | 按当前对话意图自动路由到对应模块 |
| `/tcraft-obsidian-kb init` | 初始化 vault(建目录/模板/INDEX) |
| `/tcraft-obsidian-kb 落盘` | 需求方案落盘(需求文件夹 + prd/progress) |
| `/tcraft-obsidian-kb 沉淀` | 卡片沉淀(项目知识→vault,通用知识→skill 仓库) |
| `/tcraft-obsidian-kb 标签` | 标签维护 |
| `/tcraft-obsidian-kb 问答` | 快速问答(answer-index) |
| `/tcraft-obsidian-kb 周报` | 周报(或直接 `/tcraft-weekly`) |

### `/tcraft-obsidian-query` — 查询
**用途**:3-tier 省 token 查 vault——按标签/关键词粗筛,读 frontmatter summary 判相关性(无关跳过/弱相关只读 summary/强相关精读全文),不倾倒全文。

| 用法 | 说明 |
|------|------|
| `/tcraft-obsidian-query <查询词>` | 查 vault 相关笔记,如 `/tcraft-obsidian-query 之前怎么做认证` |

### `/tcraft-weekly` — 建周报
**用途**:建本周周报,列开发/论文/技术三流任务与进展 + 问题阻塞 + 沉淀 + 下周计划;工作清单在周报内维护。

| 用法 | 说明 |
|------|------|
| `/tcraft-weekly` | 建本周周报 |
| `/tcraft-weekly <ISO周次>` | 建指定周,如 `/tcraft-weekly 2026-W34` |

**分工铁律**:周报记「事情」,需求进度在 progress.md——周报只链 progress,不重复记状态。

---

## research-skills · 论文研究

### `/tcraft-paper` — 论文研究入口
**用途**:收论文进待读、读论文记笔记、整理阅读清单。

| 用法 | 说明 |
|------|------|
| `/tcraft-paper` | 按当前对话意图判断动作 |
| `/tcraft-paper 收` | 记进待读队列 `papers/reading-list.md` |
| `/tcraft-paper 读` | 粗读判价值 → 建论文卡(状态「在读」)→ 精读 |
| `/tcraft-paper 笔记` | 填论文卡四节(为什么读/核心/关联/批判),状态「在读」→「已读」 |
| `/tcraft-paper 队列` | 整理待读队列 |

**已读判据**:论文卡四节填全才算,不是"看完了"。落盘走 obsidian-kb。

---

## 通用约定

- **命令在哪**:命令自动发现于各 plugin 的 `commands/`(`/plugin update` 或重启生效)。
- **每步确认**:涉及写 vault、commit、push、tag 等操作,命令都会展示草稿/结果给你确认,不擅自执行。
- **以项目文件实际内容为准**:分支模型、版本真源、格式化命令等从项目 CLAUDE.md / 规范文档发现,不硬编码。
- **skill 与命令**:命令 = 显式调用某流程;skill = 意图自动触发。同一件事两条路,先想"我是要明确走流程,还是交给意图匹配"。
