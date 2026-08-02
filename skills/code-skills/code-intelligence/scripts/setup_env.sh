#!/usr/bin/env bash
# setup_env.sh - 一键初始化 code-intelligence 环境依赖
# 装 nvm + Node,再全局装 codegraph、gitnexus。LSP 走 Claude 官方 *-lsp 插件(见末尾)。
set -euo pipefail

NVM_VERSION="v0.39.7"

# 1) Node:有就用;没有就 nvm 装
if ! command -v node >/dev/null 2>&1; then
  export NVM_DIR="$HOME/.nvm"
  if [ ! -s "$NVM_DIR/nvm.sh" ]; then
    echo "-> 安装 nvm ($NVM_VERSION)"
    curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh" | bash
  fi
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  echo "-> 安装 Node LTS"
  nvm install --lts
  nvm use --lts
fi
echo "node $(node -v) / npm $(npm -v)"

# 2) 全局工具
echo "-> npm install -g codegraph gitnexus"
npm install -g codegraph gitnexus

# 3) 验证
echo ""
echo "=== 验证 ==="
command -v codegraph >/dev/null && echo "codegraph: $(codegraph --version 2>/dev/null || echo OK)" || echo "codegraph: ✗"
command -v gitnexus >/dev/null && echo "gitnexus : OK" || echo "gitnexus : ✗(可用 npx gitnexus 兜底)"

# 4) gitnexus 子 skill(由完整 `gitnexus analyze` 生成;--index-only 不生成)
if command -v gitnexus >/dev/null 2>&1 && [ ! -d "$HOME/.claude/skills/gitnexus-exploring" ]; then
  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "-> gitnexus analyze(首次:生成 gitnexus-* 子 skill + 索引当前仓库 + 生成其 CLAUDE.md/AGENTS.md)"
    gitnexus analyze || echo "  (analyze 失败;在项目根手动跑 gitnexus analyze 装子 skill)"
  else
    echo "-> gitnexus 子 skill 未装;进任一 git 仓库跑 gitnexus analyze 生成(会索引该仓库)"
  fi
else
  echo "-> gitnexus 子 skill 已就绪(或 gitnexus 未装)"
fi

# 5) LSP(Claude 官方插件,在 Claude Code 里装)
cat <<'EOF'

=== LSP:走 Claude 官方插件(在 Claude Code 里执行,按需选语言)===
加 marketplace(只需一次):
  /plugin marketplace add anthropics/claude-plugins-official

按语言装插件 + 语言服务器二进制:
  Python : /plugin install pyright-lsp@claude-plugins-official
           + npm install -g pyright          (或 pip install pyright)
  C/C++  : /plugin install clangd-lsp@claude-plugins-official
           + apt install clangd / brew install llvm
           + compile_commands.json(CMake -DCMAKE_EXPORT_COMPILE_COMMANDS=ON,软链到项目根)
  TS/JS  : /plugin install typescript-lsp@claude-plugins-official
           + npm install -g typescript-language-server typescript
  其他   : gopls-lsp / rust-analyzer-lsp / jdtls-lsp / kotlin-lsp / ruby-lsp / csharp-lsp / lua-lsp / swift-lsp / php-lsp

只装你用的语言,不必全装。装完重启 Claude Code 让 LSP 生效。
EOF

echo ""
echo "✓ codegraph + gitnexus 就绪。LSP 按上面提示在 Claude Code 里装。"
