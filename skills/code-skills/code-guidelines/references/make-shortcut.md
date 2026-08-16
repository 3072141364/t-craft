# Make 快捷入口(make-shortcut)

> code-guidelines 的附属文档:把开发意图路由到项目的 make 目标。用户说"格式化""跑测试""lint""构建""初始化""清理"等,或任何"跑一下项目的 X"时按本文执行。前提:项目用 Makefile 封装常用命令(自文档,`make help` 列目标)。

把开发意图路由到项目的 make 目标--用户说"做什么",按本文找到对应的 `make <target>` 跑。

设计意图:项目用 Makefile 建立自己的**命令体系**--把常用操作(init / format / lint / test / build / clean 等)封成幂等的 make 目标,用户不必记 exact 名字,只要表达意图,从 `make help` 找到对的 target **一条命令执行**--比拆成多步手动跑省 token、更准(Makefile 是项目验证过的标准流程,工具探测 / 参数 / 顺序都内置)。**有目标就别拆,没目标才手动。**

## 意图 -> 目标(默认映射)

按 sim_flow / SimX 等项目的共同约定。**目标存在性以 `make help` 为准**--不在表里或项目没这个目标就降级(见工作流程)。

| 意图 | 默认目标 | 说明 |
|------|---------|------|
| 看命令 | `make help` | 列所有目标 + 描述 |
| 初始化环境 | `make init`(基础)/ `make init-dev`(开发) | init-dev 含开发工具 |
| 检查工具链 | `make check-tools` | |
| 格式化 | `make format` | 含 `format-py` / `format-bash`(/ `format-cpp`) |
| 静态检查 | `make lint` | ruff + mypy 等(Python 项目) |
| 跑测试 | `make test` | pytest / CTest |
| 构建 | `make build` | C++(CMake)等 |
| 装外部依赖 | `make conan` | C++ Conan |
| 清理 | `make clean` | 可能还有 `clean-cpp` |

项目可能加目标(`proto` / `docs` / `release` / ...),别只认这张表--先看 `make help`。

## 发现项目命令(不硬编码)

目标名不硬编码,运行时发现:

1. **约定优于配置**:项目根 `Makefile`;`make help`(默认目标)列出自文档目标(`target: ## 描述`)。**这是目标真源**。没有 Makefile -> 本文不适用,告知用户。
2. **读项目 CLAUDE.md**:取 make 命令说明(本项目常在 CLAUDE.md 列出 make 命令清单与含义)。
3. **docs/commands.md**:若有(Makefile 命令手册),读细节。

以 `make help` 实际输出为准,不凭记忆。

## 工作流程

1. **发现目标**:跑 `make help`(或 `grep -E '^[a-zA-Z_-]+:.*## ' Makefile`)拿可用目标 + 描述。
2. **映射意图,优先用目标**:按上表把意图映射到候选目标;**有 make 目标就一条命令跑,别拆成多步手动**--`make build` 一条顶 `conan install ... && cmake --preset ... && cmake --build ...` 三四条,省 token 又不漏步骤;**核对目标在 `make help` 输出里存在**。
3. **运行**:
   - 只读类(`help` / `check-tools`):直接跑。
   - 用户**明确要**的命令(如"格式化""跑测试"):直接跑。
   - 高副作用或意图不明(`clean` / `build` / `init` / `conan`,或用户只说"跑下项目命令"):**先展示将执行的 `make <target>` 给用户确认**再跑。
4. **目标不存在 / 歧义**:展示 `make help` 输出,问用户要哪个。
5. **失败要明确**:make 报错(缺工具等)原样转达--Makefile 的 `require` 宏通常已给出清晰提示(如"请先 make init"),照提示引导。

## 注意

- **以 `make help` 为准**:项目会加/改名目标,别凭默认表硬套。
- **幂等**:这些目标设计为可重复执行,放心跑。
- **工具缺失**:Makefile 会提示装哪个(`make init` / `make init-dev`),照提示走,不自行 `apt`/`pip` 装。
- **扩展命令体系**:发现某任务反复手动多步跑、却没对应 make 目标 -> 建议加进 Makefile 成新目标(幂等 `target: ## 描述`),下次一条命令搞定。命令体系是活的,常用就封进去。
- **与 git-guidelines 分工**:提交前格式化用本文(`make format`);提交 / 分支等 git 操作用 `git-guidelines`(本 plugin 内)。
- **无 Makefile 的项目**:本文不适用;npm scripts / cargo 等不在范围内。
