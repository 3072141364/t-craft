#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Chrome Trace Event JSON 构建脚手架(通用,无 schema 假设)。

用法:
1. 先分析用户数据的实际格式(CSV/日志/任意 JSON)。
2. 写一小段解析函数,把用户数据抽成统一事件列表:
       events = [{"name": str, "cat": str, "start": 秒, "dur": 秒, "group": str, "id": str, "args": dict}, ...]
   (字段按实际数据映射,可缺省: cat/group/id/args 不填用默认)
3. 调 build_trace(events, mode) 得到 traceEvents,落盘 trace.json。
4. 打开 https://ui.perfetto.dev -> Open trace file 验证。

分组模式 mode:
    "A": pid=group, tid=id   —— 组间平行对比(默认)
    "B": pid=group, tid=group —— 同组同泳道堆叠,看组内重合度
    "C": pid=1, tid=group    —— 全平铺,按组命名泳道
"""

import json
from collections import OrderedDict
from typing import Dict, List


def _meta(pid: int, tid, name: str, is_thread: bool) -> Dict:
    """生成 process_name / thread_name metadata。"""
    return {
        "name": "thread_name" if is_thread else "process_name",
        "cat": "__metadata",
        "ph": "M",
        "pid": pid,
        "tid": tid,
        "args": {"name": name},
    }


def build_trace(events: List[Dict], mode: str = "A", unit: str = "s") -> List[Dict]:
    """
    统一事件列表 -> Chrome Trace Event JSON 的 traceEvents 数组。

    events 每项: {name, cat?, start(秒或微秒), dur(秒或微秒), group?, id?, args?}
    unit: "s"(默认) 秒 -> 微秒; "us" 输入已是微秒。
    """
    scale = 1_000_000.0 if unit == "s" else 1.0

    def group_of(e: Dict) -> str:
        return str(e.get("group") or "ungrouped")

    def tid_of(e: Dict, g: str) -> str:
        if mode == "A":
            return str(e.get("id") or e.get("name") or g)
        return g  # B/C: tid = group

    groups: List[str] = []
    gindex: Dict[str, int] = {}
    for e in events:
        g = group_of(e)
        if g not in gindex:
            gindex[g] = len(groups)
            groups.append(g)

    out: List[Dict] = []
    for e in events:
        g = group_of(e)
        pid = 1 if mode == "C" else gindex[g] + 1
        tid = tid_of(e, g)
        start = float(e.get("start", 0)) * scale
        dur = float(e.get("dur", 0)) * scale
        ev = {
            "name": str(e.get("name") or "event"),
            "cat": str(e.get("cat") or "event"),
            "ph": "X" if dur > 0 else "I",
            "ts": int(start),
            "pid": pid,
            "tid": tid,
        }
        if ev["ph"] == "X":
            ev["dur"] = int(dur)
        if e.get("args"):
            ev["args"] = dict(e["args"])
        out.append(ev)

    # metadata: 每个分组一个 process_name, 每个泳道一个 thread_name
    meta: List[Dict] = []
    for i, g in enumerate(groups):
        pid = 1 if mode == "C" else i + 1
        meta.append(_meta(pid, None, g, is_thread=False))
    tids: OrderedDict = OrderedDict()
    for e in events:
        g = group_of(e)
        pid = 1 if mode == "C" else gindex[g] + 1
        tid = tid_of(e, g)
        tids.setdefault((pid, tid), str(e.get("name") or e.get("id") or tid))
    for (pid, tid), label in tids.items():
        meta.append(_meta(pid, tid, label, is_thread=True))

    out.sort(key=lambda x: x["ts"])
    return meta + out


if __name__ == "__main__":
    # 演示:把用户实际数据解析成 events 后调用 build_trace
    import sys

    print(__doc__)
    print("本文件是脚手架:解析用户数据的部分需按实际格式现场实现。示例:")
    demo = [
        {"name": "任务A-排队", "cat": "排队", "start": 100.0, "dur": 10.0, "group": "任务A", "id": "A1"},
        {"name": "任务A-GPU", "cat": "GPU", "start": 125.0, "dur": 40.0, "group": "任务A", "id": "A1"},
        {"name": "任务B-排队", "cat": "排队", "start": 105.0, "dur": 8.0, "group": "任务B", "id": "B1"},
    ]
    trace = build_trace(demo, mode="A")
    json.dump({"traceEvents": trace}, sys.stdout, ensure_ascii=False, indent=2)
    print()
