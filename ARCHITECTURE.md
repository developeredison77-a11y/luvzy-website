# Architecture

## Runtime

- Vite serves and builds the React 19 + TypeScript single-page app.
- React Router owns browser routes and history.
- Zustand owns cross-route demo state and persists only the local demo data.
- Feature screens remain React components. Shared layout and controls live in `src/app/App.tsx`; data contracts, fixtures, repository logic, and validation live in separate modules.
- The prototype's CSS is retained in `src/styles.css`; responsive React layout additions are in `src/app/overrides.css`.

## Data flow

```text
React route/component → Zustand actions → local repository / local state
                                      ↘ browser localStorage (demo only)

Future:
React route/component → feature hook/state → repository contract → Laravel API repository
```

`LocalProfileRepository` implements the profile search contract and can be replaced by an HTTP repository. No transport client, API endpoint, authentication token, payment SDK, or backend placeholder is configured.

## Feature map

- `src/app`: routing, layouts, screen components, and responsive overrides.
- `src/types`: typed profile, message, withdrawal, and demo-state contracts.
- `src/mocks/fixtures.ts`: fictional people, local story imagery, sample balances, and coin packs.
- `src/services/profileRepository.ts`: local profile discovery and filtering boundary.
- `src/stores/demoStore.ts`: local session, profile, interactions, messages, balances, settings, and story state.
- `src/utils/validation.ts`: adult date, Indian phone, and withdrawal eligibility rules.
- `public/images` and `public/videos`: local prototype-derived branding and media assets.
- `tests`: unit, component/journey, and Playwright browser tests.

## Local state and security

No passwords, OTPs, camera streams, payment credentials, or remote messages are stored. The sample OTP is `123456` and never sends SMS. Coin packs and withdrawals are explicit visual simulations with no cash transfer. React escapes rendered text by default; uploaded stories use object URLs within the page session. Browser persistence is versioned and limited to fictional demo state. Client-side checks are not authorization and must be replaced by server-side rules before production use.
