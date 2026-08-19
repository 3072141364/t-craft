---
name: cpp-guidelines
description: C++ 项目落地约定与工具真源(超出通用编码常识)。何时读:①要配 clang-format(Google 风格 / ColumnLimit 120)或写 .clang-format——本 skill 附属 references/format.md 给模板与命令;②要审 C++ 代码抓工具管不到的高危 bug(生命周期 / 悬垂、所有权 / RAII、use-after-move、UB、并发、异常安全)——见 references/review.md;③要对齐项目 C++ 标准(C++17/20 决定能否用 optional/concepts)与既有风格,须先读项目 CLAUDE.md 与 CMakeLists。命名 / Doxygen / const 替代注释等通用原理在父 skill code-guidelines,不在此重复。
---

# C++ 专项(项目约定 + 工具真源 + 易错点)

模型默认已会 Google 命名、`//`/Doxygen、`const`/RAII/智能指针、header-impl 拆分这些。本 skill 只补**默认可能疏忽、且对正确性影响大**的三块:项目约定发现、工具配置真源、C++ 高危易错点。通用编码原理在父 skill `code-guidelines`。

## 1. 项目约定发现(先做,不凭记忆)

从项目 `CLAUDE.md` / `CMakeLists.txt` / `.clang-format` 读:

- **C++ 标准**:如 C++17 / C++20,决定能否用 `std::optional` / `if constexpr` / concepts。以项目文件为准。
- **格式化命令**:clang-format(Google 风格,ColumnLimit 120),优先走 `make format`;配置模板见 [references/format.md](references/format.md)。
- **匹配既有风格**,以文件实际内容为准。

## 2. 工具配置真源

- **格式化**:clang-format,Google 风格,ColumnLimit 120。`.clang-format` 模板与命令见 [references/format.md](references/format.md)。
- **类型/const 编码语义**:`const T&` / `const` 成员函数 / `[[nodiscard]]` / `std::optional` / `enum class` / `static_assert` / concepts 把约束编码进签名与编译期,比注释可靠——但"为什么"(所有权策略、生命周期约束、为什么 `shared_ptr` 而非 `unique_ptr`)仍要注释。

## 3. C++ 高危易错点(写时留意,审时对照)

C++ 特有、代价高、工具未必抓得到的坑:

- **生命周期 / 悬垂**:返回局部变量引用 / 指针、悬垂迭代器、`string_view` 指向临时量。
- **所有权 / RAII**:裸 `new`/`delete` 是坏味道——用智能指针而非补注释;资源生命周期交 RAII 对象(`lock_guard`/`unique_ptr`/`fstream`)。
- **use-after-move**:`std::move` 后再用被移对象。移动处写注释说明意图(值类别 C++ 独有且易错)。
- **UB**:有符号溢出、未初始化读、越界、违反严格别名。
- **并发 / 异常安全**:数据竞争、锁顺序、异常路径下的资源泄漏。

审代码时逐条对照,完整审查清单见 [references/review.md](references/review.md)。

## 与 review 的分工

- **本 skill(写时)**:项目约定 + 工具真源 + 易错点,预防性。
- **[references/review.md](references/review.md)(审时)**:抓写时漏掉的高危 bug,检测性。
