# 格式化配置模板(从 sim_flow / SimX 提炼)

新项目搭建格式化环境时,复制下面配置 + 跑 `scripts/setup_format_tools.sh` 装工具。

## .clang-format(C++,Google 风格)

最小可用(完整 280 行版参考 SimX/.clang-format):

```yaml
---
Language:        Cpp
BasedOnStyle:    Google
ColumnLimit:     120
IndentWidth:     2
UseTab:          Never
```

## .editorconfig(其他语言 + bash 依据;shfmt 默认读它)

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
max_line_length = 120

[*.py]
indent_style = space
indent_size = 4

[*.{h,hpp,cc,cpp,c,hh}]
indent_style = space
indent_size = 2

[*.sh]
indent_style = space
indent_size = 2
shell_variant = bash

[Makefile]
indent_style = tab

[*.{cmake,txt}]
indent_style = space
indent_size = 2

[*.{toml,yaml,yml,json}]
indent_style = space
indent_size = 2
```

## pyproject.toml(Python:ruff + mypy)

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

## 命令

| 语言 | 格式化 | 检查 |
|------|--------|------|
| C++ | `clang-format -i <files>` | - |
| Python | `ruff format .` | `ruff check .` + `mypy src` |
| bash | `shfmt -i 2 -ci -bn -w <files>` | `shellcheck <files>` |

排除构建产物与第三方:`.venv`、`build`、`.git`、protobuf 生成(`*_pb2.py`、`*.pb.cc/h`)。
