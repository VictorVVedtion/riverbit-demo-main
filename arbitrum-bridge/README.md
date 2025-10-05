# RiverBit Bridge Adapter

Arbitrum Sepolia <-> RiverChain USDC 跨链桥适配器合约

## 功能

- ✅ USDC 从 Arbitrum Sepolia 存款到 RiverChain
- ✅ USDC 从 RiverChain 提取到 Arbitrum Sepolia
- ✅ 最小金额限制 (10 USDC)
- ✅ 取款请求批准机制
- ✅ 暂停/恢复功能
- ✅ 紧急提取功能

## 安装

```bash
npm install
```

## 编译

```bash
npm run compile
```

## 测试

```bash
npm test
```

## 部署

### 1. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件填入:
# - PRIVATE_KEY: 部署私钥
# - USDC_ADDRESS: Arbitrum Sepolia USDC 地址
# - ARBISCAN_API_KEY: Arbiscan API Key (用于验证)
```

### 2. 部署到 Arbitrum Sepolia

```bash
npm run deploy:sepolia
```

### 3. 验证合约

```bash
npx hardhat verify --network arbitrumSepolia <合约地址> <USDC地址>
```

## 使用方式

### 存款 (Arbitrum → RiverChain)

```javascript
// 1. 授权 USDC
await usdc.approve(bridgeAddress, amount);

// 2. 存款
await bridge.depositToRiverChain(
  "river1234567890abcdefghijklmn", // RiverChain 地址
  ethers.parseUnits("100", 6)      // 100 USDC
);
```

### 取款 (RiverChain → Arbitrum)

```javascript
// 1. 在 RiverChain 发起取款 (链端操作)
riverchaind tx bridge withdraw \
  --to=0x1234...5678 \
  --amount=100000000stake \
  --from=mykey

// 2. 链端桥接服务监听并批准取款
await bridge.initiateWithdrawal(
  "river1234567890abcdefghijklmn",
  "0x1234...5678",
  ethers.parseUnits("100", 6)
);

// 3. 用户执行取款
await bridge.executeWithdrawal("river1234567890abcdefghijklmn");
```

## 合约地址

### Arbitrum Sepolia
- BridgeAdapter: `待部署`
- USDC: `0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d` (示例地址,需确认)

## 安全特性

- ✅ OpenZeppelin 合约库
- ✅ ReentrancyGuard 防重入攻击
- ✅ Pausable 紧急暂停
- ✅ Ownable 访问控制
- ✅ SafeERC20 安全代币转账

## 测试覆盖

- ✅ 存款功能
- ✅ 取款请求
- ✅ 取款执行
- ✅ 取款取消
- ✅ 暂停功能
- ✅ 边界条件
- ✅ 权限控制

## 许可证

MIT
