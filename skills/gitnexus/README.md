# gitnexus 技能集

GitNexus 代码智能（索引查询）技能，面向 omp（oh-my-pi）harness。基于 gitnexus 知识图谱做代码理解、调用链追踪、影响面分析、PR 审查、重构、bug 排查。

## 技能

| 技能 | 用途 |
|------|------|
| `gitnexus-cli` | GitNexus CLI：analyze / index / status / clean / wiki |
| `gitnexus-exploring` | 代码怎么运作、执行流、架构理解 |
| `gitnexus-impact-analysis` | 改 X 会坏什么、影响面 / 安全性分析 |
| `gitnexus-debugging` | 追 bug、定位失败原因 |
| `gitnexus-pr-review` | PR 审查、合并风险评估 |
| `gitnexus-refactoring` | 改名 / 抽取 / 拆分 / 移动代码 |
| `gitnexus-guide` | GitNexus 本身：工具、MCP 资源、graph schema、工作流 |

## 依赖

- **gitnexus CLI**：`npm install -g gitnexus`（本插件已带 `.mcp.json`，安装后自动注册 `gitnexus mcp` 服务器）。
- **索引**：对要用它的仓库跑 `gitnexus analyze` 建 `.gitnexus/`（每仓库一次）。

## 安装

```
/marketplace add <你的GitHub用户名>/t-craft
/marketplace install gitnexus@t-craft
```

安装后启用 MCP：确保 `~/.omp/agent/mcp.json` 的 `enabledServers` 含 `gitnexus`，重启 omp。
