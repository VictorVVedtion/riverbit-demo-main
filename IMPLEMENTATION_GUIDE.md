# RiverBit 实施指南

**生成时间**: 2025-10-04
**当前阶段**: Story 1.1 - Fork并配置dYdX v4-chain

---

## 📋 **Story 1.1 完整实施步骤**

### 前置条件检查

```bash
# 1. 检查 Go 版本 (需要 1.21+)
go version
# 预期输出: go version go1.21.x ...

# 2. 检查 make 工具
make --version

# 3. 检查 gcc (部分依赖需要)
gcc --version
```

---

### 步骤 1: Fork 并克隆仓库

#### 1.1 GitHub Fork (手动操作)
1. 访问: https://github.com/dydxprotocol/v4-chain
2. 点击右上角 "Fork" 按钮
3. 选择目标组织: `RiverBit-dex`
4. 仓库名称改为: `riverchain`
5. 点击 "Create fork"

#### 1.2 克隆到本地
```bash
# 克隆 fork 的仓库
git clone https://github.com/RiverBit-dex/riverchain.git

# 进入目录
cd riverchain

# 创建开发分支
git checkout -b feature/chain-identity-config
```

---

### 步骤 2: 修改链身份配置

#### 2.1 更新 constants.go
```bash
# 编辑文件
vim protocol/app/constants/constants.go
```

**修改内容**:
```go
// 找到并替换以下内容
const (
    // 原值: ChainId = "dydx-testnet-4"
    ChainId = "riverchain-1"

    // 原值: AppName = "dydx"
    AppName = "riverchain"
)
```

#### 2.2 更新 config.go
```bash
vim protocol/app/config/config.go
```

**修改内容**:
```go
// 找到配置部分并更新
const (
    MinGasPrices     = "25000000000stake"  // 最低 Gas 价格
    MinCommissionRate = "0.05"              // 最低佣金率 5%
)

// 如果是 Devnet,设置最大验证节点数
MaxValidators = 1  // 生产环境改为 4 或更多
```

#### 2.3 验证 module_accounts.go (无需修改)
```bash
cat protocol/app/module_accounts.go | grep -A 5 "ModuleAccountPerms"
```

预期看到:
- fee_collector
- distribution
- bonded_tokens_pool
- not_bonded_tokens_pool

---

### 步骤 3: 更新二进制文件名称

#### 3.1 修改 Makefile
```bash
vim Makefile
```

查找所有 `dydxprotocolhd` 并替换为 `riverchaind`:
```bash
# 使用 sed 批量替换 (macOS)
sed -i '' 's/dydxprotocolhd/riverchaind/g' Makefile

# 或 Linux
sed -i 's/dydxprotocolhd/riverchaind/g' Makefile
```

#### 3.2 修改 main.go
```bash
vim protocol/cmd/dydxprotocolhd/main.go
```

更新应用名称引用:
```go
// 确保使用 constants.AppName
appName := constants.AppName // "riverchain"
```

---

### 步骤 4: 编译与验证

#### 4.1 安装依赖
```bash
# 进入 protocol 目录
cd protocol

# 下载 Go 模块
go mod download

# 验证依赖完整性
go mod verify
```

#### 4.2 编译二进制文件
```bash
# 编译
make install

# 验证安装 (应该输出 riverchain 相关信息)
riverchaind version

# 预期输出示例:
# riverchain: v4.x.x
# git commit: xxxxx
# go version: go1.21.x
```

如果遇到 "command not found",检查 `$GOPATH/bin` 是否在 PATH 中:
```bash
export PATH=$PATH:$(go env GOPATH)/bin
riverchaind version
```

---

### 步骤 5: 初始化 Devnet 单节点

#### 5.1 初始化节点配置
```bash
# 回到项目根目录
cd ..

# 初始化节点 (会在 ~/.riverchain 创建配置)
riverchaind init rivernode1 --chain-id riverchain-1
```

#### 5.2 创建验证节点密钥
```bash
# 创建密钥 (记下助记词!)
riverchaind keys add validator

# 输出示例:
# - name: validator
#   type: local
#   address: river1abc...
#   pubkey: '{"@type":"/cosmos.crypto.secp256k1.PubKey","key":"..."}'
#   mnemonic: "your twelve word mnemonic phrase here..."
```

**重要**: 保存好助记词!

#### 5.3 添加创世账户
```bash
# 给验证节点账户分配初始代币 (100,000 STAKE)
riverchaind add-genesis-account validator 100000000000stake
```

#### 5.4 创建创世交易
```bash
# 创建 gentx (质押 100 STAKE 成为验证节点)
riverchaind gentx validator 100000000stake --chain-id riverchain-1

# 收集所有 gentx
riverchaind collect-gentxs
```

#### 5.5 验证创世文件
```bash
# 验证创世文件格式正确
riverchaind validate-genesis

# 预期输出: File at ... is a valid genesis file
```

#### 5.6 启动节点
```bash
# 启动节点 (前台运行)
riverchaind start

# 或后台运行
riverchaind start > riverchain.log 2>&1 &
```

---

### 步骤 6: 验证节点运行

#### 6.1 检查区块生产
```bash
# 查看日志 (如果后台运行)
tail -f riverchain.log

# 或使用 journalctl (如果是 systemd 服务)
journalctl -u riverchain -f
```

**成功标志**:
```
committed state                    module=state height=1 ...
committed state                    module=state height=2 ...
committed state                    module=state height=3 ...
```

#### 6.2 查询链信息
```bash
# 查询区块 1
riverchaind query block 1

# 验证 chain_id
# 输出应包含: "chain_id": "riverchain-1"

# 查询账户余额
riverchaind query bank balances $(riverchaind keys show validator -a)
```

#### 6.3 性能验证
```bash
# 检查区块时间 (应该稳定在 1-3 秒)
watch -n 1 'riverchaind status | jq .SyncInfo.latest_block_height'
```

---

### 步骤 7: 代码提交

#### 7.1 提交变更
```bash
# 回到项目根目录
cd /path/to/riverchain

# 查看变更
git status

# 添加修改的文件
git add protocol/app/constants/constants.go
git add protocol/app/config/config.go
git add Makefile
git add protocol/cmd/dydxprotocolhd/main.go

# 提交
git commit -m "feat: configure RiverChain identity

- Update Chain ID to riverchain-1
- Update App Name to riverchain
- Configure network parameters for Devnet
- Rename binary from dydxprotocolhd to riverchaind

Refs: Story 1.1"
```

#### 7.2 推送到远程
```bash
# 推送到 GitHub
git push origin feature/chain-identity-config
```

#### 7.3 创建 Pull Request (可选)
访问 GitHub 仓库创建 PR 到 `main` 分支

---

### 步骤 8: 文档更新

创建 `RIVERCHAIN_SETUP.md`:
```bash
cat > RIVERCHAIN_SETUP.md << 'EOF'
# RiverChain Setup Guide

## 与 dYdX v4 的差异

| 配置项 | dYdX v4 | RiverChain |
|--------|---------|------------|
| Chain ID | dydx-testnet-4 | riverchain-1 |
| App Name | dydx | riverchain |
| Binary | dydxprotocolhd | riverchaind |

## 快速启动

1. 编译: `make install`
2. 初始化: `riverchaind init rivernode1 --chain-id riverchain-1`
3. 创建密钥: `riverchaind keys add validator`
4. 添加创世账户: `riverchaind add-genesis-account validator 100000000000stake`
5. 创建 gentx: `riverchaind gentx validator 100000000stake --chain-id riverchain-1`
6. 收集 gentx: `riverchaind collect-gentxs`
7. 启动: `riverchaind start`

## 验证

```bash
# 查询区块
riverchaind query block 1

# 检查 chain_id
riverchaind status | jq .NodeInfo.network
# 输出应为: "riverchain-1"
```
EOF

git add RIVERCHAIN_SETUP.md
git commit -m "docs: add RiverChain setup guide"
git push origin feature/chain-identity-config
```

---

## ✅ **完成标志**

所有步骤完成后,您应该看到:

1. ✅ GitHub 上有 `RiverBit-dex/riverchain` 仓库
2. ✅ `riverchaind version` 输出正确信息
3. ✅ 节点日志显示区块持续生产
4. ✅ `riverchaind query block 1` 返回创世区块,包含 `"chain_id": "riverchain-1"`
5. ✅ 代码已推送到 `feature/chain-identity-config` 分支

---

## 🔧 **故障排查**

### 问题 1: 编译失败
```bash
# 清理构建缓存
make clean
go clean -cache

# 重新编译
make install
```

### 问题 2: 节点无法启动
```bash
# 检查端口占用
lsof -i :26656  # P2P
lsof -i :26657  # RPC
lsof -i :1317   # REST

# 清理旧数据 (谨慎!)
rm -rf ~/.riverchain
```

### 问题 3: 创世文件错误
```bash
# 重新生成创世文件
rm -rf ~/.riverchain
riverchaind init rivernode1 --chain-id riverchain-1
# 重复步骤 5.2-5.5
```

---

## 📝 **下一步**

Story 1.1 完成后,继续:
- **Story 1.2**: Proto 与客户端代码生成
- **Story 1.3**: 业务流模块参数占位
- **Story 1.4**: Streaming 与 Indexer 基础配置
- **Story 1.5**: 前端骨架与钱包连接
- **Story 1.6**: Arbitrum 测试网适配占位

---

**需要帮助?** 查看 Story 1.1 文档: `docs/stories/1.1.fork-dydx-v4-chain.md`

---

## 📋 **Story 1.2 完整实施步骤**

### 前置条件
- ✅ Story 1.1 完成 (RiverChain 已配置)
- ✅ riverchain 仓库可访问

### 一键执行 (推荐)

```bash
# 1. 进入 riverchain 仓库
cd /path/to/riverchain

# 2. 运行自动化设置脚本
/path/to/riverbit-demo-main/scripts/setup-proto-generation.sh

# 脚本将自动:
# - 检查依赖 (Buf CLI, protoc-gen-go, etc.)
# - 创建 Buf 配置文件
# - 生成 Go Proto 代码
# - 生成 TypeScript Proto 代码
# - 创建 npm 包结构
# - 实现 RPC 客户端封装
# - 配置测试框架
# - 构建并验证
```

### 手动执行步骤

如果需要手动执行或调试:

#### 1. 安装依赖
```bash
# Buf CLI
brew install bufbuild/buf/buf  # macOS
# 或
curl -sSL https://github.com/bufbuild/buf/releases/download/v1.28.1/buf-Linux-x86_64 \
  -o /usr/local/bin/buf && chmod +x /usr/local/bin/buf

# Go 插件
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest

# TypeScript 插件
npm install -g @bufbuild/protoc-gen-es @connectrpc/protoc-gen-connect-es
```

#### 2. 生成 Proto 代码
```bash
cd riverchain

# 生成 Go 代码
buf generate

# 生成 TypeScript 代码
buf generate --template buf.gen.ts.yaml
```

#### 3. 构建 npm 包
```bash
cd ../riverchain-client-js

# 安装依赖
npm install

# 构建
npm run build

# 运行测试
npm test
```

### 验证

```bash
# 回到 riverchain 仓库
cd /path/to/riverchain

# 运行验证脚本
/path/to/riverbit-demo-main/scripts/verify-story-1.2.sh
```

### 使用客户端

```typescript
// 在前端项目中
import { RiverChainClient } from '@riverbit/riverchain-client-js';

const client = new RiverChainClient({
  rpcUrl: 'http://localhost:26657',
  chainId: 'riverchain-1'
});

await client.connect();
const height = await client.getHeight();
console.log('Block height:', height);
```

### 故障排查

#### 问题 1: Buf 命令未找到
```bash
# 检查安装
which buf

# 重新安装
brew reinstall bufbuild/buf/buf
```

#### 问题 2: TypeScript 生成失败
```bash
# 检查插件
which protoc-gen-es

# 重新安装
npm install -g @bufbuild/protoc-gen-es
```

#### 问题 3: npm 构建失败
```bash
# 清理并重新构建
cd riverchain-client-js
rm -rf node_modules dist
npm install
npm run build
```

---

**Story 1.2 完成后,继续 Story 1.3!**
