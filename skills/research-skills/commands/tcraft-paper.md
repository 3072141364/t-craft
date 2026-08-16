---
description: 论文研究快捷入口(paper-study skill)。收论文进待读、读论文记笔记、整理阅读清单、查相关论文。无参数 = 按当前对话意图判断动作;带参数 = 指定动作。落盘走 obsidian-kb,本命令管论文研究专属流程。
argument-hint: [收 | 读 | 笔记 | 队列]
---

触发 **paper-study** skill 的对应流程。

## 执行

读 paper-study skill(及其 references/reading-flow.md、references/note.md),按动作执行:

- **无参数**:按对话意图判断(看到论文要收藏→收;要读某篇→读;读完→笔记)。
- `收` → 记进待读队列 `papers/reading-list.md`(模板 research-skills/paper-study/assets/templates/reading-list.md),不打断当前阅读。
- `读` → 粗读判价值 → 建论文卡(模板 `paper.md`)状态「在读」→ 精读。
- `笔记` → 填论文卡四节(为什么读 / 核心内容 / 与我关联 / 批判待验证),状态「在读」→「已读」。
- `队列` → 整理 reading-list.md(待读/在读/略读/已读)。

## 约定

- **落盘走 obsidian-kb**:建卡/改状态通过 obsidian-kb 保证路径/双链/标签合规。
- **已读判据**:note.md 四节填全才算,不是"看完了"。
- **与周报联动**:本周读的论文在周报「本周论文」节链 `[[papers/<论文名>]]`。
- 写卡前展示草稿给用户确认。
