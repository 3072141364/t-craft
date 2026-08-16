# C++ 审查要点

clang-format(格式)+ clang-tidy(部分 lint)能查的不重复;这里抓工具管不到的逻辑问题。

## 常见 bug

- **生命周期 / 悬垂**:返回栈地址 / 临时量引用;`std::string_view` / `span` 指向临时;lambda 捕获引用越界。
- **所有权 / RAII**:裸 `new` / `delete`;智能指针误用(`shared_ptr` 循环引用漏 `weak_ptr`、`make_unique` 优于 `new`)。
- **use-after-move**:`std::move(x)` 后再用 x(除非重新赋值)。
- **UB**:未初始化读取、有符号溢出、越界、空指针解引用、违反 ODR。
- **并发**:数据竞争(非 atomic 读写无锁)、缺锁、死锁(锁序)、`static` 局部变量初始化竞态(Meyers singleton)、`async` future 不 wait 析构阻塞。
- **资源泄漏**:文件 / 锁 / 句柄不用 RAII;异常路径泄漏。
- **异常安全**:构造函数部分初始化、析构抛异常、裸 `new` + 异常泄漏。
- **移动 / 转发**:`std::forward` 模板条件、`T&&` 误用、完美转发失效。
- **转换**:C-style cast / `reinterpret_cast` 滥用;隐式窄化转换;`static_cast` 越界 downcast。
- **Google 风格逻辑(clang-format 管不到)**:入参 `const T&`、输出参数 vs 返回值、接口设计、include 顺序与依赖。
