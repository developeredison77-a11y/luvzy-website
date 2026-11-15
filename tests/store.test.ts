import { beforeEach, describe, expect, it } from 'vitest';
import { initialState } from '../src/mocks/fixtures';
import { useDemoStore } from '../src/stores/demoStore';

describe('local demo state transitions', () => {
  beforeEach(() => {
    localStorage.clear();
    useDemoStore.getState().reset();
  });

  it('deducts sample coins only when the balance can cover the charge', () => {
    const state = useDemoStore.getState();
    expect(state.spendCoins(70)).toBe(true);
    expect(useDemoStore.getState().walletCoins).toBe(430);
    expect(useDemoStore.getState().spendCoins(500)).toBe(false);
    expect(useDemoStore.getState().walletCoins).toBe(430);
  });

  it('toggles interest and allows withdrawal balance state to be updated locally', () => {
    const state = useDemoStore.getState();
    state.toggleInterest(3);
    expect(useDemoStore.getState().interestsSent).toEqual([3]);
    useDemoStore.getState().toggleInterest(3);
    expect(useDemoStore.getState().interestsSent).toEqual([]);
    useDemoStore.getState().requestWithdrawal({ id: 'demo-1', amount: 500, method: 'UPI', status: 'Pending review', createdAt: '2026-11-10T00:00:00.000Z' });
    expect(useDemoStore.getState().rewardCoins).toBe(initialState.rewardCoins - 2000);
    expect(useDemoStore.getState().withdrawals).toHaveLength(1);
  });

  it('records simulated call history and removes selected records', () => {
    const first = useDemoStore.getState().calls[0];
    expect(useDemoStore.getState().calls.length).toBeGreaterThan(0);
    useDemoStore.getState().removeCall(first.id);
    expect(useDemoStore.getState().calls.some((call) => call.id === first.id)).toBe(false);
    useDemoStore.getState().recordCall({ id: 'local-call', personId: 3, createdAt: '2026-11-10T00:00:00.000Z', durationSeconds: 60, coinsSpent: 70, status: 'completed', direction: 'outgoing' });
    expect(useDemoStore.getState().calls[0].id).toBe('local-call');
  });

  it('does not persist the browser-only signed-in flag', () => {
    useDemoStore.getState().signIn({ name: 'Authenticated Member' });
    const persisted = JSON.parse(localStorage.getItem('luvzy-react-demo-v1') ?? '{}');
    expect(persisted.state.signedIn).toBeUndefined();
    expect(persisted.state.authStatus).toBeUndefined();
    expect(useDemoStore.getState().authStatus).toBe('authenticated');
  });
});
