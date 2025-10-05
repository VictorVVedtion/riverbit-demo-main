# Story 1.1 实施记录

## 状态
✅ **配置完成** | ⏸️ **编译待环境就绪**

## 实施时间
2025-10-04

## 已完成配置

### 1. 克隆 dYdX v4 链代码
```bash
cd /Users/victor/Desktop
git clone https://github.com/dydxprotocol/v4-chain.git riverchain
```

**位置**: `/Users/victor/Desktop/riverchain`

### 2. 修改 App Name
**文件**: `riverchain/protocol/app/constants/constants.go`

```go
const (
	AppName       = "riverchain"          // was: "dydxprotocol"
	AppDaemonName = AppName + "d"         // 自动变为 "riverchaind"
	ServiceName   = "validator"
)
```

### 3. 修改 Chain ID
**文件**: `riverchain/protocol/testing/testnet/genesis.json`

```json
{
  "genesis_time": "2025-10-04T00:00:00Z",
  "chain_id": "riverchain-1",           // was: "dydx-testnet-4"
  "initial_height": "1",
  ...
}
```

### 4. 重命名二进制源码目录
```bash
cd riverchain/protocol/cmd
mv dydxprotocold riverchaind
```

**结果**: `cmd/riverchaind/`

### 5. 更新 Makefile
**文件**: `riverchain/protocol/Makefile`

批量替换:
- `dydxprotocol` → `riverchain`
- `dydxprotocold` → `riverchaind`

**关键更新**:
```makefile
ldflags = -X github.com/cosmos/cosmos-sdk/version.Name=riverchain \
		  -X github.com/cosmos/cosmos-sdk/version.AppName=riverchaind \
		  ...

install: go.sum
	go install -mod=readonly $(BUILD_FLAGS) ./cmd/riverchaind

build: go.sum
	go build -mod=readonly $(BUILD_FLAGS) -o build/riverchaind ./cmd/riverchaind
```

## 待完成 (环境依赖)

### 编译二进制
⚠️ **阻塞原因**: macOS 需要同意 Xcode license

**解决方案**:
```bash
# 方案 1: macOS
sudo xcodebuild -license

# 方案 2: Linux/Docker
cd riverchain/protocol
make build
```

**预期输出**:
```
build/riverchaind
```

### 验证编译
```bash
./build/riverchaind version
# 预期: riverchain vX.X.X
```

### 初始化测试网
```bash
./build/riverchaind init test-node --chain-id riverchain-1
```

## 配置验证清单

| 项目 | 状态 | 文件/命令 |
|------|------|-----------|
| ✅ App Name 修改 | 完成 | `protocol/app/constants/constants.go:4` |
| ✅ Chain ID 修改 | 完成 | `protocol/testing/testnet/genesis.json:3` |
| ✅ 二进制目录重命名 | 完成 | `protocol/cmd/riverchaind/` |
| ✅ Makefile 更新 | 完成 | `protocol/Makefile` |
| ⏸️ 编译验证 | 待环境 | `make build` |
| ⏸️ 运行验证 | 待编译 | `./build/riverchaind version` |

## 下一步

1. **Story 1.2**: 配置 Proto 生成和客户端代码
   - 配置 Buf CLI
   - 生成 Go/TypeScript 客户端

2. **Story 1.3**: 配置业务模块参数
   - x/feetiers
   - x/affiliates
   - x/revshare

## 注意事项

- ✅ 保持原有 Go module path (`github.com/dydxprotocol/v4-chain/protocol`)
  - 避免大规模导入路径修改
  - 编译时通过 `-ldflags` 注入新名称

- ✅ genesis.json Chain ID 已更新为 `riverchain-1`

- ✅ 所有 Makefile 目标已更新 (`riverchaind`)

## 实施者
BMad Agent (YOLO Mode)

## 验证时间
待环境就绪后验证
