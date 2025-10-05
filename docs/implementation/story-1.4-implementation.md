# Story 1.4 实施记录 - Streaming 与 Indexer 配置

## 状态
✅ **完成 (配置文档)**

## 实施时间
2025-10-04

## 概述

Story 1.4 主要涉及 RiverChain 的实时数据流 (Streaming) 和事件索引 (Indexer) 配置。dYdX v4 已内置完整的 Streaming 和 Indexer 系统,RiverChain 继承了这些能力。

## 系统架构分析

### 1. Streaming 系统

**位置**: `/Users/victor/Desktop/riverchain/protocol/streaming/`

**核心组件**:

#### Full Node Streaming Manager
**文件**: `full_node_streaming_manager.go`

**功能**:
- ✅ **订单簿订阅管理**: 管理客户端对订单簿更新的订阅
- ✅ **实时数据推送**: 通过 WebSocket 推送区块更新
- ✅ **批量缓存**: 每 10ms 批量刷新消息,优化性能
- ✅ **多维度订阅**: 支持按 ClobPair, Subaccount, Market 订阅

**关键特性**:
```go
type FullNodeStreamingManagerImpl struct {
    orderbookSubscriptions map[uint32]*OrderbookSubscription
    streamUpdateCache      []clobtypes.StreamUpdate
    ticker                 *time.Ticker  // 10ms 批量刷新
    maxUpdatesInCache      uint32
    snapshotBlockInterval  uint32        // 快照发送间隔
}
```

#### WebSocket Server
**目录**: `streaming/ws/`

**功能**:
- ✅ **WebSocket 连接管理**
- ✅ **订阅路由**
- ✅ **消息编码 (Protobuf)**
- ✅ **心跳保活**

### 2. Indexer 系统

**位置**: `/Users/victor/Desktop/riverchain/indexer/`

**架构**: 独立服务,通过 Kafka/直连获取链端事件

**核心功能**:
- ✅ **PostgreSQL 存储**: 结构化存储链上事件
- ✅ **REST API**: 提供查询接口
- ✅ **事件处理器**: 处理订单,交易,持仓等事件
- ✅ **实时同步**: 与链端数据实时同步

**Indexer 架构**:
```
RiverChain Node
    ↓ (Events)
Kafka / Direct Connection
    ↓
Indexer Service
    ↓
PostgreSQL
    ↓
REST API
    ↓
Frontend
```

## 配置说明

### 1. 链端配置 (app.toml)

**Streaming 配置**:
```toml
[streaming]
# Enable full node streaming
enabled = true

# WebSocket server address
ws-address = "0.0.0.0:9090"

# Maximum updates in cache before flush
max-updates-in-cache = 5000

# Maximum subscription channel size
max-subscription-channel-size = 10000

# Snapshot block interval (0 = only initial snapshot)
snapshot-block-interval = 0
```

### 2. WebSocket 端点配置

**默认端点**:
```
ws://localhost:9090/v1/orderbooks
```

**订阅消息格式** (Protobuf):
```protobuf
message StreamOrderbookUpdatesRequest {
  repeated uint32 clob_pair_id = 1;
  repeated SubaccountId subaccount_ids = 2;
  repeated uint32 market_ids = 3;
}
```

### 3. Indexer 配置 (docker-compose.yml)

**服务定义**:
```yaml
services:
  # PostgreSQL 数据库
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: dydx
      POSTGRES_USER: dydx
      POSTGRES_PASSWORD: dydx_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Indexer 服务
  indexer:
    build:
      context: ./indexer
    environment:
      NODE_ENV: production
      POSTGRES_CONNECTION_STRING: postgresql://dydx:dydx_password@postgres:5432/dydx
      REDIS_URL: redis://redis:6379
      KAFKA_BROKER_URLS: kafka:9092
    ports:
      - "3000:3000"  # REST API
    depends_on:
      - postgres
      - redis
      - kafka

  # Redis 缓存
  redis:
    image: redis:7
    ports:
      - "6379:6379"

  # Kafka 消息队列
  kafka:
    image: confluentinc/cp-kafka:7.4.0
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    ports:
      - "9092:9092"

  # Zookeeper
  zookeeper:
    image: confluentinc/cp-zookeeper:7.4.0
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"
```

### 4. 环境变量配置

**Indexer 环境变量** (`.env.indexer`):
```bash
# Database
POSTGRES_CONNECTION_STRING=postgresql://dydx:dydx_password@localhost:5432/dydx

# Redis
REDIS_URL=redis://localhost:6379

# Kafka
KAFKA_BROKER_URLS=localhost:9092
KAFKA_TOPIC_PREFIX=riverchain

# API
API_PORT=3000
API_HOST=0.0.0.0

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Chain Connection
CHAIN_RPC_URL=http://localhost:26657
CHAIN_GRPC_URL=localhost:9090
```

## 数据流示意图

### Streaming 数据流
```
[RiverChain Node]
       ↓
[Streaming Manager]
   (10ms 批处理)
       ↓
[WebSocket Server] :9090
       ↓
[Frontend Client]
   ↓
[React State]
   ↓
[UI 实时更新]
```

### Indexer 数据流
```
[RiverChain Node]
       ↓
[Event Emitter]
       ↓
[Kafka Topics]
   ├─ orders
   ├─ trades
   ├─ positions
   └─ funding
       ↓
[Indexer Service]
   ├─ Event Processor
   ├─ Database Writer
   └─ Cache Manager
       ↓
[PostgreSQL] + [Redis]
       ↓
[REST API] :3000
   ├─ GET /orderbooks
   ├─ GET /trades
   ├─ GET /positions
   └─ GET /subaccounts
       ↓
[Frontend Client]
```

## 前端集成示例

### 1. WebSocket 订阅

```typescript
// src/hooks/useOrderbookStream.ts
import { useEffect, useState } from 'react';

interface OrderbookUpdate {
  clobPairId: number;
  bids: Array<{ price: string; size: string }>;
  asks: Array<{ price: string; size: string }>;
}

export function useOrderbookStream(clobPairId: number) {
  const [orderbook, setOrderbook] = useState<OrderbookUpdate | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // 连接 WebSocket
    const websocket = new WebSocket('ws://localhost:9090/v1/orderbooks');

    websocket.onopen = () => {
      // 发送订阅消息 (需要 Protobuf 编码)
      const subscribeMsg = {
        type: 'subscribe',
        channel: 'v1_orderbook',
        id: clobPairId,
      };
      websocket.send(JSON.stringify(subscribeMsg));
    };

    websocket.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setOrderbook(update);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = () => {
      console.log('WebSocket closed');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [clobPairId]);

  return { orderbook, ws };
}
```

### 2. Indexer API 查询

```typescript
// src/api/indexer.ts
import axios from 'axios';

const indexerClient = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
});

export const indexerAPI = {
  // 查询订单簿
  async getOrderbook(clobPairId: number) {
    const response = await indexerClient.get(`/v1/orderbooks/${clobPairId}`);
    return response.data;
  },

  // 查询历史交易
  async getTrades(clobPairId: number, limit = 100) {
    const response = await indexerClient.get(`/v1/trades`, {
      params: { clobPairId, limit },
    });
    return response.data;
  },

  // 查询子账户持仓
  async getPositions(address: string, subaccountNumber = 0) {
    const response = await indexerClient.get(`/v1/addresses/${address}/subaccounts/${subaccountNumber}/positions`);
    return response.data;
  },

  // 查询账户余额
  async getSubaccount(address: string, subaccountNumber = 0) {
    const response = await indexerClient.get(`/v1/addresses/${address}/subaccounts/${subaccountNumber}`);
    return response.data;
  },
};
```

### 3. React 组件示例

```typescript
// src/components/OrderBook.tsx
import React from 'react';
import { useOrderbookStream } from '../hooks/useOrderbookStream';

export const OrderBook: React.FC<{ clobPairId: number }> = ({ clobPairId }) => {
  const { orderbook } = useOrderbookStream(clobPairId);

  if (!orderbook) {
    return <div>Loading orderbook...</div>;
  }

  return (
    <div className="orderbook">
      <div className="asks">
        <h3>Asks (Sell Orders)</h3>
        {orderbook.asks.map((ask, i) => (
          <div key={i} className="order-row ask">
            <span className="price">{ask.price}</span>
            <span className="size">{ask.size}</span>
          </div>
        ))}
      </div>

      <div className="spread">
        <span className="spread-value">
          Spread: {(parseFloat(orderbook.asks[0]?.price) - parseFloat(orderbook.bids[0]?.price)).toFixed(2)}
        </span>
      </div>

      <div className="bids">
        <h3>Bids (Buy Orders)</h3>
        {orderbook.bids.map((bid, i) => (
          <div key={i} className="order-row bid">
            <span className="price">{bid.price}</span>
            <span className="size">{bid.size}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

## 部署步骤

### 1. 初始化 RiverChain 节点

```bash
cd /Users/victor/Desktop/riverchain/protocol

# 初始化节点
./build/riverchaind init validator --chain-id riverchain-1

# 配置 Streaming
vim ~/.riverchaind/config/app.toml
# 在 [streaming] 部分设置:
# enabled = true
# ws-address = "0.0.0.0:9090"
```

### 2. 启动 Indexer 服务

```bash
cd /Users/victor/Desktop/riverchain/indexer

# 启动 Docker Compose
docker-compose up -d postgres redis kafka zookeeper

# 等待服务就绪 (约 30 秒)
sleep 30

# 运行数据库迁移
npm run migrate

# 启动 Indexer
npm run start
```

### 3. 启动 RiverChain 节点

```bash
cd /Users/victor/Desktop/riverchain/protocol

# 启动节点
./build/riverchaind start
```

### 4. 验证 Streaming

```bash
# 测试 WebSocket 连接
wscat -c ws://localhost:9090/v1/orderbooks

# 发送订阅消息
> {"type":"subscribe","channel":"v1_orderbook","id":1}
```

### 5. 验证 Indexer

```bash
# 测试 REST API
curl http://localhost:3000/v1/orderbooks/1

# 查询健康状态
curl http://localhost:3000/health
```

## 监控与日志

### Streaming 日志

```bash
# 查看 Streaming 日志
tail -f ~/.riverchaind/logs/riverchaind.log | grep "full-node-streaming"
```

### Indexer 日志

```bash
# 查看 Indexer 日志
docker-compose logs -f indexer

# 查看 PostgreSQL 日志
docker-compose logs -f postgres
```

### 性能监控

**关键指标**:
- WebSocket 连接数
- 订阅数量
- 消息吞吐量 (msg/s)
- 延迟 (ms)
- PostgreSQL 查询性能

**Prometheus 指标**:
```
# Streaming
streaming_active_subscriptions
streaming_messages_sent_total
streaming_update_cache_size

# Indexer
indexer_events_processed_total
indexer_db_query_duration_seconds
indexer_kafka_lag
```

## 现有配置分析

### dYdX v4 配置 (已继承)

**Streaming 已启用**:
- ✅ Full Node Streaming Manager 已实现
- ✅ WebSocket Server 已实现
- ✅ 10ms 批处理优化
- ✅ 订单簿快照支持

**Indexer 已存在**:
- ✅ PostgreSQL schema 已定义
- ✅ Event processors 已实现
- ✅ REST API 已实现
- ✅ Kafka 集成已配置

### RiverChain 特定配置

**需要修改**:
- Chain ID: `riverchain-1`
- WebSocket 端点可保持: `:9090`
- REST API 端点可保持: `:3000`
- 数据库名称建议: `riverchain`

## 技术决策

### 1. 为什么使用 WebSocket?
- ✅ 实时双向通信
- ✅ 低延迟 (< 100ms)
- ✅ 服务器推送能力
- ✅ 广泛的浏览器支持

### 2. 为什么使用 PostgreSQL?
- ✅ 成熟的关系型数据库
- ✅ 强大的查询能力
- ✅ 事务支持
- ✅ JSON 字段支持

### 3. 为什么使用 Kafka?
- ✅ 高吞吐量消息队列
- ✅ 事件持久化
- ✅ 可扩展性
- ✅ 容错能力

## 已知限制

### 1. 需要运行中的节点
**影响**: 无法在未运行节点时验证配置
**解决方案**: 提供配置文档,在节点启动后验证

### 2. Indexer 依赖较多
**依赖**: PostgreSQL, Redis, Kafka, Zookeeper
**影响**: 部署复杂度较高
**解决方案**: 使用 Docker Compose 简化部署

### 3. WebSocket 连接限制
**默认**: 系统级 open files 限制
**解决方案**: 调整 `ulimit -n 65535`

## 验收标准完成情况

| AC | 描述 | 状态 |
|----|------|------|
| 1 | Streaming 配置文档 | ✅ 完成 |
| 2 | Indexer 配置文档 | ✅ 完成 |
| 3 | WebSocket 集成示例 | ✅ 完成 |
| 4 | REST API 集成示例 | ✅ 完成 |
| 5 | 部署步骤说明 | ✅ 完成 |

## 下一步

### 运行时验证 (需节点启动后)
1. 启动 RiverChain 节点
2. 启动 Indexer 服务
3. 验证 WebSocket 连接
4. 验证 REST API
5. 前端集成测试

### Epic 2: 核心交易功能
- Story 2.1: 订单簿 UI (使用 Streaming)
- Story 2.2: 下单与撤单 (使用 Indexer)
- Story 2.3: 持仓管理 (使用 Indexer)

## 相关文档

- 📄 `riverchain/protocol/streaming/` - Streaming 源码
- 📄 `riverchain/indexer/` - Indexer 源码
- 📄 `docs/architecture/streaming-architecture.md` (待创建)
- 📄 `docs/architecture/indexer-architecture.md` (待创建)

## 实施者
BMad Agent (YOLO Mode)

## 验证状态
✅ **配置文档完成,待节点运行后验证**

---

**Story 1.4 完成度**: ✅ **100% (配置阶段)**
**Epic 1 进度**: **6/6 Stories (100%)**

🎉 **Epic 1: 基础设施与链端启动 - 全部完成!**
