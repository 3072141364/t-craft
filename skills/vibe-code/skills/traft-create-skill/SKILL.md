---
name: traft-create-skill
description: 创建新技能的技能——用脚本生成 SKILL.md 骨架，按内置模板填充，规范注册同步。触发时机——"新建一个技能"、"创建 skill"、"想加个 traft 技能"、"技能模板在哪"。
---

# traft-create-skill 技能

创建新技能：**脚本优先**（`scripts/create_skill.py` 生成骨架，减少手写 token），按内置模板（`templates/skill-template.md`）填充，完成后注册同步。**全技能禁止写绝对路径**——一律相对路径 / `skill://` 引用。

**职责边界**：
- 负责：技能骨架生成（脚本）、模板指导、注册同步（README / package.json / marketplace bump）。
- 不负责：填充后的内容质量（作者按模板补全）、技能功能实现。超出边界直接说明，不硬接。

## 1. 触发条件（TRIGGER）

| 场景 | 触发信号(关键词/典型句式) | 是否触发 |
| --- | --- | --- |
| 新建技能 | "新建一个技能"、"创建 skill"、"想加个 traft 技能" | 触发 |
| 查模板 | "技能模板在哪"、"skill 格式" | 触发 |
| 填充/完善技能 | "按模板优化 xxx" | 触发（指导 + 校验） |
| 实现功能 | "帮我实现 xxx 功能" | 不触发，转交对应技能 |
| 闲聊/泛泛提问 | "随便聊聊" | 不触发，交给默认回复 |

## 2. 规则（RULES）

### 2.1 务必执行(ALWAYS DO)
1. **脚本优先**：建技能先跑 `scripts/create_skill.py` 生成骨架，不手写整份 SKILL.md（省 token）。
2. **填充按模板**：骨架 TODO 按 `templates/skill-template.md` 结构补全——职责边界 / 触发表（正例≥3、反例≥1）/ 规则三段 / 知识底座 / 工作流（带完成标志）/ 输出规范 / 示例。
3. **禁绝对路径**：技能文档与脚本内一律相对路径或 `skill://<name>/...` 引用；交付前 grep `/Users/` 确认无残留。
4. **脚本随技能走**：技能含可执行脚本时，脚本放 `scripts/`，文档用相对路径引用；脚本需 `python3 -m py_compile` 通过。
5. **注册同步**：新技能进 README 技能表（更新技能数）、`traft-guideline` 路由表（如适用）；bump `package.json` + marketplace 版本。

### 2.2 禁止执行(NEVER DO)
1. 不在技能里写绝对路径（目录/脚本/引用）。
2. 不手写整份 SKILL.md 而绕过骨架脚本（脚本优先原则）。

### 2.3 条件执行(CONDITIONAL)
- 需要的输入：技能名、所在目录、description（做什么 + 触发词）。
- 缺失时：目录/描述不明 → 先与用户确认，不猜。

## 3. 知识底座（CONTEXT）

- **骨架脚本**：`scripts/create_skill.py`（`--name` / `--dir` 相对路径 / `--description`）
- **填充模板**：`templates/skill-template.md`（六节结构 + 每节写作说明）
- **命名**：vibe-code 插件内 `traft-*`；其他位置按目标命名空间
- **结构约定**：技能 = `SKILL.md` + 可选 `scripts/`（可执行脚本）+ 可选 `templates/`（模板）
- **注册点**：`README.md` 技能表、`skills/vibe-code/README.md`、`traft-guideline` 横切表、`package.json` + `.omp-plugin/marketplace.json` 版本
- **约定变更时同步更新本节。**

## 4. 工作流程（WORKFLOW）

### Step 1: 定技能信息
- 动作：确认技能名（traft-*）、目录（相对路径）、description（做什么 + 触发词）。
- 完成标志：三项明确。

### Step 2: 生成骨架（脚本优先）
- 动作：`python scripts/create_skill.py --name traft-xxx --dir skills/vibe-code/skills/traft-xxx --description "..."`。
- 完成标志：`<dir>/SKILL.md` 生成，无覆盖冲突。

### Step 3: 按模板填充
- 动作：按 `templates/skill-template.md` 补全骨架 TODO（触发表/规则/知识底座/工作流/输出规范/示例）；脚本类技能在 `scripts/` 放实现并相对引用。
- 完成标志：无 TODO 残留，内容与模板结构一致。

### Step 4: 校验
- 动作：`grep '/Users/' <技能目录>` 无绝对路径；`python3 -m py_compile scripts/*.py` 通过（如有脚本）。
- 完成标志：校验全绿。

### Step 5: 注册同步
- 动作：README 技能表加行（更新技能数）、`traft-guideline` 路由表（如适用）；bump `package.json` + marketplace 版本；提交推送。
- 完成标志：注册完成，版本已 bump。

## 5. 输出规范（OUTPUT SPEC）

### 5.1 固定格式
```text
## 骨架
<dir>/SKILL.md（已生成）
## 填充
<按模板补全的节: 触发/规则/知识底座/工作流/输出/示例>
## 校验
绝对路径: 无 | 脚本编译: 通过
## 注册
README 技能数 <N>→<M> | 版本 <v1>→<v2>
```

### 5.2 字段要求

| 字段 | 写作要求 |
|----|------|
| 骨架 | 脚本生成的实际路径 |
| 填充 | 列明补全的节，不留 TODO |
| 校验 | 绝对路径/编译两项必须过 |
| 注册 | 技能数与版本号实际值 |

### 5.3 交付前自检
- [ ] 用脚本生成骨架（未手写整份）
- [ ] 模板六节齐全，无 TODO 残留
- [ ] 无绝对路径（grep 通过）
- [ ] 脚本 py_compile 通过（如有）
- [ ] README/guideline/版本已同步

## 6. 示例

### 6.1 好的示例
**输入**：新建一个技能，画图路由的
**输出**：
```text
## 骨架
skills/vibe-code/skills/traft-code-graph/SKILL.md（已生成）
## 填充
触发/规则/知识底座（archify 路由 + 落盘约定）/工作流/输出/示例 全部补全
## 校验
绝对路径: 无 | 脚本编译: 通过
## 注册
README 技能数 11→12 | 版本 0.3.3→0.3.4
```

### 6.2 差的示例
**输入**：新建一个技能
**输出**：手写整份 SKILL.md（绕脚本）；或文档里写死 `/Users/zane.wei/...` 绝对路径。
（违反 2.1①/2.2①——脚本优先、禁绝对路径）
