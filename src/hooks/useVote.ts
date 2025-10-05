import { useState, useEffect } from 'react';
import { useRiverChain } from '../contexts/RiverChainContext';
import { VoteOption } from '../types/governance';

export interface TallyResult {
  yes: string;
  no: string;
  abstain: string;
  noWithVeto: string;
}

const VOTE_OPTION_MAP = {
  [VoteOption.YES]: 1,
  [VoteOption.NO]: 3,
  [VoteOption.ABSTAIN]: 2,
  [VoteOption.NO_WITH_VETO]: 4,
};

export function useVote(proposalId: string) {
  const { client, address } = useRiverChain();
  const [voting, setVoting] = useState(false);

  const vote = async (option: VoteOption) => {
    if (!client || !address) return false;

    setVoting(true);
    try {
      const msg = {
        typeUrl: '/cosmos.gov.v1beta1.MsgVote',
        value: {
          proposalId,
          voter: address,
          option: VOTE_OPTION_MAP[option],
        },
      };

      const result = await client.signAndBroadcast(address, [msg], 'auto');
      return result.code === 0;
    } catch (err) {
      console.error(err);
      return false;
    } finally {
      setVoting(false);
    }
  };

  return { vote, voting };
}

export function useTallyResult(proposalId: string) {
  const { address } = useRiverChain();
  const [tally, setTally] = useState<TallyResult | null>(null);

  useEffect(() => {
    if (!address) return;

    // TODO: 查询投票统计
    setTally({
      yes: '0',
      no: '0',
      abstain: '0',
      noWithVeto: '0',
    });
  }, [address, proposalId]);

  return tally;
}
