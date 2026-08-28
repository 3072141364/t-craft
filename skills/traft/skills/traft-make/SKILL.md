---
name: traft-make
description: 项目命令体系路由--把开发意图(格式化 / 测试 / lint / 构建 / 初始化 / 清理)映射到项目的 make 目标，一条命令执行，不拆多步手动跑。前提：项目根有 Makefile(make help 自文档)；无 Makefile 的项目不激活。何时激活："跑下测试"，"格式化"，"lint 一下"，"构建项目"，"初始化环境"，"清理一下"，或任何"跑一下项目的 X"。
---

# traft-make 项目命令体系路由

项目用 Makefile 建立自己的**命令体系**：常用操作(init / format / lint / test / build / clean)封成幂等 make 目标，`make help` 自文档。用户表达意图，本 skill 找到对的 target **一条命令执行**--Makefile 是项目验证过的标准流程，工具探测 / 参数 / 顺序都内置，比手动拆多步省 token 又不漏步骤。**有目标就别拆，没目标才手动。**项目根没有 Makefile 就不激活：不强行建 Makefile、不硬套到 npm scripts / cargo，按项目自己的方式跑。

## 意图 -> 目标(默认映射)

| 意图 | 默认目标 | 说明 |
|------|---------|------|
| 看命令 | `make help` | 列所有目标 + 描述 |
| 初始化环境 | `make init` / `make init-dev` | init-dev 含开发工具 |
| 检查工具链 | `make check-tools` | |
| 格式化 | `make format` | 含 `format-py` / `format-bash`(/ `format-cpp`) |
| 静态检查 | `make lint` | ruff + mypy 等(Python 项目) |
| 跑测试 | `make test` | pytest / CTest |
| 构建 | `make build` | C++(CMake)等 |
| 装外部依赖 | `make conan` | C++ Conan |
| 清理 | `make clean` | 可能还有 `clean-cpp` |

默认表只是候选；项目可能加目标(`proto` / `docs` / `release` / ...),**以 `make help` 实际输出为准**。

## RULES

### ALWAYS DO
- **make help 是目标真源**：动手前先跑(或 `grep -E '^[a-zA-Z_-]+:.*## ' Makefile`),核对候选目标存在再执行；以实际输出为准，不凭记忆。
- **读项目上下文（CLAUDE.md / AGENT.md / AGENTS.md 等）/ docs/commands.md**：取本项目的 make 命令清单与含义，有则优先按项目的来。
- **有目标就一条命令跑**：`make build` 一条顶 `conan install ... && cmake ... && cmake --build ...` 三四条。
- **高副作用先确认**:`clean` / `build` / `init` / `conan`,或用户只说“跑下项目命令”时，先展示将执行的 `make <target>` 再跑。
- **扩展命令体系**：发现某任务反复手动多步跑、却没对应目标 -> 建议加进 Makefile 成新幂等目标(`target: ## 描述`);命令体系是活的，常用就封进去。

### NEVER DO
- **无 Makefile 不强行**：不替项目造 Makefile、不把 make 语义硬套到 npm scripts / cargo；告知本 skill 不适用，按项目既有命令体系跑。
- 不凭默认表硬套不存在 / 已改名的目标。
- 不自行 `apt` / `pip` 装工具--Makefile 会提示装哪个(`make init` / `init-dev`),照提示走。
- 不翻译不吞 make 报错：原样转达，`require` 宏的提示(如“请先 make init”)照着引导。

## 工作流程

1. **发现目标**：先确认项目根有 Makefile，没有则本 skill 不适用(告知用户，按项目自己的命令体系跑)；有则跑 `make help` 拿可用目标 + 描述。
2. **映射意图**：按默认表映射到候选目标，核对在 `make help` 输出里存在。
3. **运行**：
   - 只读类(`help` / `check-tools`):直接跑。
   - 用户明确要的(“格式化”“跑测试”):直接跑。
   - 高副作用或意图不明：先展示将执行的命令，确认再跑。
4. **目标不存在 / 歧义**：展示 `make help` 输出，问用户要哪个。
5. **失败要明确**：原样转达错误，按 Makefile 提示引导(缺工具 -> `make init`)。

## 分工

- 提交前格式化走本 skill(`make format`);git 操作(提交 / 分支 / 合并)走 `traft-git-flow`。
- 这些目标设计为幂等，可重复执行，放心跑。
