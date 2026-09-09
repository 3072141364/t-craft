---
name: py-env-tools
description: Python 依赖/环境管理优先级：项目约定 > uv > poetry > hatch/pdm > pipenv > pip-tools > venv；conda/mamba 非必要不用（收费）。
globs: ["*.py", "pyproject.toml", "uv.lock", "poetry.lock", "Pipfile", "Pipfile.lock", "pdm.lock", "requirements.txt", "environment.yml"]
---

# Python 环境工具优先级

1. **项目约定**（最高优先）：存在 `uv.lock`/`poetry.lock`/`Pipfile.lock`/`pdm.lock`/`environment.yml`/`requirements.txt`/pyproject 声明——按项目现有工具执行，不引入新工具、不迁移、不覆盖。
2. **新项目**：直接用 **uv**。
3. **存量无配置项目**，按优先级选：

| 优先级 | 工具 | 适用 |
|---|---|---|
| 1 | **uv** | 现代默认，快（Rust） |
| 2 | **poetry** | 成熟，pyproject 驱动 |
| 3 | **hatch / pdm** | 现代 pyproject，hatch 环境+构建一体、pdm 类 poetry |
| 4 | **pipenv** | 老牌 Pipfile 方案 |
| 5 | **pip-tools** | requirements.in 编译锁定 |
| 6 | **venv + pip** | 标准库兜底 |

**特殊场景**（按场景选，不按上述顺序）：
- **conda / mamba**：**非必要不使用**（商业授权收费）——先评估 uv/venv 能否满足；确需跨语言/科学计算环境且其他方案无法替代时再考虑。

**版本管理（解释器）**：pyenv 常用，uv/rye 亦可——以项目声明（`.python-version` / pyproject `requires-python`）为准。

判定流程：新项目 → uv；存量项目先查根锁文件/配置（`uv.lock` → `poetry.lock` → `Pipfile.lock` → `pdm.lock` → `environment.yml` → `requirements.txt` → `pyproject.toml`），命中即按项目工具；全无按上表选。
