
export type User = {
  id: string;
  name: string;
  points: number;
};

export type Votable = {
  id: string;
  creatorName: string;
  title: string;
  description?: string;
  passcode: string;
  status: 'open' | 'closed';
  outcome: 'happened' | 'not_happened' | null;
  createdAt: string;
  isSpecialEvent: boolean;
};

export type Vote = {
  id: string;
  voterName: string;
  votableId: string;
  prediction: 'happened' | 'not_happened';
};
