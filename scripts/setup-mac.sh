#!/usr/bin/env bash
# setup-mac.sh - macOS 本地常用 CLI 工具一键装(Homebrew)。
# 让 Claude Code 工作更顺:ripgrep fd jq yq tree tmux ctags ffmpeg glab tea uv cmake ninja
# 不含:node/nvm(code-guidelines 的 scripts/setup_env.sh 管)、ruff/clang-format/LSP
#       (code-guidelines 管)、docker(手动)
set -uo pipefail

command -v brew >/dev/null 2>&1 || /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# $1=brew 包名, $2=命令名(默认 $1)。按命令是否可用来判已装。
pkg() {
  local b="$1"; local cmd="${2:-$1}"
  if command -v "$cmd" >/dev/null 2>&1; then echo "  = $cmd"; return; fi
  brew install "$b" >/dev/null 2>&1 && echo "  + $b" || echo "  ✗ $b"
}

echo "装本地工具(brew):"
pkg ripgrep        rg
pkg fd             fd
pkg jq             jq
pkg yq             yq
pkg tree           tree
pkg tmux           tmux
pkg universal-ctags ctags
pkg ffmpeg         ffmpeg
pkg glab           glab
pkg tea            tea
pkg cmake          cmake
pkg ninja          ninja

# make 随 Xcode Command Line Tools;没有就装
command -v make >/dev/null 2>&1 && echo "  = make" || { xcode-select --install 2>/dev/null && echo "  + make(via Xcode CLI)" || echo "  - make(手动 xcode-select --install)"; }

# uv(Python,fast)
if command -v uv >/dev/null 2>&1; then echo "  = uv"
else curl -LsSf https://astral.sh/uv/install.sh | sh && echo "  + uv" || echo "  ✗ uv"; fi

echo ""
echo "=== 验证 ==="
for t in rg fd jq yq tree tmux ctags ffmpeg glab tea uv cmake ninja make; do
  command -v "$t" >/dev/null 2>&1 && printf "  ✓ %s\n" "$t" || printf "  - %s\n" "$t"
done
echo ""
echo "✓ 完成。另:node/nvm 见 skills/code-skills/code-guidelines/scripts/setup_env.sh;"
echo "  ruff/clang-format/LSP 见 skills/code-skills/code-guidelines/scripts/setup_format_tools.sh;docker 需手动装;"
echo "  fireworks-tech-graph(方案配图,外部 plugin)需 Python + cairosvg/librsvg,未在此安装:uv pip install cairosvg + brew install librsvg,详见其 README。"
