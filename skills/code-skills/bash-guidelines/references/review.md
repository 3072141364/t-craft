# bash 审查要点

shfmt(格式)+ shellcheck(lint)能查的不重复;这里抓工具管不到的逻辑问题。

## 常见 bug

- **`rm -rf $DIR/*` 当 DIR 为空** -> `rm -rf /*`(灾难)。先 `[[ -n $DIR ]]` 或用 `find ... -delete`。
- **`set -e` 陷阱**:管道子进程失败被忽略(配 `set -o pipefail`);`$(cmd)` 在 `if` / `&&` / `||` 里不触发 -e;`! cmd` 失败也不触发。
- **词分割 / 通配**:路径含空格时 `"$var"` 必须加引号;`for f in *.txt` 空目录展开成字面量 `*.txt`(用 `shopt -s nullglob` 或判空)。
- **子 shell 不外泄**:`(cd dir; ...)` 改的 cwd / 变量不影响外层--需要外层感知时别用子 shell。
- **IFS 改了没还原**:临时改 IFS 用子 shell 或保存还原。
- **`==` vs `=`**:`[[ ]]` 里都行;`[ ]`(POSIX)只能 `=`。
- **eval / 不带引号的 `$(...)` 注入**:外部输入拼进 eval -> 命令注入。
- **trap 清理**:临时文件 / 锁没 `trap EXIT` 清理 -> 残留。
- **缺 `set -euo pipefail`**:nounset / errexit / pipefail 三件套缺失,失败静默。
- **锁文件竞态**:`touch` 非原子,用 `mkdir` 或 `flock`。
