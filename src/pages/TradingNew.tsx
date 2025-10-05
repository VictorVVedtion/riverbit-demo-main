/**
 * Trading Page (New Version with OrderBook)
 *
 * RiverBit v1.0 - 集成实时订单簿的交易页面
 */

import { useState } from 'react';
import { OrderBook, MarketStats } from '../components/trading/OrderBook';
import { OrderForm } from '../components/trading/OrderForm';
import { OpenOrders } from '../components/trading/OpenOrders';
import { Positions } from '../components/trading/Positions';
import { MarketStats as MarketStatsType } from '../types/orderbook';
import RiverbitLogo from '../components/RiverbitLogo';
import DesktopNav from '../components/DesktopNav';
import DesktopNavRight from '../components/DesktopNavRight';
import MobileMenu from '../components/MobileMenu';
import MobileHeader from '../components/MobileHeader';

/**
 * 交易页面
 */
export default function TradingNew() {
  const [selectedMarket] = useState('BTC-PERP');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // 模拟市场统计数据 (后续从 Indexer API 获取)
  const mockStats: MarketStatsType = {
    market: 'BTC-PERP',
    lastPrice: '50000.00',
    priceChange24h: '1250.50',
    priceChangePercent24h: '2.56',
    volume24h: '125000000',
    high24h: '50500.00',
    low24h: '48500.00',
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 桌面端导航栏 */}
      <div className="hidden lg:flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center space-x-8">
          <RiverbitLogo />
          <DesktopNav />
        </div>
        <DesktopNavRight />
      </div>

      {/* 移动端头部 */}
      <div className="lg:hidden">
        <MobileHeader onMenuClick={() => setShowMobileMenu(!showMobileMenu)} />
      </div>

      {/* 移动端菜单 */}
      {showMobileMenu && (
        <MobileMenu onClose={() => setShowMobileMenu(false)} />
      )}

      {/* 主内容区域 */}
      <div className="container mx-auto px-4 py-6">
        {/* 市场统计 */}
        <div className="mb-6">
          <MarketStats stats={mockStats} />
        </div>

        {/* 交易界面布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧: 订单簿 */}
          <div className="lg:col-span-3">
            <div className="h-[800px]">
              <OrderBook market={selectedMarket} depthLevels={20} />
            </div>
          </div>

          {/* 中间: 图表区域 (占位) */}
          <div className="lg:col-span-6">
            <div className="bg-gray-900 rounded-lg p-6 h-[500px] flex items-center justify-center border border-gray-800">
              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-semibold mb-2">TradingView 图表</h3>
                <p className="text-gray-400">集成中...</p>
              </div>
            </div>

            {/* Tabs: 仓位 / 订单 */}
            <div className="mt-6">
              <div className="bg-gray-900 rounded-lg">
                <div className="border-b border-gray-800">
                  <div className="flex space-x-4 px-4">
                    <button className="py-3 px-2 border-b-2 border-blue-500 text-blue-500 font-semibold">仓位</button>
                    <button className="py-3 px-2 text-gray-400 hover:text-white">当前订单</button>
                  </div>
                </div>
                <Positions market={selectedMarket} />
              </div>
            </div>
          </div>

          {/* 右侧: 下单面板 */}
          <div className="lg:col-span-3">
            <OrderForm market={selectedMarket} currentPrice={mockStats.lastPrice} />
          </div>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="fixed bottom-4 right-4 bg-blue-900/20 border border-blue-500 rounded-lg p-4 max-w-md">
        <div className="flex items-start space-x-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h4 className="font-semibold text-blue-400 mb-1">
              Story 2.1 - 订单簿 UI 已完成
            </h4>
            <p className="text-sm text-gray-300">
              左侧订单簿支持:
            </p>
            <ul className="text-xs text-gray-400 mt-2 space-y-1">
              <li>✅ WebSocket 实时订阅</li>
              <li>✅ 价格聚合 (0.01/0.1/1/10)</li>
              <li>✅ Decimal.js 精度计算</li>
              <li>✅ 买卖盘各 20 档深度</li>
              <li>⚠️ 需要启动 RiverChain 节点 (localhost:9090)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
