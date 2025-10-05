import { useProposals } from '../../hooks/useProposals';
import { ProposalStatus } from '../../types/governance';
import { Link } from 'react-router-dom';

export default function ProposalList() {
  const { proposals } = useProposals();

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

  if (proposals.length === 0) {
    return (
      <div className="bg-gray-900 rounded-lg p-12 border border-gray-800 text-center">
        <p className="text-gray-400">暂无提案</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {proposals.map((proposal) => (
        <Link
          key={proposal.id}
          to={`/governance/${proposal.id}`}
          className="block p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">
                #{proposal.id} {proposal.title}
              </h3>
              <p className="text-gray-400 line-clamp-2">
                {proposal.description}
              </p>
            </div>
            <div className={`ml-4 px-3 py-1 rounded text-sm font-semibold ${getStatusColor(proposal.status)}`}>
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
    </div>
  );
}
