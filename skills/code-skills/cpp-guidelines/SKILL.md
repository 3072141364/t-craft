---
name: cpp-guidelines
description: C++ 语言专项编码约定 + 格式化。在编写、重构、格式化 C++ 代码时使用,补充父 skill code-guidelines(跨语言通用原理)在 C++ 上的具体落地:注释语法(// / Doxygen)、Google 命名风格、const/RAII/智能指针替代注释、header-impl 拆分与编译期约束;格式化(附属文档 references/format.md):Google 风格 clang-format、ColumnLimit 120、.clang-format 模板与命令。当用户写 C++、改 C++、要求「加注释 / Doxygen」「重构 C++ 函数」「提升可读性」「格式化 C++」「写 .clang-format 配置」时遵循。语言无关的原理见 code-guidelines,不在此重复。
---

# C++ 编码约定(C++ 专项)

父 skill `code-guidelines` 讲了跨语言通用的原理(见名知义、非必要不注释、不写长函数、命名自解释、注释与文档分工)。本 skill 只补 **C++ 独有**的落地:注释语法、Google 命名、const/RAII/类型替代注释、拆分惯用法。原理不重复,先读 `code-guidelines`。

**附属文档**(渐进披露,用到才读):

- **[references/format.md](references/format.md)** -- 格式化:Google 风格 clang-format、ColumnLimit 120、.clang-format 模板与命令。格式化 / 写配置时读。
- **[references/review.md](references/review.md)** -- 审查要点:生命周期 / 悬垂、所有权 / RAII、use-after-move、UB、并发等工具管不到的逻辑问题。审代码时读。

## 项目约定发现

语言专项之外,项目级约束(C++ 标准、格式化命令、目录布局)从项目 `CLAUDE.md` 读:

- **C++ 标准**:如 C++17 / C++20,决定能用 `std::optional` / `if constexpr` / concepts 等。具体看 `CMakeLists.txt` / `.clang-format`。
- **格式化**:clang-format(Google 风格,ColumnLimit 120),配置与命令见附属文档 [references/format.md](references/format.md)。
- **以文件实际内容为准**,匹配既有风格。

## 1. 注释语法

- **行内注释**:`//` 后一个空格,接注释。`// 防止悬垂引用`。避免 C 风格 `/* */` 块注释用于行内(不嵌套,且现代 C++ 风格用 `//`)。
- **Doxygen 文档注释**:模块 / 类 / 公共函数用 `///` 或 `/** */`,加 `@param` / `@return` / `@brief`。
- **函数内部**:写普通 `//` 注释(说「为什么」),不写 Doxygen。
- **头文件**:公共 API 在 `.h` 里写 Doxygen 注释(它是接口契约);`.cc` 实现里不重复 Doxygen,只在需要时写 `//` 说明实现决策。

## 2. Google 命名风格

- **函数 / 变量(local)**:`snake_case`。`normalize_sensor_reading`。
- **类 / 结构 / 枚举 / 类型别名**:`PascalCase`。`SensorReader` / `ReadingStatus`。
- **类成员变量**:后缀下划线。`last_reading_`。区分局部变量与成员,一眼可辨。
- **常量 / 枚举值**:`kPascalCase`。`kMaxRetryCount`。
- **命名空间**:全小写顶层。`org::domain::project_name`。
- **文件名**:全小写下划线。`sensor_reader.h` / `sensor_reader.cc`。

## 3. const / 类型系统替代注释

**类型和 const 能说的,注释就别说。** C++ 的类型系统比 Python 强,更多语义能编码进签名而非注释。

- **`const T&` 入参**:表示「只读引用,不改你」,签名说了,不用 `// 不修改 src`。
- **`const` 成员函数**:表示「不改动对象状态」,签名说了,不用 `// 此方法不修改成员`。
- **`[[nodiscard]]`**:返回值不可忽略,属性说了,不用 `// 返回值必须使用`。
- **`std::optional<T>`**:可能无值,类型说了,不用 `// 可能返回空`。但「为什么可能无值」(下游约束)仍要注释。
- **`enum class`** 替代魔法常量:命名即文档,不用注释解释每个值。
- **但**类型说不出「为什么」(所有权策略、生命周期约束、为什么这里用 `shared_ptr` 而非 `unique_ptr`)仍要注释——类型管「是什么」,注释管「为什么」。

## 4. C++ 拆分惯用法

父 skill 讲了拆函数的通用原则。C++ 专项:

- **header / impl 拆分**:`.h` 放声明 + Doxygen(接口契约),`.cc` 放实现。读者看 `.h` 就能用,不用读实现——这本身就是「把接口和实现分开让代码自解释」。
- **编译期约束替代运行时注释**:`static_assert`、`if constexpr`、concepts(C++20)把约束编码进编译期,比注释「这里假设 T 可默认构造」可靠——编译器检查,注释不会过时。
- **RAII 即文档**:资源生命周期用 RAII 对象管理(`std::lock_guard` / `std::unique_ptr` / `std::fstream`),「这个资源何时释放」由类型说了,不用注释。裸 `new`/`delete` 需要注释说明所有权——那是坏味道,该用智能指针而非补注释。
- **值类别 / 移动语义**:`std::move` / `std::forward` 处用注释说明意图(为什么这里移动),因为值类别是 C++ 独有且易错。
- **模板**:简单模板名字自解释不注释;复杂模板(类型约束多、SFINAE / concepts)写 Doxygen 说明对模板参数的要求。

## 附:与 review 的分工

- **本 skill(写代码时)**:约束自己写出来的 C++ 代码——命名、注释、Doxygen、const/RAII、拆分。预防性的。
- **`references/review.md`(审代码时)**:看 C++ 代码查具体 bug——生命周期 / 悬垂、所有权 / RAII、use-after-move、UB、并发、异常安全等。检测性的。

写的时候守本 skill + 父 `code-guidelines` 防患于未然;审的时候用 `references/review.md` 抓漏网的 bug。
