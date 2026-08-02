---
name: eval-report
description: "[TODO 占位·未实现] 评估与测试报告。实现完成后,回归需求确认、评估改动影响、产出评估/测试报告(需求实现确认 + 回归影响 + 测试结论)。研发流程阶段④,与 code-review 互补:code-review 查问题,本 skill 确认需求达成且无回归。"
---

# Eval Report(占位 · TODO)

> **状态:占位,未实现。** 以下是设计意图,待开发。

## 定位

研发流程阶段④:`/code-review`(查问题)之后,产出**评估/测试报告**--保证实现了需求且不影响其他功能。

## 与 code-review 分工

- **code-review**:查"有没有问题"(双轴 Standards/Spec,找 bug/违规/异味/需求偏差)。
- **eval-report**:确认"需求达成了 + 没回归"(逐条对需求、评估影响范围、列测试结论)。

## 将来做(to implement)

- [ ] **需求实现确认**:逐条对照 spec / 需求要点,确认做了、做对了。
- [ ] **回归影响评估**:用 code-intelligence(gitnexus `impact` / `detect_changes`)评估改动影响范围,确认不破坏其他功能。
- [ ] **测试结论**:跑了哪些测试(`make test` / `make lint`)、通过情况、覆盖了什么、还缺什么。
- [ ] **产出报告**:存 vault `项目/<名>/评估/<版本或主题>.md`(card_type: 评估报告);含需求确认表 + 影响范围 + 测试结论 + 结论(可发布 / 需修)。
- [ ] 联动 obsidian-kb(存报告)、code-intelligence(影响分析)、make-shortcut(跑测试)。
