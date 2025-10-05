export interface ReferralCode {
  code: string;
  owner: string;
  createdAt: number;
}

export interface ReferralRelationship {
  referee: string;
  referrer: string;
  tier: number;
  createdAt: number;
}

export interface ReferralStats {
  totalReferrals: number;
  tier1Count: number;
  tier2Count: number;
  totalRevenue: string;
  claimableRevenue: string;
}