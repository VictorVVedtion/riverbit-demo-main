#!/bin/bash
# Story 1.2 验证脚本

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

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

# AC 1: Buf 配置文件
print_header "AC 1: 验证 Buf 配置文件"

if [ -f "buf.work.yaml" ]; then
    print_pass "buf.work.yaml 存在"
    if grep -q "proto" buf.work.yaml; then
        print_pass "buf.work.yaml 配置 proto 目录"
    else
        print_fail "buf.work.yaml 未配置 proto 目录"
    fi
else
    print_fail "buf.work.yaml 不存在"
fi

if [ -f "buf.gen.yaml" ]; then
    print_pass "buf.gen.yaml 存在"
    if grep -q "plugin: go" buf.gen.yaml; then
        print_pass "buf.gen.yaml 配置 Go 生成"
    fi
else
    print_fail "buf.gen.yaml 不存在"
fi

# AC 2: Go Proto 代码
print_header "AC 2: 验证 Go Proto 代码生成"

if [ -d "protocol/types" ]; then
    print_pass "protocol/types 目录存在"

    PB_FILES=$(find protocol/types -name "*.pb.go" 2>/dev/null | wc -l)
    if [ "$PB_FILES" -gt 0 ]; then
        print_pass "找到 $PB_FILES 个 .pb.go 文件"
    else
        print_fail "未找到 .pb.go 文件"
    fi

    GRPC_FILES=$(find protocol/types -name "*_grpc.pb.go" 2>/dev/null | wc -l)
    if [ "$GRPC_FILES" -gt 0 ]; then
        print_pass "找到 $GRPC_FILES 个 gRPC 文件"
    else
        print_fail "未找到 gRPC 文件"
    fi
else
    print_fail "protocol/types 目录不存在"
fi

# AC 3: TypeScript 代码
print_header "AC 3: 验证 TypeScript Proto 代码生成"

if [ -d "../riverchain-client-js/src/proto" ]; then
    print_pass "riverchain-client-js/src/proto 目录存在"

    TS_FILES=$(find ../riverchain-client-js/src/proto -name "*.ts" 2>/dev/null | wc -l)
    if [ "$TS_FILES" -gt 0 ]; then
        print_pass "找到 $TS_FILES 个 TypeScript 文件"
    else
        print_fail "未找到 TypeScript 文件"
    fi
else
    print_fail "riverchain-client-js/src/proto 目录不存在"
fi

# AC 4: npm 包结构
print_header "AC 4: 验证 npm 包结构"

if [ -f "../riverchain-client-js/package.json" ]; then
    print_pass "package.json 存在"

    PKG_NAME=$(jq -r '.name' ../riverchain-client-js/package.json 2>/dev/null)
    if [ "$PKG_NAME" == "@riverbit/riverchain-client-js" ]; then
        print_pass "包名正确: $PKG_NAME"
    else
        print_fail "包名不正确: $PKG_NAME"
    fi

    PKG_VERSION=$(jq -r '.version' ../riverchain-client-js/package.json 2>/dev/null)
    print_info "版本: $PKG_VERSION"

    # 检查依赖
    if jq -e '.dependencies["@cosmjs/stargate"]' ../riverchain-client-js/package.json &>/dev/null; then
        print_pass "包含 @cosmjs/stargate 依赖"
    else
        print_fail "缺少 @cosmjs/stargate 依赖"
    fi
else
    print_fail "package.json 不存在"
fi

if [ -f "../riverchain-client-js/tsconfig.json" ]; then
    print_pass "tsconfig.json 存在"
else
    print_fail "tsconfig.json 不存在"
fi

# AC 5: 客户端封装
print_header "AC 5: 验证客户端封装"

if [ -f "../riverchain-client-js/src/client/RiverChainClient.ts" ]; then
    print_pass "RiverChainClient.ts 存在"

    if grep -q "class RiverChainClient" ../riverchain-client-js/src/client/RiverChainClient.ts; then
        print_pass "RiverChainClient 类定义存在"
    fi

    if grep -q "async connect()" ../riverchain-client-js/src/client/RiverChainClient.ts; then
        print_pass "connect() 方法存在"
    fi

    if grep -q "getBalance\|queryBalance" ../riverchain-client-js/src/client/RiverChainClient.ts; then
        print_pass "查询方法存在"
    fi
else
    print_fail "RiverChainClient.ts 不存在"
fi

if [ -f "../riverchain-client-js/src/types/index.ts" ]; then
    print_pass "types/index.ts 存在"
else
    print_fail "types/index.ts 不存在"
fi

if [ -f "../riverchain-client-js/src/index.ts" ]; then
    print_pass "主入口 index.ts 存在"

    if grep -q "export.*RiverChainClient" ../riverchain-client-js/src/index.ts; then
        print_pass "RiverChainClient 已导出"
    fi
else
    print_fail "index.ts 不存在"
fi

# 构建验证
print_header "额外验证: 构建状态"

if [ -d "../riverchain-client-js/node_modules" ]; then
    print_pass "依赖已安装 (node_modules 存在)"
else
    print_fail "依赖未安装"
    print_info "运行: cd ../riverchain-client-js && npm install"
fi

if [ -d "../riverchain-client-js/dist" ]; then
    print_pass "构建产物存在 (dist 目录)"

    if [ -f "../riverchain-client-js/dist/index.js" ]; then
        print_pass "主入口已编译: dist/index.js"
    fi

    if [ -f "../riverchain-client-js/dist/index.d.ts" ]; then
        print_pass "类型声明已生成: dist/index.d.ts"
    fi
else
    print_fail "构建产物不存在"
    print_info "运行: cd ../riverchain-client-js && npm run build"
fi

# 测试验证
print_header "额外验证: 测试配置"

if [ -f "../riverchain-client-js/jest.config.js" ]; then
    print_pass "Jest 配置存在"
else
    print_fail "Jest 配置不存在"
fi

if [ -d "../riverchain-client-js/src/__tests__" ]; then
    print_pass "测试目录存在"

    TEST_FILES=$(find ../riverchain-client-js/src/__tests__ -name "*.test.ts" 2>/dev/null | wc -l)
    if [ "$TEST_FILES" -gt 0 ]; then
        print_pass "找到 $TEST_FILES 个测试文件"
    else
        print_fail "未找到测试文件"
    fi
else
    print_fail "测试目录不存在"
fi

# 文档验证
print_header "额外验证: 文档"

if [ -f "../riverchain-client-js/README.md" ]; then
    print_pass "README.md 存在"

    if grep -q "Installation" ../riverchain-client-js/README.md; then
        print_pass "包含安装说明"
    fi

    if grep -q "Quick Start\|Usage" ../riverchain-client-js/README.md; then
        print_pass "包含使用示例"
    fi
else
    print_fail "README.md 不存在"
fi

# 总结
print_header "验证总结"

echo -e "${GREEN}通过: $PASS${NC}"
echo -e "${RED}失败: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ 所有验收标准通过!${NC}"
    echo -e "${GREEN}Story 1.2 可以标记为 'Ready for Review'${NC}"
    echo ""
    echo "建议的后续步骤:"
    echo "  1. 运行测试: cd ../riverchain-client-js && npm test"
    echo "  2. 本地测试安装: npm pack"
    echo "  3. 在前端项目中集成测试"
    exit 0
else
    echo -e "${RED}❌ 部分验收标准未通过${NC}"
    echo -e "${YELLOW}请查看上述失败项并修复${NC}"
    echo ""
    echo "常见问题:"
    echo "  - 如果 Proto 文件未生成,运行: buf generate"
    echo "  - 如果依赖未安装,运行: cd ../riverchain-client-js && npm install"
    echo "  - 如果构建失败,检查 TypeScript 错误"
    exit 1
fi
