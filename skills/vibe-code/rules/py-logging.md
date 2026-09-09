---
name: py-logging
description: Python 日志优先级：项目约定 > loguru > 内置 logging。
globs: ["*.py"]
---

# Python 日志

1. **项目约定**（最高优先）：项目已有日志方案/格式就按项目走，不擅自换。
2. **loguru**：未确定时默认——`from loguru import logger`，格式化/轮转开箱即用。
3. **内置 logging**：不引第三方依赖时用标准库。
