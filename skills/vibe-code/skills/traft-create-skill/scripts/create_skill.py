#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
创建 traft-* 技能骨架 SKILL.md(脚本优先,减少手写 token)。

用法:
    python create_skill.py --name traft-xxx \
        --dir <技能目录,相对路径,如 skills/vibe-code/skills/traft-xxx> \
        --description "一句话:技能做什么 + 何时触发(路由靠 description)"

行为:
- 在 <dir>/ 生成 SKILL.md 骨架(frontmatter + 边界 + 触发 + 规则 + 知识底座 + 工作流 + 输出规范 + 示例占位)
- 骨架留 TODO 占位,由作者按 templates/skill-template.md 填充
- 骨架内只用相对路径 / skill:// 引用,不写绝对路径

示例:
    python create_skill.py --name traft-foo \
        --dir skills/vibe-code/skills/traft-foo \
        --description "示例技能——触发时机:xxx"
"""

import argparse
import os
import sys

TEMPLATE = """---
name: {name}
description: {description}
---

# {name} 技能

<一句话职责说明>

**职责边界**：
- 负责：<做什么>。
- 不负责：<不做什么/转交谁>。超出边界直接转交，不硬接。

## 1. 触发条件（TRIGGER）

| 场景 | 触发信号(关键词/典型句式) | 是否触发 |
| --- | --- | --- |
| <场景1> | "<信号>" | 触发 |
| <场景2> | "<信号>" | 触发 |
| <反例> | "<信号>" | 不触发，<转交/默认回复> |

## 2. 规则（RULES）

### 2.1 务必执行(ALWAYS DO)
1. TODO
2. TODO

### 2.2 禁止执行(NEVER DO)
1. TODO

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：TODO
- 缺失时：TODO

## 3. 知识底座（CONTEXT）

- TODO
- **约定变更时同步更新本节。**

## 4. 工作流程（WORKFLOW）

### Step 1: TODO
- 动作：TODO
- 完成标志：TODO

### Step 2: TODO
- 动作：TODO
- 完成标志：TODO

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
```text
TODO
```

### 5.2 字段要求

| 字段 | 写作要求 |
|----|------|
| TODO | TODO |

### 5.3 交付前自检
- [ ] TODO
- [ ] 无绝对路径（相对路径 / skill:// 引用）

## 6. 示例

### 6.1 好的示例
**输入**：TODO
**输出**：TODO

### 6.2 差的示例
**输入**：TODO
**输出**：TODO
"""


def main() -> int:
    p = argparse.ArgumentParser(description="创建 traft-* 技能骨架 SKILL.md")
    p.add_argument("--name", required=True, help="技能名(如 traft-xxx)")
    p.add_argument("--dir", required=True, help="技能目录(相对路径,如 skills/vibe-code/skills/traft-xxx)")
    p.add_argument("--description", required=True, help="技能描述(做什么 + 何时触发)")
    args = p.parse_args()

    if not args.name.startswith("traft-"):
        print("警告: 技能名建议以 traft- 前缀(vibe-code 插件)", file=sys.stderr)

    os.makedirs(args.dir, exist_ok=True)
    out = os.path.join(args.dir, "SKILL.md")
    if os.path.exists(out):
        print("已存在: %s (不覆盖)" % out, file=sys.stderr)
        return 1

    content = TEMPLATE.format(name=args.name, description=args.description)
    with open(out, "w", encoding="utf-8") as f:
        f.write(content)
    print("已生成: %s" % out)
    print("下一步: 按 templates/skill-template.md 填充 TODO,补触发条件/规则/工作流/示例")
    print("校验: 全文件无绝对路径(grep '/Users/' ),脚本 py_compile 通过")
    return 0


if __name__ == "__main__":
    sys.exit(main())
