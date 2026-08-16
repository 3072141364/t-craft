# 需求进度规则(progress)

> obsidian-kb 的附属文档:需求的 `progress.md` 怎么写、状态怎么流转。建需求文件夹、dev-flow 流转阶段、周报引用需求时读本文。

## 定位:progress.md 是需求状态真源

一个需求的**状态真源**是 `projects/<名>/requirements/<需求名>/progress.md`,不是周报、不是 prd、不是任何其他文件。

- 需求有生命周期(①头脑风暴 → ②方案 → ③实现 → ④验证 → ⑤发布 → ⑥沉淀),`progress.md` 的 `status` 字段跟着走。
- **dev-flow 每流转一个阶段,改 progress.md 的 `status`**;改完即自动反映到 cards.base「进行中需求」视图。
- 周报记「事情」,progress 记「状态」——周报引用需求只链 progress,不重复维护状态(见 `references/weekly.md`)。

## 文件位置与固定名

- `projects/<名>/requirements/<需求名>/progress.md`,一需求一份,与 prd/adr/test/review 同文件夹。
- 由 brainstorm(阶段①)/tcraft-project-doc(阶段②)建需求文件夹时同步创建;模板在 skill 仓库 `obsidian-kb/assets/templates/progress.md`。

## frontmatter

```yaml
---
title: <需求名>
type: feat            # feat / bugfix / debug / hotfix / refactor / docs / chore
project: <项目名>
status: ③实现          # ①头脑风暴 → ②方案 → ③实现 → ④验证 → ⑤发布 → ⑥沉淀
date: <创建日期>
tags: []
---
```

- `type` 与 prd.md 一致。
- `status` 取值固定六个阶段,`dev-flow` 与 `progress.md` 是唯一读写它的地方。

## 六阶段清单

| 阶段 | 内容 | 完成的判据 |
|------|------|-----------|
| ① 头脑风暴 | 需求要点对齐 | prd.md 已生成 |
| ② 方案 | 方案设计确认 | prd.md 方案节确认 |
| ③ 实现 | 代码 + 测试完成 | 测试过 |
| ④ 验证 | 影响面评估(轻)+ 全量测试 + 全量评估(重)+ 修复 + 冒烟(轻) | review.md + test.md 全绿 |
| ⑤ 发布 | 提交 + 合并主分支 + 版本升级 + 上线 | 已上线 + 版本升级 |
| ⑥ 沉淀 | 可复用内容提炼进 skill 仓库 | 提炼完成 |

阶段 ④ 的 review.md、② 的 adr.md 是产出物;**状态只写在这里**,产出物各自归位。

## 状态流转规则

1. **谁改**:dev-flow(调度器)在阶段流转时更新;用户显式要求时更新。
2. **改哪里**:只改 frontmatter `status`,不动正文历史(正文清单可勾选,但状态以 frontmatter 为准)。
3. **不重复**:周报、prd、其他文档一律不写需求状态,要查就链到 progress.md。
4. **终态**:⑥ 沉淀完(或需求被放弃)后,需求不再出现在「进行中需求」视图;项目整体进 `archive/` 时随文件夹走。

## 与周报的分工(一句话)

**周报记「我做了什么」,progress 记「需求到了哪一步」**——周报是时间的线,progress 是需求的点;两者用 wikilink 互链,不互相复制。
