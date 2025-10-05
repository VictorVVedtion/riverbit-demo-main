import Decimal from 'decimal.js';
import { PositionSide } from '../types/position';

export function calculateUnrealizedPnl(side: PositionSide, entryPrice: string, markPrice: string, size: string): string {
  const entry = new Decimal(entryPrice);
  const mark = new Decimal(markPrice);
  const sizeDecimal = new Decimal(size);
  if (side === PositionSide.LONG) {
    return mark.minus(entry).times(sizeDecimal).toString();
  } else {
    return entry.minus(mark).times(sizeDecimal).toString();
  }
}

export function calculateLiquidationPrice(side: PositionSide, entryPrice: string, leverage: number): string {
  const entry = new Decimal(entryPrice);
  const maintenanceMarginRatio = new Decimal(0.03);
  if (side === PositionSide.LONG) {
    return entry.times(new Decimal(1).minus(new Decimal(1).dividedBy(leverage)).plus(maintenanceMarginRatio)).toString();
  } else {
    return entry.times(new Decimal(1).plus(new Decimal(1).dividedBy(leverage)).minus(maintenanceMarginRatio)).toString();
  }
}
