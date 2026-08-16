# React / Next.js 性能准则

> **来源**:提炼自 [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) 的 `react-best-practices`(Vercel 工程团队维护,70 条规则 8 大类)。本参考保留其规则清单与优先级,按 t-craft 约定压缩重组;每条规则的完整说明与代码示例在源仓库 `skills/react-best-practices/rules/`(规则文件即下面 `前缀-规则名.md`)。

写 React / Next.js 代码(组件、页面、数据取数、重构)时,按下面优先级对照。**先按优先级抓大放小**:CRITICAL 类(消除瀑布流、包体积)收益最大,别一上来抠 LOW 级的微优化。

## 优先级总表

| 优先级 | 类别 | 影响 | 规则前缀 |
|--------|------|------|----------|
| 1 | 消除瀑布流(Eliminating Waterfalls) | **CRITICAL** | `async-` |
| 2 | 包体积优化(Bundle Size) | **CRITICAL** | `bundle-` |
| 3 | 服务端性能(Server-Side) | **HIGH** | `server-` |
| 4 | 客户端数据取数(Client Data Fetching) | MEDIUM-HIGH | `client-` |
| 5 | 重渲染优化(Re-render) | MEDIUM | `rerender-` |
| 6 | 渲染性能(Rendering) | MEDIUM | `rendering-` |
| 7 | JS 微优化(JavaScript) | LOW-MEDIUM | `js-` |
| 8 | 高级模式(Advanced) | LOW | `advanced-` |

## 1. 消除瀑布流(CRITICAL)

串行的「等完再等」是 React 性能头号杀手:请求 B 依赖请求 A 完成,白等一个来回。目标是把依赖链打平,能并发的并发、能不等的先不等。

- `async-cheap-condition-before-await` — await 前先检查便宜的同步条件,别先 await 再判断。
- `async-defer-await` — 把 await 挪到真正用到的分支里,避免无条件阻塞。
- `async-parallel` — 相互独立的操作用 `Promise.all()` 并发。
- `async-dependencies` — 部分依赖时用更好的组合,别串成链。
- `async-api-routes` — API 路由里尽早 start promise、尽量晚 await。
- `async-suspense-boundaries` — 用 Suspense 流式输出内容,不等整页。

## 2. 包体积优化(CRITICAL)

包越大,首屏越慢。目标:只载入需要的代码,重的组件/第三方按需加载。

- `bundle-barrel-imports` — 直接路径导入,避免 barrel 文件(index.ts 汇总导出)引入整包。
- `bundle-analyzable-paths` — 偏好静态可分析的导入/文件系统路径,避免宽泛的 bundle 与 trace。
- `bundle-dynamic-imports` — 重组件用 `next/dynamic` 按需加载。
- `bundle-defer-third-party` — 分析/埋点日志在 hydration 后再加载。
- `bundle-conditional` — 模块只在功能被激活时加载。
- `bundle-preload` — 在 hover/focus 时预载,做感知速度。

## 3. 服务端性能(HIGH)

Server Components / SSR / Server Actions 场景,主要围绕请求去重、数据最小化、模块级状态纪律。

- `server-auth-actions` — Server Actions 要像 API 路由一样做鉴权。
- `server-cache-react` — 用 `React.cache()` 做 per-request 去重。
- `server-cache-lru` — 跨请求缓存用 LRU(带上限)。
- `server-dedup-props` — 避免 RSC props 里的重复序列化。
- `server-hoist-static-io` — 静态 I/O(字体、logo)提升到模块级。
- `server-no-shared-module-state` — RSC/SSR 里避免模块级可变请求状态(请求间串扰)。
- `server-serialization` — 传给客户端组件的数据最小化。
- `server-parallel-fetching` — 重构组件结构让取数并行。
- `server-parallel-nested-fetching` — 每个 item 的嵌套取数用 `Promise.all` 收拢。
- `server-after-nonblocking` — 非阻塞操作用 `after()`(如日志、统计)。

## 4. 客户端数据取数(MEDIUM-HIGH)

- `client-swr-dedup` — 用 SWR 自动去重请求。
- `client-event-listeners` — 去重全局事件监听器。
- `client-passive-event-listeners` — 滚动监听用 passive,别挡主线程。
- `client-localstorage-schema` — localStorage 数据带版本号并最小化。

## 5. 重渲染优化(MEDIUM)

不必要的重渲染让组件树白干活。核心思路:缩小订阅面、把昂贵计算抽出来、减少渲染期副作用。

- `rerender-defer-reads` — 只在回调里用的状态,别订阅它。
- `rerender-memo` — 把昂贵工作抽成 memoized 组件。
- `rerender-memo-with-default-value` — 非原始默认 props 提升到模块级。
- `rerender-dependencies` — effect 依赖用原始值(primitive)。
- `rerender-derived-state` — 订阅派生的布尔,不订阅原始值。
- `rerender-derived-state-no-effect` — 派生状态在渲染期算,不用 effect。
- `rerender-functional-setstate` — 用函数式 `setState` 保证回调稳定。
- `rerender-lazy-state-init` — 昂贵初始值给 `useState` 传函数(惰性初始化)。
- `rerender-simple-expression-in-memo` — 简单原始值别套 memo(反而有害)。
- `rerender-split-combined-hooks` — 拆分依赖互相独立的 hooks。
- `rerender-move-effect-to-event` — 交互逻辑放事件处理器,不放进 effect。
- `rerender-transitions` — 非紧急更新用 `startTransition`。
- `rerender-use-deferred-value` — 昂贵渲染用 `useDeferredValue` 保输入响应。
- `rerender-use-ref-transient-values` — 高频瞬时值用 ref。
- `rerender-no-inline-components` — 别在组件内部定义组件(每次渲染重建)。

## 6. 渲染性能(MEDIUM)

- `rendering-animate-svg-wrapper` — 动画作用在 div 外层,不动 SVG 元素本身。
- `rendering-content-visibility` — 长列表用 `content-visibility`。
- `rendering-hoist-jsx` — 静态 JSX 提出组件外。
- `rendering-svg-precision` — 降低 SVG 坐标精度。
- `rendering-hydration-no-flicker` — 仅客户端数据用内联脚本防闪烁。
- `rendering-hydration-suppress-warning` — 预期的不匹配用 suppress。
- `rendering-activity` — 显隐用 Activity 组件。
- `rendering-conditional-render` — 条件渲染用三元,不用 `&&`(避免 0 渲染)。
- `rendering-usetransition-loading` — 加载态优先 `useTransition`。
- `rendering-resource-hints` — 预载用 React DOM resource hints。
- `rendering-script-defer-async` — script 标签用 defer 或 async。

## 7. JS 微优化(LOW-MEDIUM)

通用 JS 层面的性能细节,收益小但顺手。

- `js-batch-dom-css` — 用 class 或 cssText 分组改 CSS。
- `js-index-maps` — 重复查找先建 Map。
- `js-cache-property-access` — 循环里缓存对象属性访问。
- `js-cache-function-results` — 函数结果缓存在模块级 Map。
- `js-cache-storage` — 缓存 localStorage/sessionStorage 读取。
- `js-combine-iterations` — 多个 filter/map 合成一次循环。
- `js-length-check-first` — 昂贵比较前先查数组长度。
- `js-early-exit` — 函数尽早 return。
- `js-hoist-regexp` — RegExp 创建提出循环。
- `js-min-max-loop` — 找 min/max 用循环,不用 sort。
- `js-set-map-lookups` — 用 Set/Map 做 O(1) 查找。
- `js-tosorted-immutable` — 用 `toSorted()` 保持不可变。
- `js-flatmap-filter` — 映射+过滤用 `flatMap` 一次过。
- `js-request-idle-callback` — 非关键工作推迟到浏览器空闲期。

## 8. 高级模式(LOW)

- `advanced-effect-event-deps` — 别把 `useEffectEvent` 的结果放进 effect 依赖。
- `advanced-event-handler-refs` — 事件处理器存在 ref 里。
- `advanced-init-once` — 应用每载入一次只初始化一次。
- `advanced-use-latest` — 稳定回调用 `useLatest`。

## 使用方式

1. 写/改 React 代码时,拿改动点对照上面的清单,逐条问「这里违反了吗」。
2. **先 CRITICAL 后 LOW**:按优先级表从上往下扫,别本末倒置。
3. 每条规则需要「为什么 + 错误示例 + 正确示例」的展开解释时,读源仓库 `rules/<前缀>-<规则名>.md`(如 `rules/async-parallel.md`),或完整版 `AGENTS.md`。
4. 这是**性能维度的准则**;React 组件的可读性/命名/拆分,与体系内 `code-guidelines` 的语言无关原则配合使用。
