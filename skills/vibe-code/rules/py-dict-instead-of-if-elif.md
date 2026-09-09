---
name: py-dict-instead-of-if-elif
description: 多个 if/elif 做同一性质的映射/查表（值→结果、类型→处理、状态→描述）时，优先用 dict 映射替代，而不是堆 if/elif 链。分支条件复杂、每支有独立副作用流程时保留 if/elif。
globs: ["*.py"]
alwaysApply: true
---

# 多分支优先用 dict 映射

多个 `if/elif` 若在**做同一件事的查表映射**（值→结果、类型→处理函数、状态→描述文案），用 `dict` 映射替代；不要堆成 if/elif 链。

```python
# 差: if/elif 链做纯映射
if code == 200:
    desc = "OK"
elif code == 404:
    desc = "Not Found"
elif code == 500:
    desc = "Server Error"
else:
    desc = "Unknown"

# 好: map 映射 + get 兜底
STATUS_DESC = {200: "OK", 404: "Not Found", 500: "Server Error"}
desc = STATUS_DESC.get(code, "Unknown")
```

值→动作（处理函数）同理：`{ "a": handler_a, "b": handler_b }.get(key, default_handler)`。

**保留 if/elif 的情况**：分支条件不是简单相等匹配（范围/复合判断）、每支有独立且复杂的副作用流程、分支少（≤2）且没有扩展可能性时直接 if/else 即可。**不要为了用 dict 而硬造映射**——dict 适用的是「同一性质、纯查表」的分支。
