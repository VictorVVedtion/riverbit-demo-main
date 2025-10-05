# 测试策略

**最后更新**: 2025-10-04

## 测试金字塔

```
         /\
        /  \  E2E (10%)
       /____\
      /      \  Integration (20%)
     /________\
    /          \  Unit (70%)
   /____________\
```

## 测试覆盖率目标

| 层级 | 目标覆盖率 | 关键指标 |
|------|-----------|----------|
| 单元测试 | > 80% | 行覆盖率、分支覆盖率 |
| 集成测试 | > 60% | 模块间接口覆盖 |
| E2E 测试 | > 90% | 核心用户流程覆盖 |

## 前端测试策略

### 单元测试 (Vitest)

#### 工具函数测试
```typescript
// src/utils/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatPrice, formatPnL } from './format';

describe('formatPrice', () => {
  it('should format price with 2 decimals', () => {
    expect(formatPrice(50000.123)).toBe('50,000.12');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('0.00');
  });

  it('should handle negative numbers', () => {
    expect(formatPrice(-1234.56)).toBe('-1,234.56');
  });
});
```

#### React 组件测试
```typescript
// src/components/OrderBook.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { OrderBook } from './OrderBook';
import { vi } from 'vitest';

describe('OrderBook', () => {
  it('should render loading state initially', () => {
    render(<OrderBook marketId="BTC-PERP" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display orders after loading', async () => {
    const mockOrders = [
      { id: '1', price: 50000, size: 0.1, side: 'BUY' }
    ];

    vi.mock('@/lib/riverchain/client', () => ({
      fetchOrders: vi.fn().mockResolvedValue(mockOrders)
    }));

    render(<OrderBook marketId="BTC-PERP" />);

    await waitFor(() => {
      expect(screen.getByText('50000')).toBeInTheDocument();
    });
  });
});
```

#### Hooks 测试
```typescript
// src/lib/riverchain/useWallet.test.ts
import { renderHook, act } from '@testing-library/react';
import { useRiverChainWallet } from './useWallet';
import { vi } from 'vitest';

describe('useRiverChainWallet', () => {
  it('should connect to Keplr wallet', async () => {
    const mockKeplr = {
      enable: vi.fn().mockResolvedValue(true),
      getKey: vi.fn().mockResolvedValue({
        bech32Address: 'river1abc...'
      })
    };

    window.keplr = mockKeplr;

    const { result } = renderHook(() => useRiverChainWallet());

    await act(async () => {
      await result.current.connect();
    });

    expect(result.current.connected).toBe(true);
    expect(result.current.address).toBe('river1abc...');
  });
});
```

### 集成测试

#### API 客户端测试
```typescript
// src/lib/riverchain/client.test.ts
import { RiverChainClient } from './client';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get('http://localhost:1317/riverchain/orders', (req, res, ctx) => {
    return res(ctx.json({
      orders: [{ id: '1', price: '50000', size: '0.1' }]
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('RiverChainClient', () => {
  it('should fetch orders from REST API', async () => {
    const client = new RiverChainClient('http://localhost:1317');
    const orders = await client.getOrders('BTC-PERP');

    expect(orders).toHaveLength(1);
    expect(orders[0].price).toBe(50000);
  });
});
```

### E2E 测试 (Playwright)

#### 交易流程测试
```typescript
// tests/e2e/trading.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Trading Flow', () => {
  test('should complete full trading flow', async ({ page }) => {
    // 1. 连接钱包
    await page.goto('http://localhost:5173/trading');
    await page.click('[data-testid="connect-wallet"]');

    // Mock Keplr wallet
    await page.evaluate(() => {
      window.keplr = {
        enable: () => Promise.resolve(true),
        getKey: () => Promise.resolve({
          bech32Address: 'river1test...'
        })
      };
    });

    // 2. 确认钱包已连接
    await expect(page.locator('[data-testid="wallet-address"]'))
      .toContainText('river1test...');

    // 3. 下单
    await page.fill('[data-testid="order-price"]', '50000');
    await page.fill('[data-testid="order-size"]', '0.1');
    await page.click('[data-testid="place-order-btn"]');

    // 4. 确认订单成功
    await expect(page.locator('.toast-success'))
      .toContainText('Order placed successfully');

    // 5. 验证订单出现在活跃订单列表
    await expect(page.locator('[data-testid="active-orders"]'))
      .toContainText('50000');
  });

  test('should handle order validation errors', async ({ page }) => {
    await page.goto('http://localhost:5173/trading');

    // 输入无效价格
    await page.fill('[data-testid="order-price"]', '-100');
    await page.click('[data-testid="place-order-btn"]');

    // 验证错误提示
    await expect(page.locator('.error-message'))
      .toContainText('Price must be positive');
  });
});
```

#### 跨链桥接测试
```typescript
// tests/e2e/bridge.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Bridge Flow', () => {
  test('should deposit from Arbitrum', async ({ page }) => {
    await page.goto('http://localhost:5173/assets');

    // 切换到 Arbitrum 网络 (MetaMask)
    await page.click('[data-testid="switch-to-arbitrum"]');

    // 输入存款金额
    await page.fill('[data-testid="deposit-amount"]', '100');
    await page.click('[data-testid="deposit-btn"]');

    // 确认 MetaMask 交易 (Mock)
    await page.evaluate(() => {
      window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{ /* ... */ }]
      });
    });

    // 验证存款待处理状态
    await expect(page.locator('[data-testid="deposit-status"]'))
      .toContainText('Pending');
  });
});
```

## 后端测试策略

### 单元测试 (go test)

#### Keeper 方法测试
```go
// protocol/x/clob/keeper/orders_test.go
package keeper_test

import (
    "testing"
    "github.com/stretchr/testify/require"
    "github.com/RiverBit-dex/riverchain/protocol/x/clob/types"
)

func TestPlaceOrder(t *testing.T) {
    keeper, ctx := setupKeeper(t)

    order := types.Order{
        Id:    "order1",
        Price: sdk.NewDec(50000),
        Size:  sdk.NewDec(1),
        Side:  "BUY",
    }

    // 下单
    err := keeper.PlaceOrder(ctx, order)
    require.NoError(t, err)

    // 验证订单已保存
    savedOrder, found := keeper.GetOrder(ctx, "order1")
    require.True(t, found)
    require.Equal(t, order.Price, savedOrder.Price)
}

func TestPlaceOrder_ValidationFails(t *testing.T) {
    keeper, ctx := setupKeeper(t)

    // 无效价格
    order := types.Order{
        Id:    "order1",
        Price: sdk.NewDec(-100),
        Size:  sdk.NewDec(1),
        Side:  "BUY",
    }

    err := keeper.PlaceOrder(ctx, order)
    require.Error(t, err)
    require.Contains(t, err.Error(), "invalid price")
}
```

#### Message 处理器测试
```go
// protocol/x/clob/keeper/msg_server_test.go
func TestMsgPlaceOrder(t *testing.T) {
    keeper, ctx := setupKeeper(t)
    msgServer := keeper.NewMsgServerImpl(keeper)

    msg := &types.MsgPlaceOrder{
        Creator: "river1abc...",
        Price:   sdk.NewDec(50000),
        Size:    sdk.NewDec(1),
        Side:    "BUY",
    }

    res, err := msgServer.PlaceOrder(sdk.WrapSDKContext(ctx), msg)
    require.NoError(t, err)
    require.NotNil(t, res)
    require.NotEmpty(t, res.OrderId)
}
```

### 集成测试

#### 模块间交互测试
```go
// protocol/x/perpetuals/integration_test.go
func TestPerpetualSettlement(t *testing.T) {
    app := simapp.Setup(t, false)
    ctx := app.BaseApp.NewContext(false, tmproto.Header{})

    // 创建仓位
    position := perpetualtypes.Position{
        Address:   "river1test...",
        Market:    "BTC-PERP",
        Size:      sdk.NewDec(1),
        EntryPrice: sdk.NewDec(50000),
    }

    app.PerpetualsKeeper.SetPosition(ctx, position)

    // 更新价格
    app.PricesKeeper.SetPrice(ctx, "BTC-PERP", sdk.NewDec(51000))

    // 结算资金费
    err := app.PerpetualsKeeper.SettleFunding(ctx)
    require.NoError(t, err)

    // 验证仓位更新
    updatedPosition, _ := app.PerpetualsKeeper.GetPosition(ctx, position.Address, position.Market)
    require.True(t, updatedPosition.UnrealizedPnL.GT(sdk.ZeroDec()))
}
```

### E2E 测试

#### 完整交易流程测试
```go
// tests/e2e/trading_test.go
func TestEndToEndTrading(t *testing.T) {
    // 启动本地测试网
    network := testutil.NewNetwork(t)
    defer network.Cleanup()

    // 创建测试账户
    alice := network.Validators[0].ClientCtx.GetFromAddress()

    // 1. 存入资金
    depositMsg := banktypes.NewMsgSend(
        network.Validators[0].Address,
        alice,
        sdk.NewCoins(sdk.NewCoin("usdc", sdk.NewInt(10000))),
    )
    _, err := network.SendMsg(depositMsg)
    require.NoError(t, err)

    // 2. 下单
    placeOrderMsg := clobtypes.NewMsgPlaceOrder(
        alice.String(),
        "BTC-PERP",
        sdk.NewDec(50000),
        sdk.NewDec(1),
        "BUY",
    )
    res, err := network.SendMsg(placeOrderMsg)
    require.NoError(t, err)
    require.NotEmpty(t, res.TxHash)

    // 3. 查询订单
    orders, err := network.QueryOrders(alice.String())
    require.NoError(t, err)
    require.Len(t, orders, 1)
}
```

## 测试数据管理

### 测试夹具 (Fixtures)
```typescript
// tests/fixtures/orders.ts
export const mockOrders = {
  buyOrder: {
    id: 'order-buy-1',
    price: 50000,
    size: 0.1,
    side: 'BUY',
    status: 'ACTIVE'
  },
  sellOrder: {
    id: 'order-sell-1',
    price: 50100,
    size: 0.2,
    side: 'SELL',
    status: 'ACTIVE'
  }
};
```

```go
// protocol/testutil/fixtures.go
package testutil

func CreateTestOrder(id string, price int64) types.Order {
    return types.Order{
        Id:    id,
        Price: sdk.NewDec(price),
        Size:  sdk.NewDec(1),
        Side:  "BUY",
    }
}
```

### Mock 数据
```typescript
// src/lib/riverchain/__mocks__/client.ts
export const RiverChainClient = vi.fn().mockImplementation(() => ({
  getOrders: vi.fn().mockResolvedValue(mockOrders),
  placeOrder: vi.fn().mockResolvedValue({ orderId: 'order-1' }),
  cancelOrder: vi.fn().mockResolvedValue({ success: true })
}));
```

## 性能测试

### 负载测试 (k6)
```javascript
// tests/load/trading.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up
    { duration: '3m', target: 100 }, // Stay at 100 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% requests < 1s
  },
};

export default function () {
  const payload = JSON.stringify({
    market: 'BTC-PERP',
    price: '50000',
    size: '0.1',
    side: 'BUY',
  });

  const res = http.post('http://localhost:1317/riverchain/clob/orders', payload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'order created': (r) => JSON.parse(r.body).orderId !== undefined,
  });

  sleep(1);
}
```

### 前端性能测试
```typescript
// tests/performance/lighthouse.spec.ts
import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test('should meet Lighthouse performance criteria', async ({ page }) => {
  await page.goto('http://localhost:5173/trading');

  await playAudit({
    page,
    thresholds: {
      performance: 90,
      accessibility: 90,
      'best-practices': 90,
      seo: 80,
    },
  });
});
```

## 测试环境

### 本地开发
- RiverChain Devnet (单节点)
- PostgreSQL (Docker)
- Mocked 外部服务

### CI/CD
- GitHub Actions
- Docker Compose 编排
- 并行测试执行

## 测试执行

### 前端
```bash
# 单元测试
npm run test

# 单元测试 (watch mode)
npm run test:watch

# 覆盖率
npm run test:coverage

# E2E 测试
npm run test:e2e

# E2E 测试 (headless)
npm run test:e2e:ci
```

### 后端
```bash
# 单元测试
go test ./...

# 带覆盖率
go test -cover ./...

# 详细输出
go test -v ./...

# 特定包
go test ./protocol/x/clob/...

# 集成测试
go test -tags=integration ./...

# E2E 测试
go test -tags=e2e ./tests/e2e/...
```

## 持续集成

### GitHub Actions 工作流
```yaml
# .github/workflows/test.yml
name: Test

on:
  pull_request:
  push:
    branches: [main, dev]

jobs:
  frontend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:e2e:ci

  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-go@v4
        with:
          go-version: '1.21'
      - run: go test -cover ./...
      - run: go test -tags=integration ./...
```

## 测试最佳实践

### AAA 模式 (Arrange-Act-Assert)
```typescript
it('should calculate PnL correctly', () => {
  // Arrange
  const position = { entryPrice: 50000, size: 1 };
  const currentPrice = 51000;

  // Act
  const pnl = calculatePnL(position, currentPrice);

  // Assert
  expect(pnl).toBe(1000);
});
```

### 测试命名
```typescript
// ✅ 描述性命名
describe('OrderBook', () => {
  it('should display empty state when no orders exist', () => {});
  it('should sort orders by price descending', () => {});
});

// ❌ 模糊命名
describe('OrderBook', () => {
  it('test1', () => {});
  it('works', () => {});
});
```

### 隔离性
- 每个测试独立运行
- 不依赖测试执行顺序
- 清理测试数据

### 可维护性
- 使用 Page Object 模式 (E2E)
- 抽象通用测试逻辑
- 定期更新测试用例

## 质量门

### PR 合并前必须:
- [ ] 所有单元测试通过
- [ ] 代码覆盖率 > 80%
- [ ] E2E 测试通过 (核心流程)
- [ ] 性能测试通过 (p95 < 1s)
- [ ] 无 linter 错误

## 测试文档

### 测试计划
- 测试范围
- 测试用例列表
- 测试数据准备
- 风险评估

### 测试报告
- 测试执行结果
- 缺陷列表
- 覆盖率报告
- 性能指标
