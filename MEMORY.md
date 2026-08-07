# Project Memory

t-craft 开发过程中的关键偏好、决策、待办,记于此(随用随更)。

## 偏好:TODO skill 重点参考 mattpocock/skills

用户认为 [mattpocock/skills](https://github.com/mattpocock/skills)(199k★)是最棒的 skill 仓库。后续开发 t-craft 的 TODO 占位 skill 时,着重参考它,先读对应 SKILL.md 借鉴:

| t-craft TODO skill | mattpocock 借鉴点 |
|--------------------|-------------------|
| brainstorm | `engineering/grill-with-docs`、`engineering/research`(深挖需求、追问) |
| eval-report | `engineering/to-spec`、`engineering/triage`(spec 合规、分诊) |
| dev-flow(编排)| `engineering/` 整套流程(research -> domain-modeling -> implement -> tdd -> diagnosing-bugs -> code-review) |
| vault-query | 用户自创思路(summary + 3-tier 读),mattpocock 无对应,弱参考 |

> 已影响 t-craft 的:code-review 双轴(Standards/Spec)+ Fowler 异味基线,源自 mattpocock。详见 [REFERENCES.md](REFERENCES.md)。

## 待办

- [x] `brainstorm`(basic-skills)- 需求深挖/头脑风暴,流程阶段①(2026-08-03 实现,待 `/plugin update` 生效)
- [ ] `eval-report` → **并入 `spec-doc`**:spec-doc 评估测试文档段(后补,形态二)。eval-report 占位已删(2026-08-03)。
- [x] `spec-doc` 方案文档段(code-skills)- 标准文档生成 skill,两形态(方案文档已实现/评估测试文档后补)。骨架按读者分章:用户读(需求背景/方案设计/项目收益/行动清单/验收标准)+ AI 须知(范围外/代码变更清单/测试决策)。落 vault 方案卡。2026-08-03 实现,待 `/plugin update` 生效。
- [x] `obsidian-query`(obsidian-skills,原名 vault-query)- 省 token 查询:summary frontmatter + 3-tier 读。2026-08-03 实现,待 `/plugin update` 生效。
- [x] `dev-flow`(code-skills)- 研发流程调度器,识别阶段+激活 skill+流转提示。2026-08-03 实现,待 `/plugin update` 生效。
- [x] 提交推送 git(2026-08-03 已推送 main:`6511334`)

## 参考

- [brainstorm 参考调研](brainstorm-reference-research.md) — 4 个开源 brainstorm 类 skill 的实际设计机制(superpowers brainstorming / mattpocock grill-with-docs+to-spec+research / 5-Whys / first-principles)
- [brainstorm 设计决策](brainstorm-design-decision.md) — 产出=需求要点(短)/采访=弹性一次一问/追问=内嵌5-Whys+first-principles;9节骨架对齐git-flow风格
- [spec-doc 设计决策](spec-doc-design-decision.md) — 标准文档生成skill/方案文档+评估测试文档两形态/按读者分章(用户读5节+AI须知)/与brainstorm接力/落vault方案卡
- [obsidian-query 设计决策](obsidian-query-design-decision.md) — 独立skill只查/summary frontmatter+3-tier读/联动改obsidian-kb模块三+模板加summary
