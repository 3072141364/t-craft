---
description: 代码审查(常规/深度两档),双轴(Standards 规范 / Spec 需求)。/code-review = 常规;/code-review deep = 深度;/code-review <base..head> = 指定范围。VCS 无关(纯 git),出报告,不审格式(交 code-format)。
argument-hint: [deep | <base..head>]
---

对当前 git 改动做**双轴代码审查**--Standards(规范)+ Spec(需求)--出一份高置信问题报告。VCS 无关(纯 git,GitHub / GitLab / Gitea 通用),不发评论、不改代码,只出报告。

**为什么双轴**:一次改动可能过一轴、挂另一轴--代码规范但没实现需求(Standards 过、Spec 挂),或实现了需求但破坏约定(Spec 过、Standards 挂)。两轴分开报,不让一轴掩盖另一轴。

## 参数与档位

- 无参数 -> **常规**:范围=未提交(`git diff` + `git diff --cached`);跑阶段 1 / 3 / 4。提交前用。
- `deep` -> **深度**:范围=分支 vs 主干(`git diff <主干>...HEAD`);跑阶段 1 / 2 / 3 / 4。合并前用。
- `<base..head>`(如 `main..HEAD`、`v1.0..HEAD`)-> 指定范围,按常规维度。

主干自动探测:`origin/main` / `main` / `master`。**先验证 fixed point 解析得了、diff 非空**(`git rev-parse` + `git diff --stat`),空或无效就停,别进后续。无 git / 范围无效 -> 停并告知。

## 不审什么

格式 / 风格 / 导入排序 / 拼写 / lint / 类型检查全交 code-format + `make lint`(ruff / mypy / clang-format / clang-tidy 能查的不审)。预存技术债不审。**只审本次改动的行。**

## 四阶段流程

### 阶段一:范围与上下文
1. 钉 fixed point,取 diff(`git diff <fixed>...HEAD` 三点,对比 merge-base)+ `git log <fixed>..HEAD --oneline`;验证 ref 解析 + diff 非空。>400 行建议拆。
2. **识别需求来源(Spec 轴用)**,按序找:① commit 信息里的 issue 引用(`#123`、`Closes #45`、GitLab `!67` 等);② 用户给的 spec 路径;③ `docs/` / `specs/` / `.scratch/` 里匹配分支名或功能的 PRD / spec;④ 都没有就问用户,用户说没有则 Spec 轴跳过(报"无 spec")。
3. **识别规范来源(Standards 轴用)**:根 CLAUDE.md + 改动目录的 CLAUDE.md + `CODING_STANDARDS.md` / `CONTRIBUTING.md` 等;**外加代码异味基线**(读 `references/code-smells.md`,Fowler 12 味,judgement call,项目规范覆盖基线,工具能查的跳过)。
4. 理解意图:`git log` + 改动本身推断。
5. 自动跳过:纯文档 / 纯格式 / trivial 改动 -> 告知无内容,停。

### 阶段二:高层审查(仅深度档)
架构 / 设计(耦合、分层、SOLID)、性能(N+1、复杂度、内存)、测试策略(测试加了没、覆盖改动没)。要查影响范围 / 调用链 -> 转 code-intelligence(gitnexus `impact` / `trace`)。

### 阶段三:逐行双轴审查
对改动行按**两轴**查(可并行子代理避免上下文污染;否则顺序跑,但分别收集,不混):

**Standards 轴(规范)**--代码是否遵循约定、避开异味:
- 项目规范:违反 CLAUDE.md / 规范文档(**回查规范确实写了那条**,防幻觉违规)。
- 代码注释约定:违反文件内注释里的约定。
- 代码异味:命中 `references/code-smells.md` 的 12 味(命名 / 重复 / Feature Envy / Data Clumps / Primitive Obsession / Shotgun Surgery / …),标"可能 X",judgement call,项目规范覆盖。
- 历史上下文:`git blame` 看是否回退既有修复、与历史意图冲突。

**Spec 轴(需求)**--代码是否正确实现了所求:
- 需求缺失 / 部分:spec 要的没做或没做完。
- 范围蔓延:diff 里有 spec 没要求的(越界改动)。
- 实现错误:看着实现了但实现不对(正确性 bug:逻辑 / 边界 / 空值 / 并发 / 资源泄漏)。
- (spec 缺失则此轴跳过。)

语言专项:审到 bash / python / cpp 时,读 `references/<lang>-review.md` 拿该语言常见 bug + 工具管不到的逻辑问题(主要喂 Spec 轴)。

### 阶段四:报告
1. 每条发现打**置信度 0-100**:0 误报 / 预存;25 可能;50 真但次要;75 高置信;100 必现。
2. **过滤 <80**,并滤误报:预存问题、linter / 编译器能查的、咬文嚼字、有意为之的行为变更、未改行上的问题、被 `@review-ok` 标注的。
3. 赋**严重度**:🔴blocking(合并前必修)/ 🟡important(应修)/ 🟢nit(可选)。
4. **两轴分开输出,不合并不重排**(见下)。

## 报告格式

```markdown
## 代码审查报告

档位:常规 / 深度
范围:<范围说明>

### Standards(规范)
共 N 条:
1. 🔴 <简述>(规范 / 注释 / 异味 / 历史)
   - `path/file:42` -- <证据>
   - <为什么>(规范类注明 CLAUDE.md 哪条;异味标"可能 X")
2. ...

### Spec(需求)
共 M 条(spec 缺失则写"无 spec,跳过"):
1. 🔴 <简述>(缺失 / 蔓延 / 实现错误)
   - `path/file:42` -- <证据>
   - <为什么>(注明 spec 哪条 / 行)
2. ...
```

无问题则各轴分别写"未发现高置信问题"。

末尾一行小结:**Standards N 条(最重 🔴xxx)/ Spec M 条(最重 🟡yyy)**--不跨轴选"最严重",两轴各自总结。报告直接输出;要存档可存 `docs/` 或 Obsidian(obsidian-kb),不自动写。

## 约定

- **只读**:只读 diff / spec / CLAUDE.md / git 历史,**不改代码、不发评论**。
- **不绑 git-flow**:review -> 改 -> 再 review -> 没问题 -> 用户手动跑 git-flow 提交。本命令不触发 git-flow。
- **两轴分开**:Standards / Spec 分别报告,不合并不重排--一轴过另一轴挂是常态。
- **`@review-ok`**:代码里 `// @review-ok` / `# @review-ok` 标注的行,默认不报(用户主动压制误报)。
- **失败要明确**:无 diff / 无 git / 范围无效 / spec 找不到 -> 停,告知。
