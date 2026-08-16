---
name: code-guidelines
description: 跨语言编码准则与行为准则。在编写、重构、补全任意语言代码时使用,约束命名、注释、函数拆分与可读性。核心是「见名知义,非必要不注释」--优先靠函数名、变量名自解释,只在确实难懂处写短注释;不写超级长函数。行为准则(附属文档 karpathy-guidelines.md):先思考再写码、简洁优先、外科手术式修改、目标驱动执行,做技术决策、改代码时遵循。命令快捷入口(附属文档 make-shortcut.md):用户说"格式化""跑测试""lint""构建""初始化环境""清理""装依赖""看有哪些 make 命令"或任何"跑一下项目的 X"时,把意图路由到 make 目标。语言无关的原理在此;编码任务先查改动语言、激活对应语言子 skill:Python 见 python-guidelines、C++ 见 cpp-guidelines、bash 见 bash-guidelines。跨语言格式化(附属文档 format.md):.editorconfig、行长 120、一键装格式化工具,用户要"装格式化工具""搭建格式化环境""写 .editorconfig"时用;语言专项格式化在各语言子 skill。需求深挖(附属文档 brainstorm.md):接 feat/bugfix 后动手前深挖真实意图/约束/验收,用户说"深挖需求""头脑风暴""帮我理一下要做啥"时读。代码理解路由(附属文档 code-intelligence.md):找符号/追调用/理解功能/评估改动影响,codegraph -> gitnexus -> grep/LSP。项目文档走独立子 skill `project-doc`(本 plugin 内):统一管理 prd/adr/test/review,用户说"写方案文档""写设计文档""要个 spec""落个方案""记个决策""写评估报告"时用。当用户写代码、改代码、要求「加注释」「重构函数」「提升可读性」、做编码决策、要跑项目常用命令、要搭格式化环境、要深挖需求、要理解现有代码、或要写方案文档时遵循。
---

# 跨语言编码准则

写代码时让代码**自己说话**的行为准则。核心信念:好代码靠命名和结构自解释,注释是补充而非主角。

**权衡**:对一次性脚本、数据探索,自行判断放宽;对长期维护的业务代码、被多人读的库,严守。

## 原则、行为准则与命令入口的分工

本 skill 讲语言无关的**代码写法**原理(注释哲学、函数拆分、命名自解释、注释与文档分工)。**附属文档**(渐进披露,用到才读):

- **[references/karpathy-guidelines.md](references/karpathy-guidelines.md)** -- 编码行为准则:先思考再写码、简洁优先、外科手术式修改、目标驱动执行、提交即规范。做技术决策、动手改代码前读。
- **[references/make-shortcut.md](references/make-shortcut.md)** -- make 快捷入口:把开发意图路由到项目 make 目标(格式化/测试/lint/构建/初始化/清理)。用户要跑项目常用命令时读。
- **[references/format.md](references/format.md)** -- 跨语言格式化:.editorconfig 模板、行长 120 统一约定、一键装工具脚本(scripts/setup_format_tools.sh)。装工具 / 搭格式化环境时读;语言专项见各语言子 skill 的 format.md。
- **[references/code-smells.md](references/code-smells.md)** -- 代码异味基线(Fowler 12 味):审代码时逐味对照(主要喂 `/tcraft-code-review` Standards 轴)。
- **[references/brainstorm.md](references/brainstorm.md)** -- 需求深挖 / 头脑风暴(研发流程阶段①):弹性一次一问 + 内嵌 5-Whys / first-principles,产需求要点。接需求动手前读。
- **[references/code-intelligence.md](references/code-intelligence.md)** -- 代码理解路由:找符号 / 追调用 / 理解功能 / 评估影响,codegraph -> gitnexus -> grep/LSP。写码前查调用链、评估改动影响时读。

**语言路由(每次编码任务先做)**:检查当前项目/改动的语言--看 `git diff --stat` / 待改文件后缀 / 项目 CLAUDE.md --然后激活对应语言子 skill(Python -> python-guidelines、C++ -> cpp-guidelines、bash -> bash-guidelines),用其准则与附属文档干活。多语言混合改动,按文件分别套;没有子 skill 的语言套本 skill 原理。

语言专项(命名风格、注释语法、惯用拆分)走子 skill:

- **Python**:`python-guidelines`(`#` / docstring、snake_case、类型注解替代注释、AbstractTask 拆分;附属:format / review)
- **C++**:`cpp-guidelines`(`//` / Doxygen、Google 命名、RAII / const / header-impl 拆分;附属:format / review)
- **bash**:`bash-guidelines`(set -euo pipefail、引号纪律、trap 清理;附属:format / review)


## 项目约定发现

本准则的原理是通用的;但落到具体项目时,把原则接到该项目的约束上(格式化命令、类型检查配置、模块布局、语言版本兼容)。这些**不在本 skill 硬编码**,而是:

1. **读项目 `CLAUDE.md`**:提取本项目编码相关约束(语言版本如 Python 3.8 / C++17、格式化命令、类型检查工具、目录约定)。
2. **以文件实际内容为准**,匹配既有代码风格,不凭记忆。

下面各节,结合从 CLAUDE.md 读到的项目约束 + 对应语言子 skill 来执行。

## 1. 见名知义,非必要不注释

**好代码读起来像句子,注释是兜底不是主菜。**

注释的代价:注释会过时、会撒谎、会冗余。代码改了注释没改,比没注释更危险——读者信了过时注释就不再读代码。所以默认不注释,只在对的地方写。

判断要不要写注释,先问:**能不能靠命名和结构让它不需要注释就懂?** 能,就改名 / 拆函数,而不是写注释。不能(逻辑确实绕、有非显然约束),才写。

### 该写注释的地方

- **非显然的「为什么」**:为什么这么做,而不是另一种看起来更自然的方式。例:绕过一个第三方 bug、某参数取这个值是因为下游限制、这里故意不释放资源。这类注释有长期价值——它记录了代码读不出来的决策上下文。
- **算法 / 业务规则的外部出处**:「按 PO 要求用 Welford 算法」「对齐 spec 第 3.2 节」。给读者一个能查的锚点。
- **踩过的坑的预防**:一个看起来该删但删了会炸的代码(如看似多余的 sleep、一个 magic number),写一行说明为什么不能动。防止后人「顺手优化」。

### 不该写注释的地方

- **复述代码**:`x = x + 1  # x 加一`。注释比代码还啰嗦,删。
- **给烂命名打补丁**:函数叫 `process_data` 但要写三行注释解释它到底处理啥——把函数改名为 `normalize_sensor_reading`,注释就不用了。
- **能从类型 / 签名读出来的**:函数签名已经写了返回类型 / 参数类型,就别说「返回一个 list」「参数是 int」。
- **分节装饰**:`// ===== 初始化 =====`。用函数拆分代替分节注释。

### 注释怎么写

- **短**:一两行说清「为什么」。长注释说明你该拆函数或加 docstring 了。
- **写意图不写行为**:`// 防止下游对 None 解引用`,不是 `// 检查 x 是不是 None 然后返回`。
- **现在时、肯定句**:`// 用 Welford 避免大数溢出`,不是 `// 这里可能要考虑溢出问题`。

## 2. 不写超级长函数

**函数长度 = 阅读负担。函数越长,读者要在脑子里维持的上下文越多,越容易出 bug。**

长函数往往是个信号:它在做不止一件事。拆。

判断标准:能不能用一句话说清这个函数干什么?说不清(要列「先……再……然后……还……」),说明它该拆成几个各管一件事的小函数。

### 怎么拆

- **按职责拆**:一个函数只做一件事。`process_and_save_and_notify` 拆成 `process` / `save` / `notify`,各自独立可读、可测。
- **用名字代替分节注释**:函数里一段 `// 初始化` `// 校验` `// 执行`,每段抽成一个有名小函数,调用处读起来像步骤列表,且每段可独立看。
- **降嵌套**:深嵌套(4 层以上 if/for)比长还难读。用 early return(守卫语句)、抽辅助函数拉平。
- **别过度**:单次使用、3-5 行的片段不用抽函数——抽出来反而多一次跳转。拆的收益是「可独立理解」,没有这个收益就别拆。

## 3. 命名让代码自解释

**名字是代码里出现次数最多的注释。名字取好,大半注释可以删。**

- **函数名说「做什么」不说「怎么做」**:`calculate_total_price` 好,`loop_over_items_and_sum` 差——后者把实现写进了名字,实现一改名字就过时。
- **变量名说「装什么」**:`pending_tasks` 好,`list2` / `data` / `tmp` 差。
- **布尔变量是判断**:`is_valid` / `has_permission` 好,`flag` / `status` 差。
- **别缩写过头**:`config` 可以(通用),`cfg` 勉强,`c` 不行。团队惯用缩写例外。
- **取不出诚实的名字 = 设计浑浊**:如果一个函数你只能叫 `process_stuff` 或 `handle_thing`,说明它职责不清,先想清楚职责再写——这是 code smell(Mysterious Name)的信号,不是命名技巧问题。

## 4. 注释与文档的分工

- **模块 / 类 / 公共函数**:写文档注释(语言不同形式不同:Python docstring、C++ Doxygen、JS JSDoc),它是 API 契约,读者不看实现也要能用。
- **函数内部**:写普通注释(说「为什么」),不写文档注释。
- **私有辅助函数**:文档注释可选,名字能说清就不写。

具体语法(注释符、docstring 格式、Doxygen 标签)与格式化见对应语言子 skill 及其附属文档。

## 5. 结构化注释标记(跨语言)

上面讲的是「解释性注释」——说清楚代码为什么。还有一类是「状态性注释」:给代码打标签——待办(`TODO`)、已知缺陷(`FIXME`)、临时方案(`HACK`)、待复查(`REVIEW`)等。这类不解释代码,而是标记技术债的状态,方便检索和追溯。

因为它们跨语言通用(Python `#`、C++/JS `//`、bash `#` 注释符随语言,前缀词固定),约定单独放 **`references/code-markers.md`**(8 个标准标记 + 何时用 / 何时不用 + 管理约定)。写代码确要留这类标记时走那套——别随手写中文「待办」「要改」,统一前缀才能被 `grep` 和 CI 巡检。

## 附:与各语言 review 的分工

- **本 skill(写代码时)**:约束自己写出来的代码——命名、注释、函数拆分、可读性。预防性的。
- **语言子 skill 的 `references/review.md`(审代码时)**:看别人 / 自己的代码查具体 bug(可变默认参数 / 生命周期 / 并发等)。检测性的。

写的时候守本 skill + 语言子 skill 防患于未然;审的时候用对应语言 skill 的 `references/review.md` 抓漏网的 bug。
