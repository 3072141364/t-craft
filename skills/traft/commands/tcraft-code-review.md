---
description: 研发阶段④代码审查。双轴(Standards 规范 / Spec 需求)两档(影响面评估 / 全量评估),出报告不改码。无参数=全量评估(未提交范围);impact=影响面评估(轻);full=全量;<base..head>=指定范围。
argument-hint: [impact|full|<base..head>]
---

触发 `traft-code-review` skill 的评估审查(研发流程阶段④)。

## 参数
- 无参数:全量评估(未提交范围,双轴完整)。
- `impact`:影响面评估(轻档),改动影响哪些模块/调用链,开发完第一步。
- `full`:全量评估(同无参数)。
- `<base..head>`:指定范围全量评估,如 `main..HEAD`。

## 执行
读 `skill://traft-code-review`,按其流程走:

1. 定档定范围(用 git diff / git log 拿改动)。
2. Standards 轴:对照 12 味异味基线扫 diff,标"可能 X"引 hunk;查外科手术式修改。
3. Spec 轴:读 `requirements/<需求名>/prd.md` 验收标准逐条核对。
4. 回归影响:走 `traft-code-intelligence`(gitnexus-impact-analysis),对照 prd「AI 须知的变更清单」。
5. 出报告(结论当先:可发布/需修+问题清单);要落盘走 `traft-project-docs` 的 review.md 模板。

只出报告不改码;VCS 无关;不审格式(交 lint / make format)。
