---
name: bash-guidelines
description: bash 语言专项编码约定。在编写、修改 shell 脚本时使用,补充父 skill code-guidelines(跨语言通用原理)在 bash 上的落地:健壮性基础(set -euo pipefail)、引号纪律、可移植性、错误处理与清理(trap)。当用户写脚本、改脚本、写 Makefile 里调的脚本、要求「检查脚本」「加固脚本」时遵循。格式化(shfmt)与审查要点在附属文档 references/{format,review}.md。语言无关的原理见 code-guidelines,不在此重复。
---

# bash 编码约定(bash 专项)

父 skill `code-guidelines` 讲了跨语言通用的原理(见名知义、非必要不注释、不写长函数、命名自解释)。本 skill 只补 **bash 独有**的落地:健壮性基础、引号、错误处理。原理不重复,先读 `code-guidelines`。

**附属文档**(渐进披露,用到才读):

- **[references/format.md](references/format.md)** -- 格式化(shfmt)与 lint(shellcheck)标准、命令、.editorconfig bash 段。格式化 / 检查脚本时读。
- **[references/review.md](references/review.md)** -- 审查要点:`rm -rf $DIR/*` 空变量、`set -e` 陷阱、词分割、子 shell 不外泄等工具管不到的逻辑问题。审脚本时读。

## 项目约定发现

- **bash 版本**:看 shebang(`#!/usr/bin/env bash` vs `#!/bin/sh`);`sh` 不支持 `[[ ]]` / 数组,别混用。
- **既有脚本风格**以项目文件实际内容为准,不凭记忆。

## 1. 健壮性基础:三件套 + shebang

每个非平凡脚本开头:

```bash
#!/usr/bin/env bash
set -euo pipefail
```

- `errexit`(-e):失败即停,不往下滚。
- `nounset`(-u):用未定义变量报错(配合默认值 `${VAR:-default}`)。
- `pipefail`:管道中段失败也算失败(否则只看最后一个命令)。

注意三件套的边界(`set -e` 在 `if` / `&&` / `||` 里不触发)详见 [review.md](review.md)。

## 2. 引号纪律

- 展开变量**默认加引号**:`"$var"`;确定要做词分割 / 通配展开才裸写。
- 命令替换也一样:`"$(cmd)"`;裸 `$(cmd)` 会再分一次词。
- 路径含空格是常态,不是例外。

## 3. 临时资源用 trap 清理

```bash
tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT
```

- `mktemp` 而非固定 `/tmp/xxx`(冲突 + 符号链接攻击)。
- 锁文件别用 `touch`(非原子),用 `mkdir` 或 `flock`。

## 4. 可读性

- **函数拆分**:超过一屏的脚本抽函数,`main "$@"` 收尾。
- **本地变量**:`local` 限定函数内,不污染全局。
- **注释写「为什么」**:一行管道为什么这么拼、某个看似多余的 sleep 是防什么,这类才值得注释。

## 附:与 review 的分工

- **本 skill(写脚本时)**:预防性的--三件套、引号、trap 从源头防。
- **[references/review.md](references/review.md)(审脚本时)**:检测性的--抓写的时候漏掉的陷阱。
