---
name: py-version-syntax
description: 语法与类型注解必须匹配项目实际使用的 Python 版本，以 .python-version / pyproject.toml 为准
globs: ["*.py"]
alwaysApply: true
---

# Python 版本兼容

写 Python 前先确认项目版本（`.python-version` → pyproject.toml → `python --version`），**语法与类型注解与项目版本保持一致**：3.8 项目用 3.8 写法（typing.Dict/Optional），3.10+ 项目才用新语法。版本拿不准按最低兼容目标写，写完 `python -m py_compile` 验证。
