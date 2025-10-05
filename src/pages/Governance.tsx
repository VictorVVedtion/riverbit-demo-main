import { useState } from 'react';
import { useRiverChain } from '../contexts/RiverChainContext';
import RiverbitLogo from '../components/RiverbitLogo';
import DesktopNav from '../components/DesktopNav';
import DesktopNavRight from '../components/DesktopNavRight';
import MobileHeader from '../components/MobileHeader';
import MobileMenu from '../components/MobileMenu';
import ProposalList from '../components/governance/ProposalList';
import CreateProposal from '../components/governance/CreateProposal';

export default function Governance() {
  const { address } = useRiverChain();
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">治理</h1>
              <p className="text-gray-400">参与 RiverBit 协议治理</p>
            </div>
            {address && (
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
              >
                {showCreateForm ? '查看提案' : '创建提案'}
              </button>
            )}
          </div>

          {!address ? (
            <div className="bg-gray-900 rounded-lg p-12 border border-gray-800 text-center">
              <p className="text-xl text-gray-400">请先连接钱包</p>
            </div>
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
