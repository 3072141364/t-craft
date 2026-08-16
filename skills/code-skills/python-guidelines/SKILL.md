---
name: python-guidelines
description: Python 语言专项编码约定 + 格式化。在编写、重构、格式化 Python 代码时使用,补充父 skill code-guidelines(跨语言通用原理)在 Python 上的具体落地:注释语法(# / docstring)、snake_case 命名、类型注解替代注释、AbstractTask 模板方法拆分;格式化与检查(附属文档 references/format.md):PEP8、行长 120、ruff(format+lint)+ mypy(strict)的配置与命令、pyproject 模板。当用户写 Python、改 Python、要求「加注释 / docstring」「重构 Python 函数」「提升可读性」「格式化 Python」「跑 ruff / mypy」「写 pyproject ruff/mypy 配置」时遵循。语言无关的原理见 code-guidelines,不在此重复。
---

# Python 编码约定(Python 专项)

父 skill `code-guidelines` 讲了跨语言通用的原理(见名知义、非必要不注释、不写长函数、命名自解释、注释与文档分工)。本 skill 只补 **Python 独有**的落地:注释语法、命名风格、类型注解、拆函数惯用法。原理不重复,先读 `code-guidelines`。

**附属文档**(渐进披露,用到才读):

- **[references/format.md](references/format.md)** -- 格式化与检查:PEP8、行长 120、ruff + mypy 配置模板与命令。格式化 / lint / 写配置时读。
- **[references/review.md](references/review.md)** -- 审查要点:可变默认参数、异常吞咽、闭包延迟绑定等工具管不到的逻辑问题。审代码时读。

## 项目约定发现

语言专项之外,项目级约束(版本兼容、格式化命令、类型检查配置)从项目 `CLAUDE.md` 读:

- **版本兼容**:如 Python 3.8 不用 3.8+ 调试 f-string 语法、不用 `dict |` 合并、不用 3.9+ 类型注解新语法(`list[int]` 用 `List[int]` + `from typing import`)。具体版本看 `.python-version` / `pyproject.toml`。
- **格式化**:ruff / mypy 配置见附属文档 [references/format.md](references/format.md);执行优先 `make format` / `make lint`(code-guidelines 附属文档 make-shortcut)。
- **以文件实际内容为准**,匹配既有风格。

## 1. 注释语法

- **行内注释**:`#` 后一个空格,接注释。`# 防止下游对 None 解引用`。
- **docstring**:模块 / 类 / 公共函数用三引号 `"""..."""`。函数内部写普通 `#` 注释,不写 docstring。
- **多行注释**:Python 没有多行注释语法,连续 `#` 行,别用三引号字符串当多行注释(它会被 Python 当成表达式字符串,且 IDE / 文档工具可能误解析为 docstring)。

## 2. snake_case 命名(PEP 8)

- **函数 / 变量 / 方法**:`snake_case`。`normalize_sensor_reading` 好,`normalizeSensorReading` / `Normalize_Sensor_Reading` 差。
- **类名**:`PascalCase`。`AbstractTask` / `P1IsolationSandbox`。
- **常量**:`UPPER_SNAKE_CASE`。`MAX_RETRY_COUNT`。
- **私有**:`_` 前缀。`_validate_input` 表示内部用。
- **双下划线前缀**(`__name`)是名称改写,不是简单私有,别滥用。

## 3. 类型注解替代注释

**类型能说的,注释就别说。** 类型注解比注释更可靠——它会被 mypy 检查、不会过时。

- 签名 `def get_readings(sensor_id: str) -> list[Reading]:` 写了,就不用 `# 返回 Reading 列表`。
- `Optional[str]` / `str | None` 写了,就不用 `# 可能返回 None`。
- 但**类型说不出的**(为什么这个参数是 Optional、参数间的约束、返回值的语义)仍要注释——类型管「是什么」,注释管「为什么」。

项目有 mypy(配置见附属文档 format.md),类型注解配合 mypy 是 Python 可读性的主力,比注释优先级高。

## 4. Python 拆函数惯用法

父 skill 讲了拆函数的通用原则(按职责拆、名字代分节注释、降嵌套)。Python 专项:

- **列表 / 字典推导式**:[f(x) for x in xs if pred(x)] 比等价 for 循环短且自解释,但**别嵌套深**——双层嵌套推导式读起来比拆成两个函数难,嵌套超一层考虑拆。
- **dataclass 建模入参**:用 `@dataclass` + pydantic Field 做入参校验,字段名即文档,不用注释解释每个参数。
- **AbstractTask 模板方法**:项目里 `AbstractTask` 等基类用模板方法(`_before_x → _x_impl → _after_x`),子类只实现 `_xxx_impl`。写新 Task 顺着这个结构——流程在基类,差异在子类的 `_impl`,天然不长。详见项目 CLAUDE.md 的 Task 体系节。
- **`if __name__ == "__main__"`**:可执行脚本把入口逻辑放这里,主逻辑抽成函数,别堆在模块顶层。

## 附:与 review 的分工

- **本 skill(写代码时)**:约束自己写出来的 Python 代码——命名、注释、docstring、类型注解、拆函数。预防性的。
- **`references/review.md`(审代码时)**:看 Python 代码查具体 bug——可变默认参数、异常吞咽、闭包延迟绑定、`is` 比值等。检测性的。

写的时候守本 skill + 父 `code-guidelines` 防患于未然;审的时候用 `references/review.md` 抓漏网的 bug。
