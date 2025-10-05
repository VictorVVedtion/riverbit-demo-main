import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SigningStargateClient, StargateClient } from '@cosmjs/stargate';
import { Window as KeplrWindow } from '@keplr-wallet/types';

declare global {
  interface Window extends KeplrWindow {
    leap?: KeplrWindow['keplr'];
  }
}

interface RiverChainContextType {
  client: SigningStargateClient | null;
  address: string | null;
  balance: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
}

const RiverChainContext = createContext<RiverChainContextType | undefined>(undefined);

const RIVERCHAIN_CONFIG = {
  chainId: 'riverchain-1',
  chainName: 'RiverChain',
  rpc: 'http://localhost:26657',
  rest: 'http://localhost:1317',
  bip44: {
    coinType: 118,
  },
  bech32Config: {
    bech32PrefixAccAddr: 'river',
    bech32PrefixAccPub: 'riverpub',
    bech32PrefixValAddr: 'rivervaloper',
    bech32PrefixValPub: 'rivervaloperpub',
    bech32PrefixConsAddr: 'rivervalcons',
    bech32PrefixConsPub: 'rivervalconspub',
  },
  currencies: [
    {
      coinDenom: 'STAKE',
      coinMinimalDenom: 'stake',
      coinDecimals: 6,
      coinGeckoId: 'riverchain',
    },
  ],
  feeCurrencies: [
    {
      coinDenom: 'STAKE',
      coinMinimalDenom: 'stake',
      coinDecimals: 6,
      coinGeckoId: 'riverchain',
      gasPriceStep: {
        low: 0.01,
        average: 0.025,
        high: 0.04,
      },
    },
  ],
  stakeCurrency: {
    coinDenom: 'STAKE',
    coinMinimalDenom: 'stake',
    coinDecimals: 6,
    coinGeckoId: 'riverchain',
  },
};

interface RiverChainProviderProps {
  children: ReactNode;
}

export const RiverChainProvider: React.FC<RiverChainProviderProps> = ({ children }) => {
  const [client, setClient] = useState<SigningStargateClient | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected = !!client && !!address;

  // 监听账户切换
  useEffect(() => {
    if (!window.keplr && !window.leap) return;

    const handleAccountChange = () => {
      // 重新连接
      if (isConnected) {
        connect();
      }
    };

    window.addEventListener('keplr_keystorechange', handleAccountChange);
    window.addEventListener('leap_keystorechange', handleAccountChange);

    return () => {
      window.removeEventListener('keplr_keystorechange', handleAccountChange);
      window.removeEventListener('leap_keystorechange', handleAccountChange);
    };
  }, [isConnected]);

  // 自动刷新余额
  useEffect(() => {
    if (!client || !address) return;

    const fetchBalance = async () => {
      try {
        const queryClient = await StargateClient.connect(RIVERCHAIN_CONFIG.rpc);
        const balanceResult = await queryClient.getBalance(address, 'stake');
        setBalance(balanceResult.amount);
      } catch (err) {
        console.error('Error fetching balance:', err);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000); // 每 10 秒刷新

    return () => clearInterval(interval);
  }, [client, address]);

  const connect = async () => {
    setIsConnecting(true);
    try {
      // 优先尝试 Keplr
      const wallet = window.keplr || window.leap;
      if (!wallet) {
        throw new Error('请安装 Keplr 或 Leap 钱包插件');
      }

      // 建议添加 RiverChain 配置
      try {
        await wallet.experimentalSuggestChain(RIVERCHAIN_CONFIG);
      } catch (err) {
        console.warn('Chain already added or suggestion failed:', err);
      }

      // 请求连接
      await wallet.enable(RIVERCHAIN_CONFIG.chainId);

      // 获取离线签名器
      const offlineSigner = wallet.getOfflineSigner(RIVERCHAIN_CONFIG.chainId);
      const accounts = await offlineSigner.getAccounts();

      if (accounts.length === 0) {
        throw new Error('未找到账户');
      }

      // 创建签名客户端
      const signingClient = await SigningStargateClient.connectWithSigner(
        RIVERCHAIN_CONFIG.rpc,
        offlineSigner
      );

      setClient(signingClient);
      setAddress(accounts[0].address);

      console.log('✅ 已连接 RiverChain:', accounts[0].address);
    } catch (err) {
      console.error('连接钱包失败:', err);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setClient(null);
    setAddress(null);
    setBalance(null);
    console.log('🔌 已断开 RiverChain 连接');
  };

  const value: RiverChainContextType = {
    client,
    address,
    balance,
    connect,
    disconnect,
    isConnected,
    isConnecting,
  };

  return (
    <RiverChainContext.Provider value={value}>
      {children}
    </RiverChainContext.Provider>
  );
};

export const useRiverChain = (): RiverChainContextType => {
  const context = useContext(RiverChainContext);
  if (!context) {
    throw new Error('useRiverChain must be used within RiverChainProvider');
  }
  return context;
};
