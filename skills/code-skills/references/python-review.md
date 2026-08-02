# Python 审查要点

ruff(lint / format)+ mypy(类型)能查的不重复;这里抓工具管不到的逻辑问题。

## 常见 bug

- **可变默认参数**:`def f(x=[])` 共享状态;用 `None` + 内部赋值。
- **异常吞咽**:`except: pass` / 裸 `except:` 掩盖真实错误;至少 log 或 `except SpecificError`。
- **`is` 比值**:`is` 给 None / 单例 / 哨兵,`==` 给值(小整数缓存坑);比 None 用 `is None`。
- **闭包延迟绑定**:循环里 `lambda: i` 都拿到最后的 i;用默认参数 `lambda i=i: ...`。
- **资源未 with**:`open` / 锁 / 连接不用 with -> 泄漏或异常路径不释放。
- **可变全局 / 类属性共享**:多实例串扰。
- **并发**:GIL 下线程不算 CPU 并行;async 里调阻塞调用(sync io)卡事件循环;共享数据缺锁。
- **类型**:Optional 参数未判 None 就用;mypy strict 下漏注解;`Any` 滥用绕过检查。
- **迭代时改容器**:边遍历边增删 -> 跳元素;遍历副本。
- **f-string 到 sql / 命令注入**:用户输入拼 SQL / shell 命令。
- **`==` 比 None**:用 `is None`。
