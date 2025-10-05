import { useState, useEffect } from 'react';
import { useRiverChain } from '../contexts/RiverChainContext';
import Decimal from 'decimal.js';

export interface RevenueRecord {
  amount: string;
  timestamp: number;
  from: string;
  tier: number;
}

export interface RevenueData {
  pending: string;
  settled: string;
  history: RevenueRecord[];
}

export function useRevenue() {
  const { address } = useRiverChain();
  const [revenue, setRevenue] = useState<RevenueData | null>(null);

  useEffect(() => {
    if (!address) return;

    // TODO: 查询链上分润数据
    const mockHistory: RevenueRecord[] = [];
    const settled = mockHistory.reduce(
      (sum, r) => sum.plus(new Decimal(r.amount)),
      new Decimal(0)
    ).toString();

    setRevenue({
      pending: '0',
      settled,
      history: mockHistory,
    });
  }, [address]);

  return revenue;
}
