# C++ 格式化与检查(format)

> cpp-guidelines 的附属文档:C++ 格式化标准、clang-format 配置与命令。要格式化 C++、写 `.clang-format` 时读本文。跨语言统一约定(.editorconfig、行长 120、装工具)见 code-guidelines 附属文档 format.md(本 plugin 内)。

## 标准

- **规范**:Google 风格。
- **工具**:clang-format(格式);clang-tidy 可选(部分 lint,能在 review 前跑一遍)。
- **关键设置**:ColumnLimit **120**,IndentWidth 2,UseTab Never。

## 命令

| 动作 | 命令 |
|------|------|
| 格式化 | `clang-format -i <files>` |

项目有 Makefile 时优先 `make format`(code-guidelines 附属文档 make-shortcut)。排除构建产物与第三方:`build`、protobuf 生成(`*.pb.cc/h`)。

## 配置模板(.clang-format)

最小可用(完整 280 行版参考 SimX/.clang-format):

```yaml
---
Language:        Cpp
BasedOnStyle:    Google
ColumnLimit:     120
IndentWidth:     2
UseTab:          Never
```

新项目把文件放仓库根,编辑器与 CI 自动读。

## 注意

- Google 风格管格式;**逻辑风格**(入参 `const T&`、include 顺序、接口设计)clang-format 管不到,见本 skill 正文与 [review.md](review.md)。
- 工具安装:code-guidelines 的 `scripts/setup_format_tools.sh` 一键装(经 uv)。
