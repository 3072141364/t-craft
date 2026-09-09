---
name: code-intel-tools
description: 理解代码（找符号/追调用/影响面/执行流）时，按工具优先级 gitnexus > LSP > grep：关系与调用链走 gitnexus，单点定义/类型/引用走 LSP，纯文本搜索才用 grep。一次图查询顶十几次 grep。
globs: ["*.py", "*.ts", "*.js", "*.go", "*.rs", "*.cpp", "*.c", "*.java"]
alwaysApply: true
---

# 代码读取工具优先级

理解代码时按优先级选工具，别上来就 grep 全仓：

1. **gitnexus**：追调用链、谁调用 X、执行流、影响面——关系与链路类查询。
2. **LSP**：定义在哪、类型、引用、文件内符号/诊断——单点查询。
3. **grep**：纯文本搜索（字符串/TODO/配置），前两类不适用时兜底。

判定：问"关系/链路/影响"→ gitnexus；问"这个符号/定义/类型"→ LSP；问"哪段文本"→ grep。答了就停，不深挖无关分支。

细节（路由表、索引环境、安装）见 `skill://traft-code-intelligence`，需要时再读。
