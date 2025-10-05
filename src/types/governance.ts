export enum ProposalStatus {
  ACTIVE = 'ACTIVE',
  PASSED = 'PASSED',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED'
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: ProposalStatus;
  submitTime: number;
  votingEndTime: number;
  totalDeposit: string;
  proposer: string;
}

export interface Vote {
  proposalId: string;
  voter: string;
  option: VoteOption;
  timestamp: number;
}

export enum VoteOption {
  YES = 'YES',
  NO = 'NO',
  NO_WITH_VETO = 'NO_WITH_VETO',
  ABSTAIN = 'ABSTAIN'
}
