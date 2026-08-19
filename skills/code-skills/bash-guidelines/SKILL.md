---
name: bash-guidelines
description: bash 脚本加固清单与工具真源(超出通用编码常识)。何时读:①要写健壮脚本或"加固 / 检查脚本"——三件套 set -euo pipefail、引号纪律、mktemp+trap 清理、flock 锁;②要审脚本抓高危陷阱(rm -rf $DIR/* 空变量、set -e 在 if/&&/|| 里不触发、词分割、子 shell 不外泄)——见 references/review.md;③要配 shfmt / shellcheck 与 .editorconfig bash 段——见 references/format.md。命名 / 函数拆分等通用原理在父 skill code-guidelines,不在此重复。
---

# bash 专项(加固清单 + 工具真源 + 陷阱)

bash 的坑密度远高于其他语言,默认写法极易踩雷。本 skill 补**默认可能疏忽的加固动作**与陷阱清单。通用编码原理(命名 / 拆函数)在父 skill `code-guidelines`。

## 1. 健壮性三件套 + shebang(每个非平凡脚本开头)

```bash
#!/usr/bin/env bash
set -euo pipefail
```

- `errexit`(-e):失败即停,不往下滚。
- `nounset`(-u):用未定义变量报错(配合默认值 `${VAR:-default}`)。
- `pipefail`:管道中段失败也算失败。

三件套有边界(`set -e` 在 `if` / `&&` / `||` 里不触发),详见 [references/review.md](references/review.md)。

## 2. 引号纪律

- 展开变量**默认加引号**:`"$var"`;确定要词分割 / 通配才裸写。
- 命令替换同理:`"$(cmd)"`。
- 路径含空格是常态,不是例外。

## 3. 临时资源用 trap 清理

```bash
tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT
```

- `mktemp` 而非固定 `/tmp/xxx`(冲突 + 符号链接攻击)。
- 锁文件用 `mkdir` 或 `flock`,别用 `touch`(非原子)。

## 4. 项目约定 + 工具

- **bash 版本**:看 shebang(`#!/usr/bin/env bash` vs `#!/bin/sh`);`sh` 不支持 `[[ ]]` / 数组,别混用。
- **格式化 / lint**:shfmt + shellcheck,`.editorconfig` bash 段。标准与命令见 [references/format.md](references/format.md)。
- **既有脚本风格**以项目文件实际内容为准。

## 与 review 的分工

- **本 skill(写时)**:三件套 / 引号 / trap 从源头加固,预防性。
- **[references/review.md](references/review.md)(审时)**:抓 `rm -rf $DIR/*` 空变量、`set -e` 陷阱、词分割等漏网坑,检测性。
