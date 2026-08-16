# bash 格式化与检查(format)

> bash-guidelines 的附属文档:bash 格式化标准、shfmt/shellcheck 用法。要格式化脚本、写 .editorconfig 的 bash 段时读本文。跨语言统一约定见 code-guidelines 附属文档 format.md(本 plugin 内)。

## 标准

- **格式化**:shfmt,`-i 2 -ci -bn`(2 空格缩进、case 缩进、二元运算符换行对齐)。
- **检查**:shellcheck(lint)。
- **依据**:shfmt 默认读 `.editorconfig` 的 `[*.sh]` 段--`.editorconfig` 就是 bash 格式化的配置,保持一致。

## 命令

| 动作 | 命令 |
|------|------|
| 格式化 | `shfmt -i 2 -ci -bn -w <files>` |
| lint | `shellcheck <files>` |

## .editorconfig bash 段

```ini
[*.sh]
indent_style = space
indent_size = 2
shell_variant = bash
```

## 注意

- shellcheck 报的先修再看 [review.md](review.md) 的逻辑问题;两者互补不重复。
- 工具安装:code-guidelines 的 `scripts/setup_format_tools.sh` 一键装(经 uv)。
