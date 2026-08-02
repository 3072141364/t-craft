#!/usr/bin/env bash
# init_vault.sh - 初始化 Obsidian vault:建目录、复制卡片模板、建 INDEX 与卡片库 Base
# 用法: bash init_vault.sh <vault 路径>
# 幂等:已存在的目录/文件跳过,不覆盖、不删除任何已有内容。
set -euo pipefail

VAULT="${1:-}"
if [ -z "$VAULT" ]; then
  echo "用法: $0 <vault 路径>" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TPL_DIR="$SCRIPT_DIR/../assets/templates"

if [ ! -d "$TPL_DIR" ]; then
  echo "✗ 找不到模板目录: $TPL_DIR" >&2
  exit 1
fi

mkdir -p "$VAULT"
echo "初始化 vault: $VAULT"

# 1) 目录结构
for d in \
  "项目" \
  "通用/术语" "通用/AI" "通用/工具" "通用/规范" "通用/环境" \
  "日程/周报" "日程/日记" \
  "模板" \
  "归档"; do
  if [ -d "$VAULT/$d" ]; then
    echo "  = $d/ (已存在)"
  else
    mkdir -p "$VAULT/$d"
    echo "  + $d/"
  fi
done

# 2) 卡片模板(不覆盖)
shopt -s nullglob
for tpl in "$TPL_DIR"/*.md; do
  name="$(basename "$tpl")"
  if [ -f "$VAULT/模板/$name" ]; then
    echo "  = 模板/$name (已存在)"
  else
    cp "$tpl" "$VAULT/模板/$name"
    echo "  + 模板/$name"
  fi
done

# 3) INDEX.md(不覆盖)
if [ -f "$VAULT/INDEX.md" ]; then
  echo "  = INDEX.md (已存在)"
else
  cat > "$VAULT/INDEX.md" <<'EOF'
# 🏠 Vault 首页

> 卡片 = 概念/模板,不是文件夹。一篇内聚、有信息量的笔记就是一张卡;
> `card_type`(frontmatter)决定类型与骨架,文件夹决定位置。

## 卡片库(动态,按 card_type / project / status 自动汇总)
![[卡片库.base]]

## 入口
- [[通用/规范/标签速查表]] - 标签与 emoji 对照(标签真源)
- [[日程/周报/]] - 周记
- [[模板/]] - 卡片模板

## 卡片类型(模板)
- [[模板/方案卡片]] 📋 / [[模板/升级卡片]] 🚀 / [[模板/问题修复卡片]] 🐛
- [[模板/会议卡片]] 👥 / [[模板/周记卡片]] 📅 / [[模板/术语卡片]] 📖
- [[模板/决策卡片]] ⚖️ / [[模板/踩坑卡片]] 🪤
EOF
  echo "  + INDEX.md"
fi

# 4) 标签速查表 + 卡片库 Base(不覆盖)
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
copy_asset "标签速查表.md" "通用/规范/标签速查表.md"
copy_asset "卡片库.base" "卡片库.base"

echo ""
echo "✓ vault 初始化完成: $VAULT"
echo ""
echo "下一步:让 obsidian-kb 找到这个 vault(任选其一):"
echo "  1) 跨机器推荐:在 shell 配置(~/.bashrc / ~/.zshrc)加  export OBSIDIAN_VAULT=\"$VAULT\""
echo "  2) 单项目:在项目 .claude/skills-config.json 写  {\"obsidian-kb\":{\"vault\":\"$VAULT\"}}"
