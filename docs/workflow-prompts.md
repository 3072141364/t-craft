# 研发流程预设提示词

接到 feat/bugfix 后,按阶段复用以下提示词(方括号填实际内容)。⚠️ 标记的 skill 是占位 TODO,暂未实现--触发时会告知"未实现",可先用提示词里的思路手动跑。

整条流程:① 头脑风暴 -> ② 方案设计 -> ③ 实现 -> ④ 验证(影响评估→全量测试→代码审查→修复→冒烟)-> ⑤ 发布(提交→合并主分支→版本升级→上线)-> ⑥ 沉淀。prd/adr/test/review/progress 都进 Obsidian 需求文件夹。

## ① 头脑风暴 / 需求深挖

> 我接到一个 [feat / bugfix] 需求:[一句话描述]。先用 brainstorm 和我深挖:真实意图、约束、边界、风险、验收标准;同时用 obsidian-kb 查 vault 里相关的旧方案(按 summary 判相关性:无关跳过 / 弱相关简读 / 强相关精读),看有没有可复用的设计、有没有踩过的坑。产出需求要点(一句话目标 + 约束 + 验收标准 + 相关旧方案链接),并建需求文件夹 + progress.md(status ①)。

## ② 方案设计

> 基于需求要点,用 /tcraft-project-doc(project-doc skill,附属文档 prd.md)把本次需求写到 vault(`projects/[项目名]/requirements/[需求名]/prd.md`):需求背景 -> 方案设计 -> 项目收益 -> 行动清单 -> 验收标准 + AI 须知;关键设计决策落 adr.md;progress.md 状态更新为 ②方案。需要架构 / 流程 / 泳道图时联动 fireworks-tech-graph 生成 PNG,存 `projects/[项目名]/assets/` 并嵌入 `![[图.png]]`。代码仓库只留指针(`> 方案见 Obsidian: [[需求名]]`)。

## ③ 实现(动态调整 prd / 补记 adr)

> 按方案逐步实现。每步:make-shortcut(code-guidelines 附属文档)跑构建 / 测试(`make build` / `make test`),format(code-guidelines 附属文档)管格式化(`make format`);遇 bug 用 code-intelligence 查调用链 / 影响。实现一段就跑一次测试,别堆到最后。开发中方案有变 -> 动态调整 prd.md;出现关键取舍 -> 补记 adr.md(project-doc)。实现完 progress.md 更新为 ③实现。

## ④ 验证(两档:影响面评估 / 全量评估 + 全量测试 / 冒烟测试)

> 实现完,按两档验证:
> 1. **影响面评估**(轻):`/tcraft-code-review impact`——改动影响哪些调用链/模块,确认不破坏其他功能。
> 2. **全量测试**(重):make-shortcut 跑 `make test` / `make lint`,结论落 test.md(project-doc)。
> 3. **全量评估**(重):`/tcraft-code-review full` 双轴(Standards / Spec),结论落 review.md。
> 4. **修复完善**:按 review 结论修改,逐条确认解决。
> 5. **冒烟测试**(轻):关键路径快速验证(修复没引入新问题),通过才进发布。
> 全绿后 progress.md 更新为 ④验证。

## ⑤ 发布(提交 → 合并主分支 → 版本升级 → 上线)

> 验证全绿,用 git-guidelines 发布:
> 1. **提交**:格式化 -> 更新 CHANGELOG -> commit -> push(确认)。
> 2. **合并主分支**:合入受保护分支(master/main)。
> 3. **版本升级**:特定合并(发布到主分支)按变更类型递增 SemVer(feat→MINOR / fix→PATCH / BREAKING→MAJOR),改版本真源 + CHANGELOG 发版收尾 + 打 tag。
> 4. **上线**:打 release / 部署。
> 完成 progress.md 更新为 ⑤发布。

## ⑥ 沉淀(卡片 + 表格)

> 把本次可复用的设计 / 思路 / 方案,用 obsidian-kb 从需求文件夹提炼进 skill 仓库(去项目化后),双链回需求;progress.md 更新为 ⑥沉淀。新的约定 / 概念 / 数据更新到 vault 速查表(标签速查表 + 约定表 + 概念表)。

---

**省 token 提示**:查 vault 时走 obsidian-kb 模块二(query.md)的 3-tier 读——先按标签 + summary 判相关性,无关跳过、弱相关只读 summary、强相关才精读全文。
