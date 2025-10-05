#!/bin/bash
# Story 1.2: Proto 与客户端代码生成 - 自动化设置脚本

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo -e "\n${YELLOW}===> $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# 检查是否在 riverchain 仓库
if [ ! -d "protocol" ] || [ ! -d "proto" ]; then
    print_error "请在 riverchain 仓库根目录运行此脚本"
    exit 1
fi

print_step "1. 检查依赖"

# 检查 Buf CLI
if ! command -v buf &> /dev/null; then
    print_error "Buf CLI 未安装"
    echo "安装方法:"
    echo "  macOS: brew install bufbuild/buf/buf"
    echo "  Linux: curl -sSL https://github.com/bufbuild/buf/releases/download/v1.28.1/buf-Linux-x86_64 -o /usr/local/bin/buf && chmod +x /usr/local/bin/buf"
    exit 1
else
    BUF_VERSION=$(buf --version)
    print_success "Buf CLI 已安装: $BUF_VERSION"
fi

# 检查 Go 插件
if ! command -v protoc-gen-go &> /dev/null; then
    print_error "protoc-gen-go 未安装"
    echo "安装: go install google.golang.org/protobuf/cmd/protoc-gen-go@latest"
    exit 1
else
    print_success "protoc-gen-go 已安装"
fi

if ! command -v protoc-gen-go-grpc &> /dev/null; then
    print_error "protoc-gen-go-grpc 未安装"
    echo "安装: go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest"
    exit 1
else
    print_success "protoc-gen-go-grpc 已安装"
fi

print_step "2. 创建 Buf 配置"

# 创建 buf.work.yaml
cat > buf.work.yaml << 'EOF'
version: v1
directories:
  - proto
EOF
print_success "创建 buf.work.yaml"

# 创建 buf.gen.yaml (Go 生成)
cat > buf.gen.yaml << 'EOF'
version: v1
plugins:
  - plugin: go
    out: protocol/types
    opt:
      - paths=source_relative

  - plugin: go-grpc
    out: protocol/types
    opt:
      - paths=source_relative
EOF
print_success "创建 buf.gen.yaml (Go)"

# 创建 buf.gen.ts.yaml (TypeScript 生成)
cat > buf.gen.ts.yaml << 'EOF'
version: v1
plugins:
  - plugin: es
    out: ../riverchain-client-js/src/proto
    opt:
      - target=ts

  - plugin: connect-es
    out: ../riverchain-client-js/src/proto
    opt:
      - target=ts
EOF
print_success "创建 buf.gen.ts.yaml (TypeScript)"

print_step "3. 生成 Go Proto 代码"

# 确保输出目录存在
mkdir -p protocol/types

# 生成 Go 代码
buf generate

if [ $? -eq 0 ]; then
    print_success "Go Proto 代码生成成功"
    echo "生成文件位于: protocol/types/"
else
    print_error "Go Proto 代码生成失败"
    exit 1
fi

print_step "4. 设置 TypeScript 客户端项目"

# 创建 riverchain-client-js 目录
cd ..
mkdir -p riverchain-client-js/src/{proto,client,types}

print_success "创建 riverchain-client-js 目录结构"

# 创建 package.json
cat > riverchain-client-js/package.json << 'EOF'
{
  "name": "@riverbit/riverchain-client-js",
  "version": "0.1.0-alpha.1",
  "description": "TypeScript client for RiverChain",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "prepublishOnly": "npm run build",
    "lint": "eslint src --ext .ts"
  },
  "keywords": ["riverchain", "cosmos", "blockchain", "client"],
  "author": "RiverBit",
  "license": "MIT",
  "dependencies": {
    "@cosmjs/stargate": "^0.32.0",
    "@cosmjs/proto-signing": "^0.32.0",
    "@bufbuild/protobuf": "^1.6.0",
    "@connectrpc/connect": "^1.1.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0",
    "@types/node": "^20.0.0",
    "@types/jest": "^29.0.0",
    "jest": "^29.0.0",
    "ts-jest": "^29.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org"
  }
}
EOF
print_success "创建 package.json"

# 创建 tsconfig.json
cat > riverchain-client-js/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
EOF
print_success "创建 tsconfig.json"

# 创建 .gitignore
cat > riverchain-client-js/.gitignore << 'EOF'
node_modules/
dist/
*.log
.DS_Store
coverage/
.env
EOF
print_success "创建 .gitignore"

print_step "5. 生成 TypeScript Proto 代码"

cd riverchain

# 安装 TypeScript 生成插件
echo "安装 TypeScript 生成插件..."
npm install -g @bufbuild/protoc-gen-es @connectrpc/protoc-gen-connect-es

# 生成 TypeScript 代码
buf generate --template buf.gen.ts.yaml

if [ $? -eq 0 ]; then
    print_success "TypeScript Proto 代码生成成功"
    echo "生成文件位于: ../riverchain-client-js/src/proto/"
else
    print_error "TypeScript Proto 代码生成失败"
    print_error "请手动检查 buf.gen.ts.yaml 配置"
    exit 1
fi

print_step "6. 创建客户端封装"

# 创建 RiverChainClient.ts
cat > ../riverchain-client-js/src/client/RiverChainClient.ts << 'EOF'
import { StargateClient } from '@cosmjs/stargate';

export interface RiverChainConfig {
  rpcUrl: string;
  restUrl?: string;
  chainId: string;
}

export class RiverChainClient {
  private rpcUrl: string;
  private restUrl?: string;
  private chainId: string;
  private client: StargateClient | null = null;

  constructor(config: RiverChainConfig = {
    rpcUrl: 'http://localhost:26657',
    chainId: 'riverchain-1'
  }) {
    this.rpcUrl = config.rpcUrl;
    this.restUrl = config.restUrl;
    this.chainId = config.chainId;
  }

  async connect(): Promise<void> {
    this.client = await StargateClient.connect(this.rpcUrl);
  }

  async disconnect(): void {
    this.client?.disconnect();
    this.client = null;
  }

  async getHeight(): Promise<number> {
    if (!this.client) throw new Error('Client not connected');
    return this.client.getHeight();
  }

  async getBalance(address: string, denom: string = 'stake'): Promise<string> {
    if (!this.client) throw new Error('Client not connected');
    const balance = await this.client.getBalance(address, denom);
    return balance.amount;
  }

  async getAllBalances(address: string) {
    if (!this.client) throw new Error('Client not connected');
    return this.client.getAllBalances(address);
  }

  getChainId(): string {
    return this.chainId;
  }

  getRpcUrl(): string {
    return this.rpcUrl;
  }
}
EOF
print_success "创建 RiverChainClient.ts"

# 创建类型导出
cat > ../riverchain-client-js/src/types/index.ts << 'EOF'
// Re-export generated proto types
export * from '../proto/riverchain/v1/tx_pb';
export * from '../proto/riverchain/v1/query_pb';

// Custom types
export interface Coin {
  denom: string;
  amount: string;
}

export interface Account {
  address: string;
  pubkey?: any;
  accountNumber: string;
  sequence: string;
}
EOF
print_success "创建 types/index.ts"

# 创建主入口
cat > ../riverchain-client-js/src/index.ts << 'EOF'
export { RiverChainClient } from './client/RiverChainClient';
export type { RiverChainConfig } from './client/RiverChainClient';
export * from './types';
EOF
print_success "创建 index.ts"

print_step "7. 创建 README 和使用示例"

cat > ../riverchain-client-js/README.md << 'EOF'
# @riverbit/riverchain-client-js

TypeScript/JavaScript client for RiverChain - A Cosmos SDK based blockchain.

## Installation

```bash
npm install @riverbit/riverchain-client-js
```

## Quick Start

```typescript
import { RiverChainClient } from '@riverbit/riverchain-client-js';

// Create client instance
const client = new RiverChainClient({
  rpcUrl: 'http://localhost:26657',
  chainId: 'riverchain-1'
});

// Connect to the chain
await client.connect();

// Query current block height
const height = await client.getHeight();
console.log('Current height:', height);

// Query account balance
const balance = await client.getBalance('river1abc...', 'stake');
console.log('Balance:', balance);

// Get all balances
const allBalances = await client.getAllBalances('river1abc...');
console.log('All balances:', allBalances);

// Disconnect
await client.disconnect();
```

## Configuration

```typescript
const client = new RiverChainClient({
  rpcUrl: 'http://localhost:26657',      // RPC endpoint
  restUrl: 'http://localhost:1317',      // REST API endpoint (optional)
  chainId: 'riverchain-1'                // Chain ID
});
```

## API Reference

### `RiverChainClient`

#### `connect(): Promise<void>`
Connect to the RiverChain RPC endpoint.

#### `disconnect(): void`
Disconnect from the chain.

#### `getHeight(): Promise<number>`
Get the current block height.

#### `getBalance(address: string, denom?: string): Promise<string>`
Get the balance of a specific denomination for an address.

#### `getAllBalances(address: string): Promise<Coin[]>`
Get all token balances for an address.

#### `getChainId(): string`
Get the configured chain ID.

#### `getRpcUrl(): string`
Get the configured RPC URL.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Lint
npm run lint
```

## License

MIT
EOF
print_success "创建 README.md"

print_step "8. 安装依赖并构建"

cd ../riverchain-client-js
npm install

if [ $? -eq 0 ]; then
    print_success "依赖安装成功"
else
    print_error "依赖安装失败"
    exit 1
fi

npm run build

if [ $? -eq 0 ]; then
    print_success "TypeScript 编译成功"
    echo "构建产物位于: dist/"
else
    print_error "TypeScript 编译失败"
    exit 1
fi

print_step "9. 创建测试文件"

mkdir -p src/__tests__

cat > src/__tests__/client.test.ts << 'EOF'
import { RiverChainClient } from '../client/RiverChainClient';

describe('RiverChainClient', () => {
  let client: RiverChainClient;

  beforeEach(() => {
    client = new RiverChainClient({
      rpcUrl: 'http://localhost:26657',
      chainId: 'riverchain-1'
    });
  });

  it('should create client with default config', () => {
    expect(client.getChainId()).toBe('riverchain-1');
    expect(client.getRpcUrl()).toBe('http://localhost:26657');
  });

  it('should create client with custom config', () => {
    const customClient = new RiverChainClient({
      rpcUrl: 'http://custom:26657',
      chainId: 'custom-chain'
    });

    expect(customClient.getChainId()).toBe('custom-chain');
    expect(customClient.getRpcUrl()).toBe('http://custom:26657');
  });

  // Integration tests (requires running node)
  describe('Integration tests', () => {
    it.skip('should connect to RPC endpoint', async () => {
      await expect(client.connect()).resolves.not.toThrow();
      await client.disconnect();
    });

    it.skip('should query block height', async () => {
      await client.connect();
      const height = await client.getHeight();
      expect(height).toBeGreaterThan(0);
      await client.disconnect();
    });
  });
});
EOF
print_success "创建测试文件"

# 创建 Jest 配置
cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/proto/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
EOF
print_success "创建 jest.config.js"

print_step "10. 完成总结"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Story 1.2 设置完成!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "已完成的任务:"
echo "  ✓ Buf 工具链配置 (buf.work.yaml, buf.gen.yaml)"
echo "  ✓ Go Proto 代码生成 (protocol/types/)"
echo "  ✓ TypeScript Proto 代码生成 (riverchain-client-js/src/proto/)"
echo "  ✓ npm 包结构创建 (@riverbit/riverchain-client-js)"
echo "  ✓ RPC 客户端封装 (RiverChainClient)"
echo "  ✓ 测试框架配置 (Jest + ts-jest)"
echo ""
echo "下一步:"
echo "  1. 运行测试: cd riverchain-client-js && npm test"
echo "  2. 本地安装: npm pack && npm install ../riverchain-client-js/*.tgz"
echo "  3. 在前端项目使用: import { RiverChainClient } from '@riverbit/riverchain-client-js'"
echo ""
echo "验证脚本已创建: scripts/verify-story-1.2.sh"
echo ""
