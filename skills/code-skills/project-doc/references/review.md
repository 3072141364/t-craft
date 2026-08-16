# 评估审查(review)

> project-doc 的附属文档:评估审查报告(review.md)怎么写。阶段④(`/tcraft-code-review` 后)产需求达成确认 + 回归影响 + 结论时读本文。落点 `projects/<名>/requirements/<需求名>/review.md`,模板在 skill 仓库 `assets/templates/review.md`。

## 定位

开发完成、`/tcraft-code-review` 后,产出评估报告给 peer review:**确认需求达成 + 无回归 + 结论**。与 `/tcraft-code-review` 互补——code-review 查问题,本文件确认达成。

## 骨架

```markdown
---
title: <需求名>
type: feat
project: <项目名>
status: ④验证
date: <日期>
tags: []
---

## 审查结论(/tcraft-code-review)
Standards 轴 / Spec 轴结论,列出问题与修复状态。

## 需求达成确认
| prd 验收标准 | 达成 | 说明 |
|-------------|------|------|

## 回归影响
评估改动影响范围,确认不破坏其他功能(对照 prd「AI 须知」变更清单:预判 vs 实际)。

## 结论
可发布 / 需修(列未完成项)。
```

## 流程(两档)

1. **影响面评估**(轻):`/tcraft-code-review impact`,确认改动影响范围、不破坏其他功能。
2. **全量评估**(重):`/tcraft-code-review full` 双轴审查(Standards 规范 / Spec 需求),确认无问题、无范围蔓延。
2. **达成确认**:逐条对照 prd 验收标准,确认做了、做对了。
3. **回归评估**:用 code-intelligence(gitnexus `impact` / `detect_changes`)评估影响范围。
4. **测试结论**:对照 [test.md](test.md) 的测试证据。
6. **落盘**:存 `review.md`,`progress.md` 的 `status` 改为 `④验证`。

## 规则

- **对 prd 负责**:验收标准逐条核对,不达成的明说,不模糊带过。
- **对证据负责**:结论基于 test.md 与 code-review,不凭感觉。
- **与 test.md 分工**:test.md 是测试证据,review.md 是综合判断(可发布 / 需修)。
