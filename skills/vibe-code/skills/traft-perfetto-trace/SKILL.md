---
name: traft-perfetto-trace
description: 通用事件可视化技能——基于 Chrome Trace Event JSON schema，把多个任务并发/事件耗时数据转成 https://ui.perfetto.dev 可打开的 trace.json，可视化耗时、进展、重合度。触发时机——"多个任务并发怎么看"、"事件耗时可视化"、"转 perfetto 格式"、"按组展示任务时间轴"。
compatibility: python3（scripts/trace_builder.py）
---

# traft-perfetto-trace 技能

通用事件可视化：基于 **Chrome Trace Event JSON schema**，把任意「多个任务并发、事件耗时」数据转成 https://ui.perfetto.dev 可打开的 trace.json，直接可视化——**耗时**（时间轴宽度）、**进展**（泳道推进）、**重合度**（重叠区间）。**与项目/数据源解耦**：输入格式不限（CSV/日志/任意 JSON），先分析实际数据，再现场写解析，用脚手架产出。

**职责边界**：
- 负责：schema 指导（本文档）、转化实现（`scripts/trace_builder.py` 脚手架 + 按实际数据现场写的解析）。
- 不负责：数据获取/清洗（由使用方从各自数据源产出事件信息）、业务指标分析。超出边界直接转交，不硬接。

## 1. 触发条件（TRIGGER）

| 场景 | 触发信号(关键词/典型句式) | 是否触发 |
| --- | --- | --- |
| 多任务并发可视化 | "多个任务并发怎么看"、"任务重合度" | 触发 |
| 事件耗时可视化 | "事件耗时可视化"、"把耗时画成时间轴" | 触发 |
| 转 perfetto | "转成 perfetto 格式"、"导出 trace.json" | 触发 |
| 分组展示 | "按组展示任务时间轴"、"怎么实现分组" | 触发 |
| 数据获取/清洗 | "拉数据"、"清洗数据" | 不触发，由使用方数据源负责 |
| 闲聊/泛泛提问 | "随便聊聊" | 不触发，交给默认回复 |

## 2. 规则（RULES）

### 2.1 务必执行(ALWAYS DO)
1. **先分析数据，再写转化**：拿到用户数据先看实际格式（列/键/日志结构），抽成统一事件列表，不假设 schema。
2. **ts/dur 用微秒**（Perfetto 约定）：源数据是秒就 × 1_000_000；脚手架 `unit` 参数处理换算。
3. **metadata 必带**：每个分组生成 `process_name`、每个泳道生成 `thread_name`，否则 Perfetto 里全是数字 pid/tid 无法阅读。
4. **分组前先确认语义**：组间对比 → mode A；看组内重合度 → mode B；简单并列 → mode C（见 3.4）。
5. 输出后提示打开方式：https://ui.perfetto.dev → Open trace file。
6. **查询转化**：用户问 trace 内数据问题（谁最慢/每组多少/哪些重合/某任务详情）时，按 3.7 把描述转成 SQL，提示在 `q:` 查询面板执行。

### 2.2 禁止执行(NEVER DO)
1. 不手写 traceEvents 冒充转化（用 `trace_builder.build_trace`）。
2. 不预设输入 schema——每次按实际数据写解析，不猜字段名。

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：用户的事件/任务数据（任意格式：CSV、日志、JSON、表格）。
- 缺失时：无数据 → 向用户要数据，不凭空生成。

## 3. 知识底座（CONTEXT）

### 3.1 Chrome Trace Event JSON schema（核心，参考规范 "Trace Event Format"）
```json
{
  "traceEvents": [
    {"name": "process_name", "cat": "__metadata", "ph": "M", "pid": 1, "args": {"name": "任务A"}},
    {"name": "thread_name",  "cat": "__metadata", "ph": "M", "pid": 1, "tid": "A1", "args": {"name": "任务A-排队"}},
    {"name": "任务A-排队",   "cat": "排队", "ph": "X", "ts": 100000000, "dur": 10000000, "pid": 1, "tid": "A1"},
    {"name": "事件点",       "cat": "瞬时", "ph": "I", "ts": 120000000, "pid": 1, "tid": "A1"}
  ]
}
```

**事件字段**：

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 事件名（时间轴显示） |
| `cat` | string | 分类，Perfetto 按 cat 着色 |
| `ph` | string | 阶段（见 3.2） |
| `ts` | int | 开始时间，**微秒** |
| `dur` | int | 持续时长，微秒（仅 ph=X） |
| `pid` | int | 分组进程 id（左侧按 pid 折叠） |
| `tid` | string/int | 泳道 id（组内按 tid 分行） |
| `args` | object | 附加字段，点击事件查看 |

**metadata 事件**（`ph:"M"`）：`process_name`（args.name = 分组名）、`thread_name`（args.name = 泳道名）；cat 固定 `__metadata`。

### 3.2 阶段 ph 类型

| ph | 名称 | 用途 | 必需字段 |
|----|------|------|---------|
| `X` | Complete | 有持续时长的完整事件（画块） | ts + dur |
| `I` | Instant | 瞬时事件（时间轴上一个点） | ts |
| `M` | Metadata | 进程/线程命名等元信息 | args |
| `C` | Counter | 数值曲线（可选进阶） | ts + args.value |
| `b`/`e` | Async | 异步开始/结束，跨泳道区间 | id 关联 |
| `s`/`t`/`f` | Flow | 依赖流连接（进阶） | id 关联 |

基础场景用 X/I/M 即可；需要跨线程依赖用 flow，数值曲线用 counter。

### 3.3 时间与排序
- `ts`/`dur` 微秒 = 秒 × 1_000_000；负 dur 归一为 0；无效/缺失 start 的事件跳过（防时间轴拉回 1970）
- 事件按 `ts` 升序排列

### 3.4 分组实现（mode，如何实现分组）

| mode | 结构 | 适用 | 可视化效果 |
|------|------|------|-----------|
| **A**（默认） | pid=分组，tid=事件 id | 组间对比 | 每组一个泳道组，组内每事件一行，组与组平行 |
| **B** | pid=分组，tid=分组 | 看组内重合度 | 同组事件同一泳道堆叠，重叠直观 |
| **C** | pid=1，tid=分组 | 简单并列 | 全平铺，按分组命名泳道 |

- 分组维度由使用方定义：任务/机器/阶段/进程任意；跨多字段组合可拼成 group 值。

### 3.5 可视化能力（借 ui.perfetto.dev）
- **耗时**：X 事件时间轴宽度 = dur；hover 看 ts/dur/args
- **进展**：泳道内事件按 ts 推进，thread_name 标注
- **重合度**：同 tid 堆叠（mode B）或跨 tid 平行时段（mode A）直观可见
- 进阶：flow 事件画依赖链、counter 画数值曲线、选区统计重叠区

### 3.6 快捷键（交付时提示用户）
- **时间轴导航**：`W`/`S` 缩放，`A`/`D` 平移；`Shift+拖拽` 平移，`Ctrl+滚轮` 缩放
- **F**：选中事件居中，再按 `F` 缩放聚焦（超短事件看不清时用）
- **Esc**：清除选择
- 进阶：`.`/`,` 同泳道相邻事件；`Q` 开关详情面板；`Ctrl+P` 模糊找轨道；`?` 查看全部快捷键

### 3.7 查询语法（必要时把用户描述转成查询）
**Omnibox 前缀**（顶部输入框）：
| 前缀 | 作用 |
|------|------|
| `q:` | 查询面板（写 SQL） |
| `>` | 命令面板（命令/宏） |
| `t:` | 找轨道（同 Ctrl+P） |

**Trace Processor SQL**（SQLite 方言，JSON trace 导入后同样可查）：
- 常用表：`slice`（ts/dur/name/cat/thread_id/process_id）、`thread`、`process`、`args`（arg_set_id 关联）、`counter`
- 时间单位：ts/dur 为纳秒（ns），展示转秒用 `/1e9` 或毫秒 `/1e6`

**常用查询模板**（根据用户描述选/拼）：
```sql
-- 耗时 TOP N
SELECT name, dur/1e6 AS dur_ms FROM slice ORDER BY dur DESC LIMIT 10;
-- 按分组(进程)聚合:事件数/总耗时/平均
SELECT p.name, COUNT(*), SUM(s.dur)/1e6 AS total_ms, AVG(s.dur)/1e6 AS avg_ms
FROM slice s JOIN process p ON s.process_id = p.id GROUP BY p.name;
-- 按 cat 聚合
SELECT cat, COUNT(*) AS n, AVG(dur)/1e6 AS avg_ms FROM slice GROUP BY cat ORDER BY avg_ms DESC;
-- 重合度:同时运行的事件对
SELECT a.name, b.name FROM slice a JOIN slice b
  ON a.ts < b.ts + b.dur AND b.ts < a.ts + a.dur
 WHERE a.process_id != b.process_id AND a.ts != b.ts LIMIT 20;
-- 只看某分组
SELECT name, ts/1e6, dur/1e6 FROM slice
  WHERE process_id = (SELECT id FROM process WHERE name = '任务A');
```
- **转化规则**：用户问「谁最慢/耗时排行」→ ORDER BY dur DESC；「每组多少/平均」→ GROUP BY process/cat；「哪些同时跑/重合」→ 自连接重叠条件；「某任务详情」→ WHERE 过滤。SQL 给出后提示用户在 `q:` 面板执行。

### 3.8 脚手架（scripts/trace_builder.py）
- `build_trace(events, mode="A", unit="s") -> traceEvents`：统一事件列表 → traceEvents 数组（自动 metadata/微秒换算/排序/分组）
- **统一事件列表**每项：`{name, cat?, start, dur, group?, id?, args?}`（start/dur 单位由 unit 指定）
- 用户实际数据的**解析部分现场实现**：读 CSV/日志/JSON → 映射成上述事件列表 → 调 build_trace → 落盘
- **约定变更时同步更新本节。**

## 4. 工作流程（WORKFLOW）

### Step 1: 分析实际数据
- 动作：读用户数据，识别格式（CSV 列名 / JSON 键 / 日志结构）；确认时间单位（秒/毫秒/微秒）、事件粒度、分组维度。
- 完成标志：数据格式与字段映射明确。

### Step 2: 写解析（现场实现）
- 动作：写一次性解析代码（按 3.6 统一事件列表输出），只抽实际存在的字段，不臆造。
- 完成标志：解析出 events 列表（含 name/start/dur，group/id 按需）。

### Step 3: 构建 trace
- 动作：`from trace_builder import build_trace; trace = build_trace(events, mode=?)`；按 3.4 定 mode。
- 完成标志：traceEvents 生成，metadata 齐全、微秒正确。

### Step 4: 落盘验证
- 动作：写 trace.json；提示 https://ui.perfetto.dev → Open trace file；**附快捷键提示（见 3.6）**：W/S/A/D 导航，点事件看详情，`F` 聚焦，`Esc` 清除。
- 完成标志：耗时/进展/重合度可视化正确，用户知道如何操作。

（脚手架位置：本技能 `scripts/trace_builder.py`）

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
```text
## 数据识别
<格式: CSV/日志/JSON> | <N 个事件> | 时间单位: <s/ms/us> | 分组维度: <group 语义>
## 分组方案
mode <A/B/C>: <一句话结构说明>
## 输出
<trace.json>（N 事件 + M metadata）
打开: https://ui.perfetto.dev → Open trace file
操作: W/S 缩放 A/D 平移 | 点事件看详情 | F 聚焦 | Esc 清除选择
```

### 5.2 字段要求

| 字段 | 写作要求 |
|----|------|
| 数据识别 | 实际格式与字段映射，不猜 |
| 分组方案 | mode 与 pid/tid 结构 |
| 输出 | 路径 + 事件/元数据数 |

### 5.3 交付前自检
- [ ] 先分析了实际数据格式，未假设 schema
- [ ] ts/dur 为微秒，metadata 已生成
- [ ] 分组 mode 与意图匹配（对比/重合度/并列）
- [ ] 未硬编码特定数据源

## 6. 示例

### 6.1 好的示例
**输入**：这是两个任务的耗时日志（时间戳 + 阶段 + 机器），可视化
**输出**：
```text
## 数据识别
格式: 文本日志 | 12 个事件 | 时间单位: s | 分组: 机器
## 分组方案
mode A: pid=机器, tid=事件 id
## 输出
trace.json（12 事件 + 2 process_name + 12 thread_name）
打开: https://ui.perfetto.dev → Open trace file
操作: W/S 缩放 A/D 平移 | 点事件看详情 | F 聚焦 | Esc 清除选择
```
（先解析日志为统一事件列表，再 build_trace）

### 6.2 差的示例
**输入**：这是任务日志，可视化
**输出**：不看数据直接假设固定 JSON schema 跑转化，字段对不上报错/空结果。
（违反 2.1①——先分析数据再写转化）
