#!/usr/bin/env bash
# setup_format_tools.sh - 一键安装代码格式化/检查工具(uv tool,装到 ~/.local/bin)
# C++: clang-format(Google) | Python: ruff + mypy(PEP8) | bash: shfmt + shellcheck
# 工具集固定,版本用最新(不钉死);要跨机器可复现再自行 pin。
set -euo pipefail

if ! command -v uv >/dev/null 2>&1; then
  echo "✗ 缺少 uv。先装:curl -LsSf https://astral.sh/uv/install.sh | sh" >&2
  exit 1
fi

UV_TOOL_BIN="$HOME/.local/bin"

# 工具集固定:<bin>=<pkg>(版本取最新,不钉死)
TOOLS=(
  "clang-format=clang-format"
  "shfmt=shfmt-py"
  "shellcheck=shellcheck-py"
  "ruff=ruff"
  "mypy=mypy"
)

echo "安装格式化/检查工具(uv tool,最新版):"
for pair in "${TOOLS[@]}"; do
  bin="${pair%%=*}"; pkg="${pair#*=}"
  if [ -x "$UV_TOOL_BIN/$bin" ]; then
    echo "  = $bin 已就绪"
  elif uv tool install "$pkg" >/dev/null 2>&1; then
    echo "  + $bin 已安装($pkg)"
  else
    echo "  ✗ $bin 安装失败,手动:uv tool install $pkg"
  fi
done

echo ""
echo "=== 验证 ==="
for t in clang-format ruff mypy shfmt shellcheck; do
  if command -v "$t" >/dev/null 2>&1; then
    printf "  ✓ %-14s %s\n" "$t" "$($t --version 2>&1 | head -1)"
  else
    printf "  ✗ %s 未就绪(可能需重启 shell 让 ~/.local/bin 生效)\n" "$t"
  fi
done
