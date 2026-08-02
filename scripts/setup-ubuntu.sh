#!/usr/bin/env bash
# setup-ubuntu.sh - Ubuntu/Debian 本地常用 CLI 工具一键装(apt + 二进制兜底)。
# 让 Claude Code 工作更顺:ripgrep fd jq yq tree tmux ctags ffmpeg glab uv make cmake ninja
# 不含:node/nvm(code-intelligence 的 setup_env.sh 管)、ruff/clang-format/LSP
#       (code-format/code-intelligence 管)、docker(手动)
set -uo pipefail

[ "$(id -u)" -ne 0 ] && SUDO="sudo" || SUDO=""
$SUDO apt-get update -qq || true

# $1=apt 包名, $2=命令名(默认 $1)。按命令是否可用来判已装,不靠包名。
pkg() {
  local a="$1"; local cmd="${2:-$1}"
  if command -v "$cmd" >/dev/null 2>&1; then echo "  = $cmd"; return; fi
  $SUDO apt-get install -y "$a" >/dev/null 2>&1 && echo "  + $a" || echo "  ✗ $a(需 sudo 密码)"
}

echo "装本地工具(apt):"
pkg ripgrep        rg
pkg fd-find        fd
pkg jq             jq
pkg tree           tree
pkg tmux           tmux
pkg universal-ctags ctags
pkg ffmpeg         ffmpeg
pkg glab           glab
pkg cmake          cmake
pkg ninja-build    ninja
pkg make           make

# fd 软链:Ubuntu 的 fd-find 命令叫 fdfind,建 fd 软链
if command -v fdfind >/dev/null 2>&1 && ! command -v fd >/dev/null 2>&1; then
  $SUDO ln -sf "$(command -v fdfind)" /usr/local/bin/fd && echo "  + fd -> fdfind"
fi

# yq:下二进制到 ~/.local/bin(免 sudo)
if ! command -v yq >/dev/null 2>&1; then
  mkdir -p "$HOME/.local/bin"
  echo "  -> yq:下二进制到 ~/.local/bin"
  curl -fsSL https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 -o "$HOME/.local/bin/yq" 2>/dev/null \
    && chmod +x "$HOME/.local/bin/yq" && echo "  + yq" || echo "  ✗ yq(手动 https://github.com/mikefarah/yq)"
fi

# tea(Gitea CLI):Linux 手动
command -v tea >/dev/null 2>&1 || echo "  - tea(Gitea CLI):手动 https://gitea.com/gitea/tea/releases"

# uv(Python,fast)
if command -v uv >/dev/null 2>&1; then echo "  = uv"
else curl -LsSf https://astral.sh/uv/install.sh | sh && echo "  + uv" || echo "  ✗ uv"; fi

echo ""
echo "=== 验证 ==="
for t in rg fd jq yq tree tmux ctags ffmpeg glab uv cmake ninja make; do
  command -v "$t" >/dev/null 2>&1 && printf "  ✓ %s\n" "$t" || printf "  - %s\n" "$t"
done
echo ""
echo "✓ 完成。另:node/nvm 见 skills/code-skills/code-intelligence/scripts/setup_env.sh;"
echo "  ruff/clang-format/LSP 见 skills/code-skills/code-format/scripts/setup_format_tools.sh;docker 需手动装。"
