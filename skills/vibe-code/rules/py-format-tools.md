---
name: py-format-tools
description: Python 格式化优先级：项目约定 > 无配置时用 ruff（单行 ≤120）。
globs: ["*.py"]
---

# Python 格式化

1. **项目约定**（最高优先）：已有格式配置/命令（pyproject [tool.ruff]、black/isort、`make format`）按项目走，不擅自改格式工具或配置。
2. **无明确配置**：优先 **ruff**——`ruff format` + `ruff check`（含 import 排序），单行不超过 120 字符（line-length=120）。
