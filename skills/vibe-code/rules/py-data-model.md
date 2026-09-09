---
name: py-data-model
description: Python 数据模型优先级：项目约定 > pydantic > dataclass（纯内部无校验时）。
globs: ["*.py"]
alwaysApply: true
---

# Python 数据模型

1. **项目约定**（最高优先）：项目已有 dataclass/pydantic 约定按项目走，不擅自迁移、不混用两套。
2. **pydantic**：默认——数据来自外部、需校验/类型转换/schema（API 载荷、配置、输入解析），`BaseModel` 声明即校验。
3. **dataclass**：纯内部数据容器、无校验需求时——标准库 `@dataclass` 轻量够用。
