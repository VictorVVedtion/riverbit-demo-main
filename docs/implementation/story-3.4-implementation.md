# Story 3.4 实现文档: 分润提取

## 概览

**实现目标:**
- ✅ 提取收益组件
- ✅ 金额验证 (最小 10 USDC)
- ✅ MAX 按钮快速填充
- ✅ 链上提取消息

**技术栈:**
- React 19 + TypeScript
- Decimal.js 精确计算
- RiverChain Revshare 模块

---

## 核心实现

### 提取组件 (`src/components/referral/WithdrawRevenue.tsx`)

#### 状态管理
```typescript
const [amount, setAmount] = useState('');
const [isWithdrawing, setIsWithdrawing] = useState(false);

const availableBalance = revenue.settled;
const minAmount = 10;
const isAmountValid = amount &&
  parseFloat(amount) >= minAmount &&
  parseFloat(amount) <= parseFloat(availableBalance);
```

#### 提取逻辑
```typescript
const handleWithdraw = async () => {
  if (!client || !address) return;

  setIsWithdrawing(true);
  try {
    const msg = {
      typeUrl: '/riverchain.revshare.v1.MsgWithdrawRevenue',
      value: {
        address,
        amount: new Decimal(amount).times(1e6).toString(), // USDC 6位小数
      },
    };

    const result = await client.signAndBroadcast(address, [msg], 'auto');

    if (result.code === 0) {
      alert('提取成功!');
      setAmount('');
    }
  } catch (err) {
    console.error(err);
    alert('提取失败');
  } finally {
    setIsWithdrawing(false);
  }
};
```

**关键点:**
- USDC 使用 6 位小数,需乘以 `1e6`
- 使用 Decimal.js 确保精度
- 成功后清空输入框

#### UI 布局
```typescript
<div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
  <h3 className="text-xl font-semibold mb-4">提取收益</h3>

  {/* 余额显示 */}
  <label className="block text-sm text-gray-400 mb-2">
    可提取余额: <span className="text-white font-semibold">
      {new Decimal(availableBalance).toFixed(2)} USDC
    </span>
  </label>

  {/* 输入框 + MAX 按钮 */}
  <div className="relative">
    <input
      type="number"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      placeholder="最小 10 USDC"
      className="w-full px-4 py-3 bg-gray-800 rounded-lg"
    />
    <button
      onClick={handleMaxClick}
      className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
    >
      MAX
    </button>
  </div>

  {/* 错误提示 */}
  {amount && parseFloat(amount) < minAmount && (
    <p className="text-sm text-red-500 mt-1">最小提取金额为 10 USDC</p>
  )}
  {amount && parseFloat(amount) > parseFloat(availableBalance) && (
    <p className="text-sm text-red-500 mt-1">余额不足</p>
  )}

  {/* 提取按钮 */}
  <button
    onClick={handleWithdraw}
    disabled={isWithdrawing || !isAmountValid}
    className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
  >
    {isWithdrawing ? '提取中...' : '提取到主账户'}
  </button>

  <p className="text-xs text-gray-500 mt-3 text-center">
    提取将在下一个区块确认后到账
  </p>
</div>
```

#### 验证逻辑
1. **最小金额**: 10 USDC
2. **最大金额**: 可提取余额
3. **禁用条件**: 提取中 OR 金额无效

#### MAX 按钮
```typescript
const handleMaxClick = () => {
  setAmount(availableBalance);
};
```

一键填充全部可提取余额

---

## 链端 Proto 消息

### MsgWithdrawRevenue
```protobuf
message MsgWithdrawRevenue {
  string address = 1;
  string amount = 2;  // 单位: uusdc (1e-6 USDC)
}

message MsgWithdrawRevenueResponse {
  bool success = 1;
}
```

### 处理流程
1. 验证最小金额 (10 USDC = 10,000,000 uusdc)
2. 检查余额是否充足
3. 从模块账户转账到用户账户
4. 扣减已结算余额
5. 记录提取历史

---

## 页面集成 (`src/pages/ReferralNew.tsx`)

```typescript
import WithdrawRevenue from '../components/referral/WithdrawRevenue';

// 页面结构
{address && <RevenueStats />}
{address && <WithdrawRevenue />}  // 新增
{address && <RefereeList />}
```

**完整布局:**
1. 推荐计划介绍
2. 推荐码卡片
3. 收益统计面板
4. **提取收益卡片** (新增)
5. 推荐人列表

---

## 文件清单

| 文件路径 | 行数 | 说明 |
|---------|------|------|
| `src/components/referral/WithdrawRevenue.tsx` | 89 | 提取组件 |
| `src/pages/ReferralNew.tsx` | 修改 | 集成提取组件 |

**总代码行数:** ~89 行

---

## 构建结果

```bash
npm run build
✓ 898 modules transformed
dist/assets/main-qZiPM9Ek.js   3,569.66 kB
✓ built in 3.96s
```

✅ 构建成功

---

## Epic 3 完成总结

**已完成 Stories:**
- ✅ Story 3.1: 推荐码生成与绑定
- ✅ Story 3.2: 分润计算与结算
- ✅ Story 3.3: 推荐页 UI
- ✅ Story 3.4: 收益提取

**Epic 3 总代码量:**
- Story 3.1: ~204 行
- Story 3.2: ~91 行
- Story 3.3: ~94 行
- Story 3.4: ~89 行
- **总计: ~478 行**

**核心功能:**
- 推荐码生成与 URL 自动绑定
- 三级推荐体系 (20%/10%/5%)
- 分润实时计算与每日结算
- 推荐人列表与统计
- 收益提取 (最小 10 USDC)

**待集成:**
- Indexer API 真实数据
- 链端分润逻辑
- 提取历史记录
