import { useState, useEffect } from 'react';
import { useRiverChain } from '../contexts/RiverChainContext';
import { Proposal } from '../types/governance';

export function useProposals() {
  const { address } = useRiverChain();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  useEffect(() => {
    if (!address) return;

    // TODO: 查询链上提案
    const mockProposals: Proposal[] = [];

    setProposals(mockProposals);
  }, [address]);

  return { proposals };
}

export function useCreateProposal() {
  const { client, address } = useRiverChain();
  const [isCreating, setIsCreating] = useState(false);

  const createProposal = async (
    title: string,
    description: string,
    deposit: string
  ) => {
    if (!client || !address) return false;

    setIsCreating(true);
    try {
      const msg = {
        typeUrl: '/cosmos.gov.v1beta1.MsgSubmitProposal',
        value: {
          content: {
            typeUrl: '/cosmos.gov.v1beta1.TextProposal',
            value: { title, description },
          },
          initialDeposit: [{ denom: 'stake', amount: deposit }],
          proposer: address,
        },
      };

      const result = await client.signAndBroadcast(address, [msg], 'auto');
      return result.code === 0;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  return { createProposal, isCreating };
}
