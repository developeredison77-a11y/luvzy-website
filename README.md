# LUVZY website

Responsive React + TypeScript implementation of the LUVZY v23 website prototype. Website authentication, inbox, and notification preferences use the Laravel API. Other people and interactions are fictional and local to this browser; no payment processor, live messaging, or remote call service is connected.

## Requirements

- Node.js 22 or a compatible current LTS release
- pnpm 11 (the project lockfile is `pnpm-lock.yaml`)

## Run locally

```bash
pnpm install
pnpm dev
```

Open the URL printed by Vite. Website sign-in and registration use the Laravel Website API and its database-backed session (`http://localhost:8002` by default; override with `VITE_API_BASE_URL`). In `local` and `testing` environments, use demo OTP `123456`; production OTP delivery requires the configured SMS provider. A new verified number continues to profile registration. Use **Profile → Edit profile** to switch the demo account between boy and girl workflows.

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm build
pnpm test:e2e
```

Playwright uses installed Google Chrome (`channel: chrome`) because the available Playwright Chromium build does not support macOS 13 on this machine.

## Project notes

- [Architecture](ARCHITECTURE.md)
- [Prototype parity and limitations](PROTOTYPE_PARITY.md)
- [Development plan](DEVELOPMENT_PLAN.md)
- [Laravel API integration plan](API_INTEGRATION_PLAN.md)
- [Security and performance review](SECURITY_PERFORMANCE_REVIEW.md)

Local activity is stored in versioned browser storage under `luvzy-react-demo-v1`. Clear the demo data through the account screen or clear this site's browser storage.
