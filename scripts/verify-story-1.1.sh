#!/bin/bash
# RiverChain Story 1.1 验证脚本
# 自动验证 Fork 并配置 dYdX v4-chain 的所有验收标准

set -e  # 遇到错误立即退出

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 验证结果
PASS=0
FAIL=0

print_header() {
    echo -e "\n${YELLOW}========================================${NC}"
    echo -e "${YELLOW}  $1${NC}"
    echo -e "${YELLOW}========================================${NC}"
}

print_pass() {
    echo -e "${GREEN}✓ $1${NC}"
    ((PASS++))
}

print_fail() {
    echo -e "${RED}✗ $1${NC}"
    ((FAIL++))
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# ========================================
# AC 1: 验证 GitHub Fork
# ========================================
print_header "AC 1: 验证 GitHub Fork"

if git remote -v | grep -q "RiverBit-dex/riverchain"; then
    print_pass "Remote 包含 RiverBit-dex/riverchain"

    # 获取远程仓库 URL
    REMOTE_URL=$(git remote -v | grep fetch | awk '{print $2}')
    print_info "Remote URL: $REMOTE_URL"
else
    print_fail "Remote 不包含 RiverBit-dex/riverchain"
    print_info "当前 Remote:"
    git remote -v
fi

# 检查分支
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" == "feature/chain-identity-config" ]]; then
    print_pass "当前分支: feature/chain-identity-config"
else
    print_fail "当前分支不是 feature/chain-identity-config (实际: $CURRENT_BRANCH)"
fi

# ========================================
# AC 2: 验证链身份配置
# ========================================
print_header "AC 2: 验证链身份配置"

# 检查 constants.go
if [ -f "protocol/app/constants/constants.go" ]; then
    if grep -q 'ChainId.*=.*"riverchain-1"' protocol/app/constants/constants.go; then
        print_pass "Chain ID 已更新为 'riverchain-1'"
    else
        print_fail "Chain ID 未正确更新"
        print_info "当前值:"
        grep "ChainId" protocol/app/constants/constants.go || echo "未找到 ChainId"
    fi

    if grep -q 'AppName.*=.*"riverchain"' protocol/app/constants/constants.go; then
        print_pass "App Name 已更新为 'riverchain'"
    else
        print_fail "App Name 未正确更新"
        print_info "当前值:"
        grep "AppName" protocol/app/constants/constants.go || echo "未找到 AppName"
    fi
else
    print_fail "protocol/app/constants/constants.go 文件不存在"
fi

# 检查 config.go
if [ -f "protocol/app/config/config.go" ]; then
    print_pass "config.go 文件存在"

    # 检查网络参数 (如果有具体值要求)
    if grep -qi "MinGasPrices\|MinCommissionRate" protocol/app/config/config.go; then
        print_pass "网络参数配置存在"
    else
        print_info "网络参数未明确配置 (可能使用默认值)"
    fi
else
    print_fail "protocol/app/config/config.go 文件不存在"
fi

# 检查 module_accounts.go
if [ -f "protocol/app/module_accounts.go" ]; then
    print_pass "module_accounts.go 文件存在"

    # 验证关键模块账户
    REQUIRED_MODULES=("fee_collector" "distribution" "bonded_tokens_pool" "not_bonded_tokens_pool")
    for module in "${REQUIRED_MODULES[@]}"; do
        if grep -q "$module" protocol/app/module_accounts.go; then
            print_pass "模块账户 '$module' 存在"
        else
            print_fail "模块账户 '$module' 未找到"
        fi
    done
else
    print_fail "protocol/app/module_accounts.go 文件不存在"
fi

# ========================================
# AC 3: 验证编译成功
# ========================================
print_header "AC 3: 验证编译成功"

# 检查 Go 版本
GO_VERSION=$(go version 2>/dev/null | awk '{print $3}')
if [ -n "$GO_VERSION" ]; then
    print_pass "Go 已安装: $GO_VERSION"

    # 检查版本是否 >= 1.21
    GO_MINOR=$(echo $GO_VERSION | sed 's/go1\.\([0-9]*\).*/\1/')
    if [ "$GO_MINOR" -ge 21 ]; then
        print_pass "Go 版本符合要求 (>= 1.21)"
    else
        print_fail "Go 版本过低 (需要 >= 1.21, 当前: $GO_VERSION)"
    fi
else
    print_fail "Go 未安装"
fi

# 检查二进制文件是否存在
if command -v riverchaind &> /dev/null; then
    print_pass "riverchaind 二进制文件已安装"

    # 获取版本信息
    VERSION_OUTPUT=$(riverchaind version 2>&1 || true)
    print_info "Version: $VERSION_OUTPUT"

    # 验证版本输出包含 riverchain 相关信息
    if echo "$VERSION_OUTPUT" | grep -qi "riverchain\|river"; then
        print_pass "版本输出包含 RiverChain 信息"
    else
        print_info "版本输出未明确包含 RiverChain (可能仍为 dYdX 二进制)"
    fi
else
    print_fail "riverchaind 二进制文件未找到"
    print_info "尝试编译: make install"
    print_info "或检查 \$GOPATH/bin 是否在 PATH 中"
fi

# 检查 Makefile 是否更新
if [ -f "Makefile" ]; then
    if grep -q "riverchaind" Makefile; then
        print_pass "Makefile 包含 'riverchaind'"
    else
        print_fail "Makefile 未更新为 'riverchaind'"
    fi
else
    print_fail "Makefile 文件不存在"
fi

# ========================================
# AC 4: 验证 Devnet 启动
# ========================================
print_header "AC 4: 验证 Devnet 启动"

# 检查节点配置是否初始化
if [ -d "$HOME/.riverchain" ]; then
    print_pass "节点配置目录存在: ~/.riverchain"

    # 检查创世文件
    if [ -f "$HOME/.riverchain/config/genesis.json" ]; then
        print_pass "创世文件存在"

        # 验证 chain_id
        GENESIS_CHAIN_ID=$(jq -r '.chain_id' "$HOME/.riverchain/config/genesis.json" 2>/dev/null || echo "")
        if [ "$GENESIS_CHAIN_ID" == "riverchain-1" ]; then
            print_pass "创世文件 chain_id 正确: riverchain-1"
        else
            print_fail "创世文件 chain_id 不正确 (实际: $GENESIS_CHAIN_ID)"
        fi
    else
        print_fail "创世文件不存在"
        print_info "运行: riverchaind init rivernode1 --chain-id riverchain-1"
    fi

    # 检查 gentx
    if [ -d "$HOME/.riverchain/config/gentx" ] && [ "$(ls -A $HOME/.riverchain/config/gentx)" ]; then
        print_pass "Gentx 文件存在"
    else
        print_fail "Gentx 文件不存在"
        print_info "运行: riverchaind gentx validator 100000000stake --chain-id riverchain-1"
    fi
else
    print_fail "节点配置目录不存在: ~/.riverchain"
    print_info "运行: riverchaind init rivernode1 --chain-id riverchain-1"
fi

# 检查节点是否运行
if pgrep -x "riverchaind" > /dev/null; then
    print_pass "RiverChain 节点进程正在运行"

    # 尝试查询节点状态
    if command -v riverchaind &> /dev/null; then
        STATUS=$(riverchaind status 2>&1 || echo "查询失败")

        if echo "$STATUS" | jq -e '.SyncInfo.latest_block_height' &> /dev/null; then
            BLOCK_HEIGHT=$(echo "$STATUS" | jq -r '.SyncInfo.latest_block_height')
            print_pass "节点正在生产区块,当前高度: $BLOCK_HEIGHT"

            # 验证 chain_id
            NODE_CHAIN_ID=$(echo "$STATUS" | jq -r '.NodeInfo.network')
            if [ "$NODE_CHAIN_ID" == "riverchain-1" ]; then
                print_pass "节点 chain_id 正确: riverchain-1"
            else
                print_fail "节点 chain_id 不正确 (实际: $NODE_CHAIN_ID)"
            fi
        else
            print_fail "无法查询节点状态"
            print_info "状态输出: $STATUS"
        fi
    fi
else
    print_fail "RiverChain 节点进程未运行"
    print_info "启动节点: riverchaind start"
fi

# ========================================
# 额外验证: 代码变更
# ========================================
print_header "额外验证: 代码变更"

# 检查 Git 变更
if git diff --name-only origin/main 2>/dev/null | grep -q "protocol/app\|Makefile"; then
    print_pass "检测到代码变更"

    print_info "变更的文件:"
    git diff --name-only origin/main 2>/dev/null | while read file; do
        echo "  - $file"
    done
else
    print_fail "未检测到代码变更"
    print_info "确保已提交变更: git commit -m '...'"
fi

# 检查是否有未提交的变更
if git diff --quiet; then
    print_pass "无未提交的变更"
else
    print_info "存在未提交的变更:"
    git status --short
fi

# ========================================
# 总结
# ========================================
print_header "验证总结"

echo -e "${GREEN}通过: $PASS${NC}"
echo -e "${RED}失败: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ 所有验收标准通过!${NC}"
    echo -e "${GREEN}Story 1.1 可以标记为 'Ready for Review'${NC}"
    exit 0
else
    echo -e "${RED}❌ 部分验收标准未通过${NC}"
    echo -e "${YELLOW}请查看上述失败项并修复${NC}"
    exit 1
fi
