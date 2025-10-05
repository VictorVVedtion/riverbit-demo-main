import { useVote, useTallyResult } from '../../hooks/useVote';
import { VoteOption } from '../../types/governance';
import Decimal from 'decimal.js';

interface VotePanelProps {
  proposalId: string;
}

export default function VotePanel({ proposalId }: VotePanelProps) {
  const { vote, voting } = useVote(proposalId);
  const tally = useTallyResult(proposalId);

  const handleVote = async (option: VoteOption) => {
    const optionText = {
      [VoteOption.YES]: '赞成',
      [VoteOption.NO]: '反对',
      [VoteOption.ABSTAIN]: '弃权',
      [VoteOption.NO_WITH_VETO]: '强烈反对',
    }[option];

    if (confirm(`确认投 ${optionText} 票?`)) {
      const success = await vote(option);
      if (success) {
        alert('投票成功!');
      } else {
        alert('投票失败');
      }
    }
  };

  const calculatePercentage = (amount: string, total: string) => {
    if (new Decimal(total).isZero()) return '0';
    return new Decimal(amount).div(total).times(100).toFixed(1);
  };

  const totalVotes = tally
    ? new Decimal(tally.yes)
        .plus(tally.no)
        .plus(tally.abstain)
        .plus(tally.noWithVeto)
        .toString()
    : '0';

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h3 className="text-xl font-semibold mb-6">投票</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => handleVote(VoteOption.YES)}
          disabled={voting}
          className="py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          赞成 (Yes)
        </button>
        <button
          onClick={() => handleVote(VoteOption.NO)}
          disabled={voting}
          className="py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          反对 (No)
        </button>
        <button
          onClick={() => handleVote(VoteOption.ABSTAIN)}
          disabled={voting}
          className="py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          弃权 (Abstain)
        </button>
        <button
          onClick={() => handleVote(VoteOption.NO_WITH_VETO)}
          disabled={voting}
          className="py-3 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          强烈反对 (Veto)
        </button>
      </div>

      {tally && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-400 mb-3">投票统计</h4>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-green-400">赞成</span>
              <span className="text-green-400">
                {calculatePercentage(tally.yes, totalVotes)}%
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${calculatePercentage(tally.yes, totalVotes)}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-red-400">反对</span>
              <span className="text-red-400">
                {calculatePercentage(tally.no, totalVotes)}%
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500"
                style={{
                  width: `${calculatePercentage(tally.no, totalVotes)}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-400">弃权</span>
              <span className="text-gray-400">
                {calculatePercentage(tally.abstain, totalVotes)}%
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-500"
                style={{
                  width: `${calculatePercentage(tally.abstain, totalVotes)}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-orange-400">强烈反对</span>
              <span className="text-orange-400">
                {calculatePercentage(tally.noWithVeto, totalVotes)}%
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500"
                style={{
                  width: `${calculatePercentage(tally.noWithVeto, totalVotes)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
