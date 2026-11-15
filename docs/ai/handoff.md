# Handoff — Home correction awaiting data-source choice (2026-11-15)

- Outgoing provider: Codex.
- Working tree: `/Users/edisonkpaul/Documents/Own/luvzy/luvzy-website`.
- Branch / HEAD / Git diff: unavailable; this directory has no Git metadata.
- Status: Incomplete. User clarification is pending because “previous static data” conflicts with the original requirement to use backend data.

## Safe checkpoint

- Current `src/app/App.tsx:601` HomePage renders only the welcome/activity hero and fetches `/home`. Shared file mtime is 13:02 local, after an API-backed implementation had passed frontend/browser checks. Preserve the current shared source until the user chooses the intended data source.
- Independent reviewer and security reviewer inspected the current hero-only source. Independent tester reports `pnpm test` failed 3 of 26 tests, type-check/lint/build passed, and Playwright executed no tests (6 skipped).
- Earlier API-backed version passed 26 frontend tests, type-check, lint, six Playwright tests, and build, but those results do not apply to the current source state.
- Existing dynamic API methods and CSS for the omitted sections remain in the project. There is no live authenticated API browser result.

## Next actions

1. Get the user’s choice: restore the former static sample data and sections, or preserve the sections with backend-only data as originally requested.
2. Make only the selected Home change; keep the existing section structure.
3. Rerun unit, type, lint, build, and browser checks against the resulting current source. Update `docs/ai/current-task.md`, `decisions.md`, and `verification.md`.
