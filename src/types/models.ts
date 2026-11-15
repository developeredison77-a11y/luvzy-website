export type Role = 'boy' | 'girl';
export type Membership = 'Starter' | 'Plus' | 'Unlimited';
export type ContactAction = 'video' | 'audio' | 'chat';

export interface Person {
  id: number;
  name: string;
  age: number;
  city: string;
  bio: string;
  work: string;
  interests: string[];
  photo: string;
  role: Role;
  distance: string;
  availableActions?: ContactAction[];
}

export interface Profile {
  name: string;
  age: number;
  city: string;
  role: Role;
  photo?: string;
  bio: string;
  interests: string[];
}

export interface Message {
  id: string;
  personId: number;
  text: string;
  createdAt: string;
  mine: boolean;
}

export interface Withdrawal {
  id: string;
  amount: number;
  method: 'UPI' | 'Bank transfer';
  status: 'Pending review';
  createdAt: string;
}

export interface LocalReport {
  id: string;
  personId: number;
  reason: string;
  details: string;
  createdAt: string;
}

export interface CallRecord {
  id: string;
  personId: number;
  createdAt: string;
  mode?: 'video' | 'audio';
  durationSeconds: number;
  coinsSpent: number;
  status: 'completed' | 'missed';
  direction: 'incoming' | 'outgoing';
}

export interface DemoState {
  signedIn: boolean;
  profile: Profile;
  likes: number[];
  interestsSent: number[];
  passes: number[];
  blocked: number[];
  unreadNotifications: number[];
  messages: Message[];
  walletCoins: number;
  rewardCoins: number;
  online: boolean;
  discoverable: boolean;
  quietMode: boolean;
  notificationsEnabled: boolean;
  membership: Membership;
  withdrawals: Withdrawal[];
  reports: LocalReport[];
  calls: CallRecord[];
  faqOpen: number | null;
  storyReactions: Record<number, string>;
  storyComments: Record<number, string[]>;
}
