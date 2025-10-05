# Story 3.2 实现文档: 分润计算与结算

## 概览

**实现目标:**
- ✅ 分润数据查询 Hook
- ✅ 收益统计展示组件
- ✅ 分润历史记录
- ⏳ 链端分润逻辑 (后续集成)

**技术栈:**
- React 19 + TypeScript
- Decimal.js (精确计算)
- RiverChain Revshare 模块

---

## 核心实现

### 1. 分润 Hook (`src/hooks/useRevenue.ts`)

```typescript
export interface RevenueRecord {
  amount: string;      // 分润金额
  timestamp: number;   // 结算时间
  from: string;        // 来源地址
  tier: number;        // 层级 (1/2/3)
}

export interface RevenueData {
  pending: string;     // 待结算
  settled: string;     // 已结算
  history: RevenueRecord[];
}

export function useRevenue() {
  const { address } = useRiverChain();
  const [revenue, setRevenue] = useState<RevenueData | null>(null);

  useEffect(() => {
    if (!address) return;

    // TODO: 查询链上数据
    // const data = await fetch(`/indexer/v1/revenue/${address}`);

    setRevenue({
      pending: '0',
      settled: '0',
      history: [],
    });
  }, [address]);

  return revenue;
}
```

**设计原则:**
- 所有金额字段使用 `string` (避免精度丢失)
- Decimal.js 计算累计收益
- Mock 数据占位,预留 API 集成

### 2. 收益统计组件 (`src/components/referral/RevenueStats.tsx`)

#### 三卡片布局
```typescript
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="bg-gray-800 rounded-lg p-4">
    <p className="text-sm text-gray-400">待结算</p>
    <p className="text-2xl font-bold text-yellow-500">
      {new Decimal(revenue.pending).toFixed(2)} USDC
    </p>
  </div>

  <div className="bg-gray-800 rounded-lg p-4">
    <p className="text-sm text-gray-400">已结算</p>
    <p className="text-2xl font-bold text-green-500">
      {new Decimal(revenue.settled).toFixed(2)} USDC
    </p>
  </div>

  <div className="bg-gray-800 rounded-lg p-4">
    <p className="text-sm text-gray-400">累计收益</p>
    <p className="text-2xl font-bold text-blue-500">
      {totalRevenue.toFixed(2)} USDC
    </p>
  </div>
</div>
```

**颜色编码:**
- 黄色: 待结算 (等待每日自动结算)
- 绿色: 已结算 (已到账可提取)
- 蓝色: 累计总收益

#### 结算历史列表
```typescript
{revenue.history.map((record, i) => (
  <div key={i} className="flex items-center justify-between bg-gray-800 rounded p-3">
    <div>
      <p className="text-sm font-mono">{record.from.slice(0, 10)}...</p>
      <p className="text-xs text-gray-500">
        {new Date(record.timestamp).toLocaleDateString()} · Tier {record.tier}
      </p>
    </div>
    <p className="text-sm font-semibold text-green-500">
      +{new Decimal(record.amount).toFixed(2)} USDC
    </p>
  </div>
))}
```

**功能特性:**
- 显示来源地址 (截断)
- 结算日期 + 层级标签
- 滚动容器 (max-h-60)

### 3. 页面集成 (`src/pages/ReferralNew.tsx`)

```typescript
import RevenueStats from '../components/referral/RevenueStats';

// 在推荐码卡片下方显示
{address && <RevenueStats />}
```

**布局结构:**
1. 推荐计划介绍 (3卡片)
2. 推荐码卡片
3. **收益统计卡片** (新增)

---

## 链端分润逻辑 (待集成)

### 分润比例
- Tier 1: 20% (一级推荐)
- Tier 2: 10% (二级推荐)
- Tier 3: 5% (三级推荐)

### 自动结算流程
1. 交易完成后触发 `DistributeRevenue`
2. 查询推荐链 (最多3层)
3. 按比例计算分润金额
4. 累加到待结算余额
5. 每日 UTC 00:00 批量结算到用户余额

### Proto 查询
```typescript
// 查询待结算余额
client.query('/riverchain.revshare.v1.Query/PendingRevenue', { address })

// 查询结算历史
client.query('/riverchain.revshare.v1.Query/RevenueHistory', {
  address,
  limit: 100,
  offset: 0
})
```

---

## 文件清单

| 文件路径 | 行数 | 说明 |
|---------|------|------|
| `src/hooks/useRevenue.ts` | 39 | 分润数据 Hook |
| `src/components/referral/RevenueStats.tsx` | 52 | 收益统计组件 |
| `src/pages/ReferralNew.tsx` | 修改 | 集成收益组件 |

**总代码行数:** ~91 行

---

## 构建结果

```bash
npm run build
✓ 895 modules transformed
dist/assets/main-D8PGzaJ7.js   3,564.11 kB
✓ built in 4.12s
```

✅ 构建成功

---

## 下一步

**Story 3.3: 推荐页面 UI** (部分已完成)
**Story 3.4: 收益提取**
