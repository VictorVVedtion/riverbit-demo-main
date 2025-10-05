import { useState } from 'react';
import { useCreateProposal } from '../../hooks/useProposals';

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
    } else {
      alert('提案创建失败');
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold mb-6">创建提案</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">提案标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入提案标题"
            className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">提案描述</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="详细描述提案内容..."
            rows={6}
            className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            初始质押 (最小 {minDeposit} STAKE)
          </label>
          <input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            placeholder={`最小 ${minDeposit}`}
            className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isCreating || !title || !description}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
