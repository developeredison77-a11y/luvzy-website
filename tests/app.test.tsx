import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/app/App';
import { useDemoStore } from '../src/stores/demoStore';
import { ApiRequestError, customerApi, type Customer, type HomeSnapshot, type HomeStory } from '../src/services/customerApi';

function renderApp(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
}

const homeProfile = (id: number, name: string, role: 'boy' | 'girl') => ({
  id, name, age: 25, city: 'Mysuru', bio: 'Stored profile bio', work: 'Stored occupation',
  interests: ['Music'], photo: null, role, online: true, verified: true,
});

const serverStory: HomeStory = {
  id: 31, user_id: 8, author: homeProfile(8, 'Backend Profile', 'girl'), caption: 'Backend story caption',
  media_type: 'image', media_url: '/backend-story.webp', expires_at: null, is_mine: false,
  reaction: null, reaction_count: 2, comments: [],
};

const serverHome: HomeSnapshot = {
  profile: homeProfile(7, 'Database Member', 'boy'),
  profile_complete: true,
  people: [homeProfile(8, 'Backend Profile', 'girl')],
  liked_ids: [], interests_sent: [], interested_people: [{ ...homeProfile(9, 'Offline Interest', 'girl'), online: false }], following_ids: [], stories: [serverStory],
  posts: [{ id: 21, body: 'Backend community post', created_at: '2026-11-14T08:00:00.000Z', author: { id: 8, name: 'Post Author' } }],
  wallet_coins: 275, people_count: 1, online_count: 1, interest_count: 1,
};

describe('local React user journeys', () => {
  beforeEach(() => {
    localStorage.clear();
    useDemoStore.getState().reset();
    vi.spyOn(customerApi, 'me').mockRejectedValue(new ApiRequestError('Unauthenticated.', {}));
    vi.spyOn(customerApi, 'home').mockRejectedValue(new ApiRequestError('Unauthenticated.', {}));
  });
  afterEach(() => { cleanup(); vi.restoreAllMocks(); });

  it('signs in only after the backend verifies the requested OTP', async () => {
    const account: Customer = {
      id: 7,
      name: 'Test Member',
      email: 'member@example.test',
      profile_type: 'girl',
      date_of_birth: '1994-01-01',
      city: 'Mysuru',
      notifications_enabled: true,
    };
    const requestOtp = vi.spyOn(customerApi, 'requestWebsiteLoginOtp').mockResolvedValue({ challenge_id: 'challenge-1', message: 'Demo code: 123456' });
    const verifyOtp = vi.spyOn(customerApi, 'verifyWebsiteLoginOtp').mockResolvedValue({ user: account });
    const user = userEvent.setup();
    renderApp('/login');
    await user.type(screen.getByLabelText(/mobile number/i), '9876543210');
    await user.click(screen.getByRole('button', { name: /send verification code/i }));
    expect(await screen.findByText(/demo code: 123456/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/verification code digit 1/i), '123456');
    await user.click(screen.getByRole('button', { name: /verify and sign in/i }));
    await waitFor(() => expect(useDemoStore.getState().profile.name).toBe('Test Member'));
    expect(screen.getAllByRole('link', { name: /home/i }).length).toBeGreaterThan(0);
    expect(requestOtp).toHaveBeenCalledWith('+919876543210');
    expect(verifyOtp).toHaveBeenCalledWith('+919876543210', 'challenge-1', '123456');
    expect(useDemoStore.getState().signedIn).toBe(true);
    expect(useDemoStore.getState().profile.name).toBe('Test Member');
  });

  it('restores a real backend session and replaces stale locally stored sign-in state', async () => {
    localStorage.setItem('luvzy-react-demo-v1', JSON.stringify({ state: { signedIn: true }, version: 1 }));
    await useDemoStore.persist.rehydrate();
    useDemoStore.setState({ authStatus: 'checking' });
    const existingMe = vi.spyOn(customerApi, 'me').mockResolvedValue({ user: {
      id: 9, name: 'Database Member', email: null, profile_type: 'boy', date_of_birth: null, city: null, notifications_enabled: false,
    } });
    renderApp('/home');
    await waitFor(() => expect(useDemoStore.getState().authStatus).toBe('authenticated'));
    expect(screen.getAllByRole('link', { name: /home/i }).length).toBeGreaterThan(0);
    expect(existingMe).toHaveBeenCalledOnce();
    expect(useDemoStore.getState().profile.name).toBe('Database Member');
    expect(useDemoStore.getState().authStatus).toBe('authenticated');
  });

  it('clears stale local sign-in and redirects protected pages when the server has no session', async () => {
    localStorage.setItem('luvzy-react-demo-v1', JSON.stringify({ state: { signedIn: true }, version: 1 }));
    await useDemoStore.persist.rehydrate();
    useDemoStore.setState({ authStatus: 'checking' });
    renderApp('/home');
    expect(await screen.findByRole('heading', { name: /sign in to luvzy/i })).toBeInTheDocument();
    expect(useDemoStore.getState().signedIn).toBe(false);
    expect(useDemoStore.getState().authStatus).toBe('anonymous');
  });

  it('does not accept forged auth flags from same-version persisted state', async () => {
    localStorage.setItem('luvzy-react-demo-v1', JSON.stringify({
      state: { signedIn: true, authStatus: 'authenticated' },
      version: 2,
    }));
    await useDemoStore.persist.rehydrate();
    expect(useDemoStore.getState().signedIn).toBe(false);
    expect(useDemoStore.getState().authStatus).toBe('checking');
    renderApp('/home');
    expect(await screen.findByRole('heading', { name: /sign in to luvzy/i })).toBeInTheDocument();
    expect(useDemoStore.getState().authStatus).toBe('anonymous');
  });

  it('renders Home listings and community posts from the backend and persists profile actions there', async () => {
    vi.spyOn(customerApi, 'me').mockResolvedValue({ user: {
      id: 7, name: 'Database Member', email: null, profile_type: 'boy', date_of_birth: '2001-01-01', city: 'Mysuru', notifications_enabled: true,
    } });
    const homeRequest = vi.spyOn(customerApi, 'home').mockResolvedValue(serverHome);
    vi.spyOn(customerApi, 'homeProfile').mockResolvedValue({ data: homeProfile(8, 'Backend Profile', 'girl'), liked: false, interest_sent: false });
    const saveInteraction = vi.spyOn(customerApi, 'setHomeInteraction').mockResolvedValue({ active: true });
    const saveReaction = vi.spyOn(customerApi, 'setHomeStoryReaction').mockResolvedValue({ active: true, reaction: '❤️' });
    const createPost = vi.spyOn(customerApi, 'createHomePost').mockResolvedValue({ data: { id: 22, body: 'A backend-saved update', created_at: '2026-11-15T08:00:00.000Z', author: { id: 7, name: 'Database Member' } } });
    useDemoStore.setState({ authStatus: 'authenticated', signedIn: true });
    const user = userEvent.setup();
    renderApp('/home');

    expect(await screen.findByRole('heading', { name: 'Active Girls' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Random Video Calls' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Stories' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Featured Girl' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /girls interested in you/i })).toBeInTheDocument();
    expect(screen.getByText('YOUR DAILY MOMENT')).toBeInTheDocument();
    expect((await screen.findAllByText('Backend Profile, 25')).length).toBeGreaterThan(0);
    expect(screen.getByText('Backend community post')).toBeInTheDocument();
    expect(screen.getByText('Offline')).toBeInTheDocument();
    expect(screen.queryByText('Backend story caption')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: "View Backend Profile's story" }));
    await user.click(screen.getByRole('button', { name: /like · 2/i }));
    expect(saveReaction).toHaveBeenCalledWith(31, '❤️', true);
    await user.click(screen.getByRole('button', { name: 'Close story' }));
    expect(screen.queryByText(/slow morning|found a new café|sample community member/i)).not.toBeInTheDocument();
    await user.type(screen.getByLabelText('Your update'), 'A backend-saved update');
    await user.click(screen.getByRole('button', { name: 'Share update' }));
    expect(createPost).toHaveBeenCalledWith('A backend-saved update');
    expect(await screen.findByText('A backend-saved update')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: /like backend profile/i })[0]);
    expect(saveInteraction).toHaveBeenCalledWith(8, 'like', true);
    expect(homeRequest).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /view backend profile, 25/i }));
    expect(await screen.findByRole('heading', { name: 'Backend Profile, 25' })).toBeInTheDocument();
  });

  it('opens Home profile cards with backend details and persists interest from that profile', async () => {
    vi.spyOn(customerApi, 'me').mockResolvedValue({ user: {
      id: 7, name: 'Database Member', email: null, profile_type: 'boy', date_of_birth: '2001-01-01', city: 'Mysuru', notifications_enabled: false,
    } });
    const fetchProfile = vi.spyOn(customerApi, 'homeProfile').mockResolvedValue({ data: homeProfile(8, 'Backend Profile', 'girl'), liked: false, interest_sent: false });
    const saveInterest = vi.spyOn(customerApi, 'setHomeInteraction').mockResolvedValue({ active: true });
    useDemoStore.setState({ authStatus: 'authenticated', signedIn: true });
    const user = userEvent.setup();
    renderApp('/home/profile/8');

    expect(await screen.findByRole('heading', { name: 'Backend Profile, 25' })).toBeInTheDocument();
    expect(screen.getByText('Community profile')).toBeInTheDocument();
    expect(screen.queryByText(/fictional demo profile/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /send interest/i }));
    expect(fetchProfile).toHaveBeenCalledWith(8);
    expect(saveInterest).toHaveBeenCalledWith(8, 'interest', true);
    expect(await screen.findByRole('button', { name: /withdraw interest/i })).toBeInTheDocument();
  });

  it('does not fall back to a fixture when the backend denies a Home profile', async () => {
    vi.spyOn(customerApi, 'me').mockResolvedValue({ user: {
      id: 7, name: 'Database Member', email: null, profile_type: 'boy', date_of_birth: '2001-01-01', city: 'Mysuru', notifications_enabled: false,
    } });
    vi.spyOn(customerApi, 'homeProfile').mockRejectedValue(new ApiRequestError('Not found.', {}));
    useDemoStore.setState({ authStatus: 'authenticated', signedIn: true });
    renderApp('/home/profile/8');

    expect(await screen.findByRole('heading', { name: 'Profile unavailable' })).toBeInTheDocument();
    expect(screen.getByText('Not found.')).toBeInTheDocument();
    expect(screen.queryByText('Isha, 26')).not.toBeInTheDocument();
  });

  it('shows backend empty states without substituting fixture profiles or posts', async () => {
    vi.spyOn(customerApi, 'me').mockResolvedValue({ user: {
      id: 9, name: 'Empty Member', email: null, profile_type: 'boy', date_of_birth: '2001-01-01', city: 'Mysuru', notifications_enabled: false,
    } });
    vi.spyOn(customerApi, 'home').mockResolvedValue({
      ...serverHome, profile: homeProfile(9, 'Empty Member', 'boy'), people: [], posts: [],
    });
    useDemoStore.setState({ authStatus: 'authenticated', signedIn: true });
    renderApp('/home');

    expect(await screen.findByText(/no profiles are available yet/i)).toBeInTheDocument();
    expect(screen.getByText(/no community updates yet/i)).toBeInTheDocument();
    expect(screen.queryByText('Ananya, 26')).not.toBeInTheDocument();
  });

  it('requires backend profile completion before showing Home discovery', async () => {
    vi.spyOn(customerApi, 'me').mockResolvedValue({ user: {
      id: 10, name: 'Incomplete Member', email: null, profile_type: 'girl', date_of_birth: null, city: null, notifications_enabled: false,
    } });
    vi.spyOn(customerApi, 'home').mockResolvedValue({
      ...serverHome,
      profile: { ...homeProfile(10, 'Incomplete Member', 'girl'), age: null, city: '' },
      profile_complete: false,
      people: [], interested_people: [], stories: [], posts: [],
    });
    useDemoStore.setState({ authStatus: 'authenticated', signedIn: true });
    renderApp('/home');

    expect(await screen.findByRole('heading', { name: /add your details to join discovery/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeRequired();
    expect(screen.queryByText('Backend Profile, 25')).not.toBeInTheDocument();
    expect(screen.queryByText('Backend community post')).not.toBeInTheDocument();
  });

  it('routes a verified new phone through registration and creates the account through the API', async () => {
    const registered: Customer = {
      id: 11, name: 'New Member', email: null, profile_type: 'girl', date_of_birth: null, city: null, notifications_enabled: false,
    };
    vi.spyOn(customerApi, 'requestWebsiteLoginOtp').mockResolvedValue({ challenge_id: 'new-challenge', message: 'Demo code: 123456' });
    vi.spyOn(customerApi, 'verifyWebsiteLoginOtp').mockResolvedValue({ registration_required: true, challenge_id: 'new-challenge', registration_token: '1234567890abcdefghijklmnop', message: 'Verified' });
    const createAccount = vi.spyOn(customerApi, 'register').mockResolvedValue({ user: registered });
    const user = userEvent.setup();
    renderApp('/register');
    await user.type(screen.getByLabelText(/mobile number/i), '9876543210');
    await user.click(screen.getByRole('button', { name: /send verification code/i }));
    await user.type(screen.getByLabelText(/verification code digit 1/i), '123456');
    await user.click(screen.getByRole('button', { name: /verify phone number/i }));
    expect(await screen.findByText(/mobile number verified: \+91 9876543210/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/full name/i), 'New Member');
    await user.click(screen.getByRole('button', { name: 'Boy' }));
    await user.click(screen.getByRole('checkbox', { name: /18 or older/i }));
    await user.click(screen.getByRole('button', { name: /create account/i }));
    await waitFor(() => expect(useDemoStore.getState().profile.name).toBe('New Member'));
    expect(screen.getAllByRole('link', { name: /home/i }).length).toBeGreaterThan(0);
    expect(createAccount).toHaveBeenCalledWith(expect.objectContaining({
      phone: '+919876543210', challenge_id: 'new-challenge', registration_token: '1234567890abcdefghijklmnop', name: 'New Member', account_type: 'boy', adult_consent: true,
    }));
  });

  it('shows backend OTP rejection and does not sign in', async () => {
    vi.spyOn(customerApi, 'requestWebsiteLoginOtp').mockResolvedValue({ challenge_id: 'challenge-bad', message: 'Demo code: 123456' });
    vi.spyOn(customerApi, 'verifyWebsiteLoginOtp').mockRejectedValue(new ApiRequestError('The verification code is invalid or expired.', { otp: ['The verification code is invalid or expired.'] }));
    const user = userEvent.setup();
    renderApp('/login');
    await user.type(screen.getByLabelText(/mobile number/i), '9876543210');
    await user.click(screen.getByRole('button', { name: /send verification code/i }));
    await user.type(screen.getByLabelText(/verification code digit 1/i), '000000');
    await user.click(screen.getByRole('button', { name: /verify and sign in/i }));
    expect(await screen.findByText(/invalid or expired/i)).toBeInTheDocument();
    expect(useDemoStore.getState().signedIn).toBe(false);
  });

  it('keeps the authenticated UI when server logout fails so the live session is not misreported', async () => {
    useDemoStore.getState().signIn({ name: 'Session Member' });
    const logout = vi.spyOn(customerApi, 'logout').mockRejectedValue(new Error('Network unavailable'));
    const user = userEvent.setup();
    renderApp('/profile');
    await user.click(screen.getByRole('button', { name: /sign out/i }));
    expect(await screen.findByText(/network unavailable/i)).toBeInTheDocument();
    expect(useDemoStore.getState().authStatus).toBe('authenticated');
    expect(useDemoStore.getState().signedIn).toBe(true);
    expect(logout).toHaveBeenCalledOnce();
  });

  it('shows server inbox messages and marks an unread item as read', async () => {
    vi.spyOn(customerApi, 'inbox').mockResolvedValue({
      data: [{ id: 12, title: 'Service update', message: 'A planned maintenance window.', read_at: null, created_at: '2026-11-12T08:00:00.000Z' }],
      meta: { unread_count: 1, current_page: 1, last_page: 1 },
    });
    const read = vi.spyOn(customerApi, 'read').mockResolvedValue({});
    useDemoStore.getState().signIn();
    const user = userEvent.setup();
    renderApp('/notifications');

    const notification = await screen.findByRole('button', { name: /service update/i });
    expect(notification).toHaveTextContent('A planned maintenance window.');
    await user.click(notification);
    await waitFor(() => expect(read).toHaveBeenCalledWith(12));
  });

  it('updates fictional wallet coins when a sample pack is confirmed', async () => {
    const user = userEvent.setup();
    useDemoStore.getState().signIn();
    renderApp('/wallet');
    await user.click(screen.getAllByRole('button', { name: /add sample coins/i })[0]);
    await user.click(screen.getByRole('button', { name: /add demo coins/i }));
    await waitFor(() => expect(useDemoStore.getState().walletCoins).toBe(600));
  });

  it('persists a sample chat message in the local store', async () => {
    const user = userEvent.setup();
    useDemoStore.getState().signIn();
    renderApp('/chats/3');
    await user.type(screen.getByRole('textbox', { name: /message/i }), 'Hello from my browser');
    await user.click(screen.getByRole('button', { name: /send message/i }));
    expect(useDemoStore.getState().messages.at(-1)?.text).toBe('Hello from my browser');
    expect(screen.getByText('Hello from my browser')).toBeInTheDocument();
  });
});
