import { useState, useEffect } from 'react';
import { useRiverChain } from '../contexts/RiverChainContext';

export interface Referee {
  address: string;
  tier: number;
  tradingVolume: string;
  totalFees: string;
  myRevenue: string;
  joinedAt: number;
}

export function useReferees() {
  const { address } = useRiverChain();
  const [referees, setReferees] = useState<Referee[]>([]);
  const [directCount, setDirectCount] = useState(0);
  const [indirectCount, setIndirectCount] = useState(0);

  useEffect(() => {
    if (!address) return;

    // TODO: 查询链上推荐人列表
    const mockReferees: Referee[] = [];

    setReferees(mockReferees);
    setDirectCount(mockReferees.filter(r => r.tier === 1).length);
    setIndirectCount(mockReferees.filter(r => r.tier > 1).length);
  }, [address]);

  return { referees, directCount, indirectCount };
}
