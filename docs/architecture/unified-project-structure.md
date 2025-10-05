# 统一项目结构

**最后更新**: 2025-10-04

## 概述

RiverBit 项目采用 monorepo 结构,包含前端应用、后端链和相关工具。本文档定义标准的目录组织和文件命名规范。

## 根目录结构

```
riverbit-demo/                    # 前端仓库 (当前)
├── .bmad-core/                   # BMad 方法核心配置
├── .github/                      # GitHub Actions CI/CD
├── docs/                         # 项目文档
│   ├── prd/                      # 产品需求文档
│   ├── architecture/             # 架构设计文档
│   ├── stories/                  # 用户故事
│   └── qa/                       # 质量保证文档
├── public/                       # 静态资源
├── src/                          # 前端源码
└── package.json                  # 前端依赖

riverchain/                       # 后端链仓库 (待创建)
├── protocol/                     # Cosmos SDK 链代码
│   ├── app/                      # 应用配置
│   ├── streaming/                # 数据流
│   ├── indexer/                  # 事件索引
│   └── x/                        # 自定义模块
├── buf.work.yaml                 # Buf 工作空间
└── go.mod                        # Go 依赖

bridge-service/                   # 跨链桥接服务 (待创建)
├── src/
├── package.json
└── .env.example
```

## 前端应用结构 (src/)

```
src/
├── @types/                       # 全局类型定义
│   └── wallet.d.ts               # 钱包接口类型
├── abis/                         # 智能合约 ABI
│   └── IAssetBridge.json
├── assets/                       # 静态资源
│   ├── images/
│   └── icons/
├── components/                   # 可复用组件
│   ├── Button/                   # 按钮组件族
│   │   ├── PrimaryButton.tsx
│   │   ├── SecondaryButton.tsx
│   │   └── index.ts
│   ├── Modal/                    # 模态框组件
│   ├── AdjustLeverageModal.tsx
│   ├── ConfirmCloseModal.tsx
│   ├── DesktopNav.tsx            # 桌面导航
│   ├── MobileHeader.tsx          # 移动端头部
│   ├── Footer.tsx
│   └── OrderBook.tsx             # 订单簿组件
├── config/                       # 配置文件
│   ├── chains.ts                 # 链配置 (RiverChain, Arbitrum)
│   └── constants.ts              # 全局常量
├── context/                      # React Context
│   ├── RiverChainContext.tsx     # RiverChain 状态
│   └── WalletContext.tsx         # 钱包状态
├── lib/                          # 核心库
│   ├── riverchain/               # RiverChain 客户端
│   │   ├── client.ts             # RPC/REST 客户端
│   │   ├── wallet.ts             # Keplr/Leap 集成
│   │   ├── types.ts              # 链端类型
│   │   └── utils.ts              # 工具函数
│   ├── arbitrum/                 # Arbitrum 客户端
│   │   ├── contract.ts           # 合约交互
│   │   ├── wallet.ts             # MetaMask 集成
│   │   └── types.ts
│   └── streaming/                # WebSocket 客户端
│       └── orderbook.ts
├── pages/                        # 页面组件
│   ├── Trading.tsx               # 交易页
│   ├── Assets.tsx                # 资产页
│   ├── Referral.tsx              # 推荐页
│   ├── Earn.tsx                  # 收益页
│   ├── RiverPool.tsx             # 流动性池页
│   ├── API.tsx                   # API 文档页
│   ├── Announcement.tsx          # 公告页
│   └── Docs.tsx                  # 帮助文档页
├── utils/                        # 工具函数
│   ├── format.ts                 # 格式化函数
│   ├── validation.ts             # 验证函数
│   └── constants.ts              # 常量定义
├── App.tsx                       # 根组件
├── main.tsx                      # 入口文件
└── index.css                     # 全局样式
```

## 后端链结构 (protocol/)

```
protocol/
├── app/                          # 应用层
│   ├── constants/
│   │   └── constants.go          # 链常量 (Chain ID 等)
│   ├── config/
│   │   └── config.go             # 网络配置
│   └── module_accounts.go        # 模块账户
├── streaming/                    # 数据流
│   ├── full_node_streaming_manager.go
│   └── ws/                       # WebSocket 服务
├── indexer/                      # 事件索引
│   ├── events/                   # 事件处理器
│   ├── postgres/                 # PostgreSQL 适配器
│   └── services/                 # 索引服务
├── x/                            # 自定义模块
│   ├── clob/                     # 订单簿模块
│   ├── perpetuals/               # 永续合约模块
│   ├── assets/                   # 资产模块
│   ├── marketmap/                # 市场映射模块
│   ├── prices/                   # 价格模块
│   ├── affiliates/               # 推荐模块 (新增)
│   ├── revshare/                 # 分润模块 (新增)
│   ├── accountplus/              # 账户认证模块
│   └── feetiers/                 # 费率层级模块
├── buf.work.yaml                 # Buf 工作空间
├── buf.gen.yaml                  # Proto 生成配置
├── proto/                        # Proto 定义
│   └── riverchain/
│       └── v1/
└── go.mod
```

## 文档结构 (docs/)

```
docs/
├── prd/                          # 产品需求文档
│   ├── index.md                  # PRD 索引
│   ├── epic-1-infrastructure-setup.md
│   ├── epic-2-single-market-trading.md
│   ├── epic-3-stock-market-risk.md
│   └── epic-4-stability-docs.md
├── architecture/                 # 架构文档
│   ├── index.md                  # 架构索引
│   ├── tech-stack.md             # 技术栈
│   ├── unified-project-structure.md  # 本文档
│   ├── coding-standards.md       # 编码标准
│   ├── testing-strategy.md       # 测试策略
│   ├── backend-architecture.md   # 后端架构
│   ├── frontend-architecture.md  # 前端架构
│   ├── data-models.md            # 数据模型
│   ├── database-schema.md        # 数据库设计
│   ├── rest-api-spec.md          # API 规范
│   ├── external-apis.md          # 外部 API
│   ├── components.md             # 组件库
│   └── core-workflows.md         # 核心工作流
├── stories/                      # 用户故事
│   ├── 1.1.story.md
│   ├── 1.2.story.md
│   └── ...
└── qa/                           # 质量保证
    ├── assessments/              # 评估报告
    └── gates/                    # 质量门
```

## 命名规范

### 文件命名

#### TypeScript/JavaScript
- **组件**: PascalCase (e.g., `OrderBook.tsx`, `PrimaryButton.tsx`)
- **工具函数**: camelCase (e.g., `formatPrice.ts`, `validateOrder.ts`)
- **类型定义**: camelCase + `.d.ts` (e.g., `wallet.d.ts`)
- **常量**: camelCase (e.g., `constants.ts`, `config.ts`)

#### Go
- **包**: lowercase (e.g., `clob`, `perpetuals`)
- **文件**: snake_case (e.g., `streaming_manager.go`, `module_accounts.go`)
- **测试**: `*_test.go`

#### 文档
- **Markdown**: kebab-case (e.g., `tech-stack.md`, `coding-standards.md`)
- **Story**: `{epic}.{story}.story.md` (e.g., `1.1.story.md`)

### 目录命名

- **组件目录**: PascalCase (e.g., `Button/`, `Modal/`)
- **工具目录**: lowercase (e.g., `utils/`, `lib/`)
- **模块目录**: lowercase (e.g., `x/clob/`, `x/perpetuals/`)

## 导入路径

### 前端 (TypeScript)
```typescript
// 绝对路径导入 (使用 @ 别名)
import { RiverChainClient } from '@/lib/riverchain/client';
import { OrderBook } from '@/components/OrderBook';
import { formatPrice } from '@/utils/format';

// 相对路径导入 (同级或子级)
import { PrimaryButton } from './Button/PrimaryButton';
```

### 后端 (Go)
```go
// 模块导入
import (
    "github.com/RiverBit-dex/riverchain/protocol/x/clob/types"
    "github.com/RiverBit-dex/riverchain/protocol/streaming"
)
```

## 环境配置文件

```
# 前端
.env.local                        # 本地开发配置 (不提交)
.env.local.example                # 配置模板 (提交)

# 后端
.env                              # 后端配置 (不提交)
.env.example                      # 配置模板 (提交)

# Docker
docker-compose.yml                # 本地编排
docker-compose.prod.yml           # 生产编排
```

## 构建产物

```
# 前端
dist/                             # Vite 构建输出 (不提交)

# 后端
build/                            # Go 二进制文件 (不提交)

# 通用
node_modules/                     # 依赖 (不提交)
vendor/                           # Go 依赖 (不提交)
```

## Git 忽略规则

参考 `.gitignore`:
```
# 依赖
node_modules/
vendor/

# 构建产物
dist/
build/
*.log

# 环境配置
.env
.env.local

# IDE
.vscode/
.idea/
*.swp

# 系统文件
.DS_Store
Thumbs.db
```

## 特殊目录说明

### `.bmad-core/`
BMad 方法核心配置,包含:
- `agents/` - 代理定义
- `tasks/` - 任务模板
- `templates/` - 文档模板
- `checklists/` - 检查清单

**不要手动修改此目录内容!**

### `public/`
静态资源目录,直接复制到构建产物:
- `favicon.ico`
- `robots.txt`
- 图片、字体等

## 模块化原则

### 前端
1. **单一职责**: 每个组件/模块只做一件事
2. **可复用**: 抽象通用逻辑到 `lib/` 和 `utils/`
3. **类型安全**: 所有接口使用 TypeScript 定义

### 后端
1. **模块隔离**: 自定义模块放在 `x/` 目录
2. **接口抽象**: 使用 Keeper 模式
3. **测试覆盖**: 每个模块包含单元测试

## 代码组织最佳实践

### 组件组织 (前端)
```typescript
// ✅ 推荐
components/
  OrderBook/
    OrderBook.tsx           # 主组件
    OrderBookHeader.tsx     # 子组件
    OrderBookRow.tsx        # 子组件
    types.ts                # 类型定义
    utils.ts                # 工具函数
    index.ts                # 导出

// ❌ 不推荐
components/
  OrderBook.tsx
  OrderBookHeader.tsx
  OrderBookRow.tsx
  orderBookTypes.ts
  orderBookUtils.ts
```

### 模块组织 (后端)
```go
// ✅ 推荐
x/clob/
  keeper/
    keeper.go
    orders.go
    matches.go
  types/
    msgs.go
    events.go
  module.go

// ❌ 不推荐
x/clob/
  clob_keeper.go
  clob_orders.go
  clob_types.go
```

## 扩展性考虑

### 新增前端页面
1. 在 `src/pages/` 创建 `{PageName}.tsx`
2. 在 `App.tsx` 添加路由
3. 更新导航组件

### 新增后端模块
1. 在 `protocol/x/` 创建模块目录
2. 定义 Proto 文件
3. 实现 Keeper 和 Message 处理器
4. 在 `app/app.go` 注册模块

### 新增文档
1. 确定文档类型 (PRD/Architecture/QA)
2. 放在对应目录
3. 更新索引文件 (`index.md`)
