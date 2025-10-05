# 编码标准

**最后更新**: 2025-10-04

## 概述

本文档定义 RiverBit 项目的编码标准和最佳实践,确保代码质量和团队协作效率。

## 核心原则

### SOLID 原则
- **S** - Single Responsibility: 单一职责
- **O** - Open/Closed: 开闭原则
- **L** - Liskov Substitution: 里氏替换
- **I** - Interface Segregation: 接口隔离
- **D** - Dependency Inversion: 依赖倒置

### KISS 原则
- Keep It Simple, Stupid
- 优先选择简单直观的解决方案
- 避免过度设计

### DRY 原则
- Don't Repeat Yourself
- 抽象重复逻辑
- 统一相似功能实现

### YAGNI 原则
- You Aren't Gonna Need It
- 仅实现当前需要的功能
- 避免预先设计未来特性

## TypeScript/JavaScript 标准

### 代码风格

#### 命名规范
```typescript
// ✅ 变量/函数: camelCase
const orderPrice = 50000;
function calculatePnL() {}

// ✅ 类/组件/接口: PascalCase
class OrderBook {}
interface WalletState {}
function OrderBookComponent() {}

// ✅ 常量: UPPER_SNAKE_CASE
const MAX_LEVERAGE = 20;
const API_BASE_URL = 'https://api.riverbit.io';

// ✅ 私有成员: 下划线前缀
class Wallet {
  private _privateKey: string;
}

// ✅ 类型别名: PascalCase + Type 后缀
type OrderType = 'LIMIT' | 'MARKET';
type UserStateType = { address: string; balance: number };
```

#### 文件组织
```typescript
// ✅ 推荐: 导入分组
// 1. 外部依赖
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// 2. 内部模块
import { RiverChainClient } from '@/lib/riverchain/client';
import { formatPrice } from '@/utils/format';

// 3. 类型定义
import type { Order, Position } from '@/types';

// 4. 样式
import './OrderBook.css';

// ❌ 避免: 混乱导入
import './OrderBook.css';
import { ethers } from 'ethers';
import type { Order } from '@/types';
import React from 'react';
```

#### 类型定义
```typescript
// ✅ 优先使用 interface (可扩展)
interface Order {
  id: string;
  price: number;
  size: number;
  side: 'BUY' | 'SELL';
}

// ✅ 使用 type 定义联合类型/交叉类型
type OrderSide = 'BUY' | 'SELL';
type OrderWithTimestamp = Order & { timestamp: number };

// ✅ 使用泛型提高复用性
interface ApiResponse<T> {
  data: T;
  error?: string;
}

// ❌ 避免 any
function processOrder(order: any) {} // Bad

// ✅ 使用具体类型
function processOrder(order: Order) {} // Good
```

### React 组件标准

#### 函数组件结构
```typescript
// ✅ 标准组件结构
import React, { useState, useEffect } from 'react';
import type { FC } from 'react';

// 1. Props 类型定义
interface OrderBookProps {
  marketId: string;
  onOrderClick?: (order: Order) => void;
}

// 2. 组件函数
export const OrderBook: FC<OrderBookProps> = ({ marketId, onOrderClick }) => {
  // 3. State 定义
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 4. Effects
  useEffect(() => {
    fetchOrders();
  }, [marketId]);

  // 5. 事件处理器
  const handleOrderClick = (order: Order) => {
    onOrderClick?.(order);
  };

  // 6. 辅助函数
  const fetchOrders = async () => {
    // ...
  };

  // 7. 渲染
  if (loading) return <div>Loading...</div>;

  return (
    <div className="order-book">
      {orders.map(order => (
        <OrderRow
          key={order.id}
          order={order}
          onClick={handleOrderClick}
        />
      ))}
    </div>
  );
};
```

#### Hooks 使用
```typescript
// ✅ 自定义 Hook 命名以 use 开头
function useRiverChainWallet() {
  const [address, setAddress] = useState<string>();
  const [connected, setConnected] = useState(false);

  const connect = async () => {
    // ...
  };

  return { address, connected, connect };
}

// ✅ Hook 依赖数组完整
useEffect(() => {
  fetchData(marketId, userId);
}, [marketId, userId]); // 包含所有依赖

// ❌ 避免空依赖数组(除非确实只需运行一次)
useEffect(() => {
  // 使用了 marketId 但未声明依赖
  fetchData(marketId);
}, []); // Bad
```

### 错误处理
```typescript
// ✅ 使用 try-catch 处理异步错误
async function placeOrder(order: Order) {
  try {
    const result = await riverchainClient.placeOrder(order);
    return { success: true, data: result };
  } catch (error) {
    console.error('Place order failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// ✅ 自定义错误类
class OrderValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'OrderValidationError';
  }
}

// ❌ 避免吞掉错误
try {
  await doSomething();
} catch (e) {
  // 静默失败 - Bad
}
```

## Go 编码标准

### 代码风格

#### 命名规范
```go
// ✅ 变量/函数: camelCase (unexported) 或 PascalCase (exported)
var orderPrice int64
func calculatePnL() {}
func GetOrderBook() {} // Exported

// ✅ 常量: PascalCase 或 camelCase
const MaxLeverage = 20
const defaultTimeout = 30 * time.Second

// ✅ 接口: -er 后缀
type OrderPlacer interface {
    PlaceOrder(order Order) error
}

// ✅ 包名: 单数、小写
package clob
package perpetuals
```

#### 错误处理
```go
// ✅ 返回错误而非 panic
func PlaceOrder(order Order) (*OrderResponse, error) {
    if err := validateOrder(order); err != nil {
        return nil, fmt.Errorf("validate order: %w", err)
    }

    // ...
    return response, nil
}

// ✅ 使用 errors.Is 和 errors.As
if errors.Is(err, ErrOrderNotFound) {
    // handle not found
}

var validationErr *ValidationError
if errors.As(err, &validationErr) {
    // handle validation error
}

// ❌ 避免忽略错误
result, _ := doSomething() // Bad
```

#### Context 使用
```go
// ✅ Context 作为第一个参数
func ProcessOrder(ctx context.Context, order Order) error {
    select {
    case <-ctx.Done():
        return ctx.Err()
    default:
        // process order
    }
}

// ✅ 传递 Context
func handleRequest(ctx context.Context) {
    newCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()

    ProcessOrder(newCtx, order)
}
```

### Cosmos SDK 模块标准

#### Keeper 模式
```go
// ✅ Keeper 结构
type Keeper struct {
    storeKey storetypes.StoreKey
    cdc      codec.BinaryCodec
}

// ✅ Keeper 方法命名
func (k Keeper) GetOrder(ctx sdk.Context, orderId string) (Order, bool) {
    // ...
}

func (k Keeper) SetOrder(ctx sdk.Context, order Order) {
    // ...
}

func (k Keeper) DeleteOrder(ctx sdk.Context, orderId string) {
    // ...
}
```

#### Message 处理
```go
// ✅ Message 类型定义
type MsgPlaceOrder struct {
    Creator string
    Price   sdk.Dec
    Size    sdk.Dec
    Side    string
}

// ✅ ValidateBasic 实现
func (msg *MsgPlaceOrder) ValidateBasic() error {
    if _, err := sdk.AccAddressFromBech32(msg.Creator); err != nil {
        return errorsmod.Wrap(sdkerrors.ErrInvalidAddress, "invalid creator address")
    }

    if msg.Price.LTE(sdk.ZeroDec()) {
        return errorsmod.Wrap(ErrInvalidPrice, "price must be positive")
    }

    return nil
}
```

## 代码审查清单

### 所有语言通用
- [ ] 代码符合命名规范
- [ ] 没有硬编码的配置/密钥
- [ ] 错误处理完整
- [ ] 添加必要的注释
- [ ] 没有 TODO/FIXME (或已创建 Issue)
- [ ] 遵循 SOLID/DRY/KISS 原则

### TypeScript/React
- [ ] 组件使用 TypeScript 严格模式
- [ ] Props 有完整类型定义
- [ ] useEffect 依赖数组正确
- [ ] 避免使用 any
- [ ] 异步操作有错误处理

### Go
- [ ] 错误返回使用 %w 包装
- [ ] Context 正确传递
- [ ] 并发安全(如使用锁)
- [ ] defer 使用正确
- [ ] 资源正确释放

## 注释规范

### 文档注释
```typescript
// ✅ TypeScript: JSDoc 格式
/**
 * 计算仓位盈亏
 * @param position - 仓位信息
 * @param currentPrice - 当前市场价格
 * @returns 未实现盈亏
 */
function calculateUnrealizedPnL(
  position: Position,
  currentPrice: number
): number {
  // ...
}
```

```go
// ✅ Go: godoc 格式
// PlaceOrder creates a new order in the order book.
// Returns the order ID if successful, or an error if validation fails.
func (k Keeper) PlaceOrder(ctx sdk.Context, order Order) (string, error) {
    // ...
}
```

### 行内注释
```typescript
// ✅ 解释"为什么",不是"做什么"
// HACK: Temporary workaround for Keplr v0.12 bug
const chainId = 'riverchain-1';

// ❌ 冗余注释
// Set the price
const price = 50000; // Bad
```

## 性能考虑

### 前端
- 避免在循环中创建函数
- 使用 React.memo 优化重渲染
- 大列表使用虚拟滚动
- 图片懒加载

### 后端
- 避免 N+1 查询
- 使用批量操作
- 适当使用缓存
- 数据库索引优化

## 安全规范

### 前端
- 永不在前端存储私钥
- 使用 HTTPS/WSS
- 输入验证和清理
- XSS 防护

### 后端
- 输入验证
- SQL 注入防护
- 权限检查
- 日志脱敏

## 工具配置

### ESLint (.eslintrc)
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/exhaustive-deps": "error"
  }
}
```

### golangci-lint (.golangci.yml)
```yaml
linters:
  enable:
    - gofmt
    - goimports
    - govet
    - errcheck
    - staticcheck
    - unused
    - gosimple
    - ineffassign

linters-settings:
  gofmt:
    simplify: true
  goimports:
    local-prefixes: github.com/RiverBit-dex/riverchain
```

## 持续改进

- 定期审查和更新编码标准
- 团队代码审查反馈纳入标准
- 自动化检查工具持续优化
