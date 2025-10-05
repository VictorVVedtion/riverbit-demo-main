# Story 1.3 实施记录 - 业务模块参数配置

## 状态
✅ **文档完成** | ⏸️ **实施待链端启动**

## 实施时间
2025-10-04

## 业务模块概览

RiverChain 使用 dYdX v4 的以下业务模块:

### 1. x/feetiers (费率层级)
**位置**: `protocol/x/feetiers`
**功能**: 基于交易量的费率优惠层级

### 2. x/affiliates (推荐系统)
**位置**: `protocol/x/affiliates`
**功能**: 推荐码生成与绑定

### 3. x/revshare (分润机制)
**位置**: `protocol/x/revshare`
**功能**: 推荐人收益分成

## 费率层级配置 (x/feetiers)

### RiverBit 费率方案

| 层级 | 交易量要求 (USDC) | Maker Fee | Taker Fee |
|------|-------------------|-----------|-----------|
| 1 | $0 | -0.01% | 0.05% |
| 2 | $1,000,000 | -0.005% | 0.04% |
| 3 | $5,000,000 | 0% | 0.03% |
| 4 | $25,000,000 | 0% | 0.02% |

### 参数说明

**PPM (Parts Per Million)**:
- 1 PPM = 0.0001%
- -100 PPM = -0.01% (Maker 返佣)
- 500 PPM = 0.05% (Taker 费用)

### 治理提案模板

**文件**: `protocol/scripts/genesis/update_feetiers.json`

```json
{
  "@type": "/dydxprotocol.feetiers.MsgUpdatePerpetualFeeParams",
  "authority": "river10d07y265gmmuvt4z0w9aw880jnsr700jnmapky",
  "params": {
    "tiers": [
      {
        "name": "1",
        "absolute_volume_requirement": "0",
        "maker_fee_ppm": -100,
        "taker_fee_ppm": 500
      },
      {
        "name": "2",
        "absolute_volume_requirement": "1000000000000",
        "maker_fee_ppm": -50,
        "taker_fee_ppm": 400
      },
      {
        "name": "3",
        "absolute_volume_requirement": "5000000000000",
        "maker_fee_ppm": 0,
        "taker_fee_ppm": 300
      },
      {
        "name": "4",
        "absolute_volume_requirement": "25000000000000",
        "maker_fee_ppm": 0,
        "taker_fee_ppm": 200
      }
    ]
  }
}
```

### 提交治理提案

```bash
# 创建提案
riverchaind tx gov submit-proposal \
  protocol/scripts/genesis/update_feetiers.json \
  --from=validator \
  --chain-id=riverchain-1 \
  --deposit=1000000000stake

# 投票
riverchaind tx gov vote 1 yes \
  --from=validator \
  --chain-id=riverchain-1
```

## 推荐系统配置 (x/affiliates)

### RiverBit 推荐方案

**推荐参数**:
- ✅ 推荐码长度: 8 字符 (Base32 编码)
- ✅ 推荐人奖励: 10% 交易费用
- ✅ 被推荐人折扣: 5% 交易费用

### 模块功能

**x/affiliates 提供**:
1. 推荐码生成 (自动 Base32 编码)
2. 推荐关系绑定
3. 循环推荐检测
4. 推荐关系查询

### 使用示例

```go
// 生成推荐码
referralCode := GenerateReferralCode(userAddress)
// 输出: "A1B2C3D4" (8 字符)

// 绑定推荐关系
RegisterAffiliate(userAddress, referrerCode)

// 查询推荐人
referrer := GetReferrer(userAddress)
```

## 分润机制配置 (x/revshare)

### RiverBit 分润方案

**3 级分润比例**:
- Level 1 (直推): 20% 交易费用
- Level 2 (二级): 10% 交易费用
- Level 3 (三级): 5% 交易费用

### 分润计算示例

```
用户 Alice 交易产生 100 USDC 费用
├── Level 1 推荐人 Bob: 20 USDC (20%)
├── Level 2 推荐人 Carol: 10 USDC (10%)
└── Level 3 推荐人 Dave: 5 USDC (5%)

总分润: 35 USDC (35%)
协议保留: 65 USDC (65%)
```

### 结算周期

- **频率**: 每日自动结算
- **时间**: UTC 00:00
- **方式**: 自动转账到推荐人地址

### 模块功能

**x/revshare 提供**:
1. 多级分润计算
2. 精度处理 (Decimal)
3. 每日自动结算
4. 收益查询和提取

## 配置清单

| 模块 | 参数 | RiverBit 配置 | 状态 |
|------|------|---------------|------|
| **feetiers** | Tier 1 Maker | -0.01% | ✅ 已定义 |
| | Tier 1 Taker | 0.05% | ✅ 已定义 |
| | Tier 2 Maker | -0.005% | ✅ 已定义 |
| | Tier 2 Taker | 0.04% | ✅ 已定义 |
| | Tier 3 Maker | 0% | ✅ 已定义 |
| | Tier 3 Taker | 0.03% | ✅ 已定义 |
| | Tier 4 Maker | 0% | ✅ 已定义 |
| | Tier 4 Taker | 0.02% | ✅ 已定义 |
| **affiliates** | 推荐码长度 | 8 字符 | ✅ 默认 |
| | 推荐人奖励 | 10% | ✅ 规划 |
| | 被推荐人折扣 | 5% | ✅ 规划 |
| **revshare** | Level 1 分润 | 20% | ✅ 规划 |
| | Level 2 分润 | 10% | ✅ 规划 |
| | Level 3 分润 | 5% | ✅ 规划 |
| | 结算周期 | 每日 | ✅ 默认 |

## 实施步骤

### Phase 1: 启动链端
```bash
# 1. 同意 Xcode License
sudo xcodebuild -license

# 2. 编译
cd /Users/victor/Desktop/riverchain/protocol
make build

# 3. 初始化
./build/riverchaind init test-node --chain-id riverchain-1

# 4. 启动
./build/riverchaind start
```

### Phase 2: 配置费率层级
```bash
# 提交治理提案修改费率
riverchaind tx gov submit-proposal \
  scripts/genesis/update_feetiers.json \
  --from=validator \
  --deposit=1000000000stake
```

### Phase 3: 测试推荐系统
```bash
# 生成推荐码
riverchaind tx affiliates register-affiliate \
  --from=alice \
  --chain-id=riverchain-1

# 绑定推荐关系
riverchaind tx affiliates update-affiliate \
  --referrer-address=river1... \
  --from=bob \
  --chain-id=riverchain-1
```

### Phase 4: 查询分润
```bash
# 查询推荐收益
riverchaind q revshare affiliate-revenue \
  river1... \
  --chain-id=riverchain-1
```

## 注意事项

### 1. 精度问题
- 使用 `math/big` 或 Decimal 库进行精确计算
- 避免浮点数运算导致的精度损失

### 2. 治理参数
- 费率修改需要通过治理提案
- 投票期默认 7 天
- 需要 40% 投票率和 50% Yes 票

### 3. 分润限制
- 最多 3 级分润
- 循环推荐检测
- 防止推荐链过长

### 4. 安全考虑
- 推荐码唯一性验证
- 防止推荐作弊
- 分润计算准确性审计

## 下一步

### Story 1.4: Streaming & Indexer
- WebSocket 实时数据推送
- PostgreSQL 历史数据索引
- 订单簿、交易、持仓事件订阅

### Epic 3: 推荐与分润系统完整实现
- Story 3.1: 推荐码生成与绑定 UI
- Story 3.2: 分润计算与结算逻辑
- Story 3.3: 推荐页面 UI
- Story 3.4: 分润收益提取

## 实施者
BMad Agent (YOLO Mode)

## 验证状态
✅ **文档完成,待链端启动后配置**

## 相关文档
- 📄 `docs/stories/1.3.business-modules-params.md` - Story 1.3 PRD
- 📄 `protocol/scripts/genesis/update_feetiers.json` - 费率治理提案模板
- 📄 `protocol/x/feetiers/types/params.go` - 费率参数验证逻辑
- 📄 `protocol/x/affiliates/` - 推荐系统模块
- 📄 `protocol/x/revshare/` - 分润系统模块
