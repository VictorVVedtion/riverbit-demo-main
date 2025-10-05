import { useState } from 'react';
import { useRiverChain } from '../contexts/RiverChainContext';

export function useClosePosition() {
  const { client, address } = useRiverChain();
  const [isClosing, setIsClosing] = useState(false);

  const closePosition = async (market: string, size: string) => {
    if (!client || !address) return false;
    if (!confirm('确认平仓?')) return false;

    setIsClosing(true);
    try {
      const msg = {
        typeUrl: '/dydxprotocol.clob.MsgPlaceOrder',
        value: {
          order: {
            orderId: { subaccountId: { owner: address, number: 0 }, clientId: Date.now(), clobPairId: 0, orderFlags: 64 },
            side: 1,
            quantums: new (await import('decimal.js')).default(size).times(1e6).toFixed(0),
            subticks: '0',
            goodTilBlockTime: Math.floor(Date.now() / 1000) + 60,
            timeInForce: 1,
            reduceOnly: true,
          },
        },
      };
      const result = await client.signAndBroadcast(address, [msg], { amount: [{ denom: 'stake', amount: '5000' }], gas: '200000' }, 'Close position');
      return result.code === 0;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsClosing(false);
    }
  };

  return { closePosition, isClosing };
}
