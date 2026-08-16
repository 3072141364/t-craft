# 跨语言格式化(format)

> code-guidelines 的附属文档:格式化的**跨语言统一约定**(.editorconfig、行长 120)与工具安装。装格式化工具、搭新项目格式化环境、写 .editorconfig 时读本文。语言专项标准与配置在各语言 skill 的附属文档:Python(ruff + mypy)见 `python-guidelines/references/format.md`、C++(clang-format Google)见 `cpp-guidelines/references/format.md`、bash(shfmt + shellcheck)见 `bash-guidelines/references/format.md`。

## 统一约定

- **行长统一 120**(C++ / Python / 编辑器一致;PEP8 默认 79 不用)。
- **.editorconfig**:utf-8、lf、final newline、trim trailing、max_line_length 120;各语言缩进见下模板。shfmt 默认读它,是 bash 格式化的依据。
- **执行顺序**:项目有 Makefile -> `make format` / `make lint`(附属文档 make-shortcut);没有 -> 按语言 skill 的 format.md 直接跑工具。

## .editorconfig 模板

从 sim_flow / SimX 提炼,新项目复制到仓库根:

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

通用排除(格式化 / lint 都别碰):`.venv`、`build`、`dist`、`.git`、`__pycache__`、protobuf 生成(`*_pb2.py`、`*.pb.cc/h`)。

## 工具安装(一键)

```bash
bash <skill>/scripts/setup_format_tools.sh
```

经 `uv tool` 安装、装最新版、装到 `~/.local/bin`:clang-format、shfmt、shellcheck、ruff、mypy。工具集固定,版本不钉死(要可复现再 pin)。需先有 uv(没有:`curl -LsSf https://astral.sh/uv/install.sh | sh`)。
