# 设计语言库(DESIGN.md)

> **来源**:[voltagent/awesome-design-md](https://github.com/voltagent/awesome-design-md) —— 73+ 个知名站点的「设计 DNA」库(airbnb / apple / claude / linear / notion / vercel…)。概念来自 [Google Stitch 的 DESIGN.md](https://stitch.withgoogle.com/docs/design-md/overview/)。
>
> **适用边界**:本参考只服务「品牌感 / 营销页 / 仿某站风格」场景。你的工作若主要是应用 / 工具 UI(后台、仿真平台、本地工具),主参考是 [`app-ui-design.md`](app-ui-design.md),本库只借配色 / 字体气质。

**DESIGN.md 是什么**:一个纯文本的设计系统文档,放在项目根,任何 AI 编码代理读它就能生成视觉一致的 UI。不依赖 Figma 导出、JSON schema、特殊工具——就是 markdown,LLM 最擅长的格式。类比:

| 文件 | 谁读 | 定义什么 |
|------|------|----------|
| `AGENTS.md` | 编码代理 | 项目怎么构建 |
| `DESIGN.md` | 设计代理 | 项目看起来/感觉起来怎样 |

## 一份 DESIGN.md 长什么样

结构化描述一个站点的设计语言,典型构成(以 `claude` 为例):

- **身份段**:一句话点名风格锚点(如「暖米色画布 + 衬线展示标题 + 珊瑚色 CTA」),品牌张力来自哪个配色组合。
- **配色 token**:`primary` / `ink` / `body` / `muted` / `hairline` / `canvas` / `surface-*` 等具名 hex,组织成明暗两套。
- **字体**:展示字体(常是衬线/雕塑感)+ 正文无衬线 + 工具字,各自角色的使用场合。
- **组件与规则**:按钮、卡片、导航、间距、动效的具体约定。

## 使用流程

1. **先让用户定风格(开发时必做)**:读本 skill 的 **`design-styles.json`**(74 款风格索引,每款含分类、气质一句话、官方站点 `url`、拉取路径)。用户点名站点就用点的;没点名就从索引按任务气质推荐 2-3 款,**把候选的 `url` 一起给用户,点开就能直观看到该风格长什么样**。风格确认后再拉规则,不自己擅自定风格。
2. **拉取对应 DESIGN.md**(按选中款式的 `path` 字段,如 `design-md/linear.app/DESIGN.md`):

   ```
   gh api repos/voltagent/awesome-design-md/contents/<path> --jq .content | base64 -d
   # 或直接 WebFetch:
   # https://raw.githubusercontent.com/voltagent/awesome-design-md/main/<path>
   ```

3. **生成 UI**:按 DESIGN.md 的 token 与规则构建,视觉全程一致,不临时发明。
4. **落地**:项目里沉淀一份自己的 `DESIGN.md`(取参考站的核心 + 本项目品牌),后续迭代都读它。

## 风格索引

**完整 74 款列表见本 skill 的 `design-styles.json`**(分类:ai / devtool / saas / consumer / crypto / auto / media;每款含官方站点 `url`,可直接点开预览),选风格先读它,不用背这个仓库。

## 注意

- **设计语言是起点不是终点**:DESIGN.md 给「一致性」与「气质」,但别让输出退化成模板——按 `design-methodology.md` 的原则做取舍与个性化。
- **按需拉取,不整库拷贝**:库是参考,只拉当前任务要的那个站点,不进本 skill 仓库。
- 想要某个站点的 DESIGN.md 但库里没有,可以请求:https://getdesign.md/request 。
