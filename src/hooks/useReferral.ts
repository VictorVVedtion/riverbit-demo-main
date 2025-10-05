import { useState } from 'react';
import { useRiverChain } from '../contexts/RiverChainContext';

export function useReferral() {
  const { client, address } = useRiverChain();
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const registerAffiliate = async (referrer: string = '') => {
    if (!client || !address) return null;
    setLoading(true);
    try {
      const msg = {
        typeUrl: '/dydxprotocol.affiliates.MsgRegisterAffiliate',
        value: { referee: address, referrer },
      };
      const result = await client.signAndBroadcast(address, [msg], 'auto');
      if (result.code === 0) {
        if (!referrer) {
          const code = 'ABC' + Date.now().toString().slice(-5);
          setReferralCode(code);
          return code;
        }
        return true;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    return null;
  };

  return {
    referralCode,
    generateCode: () => registerAffiliate(''),
    bindReferrer: (code: string) => registerAffiliate(code),
    loading
  };
}