import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { initialState } from '../mocks/fixtures';
import type { CallRecord, DemoState, LocalReport, Membership, Profile, Role, Withdrawal } from '../types/models';

type DemoStore = DemoState & {
  authStatus: 'checking' | 'authenticated' | 'anonymous';
  signIn: (profile?: Partial<Profile>) => void;
  signOut: () => void;
  updateProfile: (profile: Profile) => void;
  setRole: (role: Role) => void;
  setMembership: (membership: Membership) => void;
  toggleLike: (id: number) => void;
  toggleInterest: (id: number) => void;
  passPerson: (id: number) => void;
  blockPerson: (id: number) => void;
  unblockPerson: (id: number) => void;
  sendMessage: (personId: number, text: string) => void;
  addCoins: (coins: number) => void;
  spendCoins: (coins: number) => boolean;
  setPreference: (key: 'online' | 'discoverable' | 'quietMode' | 'notificationsEnabled', value: boolean) => void;
  markNotificationsRead: () => void;
  toggleStoryReaction: (id: number, reaction: string) => void;
  addStoryComment: (id: number, comment: string) => void;
  requestWithdrawal: (withdrawal: Withdrawal) => void;
  saveReport: (report: LocalReport) => void;
  recordCall: (call: CallRecord) => void;
  removeCall: (id: string) => void;
  setFaqOpen: (id: number | null) => void;
  reset: () => void;
};

export const useDemoStore = create<DemoStore>()(persist((set, get) => ({
  ...initialState,
  authStatus: 'checking',
  signIn: (profile = {}) => set((state) => ({ signedIn: true, authStatus: 'authenticated', profile: { ...state.profile, ...profile } })),
  signOut: () => set({ signedIn: false, authStatus: 'anonymous' }),
  updateProfile: (profile) => set({ profile }),
  setRole: (role) => set((state) => ({ profile: { ...state.profile, role } })),
  setMembership: (membership) => set({ membership }),
  toggleLike: (id) => set((state) => ({ likes: state.likes.includes(id) ? state.likes.filter((item) => item !== id) : [...state.likes, id] })),
  toggleInterest: (id) => set((state) => ({ interestsSent: state.interestsSent.includes(id) ? state.interestsSent.filter((item) => item !== id) : [...state.interestsSent, id] })),
  passPerson: (id) => set((state) => ({ passes: state.passes.includes(id) ? state.passes : [...state.passes, id] })),
  blockPerson: (id) => set((state) => ({ blocked: state.blocked.includes(id) ? state.blocked : [...state.blocked, id], likes: state.likes.filter((item) => item !== id), interestsSent: state.interestsSent.filter((item) => item !== id) })),
  unblockPerson: (id) => set((state) => ({ blocked: state.blocked.filter((item) => item !== id) })),
  sendMessage: (personId, text) => set((state) => ({ messages: [...state.messages, { id: crypto.randomUUID(), personId, text: text.trim().slice(0, 1000), createdAt: new Date().toISOString(), mine: true }] })),
  addCoins: (coins) => set((state) => ({ walletCoins: state.walletCoins + Math.max(0, Math.floor(coins)) })),
  spendCoins: (coins) => { const current = get().walletCoins; if (coins <= 0 || current < coins) return false; set({ walletCoins: current - coins }); return true; },
  setPreference: (key, value) => set({ [key]: value }),
  markNotificationsRead: () => set({ unreadNotifications: [] }),
  toggleStoryReaction: (id, reaction) => set((state) => ({ storyReactions: { ...state.storyReactions, [id]: state.storyReactions[id] === reaction ? '' : reaction } })),
  addStoryComment: (id, comment) => set((state) => ({ storyComments: { ...state.storyComments, [id]: [...(state.storyComments[id] ?? []), comment.trim().slice(0, 240)] } })),
  requestWithdrawal: (withdrawal) => set((state) => ({ withdrawals: [...state.withdrawals, withdrawal], rewardCoins: state.rewardCoins - withdrawal.amount * 4 })),
  saveReport: (report) => set((state) => ({ reports: [...state.reports, report] })),
  recordCall: (call) => set((state) => ({ calls: [call, ...state.calls] })),
  removeCall: (id) => set((state) => ({ calls: state.calls.filter((call) => call.id !== id) })),
  setFaqOpen: (id) => set({ faqOpen: id }),
  reset: () => set({ ...initialState, signedIn: false, authStatus: 'anonymous' }),
}), {
  name: 'luvzy-react-demo-v1',
  version: 2,
  storage: createJSONStorage(() => localStorage),
  migrate: (persisted: unknown) => ({ ...(persisted as Partial<DemoStore>), signedIn: false }),
  merge: (persisted, current) => ({
    ...current,
    ...(persisted as Partial<DemoStore>),
    signedIn: false,
    authStatus: 'checking',
  }),
  partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['faqOpen', 'signedIn', 'authStatus'].includes(key))) as DemoStore,
}));

export type { DemoStore };
