import { expect, test, type Page, type Route } from '@playwright/test';

const account = {
  id: 701,
  name: 'Browser Member',
  email: null,
  profile_type: 'girl' as const,
  date_of_birth: null,
  city: 'Mysuru',
  notifications_enabled: false,
};

async function mockWebsiteApi(page: Page, options: { newAccount?: boolean; rejectOtp?: boolean } = {}) {
  let authenticated = false;
  const originFor = (route: Route) => route.request().headers().origin ?? 'http://127.0.0.1:4173';
  const json = (route: Route, status: number, body: unknown) => route.fulfill({
    status,
    contentType: 'application/json',
    headers: {
      'access-control-allow-origin': originFor(route),
      'access-control-allow-credentials': 'true',
    },
    body: JSON.stringify(body),
  });

  await page.route(/\/(?:api\/v1\/|sanctum\/)/, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (request.method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: {
          'access-control-allow-origin': originFor(route),
          'access-control-allow-credentials': 'true',
          'access-control-allow-methods': 'GET, POST, PATCH, OPTIONS',
          'access-control-allow-headers': 'Accept, Content-Type, X-XSRF-TOKEN',
        },
      });
      return;
    }
    if (url.pathname === '/sanctum/csrf-cookie') {
      await route.fulfill({ status: 204, headers: { 'access-control-allow-origin': originFor(route), 'access-control-allow-credentials': 'true' } });
      return;
    }
    if (url.pathname === '/api/v1/auth/me') {
      await json(route, authenticated ? 200 : 401, authenticated ? { user: account } : { message: 'Unauthenticated.' });
      return;
    }
    if (url.pathname === '/api/v1/website/auth/otp/request') {
      await json(route, 202, { challenge_id: 'browser-challenge', message: 'Demo mode: use 123456 as your verification code.' });
      return;
    }
    if (url.pathname === '/api/v1/website/auth/otp/verify') {
      if (options.rejectOtp) {
        await json(route, 422, { message: 'The verification code is invalid or expired.', errors: { otp: ['The verification code is invalid or expired.'] } });
      } else if (options.newAccount) {
        await json(route, 202, { registration_required: true, challenge_id: 'browser-challenge', registration_token: '1234567890abcdefghijklmnop', message: 'Mobile number verified.' });
      } else {
        authenticated = true;
        await json(route, 200, { user: account });
      }
      return;
    }
    if (url.pathname === '/api/v1/website/auth/register') {
      authenticated = true;
      await json(route, 201, { user: { ...account, name: 'Registered Member', profile_type: 'boy' } });
      return;
    }
    if (url.pathname === '/api/v1/auth/logout' && request.method() === 'POST') {
      authenticated = false;
      await json(route, 200, { message: 'Signed out.' });
      return;
    }
    if (url.pathname === '/api/v1/home' && request.method() === 'GET') {
      const profile = { id: 701, name: 'Browser Member', age: 31, city: 'Mysuru', bio: 'A member from the Home API.', work: 'Designer', interests: [], photo: null, role: 'boy', online: true, verified: false };
      const person = { id: 702, name: 'API Active Member', age: 26, city: 'Pune', bio: 'A discoverable member.', work: 'Engineer', interests: [], photo: null, role: 'girl', online: true, verified: true };
      await json(route, 200, {
        profile, profile_complete: true, people: [person], liked_ids: [], interests_sent: [], interested_people: [], following_ids: [], stories: [], posts: [],
        wallet_coins: 250, people_count: 1, online_count: 1, interest_count: 0,
      });
      return;
    }
    if (url.pathname === '/api/v1/notifications') {
      await json(route, 200, { data: [], meta: { unread_count: 0, current_page: 1, last_page: 1 } });
      return;
    }
    await json(route, 404, { message: 'Not found.' });
  });
}

async function signIn(page: Page) {
  await page.goto('/login');
  await page.getByLabel(/mobile number/i).fill('9876543210');
  await page.getByRole('button', { name: /send verification code/i }).click();
  await expect(page.getByText(/demo mode: use 123456/i)).toBeVisible();
  await page.getByLabel(/verification code digit 1/i).fill('123456');
  await page.getByRole('button', { name: /verify and sign in/i }).click();
  await expect(page).toHaveURL(/\/home$/);
}

test('database session is required to open a protected route', async ({ page }) => {
  await mockWebsiteApi(page);
  await page.goto('/home');
  await expect(page.getByRole('heading', { name: /sign in to luvzy/i })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('luvzy-react-demo-v1') ?? '{}').state?.signedIn)).toBeUndefined();
});

test('Home keeps its original sections and renders API data responsively', async ({ page }) => {
  test.setTimeout(60_000);
  await mockWebsiteApi(page);
  await signIn(page);

  await expect(page.getByRole('heading', { name: /good to see you, browser/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Active Girls' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Random Video Calls' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Stories' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Featured Girl' })).toBeVisible();
  await expect(page.locator('#home-featured-girl-section h2')).toContainText('API Active Member, 26');
  await expect(page.getByRole('heading', { name: /girls interested in you/i })).toBeVisible();
  await expect(page.getByText('API Active Member, 26').first()).toBeVisible();
  await expect(page.getByText('1 Girls Online')).toBeVisible();
  await expect(page.getByText('Suggestion:')).toBeVisible();
  const sectionPositions = await page.evaluate(() => {
    const selectors = ['#home-welcome-title', '#home-connect-title', '#home-random-title', '#nc-story-title', '#home-featured-girl-section', '#home-interested-title'];
    return selectors.map((selector) => document.querySelector(selector)?.getBoundingClientRect().top ?? -1);
  });
  expect(sectionPositions.every((position) => position >= 0)).toBe(true);
  expect(sectionPositions.every((position, index) => index === 0 || sectionPositions[index - 1] < position)).toBe(true);

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});

test('guest can request a demo OTP, sign in, and use the local prototype', async ({ page }) => {
  await mockWebsiteApi(page);
  await signIn(page);
  await page.goto('/wallet');
  await page.getByRole('button', { name: /add sample coins/i }).first().click();
  await page.getByRole('button', { name: /add demo coins/i }).click();
  await expect(page.locator('.wallet-balance strong')).toContainText('600');
});

test('new verified phone completes database registration through the API', async ({ page }) => {
  await mockWebsiteApi(page, { newAccount: true });
  await page.goto('/register');
  await page.getByLabel(/mobile number/i).fill('9876543210');
  await page.getByRole('button', { name: /send verification code/i }).click();
  await page.getByLabel(/verification code digit 1/i).fill('123456');
  await page.getByRole('button', { name: /verify phone number/i }).click();
  await expect(page.getByText(/mobile number verified: \+91 9876543210/i)).toBeVisible();
  await page.getByLabel(/full name/i).fill('Registered Member');
  await page.getByRole('button', { name: 'Boy' }).click();
  await page.getByRole('checkbox', { name: /18 or older/i }).check();
  await page.getByRole('button', { name: /create account/i }).click();
  await expect(page.getByRole('navigation', { name: /main navigation/i })).toBeVisible();
});

test('server OTP rejection leaves the visitor signed out', async ({ page }) => {
  await mockWebsiteApi(page, { rejectOtp: true });
  await page.goto('/login');
  await page.getByLabel(/mobile number/i).fill('9876543210');
  await page.getByRole('button', { name: /send verification code/i }).click();
  await page.getByLabel(/verification code digit 1/i).fill('000000');
  await page.getByRole('button', { name: /verify and sign in/i }).click();
  await expect(page.getByRole('alert')).toContainText(/invalid or expired/i);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('luvzy-react-demo-v1') ?? '{}').state?.signedIn)).toBeUndefined();
});

test('mobile navigation stays inside the viewport after session login', async ({ page }) => {
  await mockWebsiteApi(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await signIn(page);
  const nav = page.getByRole('navigation', { name: /mobile app navigation/i });
  await expect(nav).toBeVisible();
  await nav.getByRole('link', { name: /explore/i }).click();
  await expect(page).toHaveURL(/\/explore$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});
