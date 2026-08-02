---
name: code-format
description: 代码格式化与检查的标准和工具搭建。C++ 遵循 Google(clang-format)、Python 遵循 PEP8(ruff format + ruff lint + mypy)、bash 用 shfmt、其他语言遵循 .editorconfig,行长统一 120。当用户要"格式化代码""配置格式化""装格式化工具""写 .clang-format / .editorconfig / pyproject ruff 配置""检查代码风格""跑 lint""搭建格式化环境(新项目)"时使用。提供一键装工具脚本 + 配置模板。项目有 make format 时,执行优先走 make-shortcut,本 skill 管标准/配置/工具。
---

# Code Format

代码格式化与静态检查的统一标准 + 工具搭建。从 sim_flow / SimX 提炼:C++ Google(clang-format)、Python PEP8(ruff + mypy)、bash(shfmt)、其他(.editorconfig),行长统一 120。

## 何时触发

- **格式化代码**:对某语言跑格式化(无 Makefile 时直接跑工具)。
- **配置格式化**:写 `.clang-format` / `.editorconfig` / `pyproject.toml` 的 ruff/mypy 配置。
- **装工具 / 搭环境**:新项目搭格式化环境、装 clang-format/ruff/mypy/shfmt/shellcheck。
- **检查代码风格 / 跑 lint**。
- 注:项目有 Makefile 时,"格式化""lint"的**执行**优先走 `make format` / `make lint`(make-shortcut);本 skill 管标准、配置、工具。

## 各语言标准

| 语言 | 规范 | 工具 | 关键设置 |
|------|------|------|---------|
| C++ | Google | clang-format | ColumnLimit 120, IndentWidth 2, UseTab Never |
| Python | PEP8 | ruff(format + lint)+ mypy(类型) | line-length 120, 4 空格, double quote; lint select E/W/F/I/UP/B/SIM/N, ignore E501; mypy strict |
| bash | - | shfmt(+ shellcheck) | `-i 2 -ci -bn`(2 空格) |
| 其他 | .editorconfig | 编辑器 / shfmt 读 | utf-8, lf, final newline, trim trailing, max_line 120 |

行长统一 **120**(PEP8 默认 79,本项目组统一 120)。

## 工具安装(一键)

```bash
bash <skill>/scripts/setup_format_tools.sh
```

经 `uv tool` 安装、装最新版、装到 `~/.local/bin`:clang-format、shfmt、shellcheck、ruff、mypy。工具集固定,版本不钉死(要可复现再 pin)。需先有 uv(没有:`curl -LsSf https://astral.sh/uv/install.sh | sh`)。

## 配置模板(新项目搭建)

见 `references/format-configs.md`(从 sim_flow / SimX 提炼,可直接复制):

- `.clang-format`:BasedOnStyle Google + ColumnLimit 120 + IndentWidth 2。
- `.editorconfig`:utf-8 / lf / final newline / trim / max_line 120;各语言缩进(Python 4,C++ / bash / TOML / YAML 2,Makefile tab)。
- `pyproject.toml`:`[tool.ruff]` / `[tool.ruff.lint]` / `[tool.ruff.format]` / `[tool.mypy]`。
- bash:`shfmt -i 2 -ci -bn -w`,shellcheck 检查。

搭建新项目:复制配置 + 跑 setup 脚本装工具。

## 工作流程

1. **格式化**:有 Makefile -> `make format`(走 make-shortcut);没有 -> 按语言直接跑 `clang-format -i` / `ruff format` / `shfmt -i 2 -ci -bn -w`。
2. **检查**:有 Makefile -> `make lint`;没有 -> `ruff check .` + `mypy src`。
3. **配置 / 搭建**:用 `references/format-configs.md` 模板生成配置 + 跑 setup 脚本。
4. **写入前确认**:格式化会改文件,展示将跑的命令再执行(用户明确要的除外)。

## 注意

- **行长 120**:C++ / Python / 编辑器统一 120,别用 PEP8 默认 79。
- **mypy 是类型检查不是格式化**:与 ruff 互补,lint 流程一起跑。
- **shfmt 读 .editorconfig**:.editorconfig 是 bash 格式化的依据,保持一致。
- **与 make-shortcut 分工**:有 Makefile 的项目,格式化 / lint 执行走 `make format` / `make lint`;本 skill 管标准 / 配置 / 工具。
- **工具集固定,版本用最新**:脚本装固定的一组工具,版本取最新(不钉死);要跨机器可复现再自行 pin 版本。
