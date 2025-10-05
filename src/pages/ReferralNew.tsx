import { useState, useEffect } from 'react';
import { useReferral } from '../hooks/useReferral';
import { useRiverChain } from '../contexts/RiverChainContext';
import { generateReferralLink, copyToClipboard, getReferralCodeFromUrl } from '../utils/referralUtils';
import RiverbitLogo from '../components/RiverbitLogo';
import DesktopNav from '../components/DesktopNav';
import DesktopNavRight from '../components/DesktopNavRight';
import MobileHeader from '../components/MobileHeader';
import MobileMenu from '../components/MobileMenu';
import RevenueStats from '../components/referral/RevenueStats';
import RefereeList from '../components/referral/RefereeList';
import WithdrawRevenue from '../components/referral/WithdrawRevenue';

export default function ReferralNew() {
  const { address } = useRiverChain();
  const { referralCode, generateCode, bindReferrer, loading } = useReferral();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const refCode = getReferralCodeFromUrl();
    if (refCode && address) {
      bindReferrer(refCode).then(success => {
        if (success) alert('推荐关系绑定成功!');
      });
    }
  }, [address]);

  const handleCopy = () => {
    if (referralCode) {
      const link = generateReferralLink(referralCode);
      copyToClipboard(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
          <h1 className="text-4xl font-bold mb-4">推荐计划</h1>
          <p className="text-gray-400 mb-12">邀请好友交易,赚取手续费返佣</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="text-xl font-semibold mb-2">15% 返佣</h3>
              <p className="text-gray-400 text-sm">一级推荐返佣比例</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-3xl mb-2">🔗</div>
              <h3 className="text-xl font-semibold mb-2">5% 二级返佣</h3>
              <p className="text-gray-400 text-sm">二级推荐返佣比例</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="text-xl font-semibold mb-2">实时结算</h3>
              <p className="text-gray-400 text-sm">每笔交易即时分润</p>
            </div>
          </div>

          {address ? (
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
              <h2 className="text-2xl font-semibold mb-6">我的推荐码</h2>
              {referralCode ? (
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex-1 bg-gray-800 rounded-lg p-4 font-mono text-2xl text-center">
                      {referralCode}
                    </div>
                    <button onClick={handleCopy} className="px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors">
                      {copied ? '已复制!' : '复制链接'}
                    </button>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">邀请链接:</p>
                    <p className="text-sm font-mono break-all">{generateReferralLink(referralCode)}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <button onClick={generateCode} disabled={loading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50">
                    {loading ? '生成中...' : '生成推荐码'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-12 border border-gray-800 text-center">
              <p className="text-xl text-gray-400 mb-4">请先连接钱包</p>
            </div>
          )}

          {address && <RevenueStats />}
          {address && <WithdrawRevenue />}
          {address && <RefereeList />}
        </div>
      </div>
    </div>
  );
}