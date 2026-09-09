---
name: traft-code-make
description: 项目命令体系路由--把开发意图(格式化 / 测试 / lint / 构建 / 初始化 / 清理)映射到项目的 make 目标，一条命令执行，不拆多步手动跑。前提：项目根有 Makefile(make help 自文档)；无 Makefile 的项目不激活。何时激活："跑下测试"，"格式化"，"lint 一下"，"构建项目"，"初始化环境"，"清理一下"，或任何"跑一下项目的 X"。
compatibility: make + 项目根 Makefile（无 Makefile 不激活）
---

# traft-code-make 技能

项目命令体系路由：把开发意图（格式化/测试/lint/构建/初始化/清理）映射到项目的 make 目标，**一条命令执行**。前提：项目根有 Makefile（`make help` 自文档）。**有目标就别拆，没目标才手动。**

**职责边界**：
- 负责：把"跑一下项目的 X"映射到 make 目标并执行；建议把反复手动多步的操作封成新目标。
- 不负责：git 操作（提交/分支/合并，`traft-code-git`）；无 Makefile 的项目不激活（不强行建 Makefile、不硬套 npm scripts / cargo，按项目自己的方式跑）。

## 1. 触发条件（TRIGGER）

| 场景 | 触发信号(关键词/典型句式) | 是否触发 |
| --- | --- | --- |
| 跑测试 | "跑下测试" | 触发 |
| 格式化 | "格式化" | 触发 |
| lint/构建/清理 | "lint 一下"、"构建项目"、"清理一下" | 触发 |
| 环境初始化 | "初始化环境"、"检查工具链" | 触发 |
| 跑项目命令 | "跑一下项目的 X" | 触发 |
| 无 Makefile 的项目 | 项目根无 Makefile | 不触发，按项目既有命令体系跑 |
| git 操作 | "提交代码"、"切分支" | 不触发，转交 `traft-code-git` |

## 2. 规则（RULES）

### 2.1 务必执行(ALWAYS DO)
1. **make help 是目标真源**：动手前先跑（或 `grep -E '^[a-zA-Z_-]+:.*## ' Makefile`），核对候选目标存在再执行；以实际输出为准，不凭记忆。
2. **读项目上下文**（CLAUDE.md / AGENT.md / AGENTS.md 等）/ docs/commands.md：取本项目的 make 命令清单与含义，有则优先按项目的来。
3. **有目标就一条命令跑**：`make build` 一条顶 `conan install ... && cmake ... && cmake --build ...` 三四条。
4. **高副作用先确认**：`clean` / `build` / `init` / `conan`，或用户只说"跑下项目命令"时，先展示将执行的 `make <target>` 再跑。
5. **扩展命令体系**：发现某任务反复手动多步跑、却没对应目标 -> 建议加进 Makefile 成新幂等目标（`target: ## 描述`）。

### 2.2 禁止执行(NEVER DO)
1. **无 Makefile 不强行**：不替项目造 Makefile、不把 make 语义硬套到 npm scripts / cargo；告知本 skill 不适用，按项目既有命令体系跑。
2. 不凭默认表硬套不存在 / 已改名的目标。
3. 不自行 `apt` / `pip` 装工具——Makefile 会提示装哪个（`make init` / `init-dev`），照提示走。
4. 不翻译不吞 make 报错：原样转达，`require` 宏的提示（如"请先 make init"）照着引导。

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：项目根有 Makefile；意图明确。
- 缺失时：无 Makefile → 告知本 skill 不适用；意图不明 → 展示 `make help` 输出问用户要哪个。

## 3. 知识底座（CONTEXT）

### 3.1 意图 -> 目标（默认映射）

| 意图 | 默认目标 | 说明 |
|------|---------|------|
| 看命令 | `make help` | 列所有目标 + 描述 |
| 初始化环境 | `make init` / `make init-dev` | init-dev 含开发工具 |
| 检查工具链 | `make check-tools` | |
| 格式化 | `make format` | 含 `format-py` / `format-bash`（/ `format-cpp`） |
| 静态检查 | `make lint` | ruff + mypy 等（Python 项目） |
| 跑测试 | `make test` | pytest / CTest |
| 构建 | `make build` | C++（CMake）等 |
| 装外部依赖 | `make conan` | C++ Conan |
| 清理 | `make clean` | 可能还有 `clean-cpp` |

默认表只是候选；项目可能加目标（`proto` / `docs` / `release` / ...），**以 `make help` 实际输出为准**。

### 3.2 分工
- 提交前格式化走本 skill（`make format`）；git 操作（提交/分支/合并）走 `traft-code-git`。
- 这些目标设计为幂等，可重复执行。
- **约定变更时同步更新本节。**

## 4. 工作流程（WORKFLOW）

### Step 1: 发现目标
- 动作：确认项目根有 Makefile；没有则告知不适用，按项目自己的命令体系跑。有则跑 `make help` 拿可用目标 + 描述。
- 完成标志：Makefile 存在且目标清单在手。

### Step 2: 映射意图
- 动作：按 3.1 默认表映射到候选目标，核对在 `make help` 输出里存在。
- 完成标志：目标确定且真实存在。

### Step 3: 运行
- IF 只读类（`help` / `check-tools`）或用户明确要的（"格式化""跑测试"）→ 直接跑。
- IF 高副作用或意图不明 → 先展示将执行的命令，确认再跑。
- 完成标志：命令执行完毕。

### Step 4: 处理异常
- IF 目标不存在/歧义 → 展示 `make help` 输出，问用户要哪个。
- IF 失败 → 原样转达错误，按 Makefile 提示引导（缺工具 -> `make init`）。
- 完成标志：结果明确（成功或已引导下一步）。

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
```text
执行: make <target>
结果: <成功 / 原样错误 + 引导>
```

### 5.2 字段要求

| 字段 | 写作要求 |
|----|------|
| 执行 | 展示将执行的 make 命令（高副作用前先确认） |
| 结果 | 原样转达，不翻译不吞错误 |

### 5.3 交付前自检
- [ ] 目标来自 `make help` 实际输出，非默认表硬套
- [ ] 高副作用命令已先确认
- [ ] 无 Makefile 时未强行造

## 6. 示例

### 6.1 好的示例
**输入**：跑下测试
**输出**：
```text
执行: make test
结果: 成功，42 passed
```

### 6.2 差的示例
**输入**：跑下测试
**输出**：默认表映射 `make test` 但项目实际目标是 `make unit`——不核对 `make help` 直接跑。
（违反 2.1①——make help 是目标真源）
