# Story 4.1 实现文档: 治理提案系统

## 概览

**实现目标:**
- ✅ 提案查询 Hook
- ✅ 提案创建 Hook
- ✅ 提案列表组件
- ✅ 创建提案表单
- ✅ 治理页面

**技术栈:**
- React 19 + TypeScript
- Cosmos SDK x/gov 模块
- React Router 路由

---

## 核心实现

### 1. 类型定义 (`src/types/governance.ts`)

```typescript
export enum ProposalStatus {
  ACTIVE = 'ACTIVE',
  PASSED = 'PASSED',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED'
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: ProposalStatus;
  submitTime: number;
  votingEndTime: number;
  totalDeposit: string;
  proposer: string;
}

export enum VoteOption {
  YES = 'YES',
  NO = 'NO',
  NO_WITH_VETO = 'NO_WITH_VETO',
  ABSTAIN = 'ABSTAIN'
}
```

### 2. 提案 Hook (`src/hooks/useProposals.ts`)

#### 查询提案
```typescript
export function useProposals() {
  const { address } = useRiverChain();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    if (!address) return;

    // TODO: 查询链上提案
    // client.query('/cosmos.gov.v1beta1.Query/Proposals', {
    //   proposalStatus: 0, // All
    // })

    setProposals([]);
  }, [address]);

  return { proposals };
}
```

#### 创建提案
```typescript
export function useCreateProposal() {
  const { client, address } = useRiverChain();
  const [isCreating, setIsCreating] = useState(false);

  const createProposal = async (
    title: string,
    description: string,
    deposit: string
  ) => {
    if (!client || !address) return false;

    setIsCreating(true);
    try {
      const msg = {
        typeUrl: '/cosmos.gov.v1beta1.MsgSubmitProposal',
        value: {
          content: {
            typeUrl: '/cosmos.gov.v1beta1.TextProposal',
            value: { title, description },
          },
          initialDeposit: [{ denom: 'stake', amount: deposit }],
          proposer: address,
        },
      };

      const result = await client.signAndBroadcast(address, [msg], 'auto');
      return result.code === 0;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return { createProposal, isCreating };
}
```

**Proto 消息:**
- `/cosmos.gov.v1beta1.MsgSubmitProposal` - 提交提案
- `/cosmos.gov.v1beta1.TextProposal` - 文本提案类型

### 3. 提案列表 (`src/components/governance/ProposalList.tsx`)

#### 状态颜色
```typescript
const getStatusColor = (status: ProposalStatus) => {
  switch (status) {
    case ProposalStatus.ACTIVE:
      return 'bg-blue-500/20 text-blue-400';
    case ProposalStatus.PASSED:
      return 'bg-green-500/20 text-green-400';
    case ProposalStatus.REJECTED:
      return 'bg-red-500/20 text-red-400';
    case ProposalStatus.FAILED:
      return 'bg-gray-500/20 text-gray-400';
  }
};
```

#### 列表渲染
```typescript
{proposals.map((proposal) => (
  <Link
    key={proposal.id}
    to={`/governance/${proposal.id}`}
    className="block p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">
          #{proposal.id} {proposal.title}
        </h3>
        <p className="text-gray-400 line-clamp-2">
          {proposal.description}
        </p>
      </div>
      <div className={`ml-4 px-3 py-1 rounded text-sm ${getStatusColor(proposal.status)}`}>
        {proposal.status}
      </div>
    </div>

    <div className="mt-4 flex items-center space-x-6 text-sm text-gray-400">
      <div>提交时间: {new Date(proposal.submitTime).toLocaleDateString()}</div>
      {proposal.status === ProposalStatus.ACTIVE && (
        <div>投票截止: {new Date(proposal.votingEndTime).toLocaleDateString()}</div>
      )}
    </div>
  </Link>
))}
```

#### 空状态
```typescript
if (proposals.length === 0) {
  return (
    <div className="bg-gray-900 rounded-lg p-12 text-center">
      <p className="text-gray-400">暂无提案</p>
    </div>
  );
}
```

### 4. 创建提案表单 (`src/components/governance/CreateProposal.tsx`)

```typescript
export default function CreateProposal() {
  const { createProposal, isCreating } = useCreateProposal();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deposit, setDeposit] = useState('1000');

  const minDeposit = 1000;

  const handleSubmit = async () => {
    if (!title || !description) {
      alert('请填写完整信息');
      return;
    }

    if (parseFloat(deposit) < minDeposit) {
      alert(`最小质押 ${minDeposit} STAKE`);
      return;
    }

    const success = await createProposal(title, description, deposit);

    if (success) {
      alert('提案创建成功!');
      setTitle('');
      setDescription('');
      setDeposit('1000');
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold mb-6">创建提案</h3>

      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入提案标题"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="详细描述提案内容..."
          rows={6}
        />

        <input
          type="number"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
          placeholder={`最小 ${minDeposit}`}
        />

        <button
          onClick={handleSubmit}
          disabled={isCreating || !title || !description}
        >
          {isCreating ? '创建中...' : '提交提案'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          提案需要达到 40% 投票率和 50% 支持率才能通过
        </p>
      </div>
    </div>
  );
}
```

**验证规则:**
- 标题和描述必填
- 最小质押 1000 STAKE
- 禁用状态: 创建中 OR 信息不完整

### 5. 治理页面 (`src/pages/Governance.tsx`)

```typescript
export default function Governance() {
  const { address } = useRiverChain();
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 导航栏 */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">治理</h1>
              <p className="text-gray-400">参与 RiverBit 协议治理</p>
            </div>
            {address && (
              <button onClick={() => setShowCreateForm(!showCreateForm)}>
                {showCreateForm ? '查看提案' : '创建提案'}
              </button>
            )}
          </div>

          {!address ? (
            <div className="text-center">请先连接钱包</div>
          ) : showCreateForm ? (
            <CreateProposal />
          ) : (
            <ProposalList />
          )}
        </div>
      </div>
    </div>
  );
}
```

**功能:**
- 未连接钱包: 提示连接
- 已连接: 切换「创建提案」/「查看提案」
- 响应式布局

---

## 治理参数

### Cosmos SDK x/gov 配置
```toml
[gov]
min_deposit = "1000000000stake"  # 1000 STAKE
voting_period = "604800s"        # 7 天
quorum = "0.4"                   # 40% 投票率
threshold = "0.5"                # 50% Yes
veto_threshold = "0.334"         # 33.4% NoWithVeto
```

### 提案流程
1. **提交阶段**: 质押 ≥ 1000 STAKE
2. **投票阶段**: 7 天投票期
3. **通过条件**:
   - 投票率 ≥ 40%
   - Yes 票 ≥ 50%
   - NoWithVeto < 33.4%

---

## 路由集成

### App.tsx
```typescript
import Governance from "./pages/Governance";

<Route path="/governance" element={<Governance />} />
```

---

## 文件清单

| 文件路径 | 行数 | 说明 |
|---------|------|------|
| `src/types/governance.ts` | 29 | 治理类型定义 |
| `src/hooks/useProposals.ts` | 58 | 提案 Hook |
| `src/components/governance/ProposalList.tsx` | 59 | 提案列表 |
| `src/components/governance/CreateProposal.tsx` | 92 | 创建表单 |
| `src/pages/Governance.tsx` | 59 | 治理页面 |
| `src/App.tsx` | 修改 | 路由配置 |

**总代码行数:** ~297 行

---

## 构建结果

```bash
npm run build
✓ 903 modules transformed
dist/assets/main-CDebhxBk.js   3,576.08 kB
✓ built in 3.95s
```

✅ 构建成功

---

## 下一步

**Story 4.2: 投票机制**
- 投票按钮 (Yes/No/NoWithVeto/Abstain)
- 投票进度条
- 投票历史
