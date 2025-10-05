# Epic 1: 基础设施与链端启动

**Epic ID**: 1
**标题**: Week 1 - 基础设施与链端启动
**状态**: Active
**优先级**: Critical
**预计时间**: 1 周

## Epic 目标

完成 dYdX v4-chain 的 fork 与链身份配置,打通 Proto 生成流程,搭建前端骨架并实现基础的钱包连接功能。为后续开发奠定技术基础。

## 背景与上下文

RiverBit 项目需要基于 dYdX v4 技术栈构建,但使用 RiverChain 作为链身份。阶段一第 1 周的核心任务是将 dYdX v4-chain 改造为 RiverChain,并确保前端能够与链端正常通信。

## 用户故事列表

### Story 1.1: Fork 并配置 dYdX v4-chain
**优先级**: P0 - Critical

**用户故事**:
作为后端开发者,我需要 fork dYdX v4-chain 仓库并修改链身份配置,以便启动 RiverChain Devnet 单节点。

**验收标准**:
1. 成功 fork `dydxprotocol/v4-chain` 仓库到 `RiverBit-dex/riverchain`
2. 链身份配置完成:
   - `protocol/app/constants/constants.go` - Chain ID 改为 "riverchain-1"
   - `protocol/app/config/config.go` - 网络参数配置
   - `protocol/app/module_accounts.go` - 模块账户权限设置
3. 本地编译成功: `make install && riverchaind version` 输出正确版本
4. Devnet 单节点成功启动并产生区块

**技术要点**:
- Go 1.21+
- Cosmos SDK 0.50+
- CometBFT 0.38+

---

### Story 1.2: Proto 与客户端代码生成
**优先级**: P0 - Critical

**用户故事**:
作为全栈开发者,我需要配置 Buf 工具链并生成 TypeScript 客户端代码,以便前端能调用链端接口。

**验收标准**:
1. `buf.work.yaml` 和 `buf.gen.yaml` 配置完成
2. Go Proto 文件生成成功: `make proto-gen`
3. TypeScript 客户端桩代码生成成功: `buf generate`
4. 创建 npm 包 `@riverbit/riverchain-client-js` (占位版本)
5. 包含基础类型定义和 RPC 客户端封装

**技术要点**:
- Buf CLI
- protoc-gen-ts
- npm package 结构

---

### Story 1.3: 业务流模块参数占位
**优先级**: P1 - High

**用户故事**:
作为链端开发者,我需要配置费率层级、推荐分润、账户认证等业务流模块的基础参数,以便后续实现完整的业务逻辑。

**验收标准**:
1. `x/feetiers` 模块: 费率层级参数草案 (Maker/Taker 费率)
2. `x/affiliates` & `x/revshare` 模块: 推荐码与分润比例占位
3. `x/accountplus` 模块: 认证器组合与限流策略占位
4. 创建治理提案模板 (JSON 格式)
5. 参数可通过 CLI 查询验证

**技术要点**:
- Cosmos SDK modules
- Governance proposals
- CLI 命令

---

### Story 1.4: Streaming 与 Indexer 基础配置
**优先级**: P1 - High

**用户故事**:
作为后端开发者,我需要启用 Full Node Streaming 并配置 Indexer,以便实时订阅链上事件并提供历史数据查询。

**验收标准**:
1. `protocol/streaming/full_node_streaming_manager.go` - 启用订阅功能
2. `protocol/indexer/*` - PostgreSQL 连接配置完成
3. 本地 PostgreSQL 15+ 数据库启动
4. Indexer 守护进程成功运行并索引创世区块
5. WebSocket 接口可访问 (localhost:8080/streaming)

**技术要点**:
- PostgreSQL 15+
- WebSocket
- Go goroutines

---

### Story 1.5: 前端骨架与钱包连接
**优先级**: P0 - Critical

**用户故事**:
作为前端开发者,我需要搭建前端应用骨架并实现 Cosmos 钱包连接,以便用户能通过 Keplr/Leap 钱包与链端交互。

**验收标准**:
1. 安装依赖: `@riverbit/riverchain-client-js`, `@cosmjs/stargate`, `@cosmjs/proto-signing`
2. 创建 `src/lib/riverchain/` 目录结构:
   - `client.ts` - RPC/REST 客户端封装
   - `wallet.ts` - Keplr/Leap 钱包连接逻辑
   - `types.ts` - 链端类型定义
3. 创建 `src/context/RiverChainContext.tsx` - 全局链状态管理
4. 基础路由验证: `/trading` 页面可访问
5. 前端能通过 RPC 读取链高和账户信息

**技术要点**:
- React Context API
- Keplr/Leap wallet API
- @cosmjs/stargate

---

### Story 1.6: Arbitrum 测试网适配占位
**优先级**: P2 - Medium

**用户故事**:
作为前端开发者,我需要实现 Arbitrum 测试网的钱包连接和最小资产管理合约接口,以便为跨链资产流通做准备。

**验收标准**:
1. 创建 `src/lib/arbitrum/` 目录结构
2. 定义最小资产管理合约 ABI (`IAssetBridge.sol`):
   ```solidity
   interface IAssetBridge {
     function deposit(address token, uint256 amount) external;
     function withdraw(address token, uint256 amount) external;
   }
   ```
3. 使用 ethers.js 6.x 连接 Arbitrum 测试网
4. MetaMask 钱包连接成功
5. 前端能显示 Arbitrum 账户地址和 ETH 余额

**技术要点**:
- ethers.js 6.x
- Arbitrum Sepolia 测试网
- Solidity 接口定义

---

## 技术依赖

### 后端
- Go 1.21+
- PostgreSQL 15+
- Redis 7+ (可选,用于缓存)

### 前端
- Node.js 20+
- pnpm/npm
- Vite 7

### 工具链
- Buf CLI
- Docker & Docker Compose
- Git

## 交付物

### 第 1 周结束时应交付:
1. ✅ RiverChain Devnet 本地可启动并产生区块
2. ✅ TypeScript 客户端 npm 包发布 (占位版本)
3. ✅ 前端通过 RPC/REST 读取链高与账户信息
4. ✅ 业务流参数在链上完成占位并可查询
5. ✅ Streaming 与 Indexer 基础运行
6. ✅ Arbitrum 钱包连接占位完成

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| dYdX v4 代码库复杂度高 | High | 提前熟悉 Cosmos SDK,参考官方文档 |
| Proto 生成工具链问题 | Medium | 使用 Docker 容器统一环境 |
| 钱包兼容性问题 | Low | 优先支持 Keplr,Leap 作为备选 |

## 人力分配

- **后端 Go 开发 ×2**: Story 1.1, 1.2, 1.3, 1.4
- **前端开发 ×2**: Story 1.5, 1.6
- **运维 ×1**: Docker 环境搭建,CI 基础配置

## 验收标准 (Epic DoD)

Epic 1 完成的定义:
- [ ] 所有 Story (1.1-1.6) 状态为 "Done"
- [ ] 端到端演示: 前端连接 Devnet,读取链上数据
- [ ] 无 P0/P1 阻塞问题
- [ ] 技术债务记录在案 (如有)
