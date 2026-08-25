---
name: traft-obsidian
description: obsidian知识库管理技能, 用户开发项目的离码文档、研究调研文档、工作周报文档都在这里管理。何时激活："当用户要求增、删、改、查知识库文档时" "查询或更新项目文档时，包括但不限于决策文档adr、方案文档prd、测试文档test，进度文档progress","当用户要求新增周报任务，跟新进度", "帮我整理论文要点并落盘"，"沉淀这个知识点"。
---


# START 
用户使用obsidian管理自己的知识库，目前主要分为几类`开发项目文档`、`研究调研笔记`、`周报进程`。

- obsidian 使用卡片的形式进行管理，一张卡片等于一篇md文档。
- obsidian 的文档有三种路径格式，假设`OBSIDIAN_VAULT_PATH=/home/wz/文档/default/`,下面三个路径指向同一篇文档。
  - obsidian url：obsidian://open?vault=default&file=INDEX
  - 基于库的相对路径：INDEX
  - 绝对路径：/home/wz/文档/default/INDEX.md
- 每张卡片都必须有frontmatter。
- 充分利用obsidian的双链功能。
- 卡片的增删改查直接使用read和write工具即可，和普通文件无差别。
- 适当使用emoji，增加文档可读性，可参考 `reference/emoji-cheatsheet.md`(或 `skill://traft-obsidian/reference/emoji-cheatsheet.md`)。

# RULES

## ALWAYS DO
- 环境变量 OBSIDIAN_VAULT_PATH 记录了vault路径，如果没有，询问用户并记录到zshrc和bashrc。
- 涉及到开发项目的，激活 `traft-project-docs` skill。
- 涉及到调研、论文阅读的，激活 `traft-research` skill。
- 涉及到周报的，激活 `traft-weekly` skill。


## NEVER DO



# WORKFLOWS





