export enum PositionSide {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export interface Position {
  market: string;
  side: PositionSide;
  size: string;
  entryPrice: string;
  markPrice: string;
  liquidationPrice: string;
  unrealizedPnl: string;
  realizedPnl: string;
  margin: string;
  marginRatio: string;
  leverage: number;
  updatedAt: number;
}
