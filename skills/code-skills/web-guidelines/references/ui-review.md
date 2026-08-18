# UI 审查(Web Interface Guidelines)

> **来源**:提炼自 [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) 的 `web-design-guidelines`。规则本体不硬编码,动态拉取 [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) 的最新规则——和 t-craft 的「项目约定发现」同一思路。

用户说「review 我的 UI」「检查可访问性」「audit 设计」「review UX」「按最佳实践检查站点」时,对**界面层**做合规审查(业务逻辑走 `/tcraft-code-review`)。

## 工作原理

规则会持续演进,所以不把规则拷进来,而是**每次审查前拉最新版**:

```
WebFetch https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

返回的内容包含全部规则与输出格式要求(覆盖可访问性、焦点态、表单、语义 HTML、性能、UX 等 100+ 条)。

## 流程

1. **拉取规则**:WebFetch 上面的 URL,取最新规则(含输出格式说明)。
2. **确定审查范围**:用户给了文件/目录就用;没给就列出候选并问,或按最近改动范围(git diff)圈定。
3. **逐条对照**:把目标文件过一遍全部规则,找违反项。
4. **输出**:按规则规定的 `file:line` 紧凑格式出报告,一条一行,便于直接跳转修复。

## 执行注意

- **以实际渲染/真实 DOM 为准**:能跑起来看的就本地起服务看,不只读源码——可访问性与焦点态问题常只在真实交互中出现。
- **与设计取舍配合**:审查发现的问题分两类——硬伤(违反规则,直接修)与设计取舍(可访问性/UX 与工具效率的权衡,按 [`app-ui-design.md`](app-ui-design.md) 的原则判断)。
- **渐进披露**:规则很长,别一次全塞上下文。拉下来后按审查目标筛相关类别,用多少读多少。
