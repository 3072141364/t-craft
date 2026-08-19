---
name: python-guidelines
description: Python 项目落地约定与工具真源(超出通用编码常识)。何时读:①要配 / 跑 ruff、mypy,或写 pyproject 的 lint/type 配置——本 skill 附属 references/format.md 给行长 120 + ruff+mypy(strict) 的配置模板与命令;②要审 Python 代码抓工具管不到的逻辑 bug(可变默认参数、异常吞咽、闭包延迟绑定、is 比值)——见 references/review.md;③要对齐项目版本兼容(如 3.8 不用 dict 合并 / 新式类型注解)与既有风格,须先读项目 CLAUDE.md 与 pyproject。命名 / docstring / 类型注解替代注释等通用原理在父 skill code-guidelines,不在此重复。
---

# Python 专项(项目约定 + 工具真源 + 易错点)

模型默认已会 snake_case、docstring、类型注解、推导式这些。本 skill 只补**默认可能疏忽、且对项目正确性有影响**的三块:项目约定发现、工具配置真源、Python 独有易错点。通用编码原理在父 skill `code-guidelines`。

## 1. 项目约定发现(先做,不凭记忆)

从项目 `CLAUDE.md` / `pyproject.toml` / `.python-version` 读:

- **版本兼容**:如 Python 3.8——不用 3.8+ 调试 f-string(`f"{x=}"`)、不用 `dict | dict` 合并、类型注解用 `List[int]` + `from typing import` 而非 `list[int]`。具体版本以项目文件为准。
- **格式化 / 类型检查命令**:优先 `make format` / `make lint`(见 code-guidelines 的 make-shortcut.md);配置模板见 [references/format.md](references/format.md)。
- **匹配既有风格**,以文件实际内容为准。

## 2. 工具配置真源

- **格式化 + lint + 类型检查**:ruff(format+lint)+ mypy(strict),行长 120,PEP8。配置模板与命令见 [references/format.md](references/format.md)。
- 类型注解配合 mypy 是 Python 可读性主力(会被检查、不会过时),比注释可靠——但**类型说不出的"为什么"**(为什么这个参数 Optional、参数间约束)仍要注释。

## 3. Python 独有易错点(写时留意,审时对照)

模型默认可能疏忽、Python 特有的坑:

- **可变默认参数**:`def f(x, acc=[])` 的 `acc` 跨调用共享,几乎总是 bug,用 `acc=None` + 函数内初始化。
- **闭包延迟绑定**:循环里建闭包捕获循环变量,全部拿到最后一个值,用默认参数固定。
- **异常吞咽**:`except: pass` / 裸 `except` 吞掉一切(含 KeyboardInterrupt),按需窄化。
- **`is` 比值**:`is` 判身份不判相等,除 `None`/`True`/`False` 外别用 `is` 比较值。
- **AbstractTask 模板方法**:项目里 `AbstractTask` 等基类用模板方法(`_before_x → _x_impl → _after_x`),写新 Task 顺着结构——流程在基类、差异在子类 `_impl`,天然不长。详见项目 CLAUDE.md 的 Task 体系节。

审代码时逐条对照,完整审查清单见 [references/review.md](references/review.md)。

## 与 review 的分工

- **本 skill(写时)**:项目约定 + 工具真源 + 易错点,预防性。
- **[references/review.md](references/review.md)(审时)**:抓写时漏掉的逻辑 bug,检测性。
