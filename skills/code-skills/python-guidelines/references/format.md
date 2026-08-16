# Python 格式化与检查(format)

> python-guidelines 的附属文档:Python 格式化标准、工具配置与命令。要格式化 Python、写 ruff/mypy 配置、跑 lint 时读本文。跨语言统一约定(.editorconfig、行长 120、装工具)见 code-guidelines 附属文档 format.md(本 plugin 内)。

## 标准

- **规范**:PEP8,行长 **120**(不用 PEP8 默认 79,本项目组统一 120)。
- **工具**:ruff(format + lint)+ mypy(类型检查,strict)。
- **关键设置**:4 空格、double quote、lf;line-length 120;lint select `E/W/F/I/UP/B/SIM/N`,ignore `E501`(行长由 formatter 管,lint 层不重复报)。

## 命令

| 动作 | 命令 |
|------|------|
| 格式化 | `ruff format .` |
| lint | `ruff check .` |
| 类型检查 | `mypy src` |

项目有 Makefile 时优先 `make format` / `make lint`(code-guidelines 附属文档 make-shortcut)。排除构建产物与第三方:`.venv`、`build`、`dist`、`__pycache__`、protobuf 生成(`*_pb2.py`)。

## 配置模板(pyproject.toml)

```toml
[tool.ruff]
line-length = 120
target-version = "py312"
exclude = [".venv", "build", "dist", ".eggs", "__pycache__"]

[tool.ruff.lint]
# E/W pycodestyle, F pyflakes, I isort, UP pyupgrade, B bugbear, SIM 简化, N 命名
select = ["E", "W", "F", "I", "UP", "B", "SIM", "N"]
ignore = ["E501"]  # 行长由 formatter 控制,lint 层不重复报

[tool.ruff.format]
quote-style = "double"
indent-style = "space"
line-ending = "lf"

[tool.mypy]
python_version = "3.12"
strict = true
ignore_missing_imports = true
exclude = [".venv", "build", "dist", ".eggs", "__pycache__"]
```

dev 依赖(uv):`[dependency-groups] dev = ["ruff>=0.15.21", "mypy>=1.13"]`。

## 注意

- **mypy 是类型检查不是格式化**:与 ruff 互补,lint 流程一起跑。
- `target-version` / `python_version` 按项目实际 Python 版本改(如 3.8 项目不能用 pyupgrade 到 3.12 语法)。
- 工具安装:code-guidelines 的 `scripts/setup_format_tools.sh` 一键装(经 uv)。
