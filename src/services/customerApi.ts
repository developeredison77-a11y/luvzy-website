const apiBase = (import.meta.env.VITE_API_BASE_URL ?? `${window.location.protocol}//${window.location.hostname}:8002`).replace(/\/$/, '');

export type Customer = { id: number; name: string; email: string | null; profile_type: 'boy' | 'girl' | null; date_of_birth: string | null; city: string | null; notifications_enabled: boolean };
export type InboxNotification = { id: number; title: string; message: string; read_at: string | null; created_at: string };
export type HomeProfile = {
  id: number; name: string; age: number | null; city: string; bio: string; work: string;
  interests: string[]; photo: string | null; role: 'boy' | 'girl'; online: boolean; verified: boolean;
};
export type ActiveGirl = {
  profile_key: string; name: string; age: number; photo: string | null;
  online: true; verified: boolean; liked: boolean;
};
export type ActiveGirlsResponse = { data: ActiveGirl[]; online_count: number };
export type HomeProfileDetail = { data: HomeProfile; liked: boolean; interest_sent: boolean };
export type HomeStory = {
  id: number; user_id: number; author: HomeProfile; caption: string | null;
  media_type: 'image' | 'video'; media_url: string; expires_at: string | null; is_mine: boolean;
  reaction: string | null; reaction_count: number;
  comments: { id: number; body: string; created_at: string; author: { id: number; name: string } }[];
};
export type HomePost = { id: number; body: string; created_at: string; author: { id: number; name: string } };
export type HomeSnapshot = {
  profile: HomeProfile; profile_complete: boolean; people: HomeProfile[]; liked_ids: number[]; interests_sent: number[];
  interested_people: HomeProfile[]; following_ids: number[]; stories: HomeStory[];
  posts: HomePost[]; wallet_coins: number; people_count: number; online_count: number; interest_count: number;
};

function xsrfToken(): string | undefined {
  const entry = document.cookie.split('; ').find((item) => item.startsWith('XSRF-TOKEN='));
  return entry ? decodeURIComponent(entry.slice('XSRF-TOKEN='.length)) : undefined;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase();
  const isFormData = typeof FormData !== 'undefined' && init.body instanceof FormData;
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    await fetch(`${apiBase}/sanctum/csrf-cookie`, { credentials: 'include' });
  }
  const response = await fetch(`${apiBase}/api/v1${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(init.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(xsrfToken() ? { 'X-XSRF-TOKEN': xsrfToken()! } : {}),
      ...init.headers,
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errors = body.errors as Record<string, string[]> | undefined;
    throw new ApiRequestError(typeof body.message === 'string' ? body.message : '', errors ?? {});
  }
  return body as T;
}

export class ApiRequestError extends Error {
  constructor(message: string, readonly fieldErrors: Record<string, string[]>) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

let currentCustomerRequest: Promise<{ user: Customer }> | null = null;

function currentCustomer(): Promise<{ user: Customer }> {
  if (!currentCustomerRequest) {
    currentCustomerRequest = request<{ user: Customer }>('/auth/me').finally(() => { currentCustomerRequest = null; });
  }
  return currentCustomerRequest;
}

export const customerApi = {
  requestWebsiteLoginOtp: (phone: string) => request<{ challenge_id: string; message: string }>('/website/auth/otp/request', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyWebsiteLoginOtp: (phone: string, challengeId: string, otp: string) => request<{ user?: Customer; registration_required?: boolean; registration_token?: string; challenge_id?: string; message?: string }>('/website/auth/otp/verify', { method: 'POST', body: JSON.stringify({ phone, challenge_id: challengeId, otp }) }),
  requestWebsitePhoneLinkOtp: (email: string, password: string, phone: string) => request<{ challenge_id: string; message: string }>('/website/auth/phone/link/request', { method: 'POST', body: JSON.stringify({ email, password, phone }) }),
  verifyWebsitePhoneLinkOtp: (phone: string, challengeId: string, otp: string) => request<{ user: Customer }>('/website/auth/phone/link/verify', { method: 'POST', body: JSON.stringify({ phone, challenge_id: challengeId, otp }) }),
  register: (data: { phone: string; challenge_id: string; registration_token: string; name: string; latitude?: number; longitude?: number; location_accuracy_m?: number; account_type: 'boy' | 'girl'; notifications_enabled: boolean; adult_consent: boolean }) => request<{ user: Customer }>('/website/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: currentCustomer,
  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
  inbox: () => request<{ data: InboxNotification[]; meta: { unread_count: number; current_page: number; last_page: number } }>('/notifications'),
  read: (id: number) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  readAll: () => request('/notifications/read-all', { method: 'PATCH' }),
  preference: (enabled: boolean) => request('/notification-preferences', { method: 'PATCH', body: JSON.stringify({ notifications_enabled: enabled }) }),
  home: () => request<HomeSnapshot>('/home'),
  activeGirls: () => request<ActiveGirlsResponse>('/home/active-girls'),
  setActiveGirlLike: (profileKey: string, active: boolean) => request<{ active: boolean }>(`/home/active-girls/${encodeURIComponent(profileKey)}/like`, { method: 'PUT', body: JSON.stringify({ active }) }),
  homeProfile: (id: number) => request<HomeProfileDetail>(`/home/profiles/${id}`),
  setHomeInteraction: (targetId: number, type: 'like' | 'interest', active: boolean) => request<{ active: boolean }>(`/home/interactions/${targetId}`, { method: 'PUT', body: JSON.stringify({ type, active }) }),
  setPresence: (online: boolean) => request<{ online: boolean }>('/home/presence', { method: 'PATCH', body: JSON.stringify({ online }) }),
  updateHomeProfile: (data: { date_of_birth: string; city: string; bio?: string; occupation?: string }) => request<{ message: string }>('/home/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  createHomePost: (body: string) => request<{ data: HomePost }>('/home/posts', { method: 'POST', body: JSON.stringify({ body }) }),
  uploadHomeStory: (media: File, caption = '') => {
    const form = new FormData();
    form.set('media', media);
    if (caption.trim()) form.set('caption', caption.trim());
    return request<{ data: HomeStory }>('/home/stories', { method: 'POST', body: form });
  },
  setHomeStoryReaction: (storyId: number, reaction: string, active: boolean) => request<{ active: boolean; reaction: string | null }>(`/home/stories/${storyId}/reaction`, { method: 'PUT', body: JSON.stringify({ reaction, active }) }),
  createHomeStoryComment: (storyId: number, body: string) => request<{ data: HomeStory['comments'][number] }>(`/home/stories/${storyId}/comments`, { method: 'POST', body: JSON.stringify({ body }) }),
};
