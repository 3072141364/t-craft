#!/usr/bin/env bash
# init_vault.sh - 初始化 Obsidian vault:建英文目录、建 INDEX 与 cards.base、铺种子速查表
# 用法: bash init_vault.sh <vault 路径>
# 幂等:已存在的目录/文件跳过,不覆盖、不删除任何已有内容。
# 注意:卡片模板不复制进 vault -- 模板沉淀在 skill 仓库(assets/templates/),按需从技能取用。
set -euo pipefail

VAULT="${1:-}"
if [ -z "$VAULT" ]; then
  echo "用法: $0 <vault 路径>" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

mkdir -p "$VAULT"
echo "初始化 vault: $VAULT"

# 1) 目录结构(统一英文;按开发者的三条工作流:项目/论文/技术 + 周报)
for d in \
  "projects" \
  "papers" \
  "tech" \
  "weekly" \
  "misc" \
  "archive"; do
  if [ -d "$VAULT/$d" ]; then
    echo "  = $d/ (已存在)"
  else
    mkdir -p "$VAULT/$d"
    echo "  + $d/"
  fi
done

# 2) 种子速查表 + cards.base + 人员(不覆盖;放 vault 根,无 common/)
copy_asset() {
  rel="$1"; dest="$2"
  src="$SCRIPT_DIR/../assets/$rel"
  [ -f "$src" ] || return 0
  if [ -f "$VAULT/$dest" ]; then
    echo "  = $dest (已存在)"
  else
    cp "$src" "$VAULT/$dest"
    echo "  + $dest"
  fi
}
copy_asset "tags-cheatsheet.md" "tags-cheatsheet.md"
copy_asset "emoji-cheatsheet.md" "emoji-cheatsheet.md"
copy_asset "tasks-status-cheatsheet.md" "tasks-status-cheatsheet.md"
copy_asset "people.md" "people.md"
copy_asset "cards.base" "cards.base"

# 3) INDEX.md(不覆盖)
if [ -f "$VAULT/INDEX.md" ]; then
  echo "  = INDEX.md (已存在)"
else
  cat > "$VAULT/INDEX.md" <<'EOF'
# 🏠 Vault 首页

> 三条工作流:项目开发(projects)、读论文(papers)、学技术(tech),周报汇总(weekly)。
> 需求 = 文件夹(一需求一文件夹);项目知识 = 项目 wiki 卡;跨项目可复用知识沉淀到 skill 仓库,不进 vault;卡片模板在 skill 仓库(obsidian-kb/assets/templates/)。

## 视图(动态,按 card_type / 进行中需求 / 论文 / project 自动汇总)
![[cards.base]]

## 入口
- [[people]] - 人员花名册(身份 emoji、中英文名)
- [[tags-cheatsheet]] - 标签(扁平无前缀)对照
- [[emoji-cheatsheet]] - card_type 图标、周报字段 emoji 对照
- [[tasks-status-cheatsheet]] - checkbox 扩展符号对照
- [[papers/reading-list]] - 论文待读队列
- [[weekly/]] - 周记
- [[misc/]] - 零散卡(平铺,靠标签找)
EOF
  echo "  + INDEX.md"
fi

echo ""
echo "✓ vault 初始化完成: $VAULT"
echo ""
echo "下一步:让 obsidian-kb 找到这个 vault(任选其一):"
echo "  1) 跨机器推荐:在 shell 配置(~/.bashrc / ~/.zshrc)加  export OBSIDIAN_VAULT=\"$VAULT\""
echo "  2) 单项目:在项目 .claude/skills-config.json 写  {\"obsidian-kb\":{\"vault\":\"$VAULT\"}}"
echo ""
echo "提示:项目级结构(wiki/、workflow/、assets/、reference.md)在开始往项目沉淀内容时按需建;"
echo "     需求级结构(requirements/<需求名>/{prd,progress,adr,test,review}.md)由 brainstorm/project-doc 按需创建;"
echo "     papers/ 一论文一卡(归 research-skills 的 paper-study);tech/ 按主题分目录;weekly/ 周记 <YYYY>-W<ww>.md;misc/ 零散卡平铺靠标签;"
echo "     卡片模板在 skill 仓库 assets/templates/,不从 vault 取。"
