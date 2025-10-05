import { useState, useEffect } from 'react';
import { useRiverChain } from '../contexts/RiverChainContext';
import { Position } from '../types/position';
import Decimal from 'decimal.js';

export function usePositions(market?: string) {
  const { address } = useRiverChain();
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    if (!address) return;
    setPositions([]);
  }, [address, market]);

  const totalUnrealizedPnl = positions.reduce(
    (sum, pos) => sum.plus(new Decimal(pos.unrealizedPnl)),
    new Decimal(0)
  ).toString();

  return { positions, totalUnrealizedPnl };
}
