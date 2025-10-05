import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRiverChain } from '../contexts/RiverChainContext';
import { ProposalStatus } from '../types/governance';
import RiverbitLogo from '../components/RiverbitLogo';
import DesktopNav from '../components/DesktopNav';
import DesktopNavRight from '../components/DesktopNavRight';
import MobileHeader from '../components/MobileHeader';
import MobileMenu from '../components/MobileMenu';
import VotePanel from '../components/governance/VotePanel';

export default function ProposalDetail() {
  const { id } = useParams<{ id: string }>();
  const { address } = useRiverChain();
  const [showMenu, setShowMenu] = useState(false);

  // TODO: 查询提案详情
  const proposal = {
    id: id || '1',
    title: '示例提案',
    description: '这是一个示例提案的详细描述...',
    status: ProposalStatus.ACTIVE,
    submitTime: Date.now(),
    votingEndTime: Date.now() + 7 * 24 * 60 * 60 * 1000,
    totalDeposit: '1000',
    proposer: 'river1...',
  };

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

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center space-x-8">
          <RiverbitLogo />
          <DesktopNav />
        </div>
        <DesktopNavRight />
      </div>
      <div className="lg:hidden">
        <MobileHeader onMenuClick={() => setShowMenu(!showMenu)} />
      </div>
      {showMenu && <MobileMenu onClose={() => setShowMenu(false)} />}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/governance"
            className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            ← 返回治理页面
          </Link>

          <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 mb-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold">
                #{proposal.id} {proposal.title}
              </h1>
              <div
                className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(proposal.status)}`}
              >
                {proposal.status}
              </div>
            </div>

            <div className="prose prose-invert max-w-none mb-6">
              <p className="text-gray-300">{proposal.description}</p>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div>提交时间: {new Date(proposal.submitTime).toLocaleDateString()}</div>
              {proposal.status === ProposalStatus.ACTIVE && (
                <div>
                  投票截止: {new Date(proposal.votingEndTime).toLocaleDateString()}
                </div>
              )}
              <div>质押: {proposal.totalDeposit} STAKE</div>
            </div>
          </div>

          {address && proposal.status === ProposalStatus.ACTIVE && (
            <VotePanel proposalId={proposal.id} />
          )}

          {!address && (
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 text-center">
              <p className="text-gray-400">请先连接钱包以进行投票</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
