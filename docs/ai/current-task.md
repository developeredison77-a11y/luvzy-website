# Home interested profiles panel (2026-11-15)

- **Goal:** Add the supplied interested profiles section after the featured profile on Home, with safe layouts for any profile count and a link to `/matches`.
- **Risk level:** 2 — responsive user-facing Home section.
- **Owner provider:** Codex.
- **Status:** Implemented. TypeScript, lint, build, and diff checks pass; browser review blocked by unauthenticated `/home` redirecting to `/login`.
- **Acceptance:** [x] section follows featured profile; [x] one, two, three and overflow profiles adapt cleanly; [x] full-list link opens `/matches`; [x] TypeScript, lint, build, and diff checks pass. Browser visual review blocked by missing authenticated session.
- **Done:** Derived displayed people from the same saved likes and blocked-profile filtering used by Matches. Show up to three cards and an overflow tile linked to Matches.
- **Next action:** None; visual browser review remains unverified until an authenticated session is available.

# Featured profile section after Home Stories (2026-11-15)

- **Goal:** Recreate the supplied featured profile reference as a responsive Home section directly after Stories.
- **Risk level:** 2 — multi-breakpoint, user-facing Home UI.
- **Owner provider:** Codex.
- **Status:** Implemented. TypeScript, lint, build, and diff whitespace checks pass. Browser visual review blocked by unauthenticated `/home` redirecting to `/login`.
- **Acceptance:** [x] featured profile follows Stories; [x] responsive desktop/tablet/mobile layouts; [x] existing profile, video call and chat data/actions reused; [x] production build and lint pass.
- **Done:** Added the featured profile banner and responsive styling. Its Video Call action opens the direct call cost review; random-call chooser remains on random-call CTAs.
- **Next action:** None.

# Auto-expand newly submitted story replies (2026-11-15)

- **Goal:** Show a reply immediately after submission without requiring a separate expand click.
- **Risk level:** 1 — targeted interaction-state adjustment.
- **Owner provider:** Codex.
- **Status:** Complete.
- **Done:** Submitting a reply expands its parent thread; older threads remain collapsed until opened.
- **Verification:** Browser confirms the new reply is immediately visible and the thread reports expanded. Lint/build PASS.
- **Next action:** None.

# Story reply controls and reaction surface (2026-11-15)

- **Goal:** Collapse replies by default with an expand/minimize control and refine the floating reaction tray.
- **Risk level:** 2 — interactive comments state and user-facing UI.
- **Owner provider:** Codex.
- **Status:** Complete.
- **Acceptance:** [x] replies hidden until expanded and can be minimized again; [x] reaction tray has a restrained, polished background and responsive sizing; [x] browser interactions, lint, and build pass.
- **Done:** Added nested reply grouping with per-thread View/Hide controls; restyled the emoji tray as a compact neutral glass capsule.
- **Verification:** Lint/build PASS. Browser at 390px confirms replies start hidden, expand and minimize, and reaction tray renders as a 334×56px pill. Browser test data restored.
- **Next action:** None.

# Instagram-style story reaction controls (2026-11-15)

- **Goal:** Remove visible labels from story reaction icons and align the story viewer controls with Instagram Stories.
- **Risk level:** 1 — small user-facing style and markup adjustment.
- **Owner provider:** Codex.
- **Status:** Complete.
- **Done:** Reactions show emoji only while retaining accessible names. The viewer uses the existing full-screen story style, floating reaction tray, and message-style comment action. Caption clears the controls.
- **Verification:** Lint/build PASS. Browser PASS: six icons have no visible labels, reaction toggles, comments open, and the caption stays above the reaction tray.
- **Next action:** None.

# Stories viewer completion (2026-11-15)

- Taken over by Codex at 2026-11-15T08:35Z. Verified existing uncommitted Home Stories work in `src/app/App.tsx` and `src/app/overrides.css`; the 07:38 handoff is stale and its data-source question was resolved by the user's explicit static Stories reference request.
- **Goal:** Keep story avatars circular and make them open stories with reaction, comment, and reply controls.
- **Risk level:** 2 — user-facing interactive view with persisted local state.
- **Owner provider:** Codex.
- **Status:** Complete.
- **Acceptance:** [x] circular story avatars; [x] story image opens from each avatar; [x] reactions, comments, and replies use the existing persisted local store; [x] lint/build and browser interactions pass.
- **Done:** Reconnected existing story fixtures and store actions to an accessible viewer with next/previous navigation, reactions, comments, and replies. Locked avatar ring and image dimensions to circles.
- **Verification:** Lint/build PASS. Browser PASS: story image loaded, reaction toggled, comment and nested reply rendered, next story advanced, close/comment inputs receive focus correctly, and avatars measured 68×68px mobile / 96×96px desktop. Browser local demo state restored after interaction checks.
- **Next action:** None.

# Static Neon Home dashboard restoration (2026-11-15)

- **Goal:** Match `Luvzy Neon Video Dating Dashboard.png` with local static profile/demo data and restore the guided random-call popups from both “Start Random Call” and “Find Random Call”.
- **Risk level:** 2 — multi-section responsive dashboard and call interaction.
- **Owner provider:** Codex.
- **Status:** Complete. TypeScript, lint, build, desktop/mobile browser review, and both random-call flows pass.
- **Acceptance:** [x] Restore hero/activity, five active profile cards, random-call banner, profile/streak panels; [x] remove `/home` feed API dependency; [x] both random-call CTAs open the existing guided flow; [x] local coin spending and call history remain.
- **Done:** `/home` now reads local fixtures and demo-store state; both call buttons use the existing guided random-call popup. Home API is not requested. At 390px, document width matches viewport.
- **Next action:** None.

---

# SUPERSEDED — Home page content reduction follow-up (2026-11-15)

- **Goal:** Keep the supplied welcome/activity hero, shared-header wallet popover, and footer on `/home`; remove every other Home feed section.
- **Risk level:** 1 — single-page presentation change.
- **Owner provider:** Codex.
- **Status:** Implemented. TypeScript, lint, and production build pass. Browser visual inspection is blocked because `/home` redirects to `/login` without an authenticated backend session.
- **Done:** `/home` renders only the welcome/activity hero; it uses the signed-in profile immediately and updates activity counts from the Home API. Removed Home feed sections, profile completion form, story actions and section components. Shared wallet popover and footer remain.
- **Next action:** None.

---

## Responsive profile-card actions (2026-11-15)

- **Goal:** Match the reference card action row; display only available chat/video/audio actions, keep the layout responsive, and guarantee one action.
- **Risk level:** 2 — responsive interactive profile cards.
- **Owner provider:** Codex.
- **Status:** Implemented. TypeScript, lint, and build pass. Browser verification unavailable because the expected Playwright browser executable is missing.
- **Done:** Card actions follow each profile’s `availableActions`; empty or missing capabilities fall back to video call. One, two, and three action layouts have separate responsive grids. Call actions reuse the existing dialog and chat stays accessible.
- **Verification:** `pnpm exec tsc --noEmit`, `pnpm run lint`, and `pnpm run build` — PASS. Browser smoke check — BLOCKED; Playwright expects chromium-headless-shell 1254, but only 1223 is installed.
- **Next action:** None.

## SUPERSEDED — Restored static Neon Home dashboard (2026-11-15)

- **Goal:** Rebuild `/home` to match `Luvzy Neon Video Dating Dashboard.png`, use local static profiles, and preserve the existing guided call popup from both call entry buttons.
- **Risk level:** 2 — multi-section responsive interface and interactive call flow.
- **Owner provider:** Codex.
- **Status:** Implemented. TypeScript, lint, and production build pass. Browser interaction verification unavailable.
- **Done:** Restored hero/activity, five active profile cards, random video call banner with shuffle, and profile/daily streak panels. Home data now uses local fixtures and demo store. “Start Random Call” and “Find Random Call” both use the existing guided call dialog.
- **Verification:** `pnpm exec tsc --noEmit` — PASS; `pnpm run lint` — PASS; `pnpm run build` — PASS with 518.91 kB chunk advisory. Automated and browser tests not run.
- **Next action:** None.

## SUPERSEDED — Home page content reduction (2026-11-15)

- **Goal:** Keep the welcome/activity hero, the existing header wallet alert, and shared footer; remove all other Home page content.
- **Risk level:** 2 — user-visible responsive page content and its loading state.
- **Owner provider:** Codex.
- **Status:** Implemented; TypeScript, lint, and production build pass. Browser screenshot verification unavailable in this session.
- **Done:** Home renders only the welcome/activity hero. Removed the other Home sections and now-unused section components. Reduced the loading skeleton to match. Header wallet alert and shared footer remain outside HomePage and unchanged.
- **Verification:** `pnpm exec tsc --noEmit` — PASS; `pnpm run lint` — PASS; `pnpm run build` — PASS with existing >500 kB JS chunk advisory. Automated tests and browser screenshot verification not run. Git metadata unavailable.
- **Next action:** None.

# Secured dynamic Website Home (2026-11-15)

## Home layout preservation follow-up (2026-11-15T04:50Z)

- **Goal:** Restore the existing Home page sections and order while keeping Home data and profile actions API-backed.
- **Risk level:** 2 — responsive Home composition and API-backed presentation; backend authorization code was not changed.
- **Owner provider:** Codex.
- **Status:** SUPERSEDED 2026-11-15T07:36Z by Codex: `src/app/App.tsx` changed after this checkpoint and now renders only the hero; the recorded section-preservation result no longer describes the current source.
- **Done:** Restored the boy Home sequence: original welcome hero and actions, Active Girls, Random Video Calls, profile/community dashboard. Random-call suggestions now use the Home API profile pool. Loading skeleton mirrors the page sections. Added section-order/API-data/responsive browser coverage.
- **Verification:** SUPERSEDED 2026-11-15T07:36Z by Codex: current source no longer renders these sections. Earlier tests passed against a prior source state. Live authenticated API browser integration remains unverified because direct `/home` navigation without a backend session redirects to `/login`.
- **Remaining for this correction:** None. Original secured Home implementation’s environment dependencies remain below.

- **Goal:** Replace every `/home` fixture listing/value/action with API data and secured, validated Laravel endpoints.
- **Risk level:** 3 — authenticated profile/media data, adult eligibility, uploads, and persisted member actions.
- **Owner provider:** Codex.
- **Status:** Implemented; independent tester PASS, security review reports no confirmed findings, and final independent judge PASS. Home section structure has been restored in the follow-up above. Awaiting user decision on independent age assurance. Additive migration has not been applied to the configured database.
- **Acceptance:** Home profiles, interests, presence, stories, posts, and wallet values come from backend; mutations persist through authenticated validated routes; incomplete/under-18 profiles receive no discovery data; profile/story visibility, privacy, upload limits, cleanup and empty/error/loading states are covered.
- **Done:** Replaced Home fixture data with `/api/v1/home`; persisted likes/interests, presence, profile completion, posts, story uploads/reactions/comments. Home card profile links now load authorized backend profile details and persist interests; denied/missing profiles never fall back to fixtures. Backend limits profile/media visibility, sanitizes post authors, caps story uploads at 50 MiB per account per rolling day, and retries failed media cleanup while retaining moderation history.
- **Verification:** Final independent checks: `pnpm test` — 26 tests PASS; TypeScript, lint, build PASS; backend Home suite — 14 tests / 138 assertions PASS with in-memory SQLite; targeted Pint PASS. Vite reports a 543.68 kB main JS chunk advisory. Browser mocks were exercised earlier; real API browser integration remains unverified. Full test details are in `verification.md`.
- **Pending:** User decision whether validated, user-entered DOB is sufficient or Home discovery requires independent age assurance. Apply the additive backend migration only in the intended development environment and resolve CORS before live API use.

# Dynamic website authentication with Laravel sessions (2026-11-14)

- **Goal:** Make login and registration rely on backend OTP verification and database-backed Laravel sessions; retain the environment-gated demo OTP; ensure stale locally persisted demo users never authenticate; cover auth success and failure cases.
- **Risk level:** 3 — authentication, session lifecycle, OTP and account creation.
- **Owner provider:** Codex.
- **Status:** Complete. Focused tests, live auth verification, independent tester PASS and independent judge PASS.
- **Context:** The frontend already calls Website OTP endpoints, but `signedIn` is persisted in Zustand and grants access without a database user. Profile sign-out calls the API but can retain the fake sign-in when the API fails. Backend Website OTP/session APIs exist; frontend/backend are sibling directories without Git metadata.
- **Acceptance:** Existing session is hydrated through `/api/v1/auth/me`; no local flag grants access; successful login/registration applies the database user to the site; logout invalidates the server session on confirmed success and retains truthful UI state on network failure; demo OTP remains backend local/testing only; OTP/login/register edge cases are automated and verified against isolated test DB; browser auth flow, lint/build and backend auth tests pass; independent Level-3 tester and judge review findings.
- **Done:** Traced existing frontend API integration and backend OTP/session contract. Confirmed port 8002 API responds and its test suite uses in-memory SQLite.
- **Done:** Website boot checks Laravel `/auth/me`; local auth flags are excluded from persistence and sanitized on every rehydration; sign-out completes only after Laravel confirms session invalidation; OTP login and registration map backend users into the UI. Backend OTP tests cover the challenge, registration proof and session lifecycle. Docs now describe connected API scope and production HTTPS configuration.
- **Verification:** Focused frontend suite passes 21 tests; backend auth suite now passes 8 tests / 114 assertions, including late duplicate-phone claim; manual isolated-database browser flow passes. Latest output is in `docs/ai/verification.md`.
- **Verified:** All prioritized auth/session findings were resolved; added a dedicated duplicate-phone race regression test. Independent judge final status: PASS.
- **Next action:** None for this request.

# Calls activity dashboard reference redesign (2026-11-14)

- **Goal:** Rebuild `/calls` to match the supplied Neon Purple Call Activity Dashboard with responsive summary metrics, filters, and call rows.
- **Risk:** Level 2 — multi-state user-visible dashboard and call-history presentation.
- **Owner provider:** Codex.
- **Status:** Complete; lint/build and responsive browser checks pass.
- **Acceptance:** Dark neon call activity header, four responsive summary metrics, functional period/all/missed/search/sort controls, accessible per-call type/status/actions, preserved detail/delete/call flows, no overflow on narrow screens, lint/build pass.
- **Verified context:** `CallRecord` now has optional mode data for video/audio display. Dashboard uses the local history and preserves existing call, detail, chat, and delete actions. Git metadata unavailable.
- **Done:** Replaced the narrow light call list with the neon dashboard, four activity metrics, date range, all/missed filters, name search, sorting, and responsive history rows. Added demo call modes and retained local call-again/detail/delete behavior.
- **Verification:** `pnpm run lint` — PASS. `pnpm run build` — PASS; existing Vite advisory reports the 539.34 kB JS bundle exceeds 500 kB. Playwright confirms no page overflow at 1440, 1024, 768, 390, or 320px; small-screen hero art is hidden. Clean reload has two backend `/api/v1/notifications` 401s and no frontend/runtime errors. Missed filter, search, and Call Again confirmation were exercised earlier in this turn; call was not started. Automated tests not run (not requested).
- **Next action:** None.

# Matches page aligned with Explore (2026-11-14)

- **Goal:** Give `/matches` the same responsive discovery layout and profile-card visual system as `/explore`, using only profiles already liked by the signed-in demo member.
- **Risk:** Level 2 — shared responsive directory UI and route-specific data selection.
- **Owner provider:** Codex.
- **Status:** Complete; lint/build and responsive browser checks pass.
- **Acceptance:** Shared Explore/Matches UI; Matches keeps likes-only results; search/city/interest/action/age filters and load-more operate on the selected set; empty matches state links to Explore; responsive browser check and lint/build pass.
- **Verified context:** `/explore` has the finished neon directory and `MatchesPage` currently renders a generic `PersonCard` grid from `likes`. Git metadata unavailable; snapshot reports not a Git repository.
- **Done:** Both routes use the same profile-directory component and controls; Matches remains likes-only, centers small result sets, and links its empty state to Explore.
- **Next action:** None.

# Explore load-more pagination (2026-11-14)

- **Goal:** Add the supplied reference’s profile count, progress indicator, and prominent Load More Profiles control to `/explore`.
- **Risk:** Level 1 — localized, responsive interface and static demo data update.
- **Owner provider:** Codex.
- **Status:** Complete; lint/build and responsive browser checks pass.
- **Acceptance:** Load more reveals the next distinct profile batch; count/progress reflect active filters; changing filters resets pagination; control fits narrow screens; no overflow; profile skeleton matches first visible batch.
- **Verified context:** Explore used eight eligible sample profiles. Distinct static fixtures are added for a second batch; Git metadata is unavailable.
- **Done:** Added eight fictional girl profiles, 8-at-a-time pagination, accessible count/progress, reference-inspired neon CTA and heart-divider decoration; initial skeleton now mirrors the first eight cards.
- **Next action:** None.

# Explore profiles reference redesign (2026-11-14)

- **Goal:** Match the supplied LUVZY Neon Explore Profiles reference and preserve the experience at phone, tablet, and desktop widths.
- **Risk:** Level 2 — multi-state responsive UI feature.
- **Owner provider:** Codex.
- **Status:** Complete; lint/build and responsive browser checks pass.
- **Acceptance:** Neon heading and full-width responsive filter row; photo-led profile cards with online/city badges, verified name/work, and only available video/audio/chat actions; functional extra filters; skeleton preserves filter/card layout, exact eligible card count, and action count; skeleton motion has shimmer only and respects reduced motion; existing route/search behavior remains.
- **Verified context:** `/explore` uses async local repository search and opposite-role visibility. The boy demo now has eight distinct girl profiles with variable available actions to fill the reference grid. Git metadata is unavailable.
- **Done:** Full-width neon Explore header and filters; photo-led cards expose only available actions; search includes interests; extra action/age filters work; initial skeleton mirrors eligible profiles and each action layout. Lint/build pass; browser confirms eight cards, four desktop columns, one mobile column, and no horizontal overflow at 390px and 320px.
- **Next action:** None.

# Home page skeleton loading state (2026-11-14)

- **Goal:** Add a responsive `/home` skeleton that mirrors the selected profile’s real page structure and avoids bounce motion or artificial loading delays.
- **Risk:** Level 2 — multi-section UI state.
- **Owner provider:** Codex.
- **Status:** Complete; lint/build and responsive browser checks pass.
- **Acceptance:** Skeleton is shown while initial profile image assets are pending; boy/girl layouts retain matching section order, columns and profile-card counts; skeleton has no bounce and honors reduced motion; actual content appears after assets load or fail.
- **Verified context:** `/home` uses synchronous static demo data and has no data-loading state. Profile photos are asynchronous resources; Zustand uses synchronous localStorage persistence. Git metadata is unavailable.
- **Done:** Boy and girl skeletons mirror section order and card counts. Loading waits for their initial profile photos and settles on load or error; there is no timer-based delay. Shimmer is linear and disabled for reduced motion. Updated the random-call section copy to remove the obsolete shuffle reference.
- **Verification note:** The browser reached settled content before a skeleton screenshot could be captured; the skeleton branch and its role-specific DOM are source-reviewed. A local delayed-image Playwright run was unavailable because the local Chromium executable is not installed.
- **Next action:** None.

# Floating Random Call reference styling (2026-11-14)

- **Goal:** Match the supplied neon Random Call reference and keep the inactive video icon centered in its round medallion.
- **Risk:** Level 2 — responsive UI redesign.
- **Owner provider:** Codex.
- **Status:** Complete; lint/build and browser checks pass.
- **Acceptance:** Boy-only fixed lower-right placement; inactive camera centered in the round state; expanded reference-style neon pill on hover/focus; existing Random Call dialog reused; no drag or reposition controls; animation respects reduced-motion preferences; responsive at 320px and 390px.
- **Done:** Removed hidden label/dot layout space that shifted the inactive icon left. Camera, medallion, and outer button now share the same center; hover still reveals the title and six-dot accent.
- **Next action:** None.

# Low coin balance header alert (2026-11-14)

- **Goal:** When a boy account has fewer than 100 coins, highlight the header balance and open the supplied wallet popover on click.
- **Risk:** Level 2 — UI-only demo balance and wallet navigation; no payment processing or payment API changes.
- **Status:** Implemented. The warning appears only below 100, pulses with reduced-motion support, opens a responsive wallet popover, closes on outside press or Escape, and links to `/wallet`. The existing demo balance was restored after testing.
- **Verification:** `pnpm run lint` passes. `pnpm run build` succeeds with the main-chunk advisory (504.98 kB). Browser checks confirm 100 coins stays normal, 99 triggers the alert, popup and wallet navigation work, and the 320px viewport has no document overflow.
- **Next action:** none.

# Random-call profile shuffle (2026-11-14)

- **Goal:** Replace generic matching copy with a visual profile shuffle that smoothly cycles portraits and settles on the chosen profile before showing the match.
- **Status:** Implemented. The roulette slows through staged intervals, lands on the randomly selected fictional profile, holds it briefly, then continues to a smoothly animated match screen. The match screen shows the selected profile’s one-minute call rate and offers Shuffle again and Start call. When balance is below three minutes at that girl’s rate, it shows the exact three-minute cost, coin shortfall, and a Buy coins link to the wallet. Shuffle again selects a different fictional profile; the separate coin-review step is removed. Reduced-motion preference skips the cycling and shows the selected profile directly.
- **Verification:** `pnpm run lint` and `pnpm run build` pass. Browser walkthrough confirmed different picks on repeat shuffle, rate display, the threshold warning and wallet navigation, and no overflow at 320px, 390px, and 1280px.
- **Next action:** none.

# Mobile-number login screen (2026-11-13)

## OTP-first registration handoff and managed cities (2026-11-13)

- **Goal:** Verify each phone on the login flow; existing accounts sign in; new numbers continue to a profile-only registration form after OTP.
- **Status:** Implemented. `/register` without a verified handoff redirects to phone verification. Successful new-number verification carries a short-lived registration token (10 digits + 16 alphanumeric characters) in router state; registration submits it with profile fields. No OTP, email, DOB or password inputs appear on the registration form.
- **Security:** Backend stores a keyed token hash, limits token guesses to five, expires proof after ten minutes and consumes proof once.
- **Verification:** Website production build passes; browser route snapshot confirms direct `/register` goes to `/login` and shows phone verification. No OTP/API flow was submitted; no configured DB/migration or SMS used. Independent Level-3 checks unavailable; no Git metadata.
- **Next action:** Apply additive migrations in a confirmed environment and run the full flow against an isolated DB.

## Demo OTP sign-in and registration routing (2026-11-13; superseded behavior)

- **Historical behavior:** Local/testing requests for unlinked numbers returned `registration_required` before OTP verification.
- **Superseded by:** OTP-first registration handoff above. All valid numbers now receive OTP; only after a correct code does the API sign in an existing account or issue a registration token for a new number.

## OTP rejection guidance (2026-11-13)

- **Goal:** Explain why the local demo OTP can be rejected immediately and keep API guidance visible after verify errors.
- **Status:** SUPERSEDED by demo OTP sign-in and registration routing below.
- **Cause:** OTP verification requires a persisted challenge and an active account with this phone already verified. The API intentionally returns a placeholder challenge for ineligible numbers to prevent account enumeration; `123456` cannot verify that placeholder.
- **Historical note:** Existing email-only accounts may use the separate account-link flow once; normal sign-in and new registration now begin with phone OTP.

## Visible OTP digits and standard focus behavior (2026-11-13)

- **Goal:** Fix invisible/misaligned OTP digits while retaining six boxes, whole-code paste, auto-advance, and backspace navigation.
- **Status:** implemented; `pnpm run build` passes. Each visible box is now a real text input with readable digits.
- **Next action:** none; OTP-stage browser verification remains pending an isolated API response.

## Single-input OTP with six-box display (2026-11-13)

- **Status:** SUPERSEDED 2026-11-13; transparent overlay caused digits to render faint and offset. Replaced by six real inputs with whole-code paste and cross-field deletion.

- **Goal:** Use the requested “Verification code” label and six-box appearance while allowing paste and normal deletion through one input control.
- **Status:** implemented; `pnpm run build` passes.
- **Next action:** none; live OTP interaction remains unverified without an isolated API response.

## In-place OTP field (2026-11-13)

- **Goal:** Keep the current website login page and replace the phone field with one OTP field after the API accepts the phone request.
- **Status:** implemented; website production build passes and `/login` renders in the browser with the shared page layout.
- **Next action:** full OTP-stage browser exercise requires an isolated API response; do not submit to the configured backend.

## Indian mobile and focused OTP step (2026-11-13)

- **Task ID:** 2026-11-13-luvzy-indian-phone-otp-ui
- **Goal:** Restrict auth phone entry to 10 Indian mobile digits and show only a six-box OTP step after API acceptance.
- **Status:** implemented; production build passes. The 390px login view was inspected in the browser; OTP request was not submitted to the configured API.
- **Next action:** exercise paste, backspace and verify against an isolated API account.

## Local demo OTP support (2026-11-13)

- **Task ID:** 2026-11-13-luvzy-demo-otp
- **Goal:** Let local website login and account-link flows use the backend-issued demo OTP without SMS.
- **Status:** implemented; website production build passes. Demo instructions come from the API response and render in the auth form.
- **Next action:** exercise the request/verify flow when an isolated backend database with the auth migrations is available.

## Backend-driven auth validation update (2026-11-13)

- **Task ID:** 2026-11-13-luvzy-api-validation
- **Goal:** Match the supplied field-error design and source auth validation messages exclusively from Laravel APIs for website and Flutter.
- **Risk level:** 3 — authentication contracts and public API validation.
- **Status:** implementation complete; website build and backend checks pass; Flutter analysis passes. App route runtime validation and visual browser review remain unverified.
- **Acceptance:** [x] website auth forms display field-level backend errors; [x] Flutter auth forms display field-level backend errors; [x] separate app/website FormRequests and auth routes exist; [x] screenshot-style error presentation is implemented; [ ] browser exercise and app OTP runtime smoke check pass.
- **Next action:** configure SMS and database migrations in the intended backend environment, then verify both clients against it and obtain independent Level-3 review.

---

- **Task ID:** 2026-11-13-luvzy-mobile-login
- **Goal:** Update the website `/login` screen to use mobile-number sign-in and match the LUVZY app design.
- **Module / area:** `src/app/App.tsx`, auth styling, and customer authentication contract if required.
- **Risk level:** 3 — authentication and account identity.
- **Owner provider:** Codex
- **Status:** in progress; OTP login and one-time existing-account phone linking are implemented. SMS credentials and database migration remain environment setup.
- **Source check:** SUPERSEDED 2026-11-13. Flutter now uses its app OTP routes; backend has separate app and website OTP APIs. Local/testing environments use a fixed demo OTP; other environments remain SMS-only.

## Acceptance criteria

- [ ] Mobile login screen matches the app's visual style and adapts to narrow screens.
- [x] Login uses mobile number and the six-digit OTP contract. SUPERSEDED 2026-11-13 by local/testing-only demo OTP support.
- [x] Existing accounts can re-authenticate by password and prove phone ownership before linking; new email-based registrations can use the same flow.
- [ ] SMS provider is configured and website login completes end to end.
- [ ] Separate security/reviewer/judge checks and auth-specific verification pass.

## Done

- Website `/login` now collects an Indian mobile number and OTP.
- Laravel routes, requests, controller, services, and phone helper live under the Website API namespace. Existing app authentication routes remain unchanged.
- Added nullable unique verified phone fields, one-use OTP challenge storage, HMAC code/phone fingerprints, attempt limits, session rotation, request throttles, and a Twilio adapter.

## Pending

- Configure Twilio credentials and run the additive migrations in the intended backend environment.
- Run separate level-3 security, tester, and judge reviews; automated tests were not requested.

### Next action
- Complete account phone linking/enrollment after the user selects the migration flow; verify after SMS provider setup.

---

# Shared landing header and footer (2026-11-13)

- **Task ID:** 2026-11-13-luvzy-shared-site-chrome
- **Goal:** Use the landing page header and footer consistently on every site route.
- **Module / area:** `src/app/App.tsx` and standalone page components/styles.
- **Risk level:** 2 — cross-route shared navigation and responsive layout.
- **Owner provider:** Codex
- **Status:** complete.
- **Takeover/source check:** Previous Delete Account task is recorded complete; its handoff is stale but code is present. Checkout has no Git metadata, so diff scope cannot be checked.

## Acceptance criteria

- [x] Every route renders the same shared header and landing-page footer, without page-local duplicates.
- [x] Shared navigation works from landing, policy, help, and account pages on desktop and mobile.
- [x] Preserve existing page content, active interactions, auth controls, and signed-in mobile bottom navigation.
- [x] Lint/build and browser checks confirm route coverage, responsive layout, and no duplicate header/footer landmarks.

## Steps

### Done
- Mapped shared `Header`/`Footer` in `App.tsx` and local chrome in Privacy, Terms, Help, Community Guidelines, and Delete Account pages.

### Done (verified)
- Moved all standalone public pages under the existing app-level `Header` and `Footer`; removed local headers/footers from Privacy, Terms, Help, Community Guidelines and Delete Account.
- Footer now always uses the landing-page design. Shared section links target the landing page from inner routes, and the app scrolls to hash targets after route changes.
- `pnpm lint` and `pnpm build` passed. Browser verified one header/footer and no overflow at 320/390/768/1440px across landing, Privacy, Terms, Help, Community Guidelines and Delete Account; mobile menu routes; cross-page section navigation; and zero console errors/warnings.
- Independent reviewer and final judge passed with no outstanding findings. Automated tests were not run, as not requested.

### Next action
- None. Signed-in-specific navigation and mobile app controls remain state-dependent inside the same shared header component.

---

# Delete Account page (2026-11-13)

- **Task ID:** 2026-11-13-luvzy-delete-account-page
- **Goal:** Implement the supplied responsive Delete Account page at `/delete-account` and add it to the landing footer.
- **Module / area:** `src/app/DeleteAccountPage.tsx`, scoped styles, route metadata and site footers.
- **Risk level:** 2 — public static preview only. The form keeps entered data in component memory and clears it; no deletion endpoint, storage, or data mutation is implemented.
- **Owner provider:** Codex
- **Status:** complete
- **Last updated:** 2026-11-13T04:38:40Z by Codex

## Takeover / source check

Previous Community Guidelines task is recorded complete and source contains its page, route and footer links. `handoff.md` still describes the older Privacy Policy checkpoint, so it is stale. Checkout has no Git metadata; no prior work was reverted.

## Acceptance criteria

- [x] Match supplied responsive design and content.
- [x] Preserve the design-preview banner and ensure no deletion request can be sent or falsely confirmed.
- [x] Reconcile links with existing routes, including the actual `/settings` and `/terms` paths.
- [x] Add `/delete-account` to landing and shared site footers.
- [x] Lint/build and browser checks pass; independent reviewer/security findings addressed. Automated tests were not run, as instructed.

## Steps

### Done
- Inspected supplied JSX, CSS, copy, launch checklist, and desktop/mobile previews. Confirmed reference explicitly says no live deletion endpoint and requires the preview banner to remain.

### Done (verified)
- Integrated the supplied responsive layout and content with scoped styles, public `/delete-account` route, valid website links and footer links.
- Made the request form a local-only preview. It validates input, sends no network request, clears fields, and clearly says no request was sent or stored.
- Fixed reviewer findings: settings CTA now says it only opens general settings, and the tabs support left/right cycling plus Home/End with focus movement.
- Corrected support and process copy to avoid implying deletion or support submission is available.
- `pnpm lint`, `pnpm build`, responsive browser checks, landing footer navigation, keyboard interactions, and preview-form behavior passed. Security review found a copy inconsistency that has been corrected; reviewer findings are addressed in source.
- No Git metadata is available, so diff scope could not be checked. Automated tests were not run, as instructed.

### Blockers
- none

### Next action
- none. The actual account-deletion and recovery workflows remain unimplemented; keep the preview disclosure visible until those systems exist.

---

# Privacy policy page (2026-11-12)

- **Task ID:** 2026-11-12-luvzy-privacy-policy
- **Goal:** Add a public, responsive `/privacy-policy` page matching the six supplied desktop/tablet/mobile references.
- **Module / area:** `src/app/PrivacyPolicyPage.tsx`, scoped content/styles, `App.tsx` metadata/routes, footer, registration consent and settings.
- **Risk level:** 3 — public privacy disclosures and legal policy content.
- **Owner provider:** Codex
- **Status:** complete; implementation, verification and independent review finished.
- **Takeover/source check:** Previous Community Guidelines task is recorded complete. Existing Terms, Help and Community Guidelines pages are present and retained. Checkout has no Git metadata; scope cannot be diff-verified.
- **Source of truth:** Supplied `LUVZY_Privacy_Policy_React_Design` JSX, CSS, JSON and screenshots. Keep draft banner, placeholders and review notes. Do not imply legal approval or account deletion functionality.

## Acceptance criteria

- [x] Public responsive page uses all 19 supplied policy sections and both data tables.
- [x] Reference navigation, draft banner, hero, summary cards, TOC, policy cards and footer are implemented.
- [x] Page route works signed out; footer, registration consent, settings and related legal routes link correctly.
- [x] Draft-only legal details and unavailable account deletion workflow remain clearly disclosed.
- [x] Complete desktop/tablet/mobile, keyboard, anchor and console verification; finish independent reviewer/security/tester/judge checks.

## Steps

### Done
- Adapted the supplied page design and exact JSON draft to the existing React app, with scoped responsive styles and public route metadata.
- Reused existing `/terms` and `/community-guidelines` routes; marked unavailable account deletion as non-clickable in the footer.
- Linked Privacy Policy from public landing footer, registration consent and Settings.

### Done (verified)
- `pnpm lint`, `pnpm exec tsc -b --pretty false`, `pnpm build`, and existing `pnpm test` suite passed.
- Browser verified direct signed-out route, page metadata, desktop/tablet/mobile layouts at 320/390/768/820/1024/1440px, TOC and mobile menu keyboard behavior, internal scrolling tables, registration/settings links, CTA target, and zero console errors on fresh navigation.
- Independent security and tester roles passed. Reviewer findings for the CTA target were fixed; browser verification and follow-up reviewer passed.

### Next action
- None. Policy remains a publication draft pending operator/legal review of the supplied placeholders and operational practices.

---

# Community Guidelines page (2026-11-13)

- **Task ID:** 2026-11-13-luvzy-community-guidelines
- **Goal:** Implement the supplied responsive Community Guidelines design as a public `/community-guidelines` page and link it from the landing page footer.
- **Module / area:** `src/app/CommunityGuidelinesPage.tsx`, scoped stylesheet/content, route metadata, and footer navigation.
- **Risk level:** 2 — public safety policy UI; supplied publication draft and operator review notices must remain visible.
- **Owner provider:** Codex
- **Status:** complete
- **Last updated:** 2026-11-12T22:58:20Z by Codex

## Takeover / source check

The preceding Help & FAQ task is recorded complete. Source confirms the page and footer update are present. Checkout has no Git metadata, so scope cannot be diff-verified. No prior edits were reverted.

## Acceptance criteria

- [x] Preserve supplied visual structure and all 18 content sections.
- [x] Keep publication-draft notice and per-section operator review callouts visible.
- [x] Render `/community-guidelines` publicly with valid internal site routes.
- [x] Add Community Guidelines link to landing footer.
- [x] Lint, production build, responsive browser and landing-footer checks pass.

## Steps

### Done (verified)
- Integrated source JSX, CSS and JSON into the React app. Build and lint passed. Browser confirms 18 sections, draft notice, no horizontal overflow at 320px and 1440px, and zero console errors. Landing footer link resolves to `/community-guidelines`.

### Done (verified)
- Updated Help page Safety links to the new public guidelines route. Re-ran lint/build. Browser verified the landing and Help footer links, the 18-section TOC, and zero console errors/warnings.

### In progress
- none

### Pending
- none

### Blockers
- none

### Next action
- none

---

# Terms of Service moved to website (2026-11-13)

- **Task ID:** 2026-11-13-luvzy-terms-website
- **Goal:** Recreate the supplied Terms of Service page in `luvzy-website` and remove the duplicate Laravel admin/backend page.
- **Module / area:** `src/app/TermsOfServicePage.tsx`, `src/app/terms-of-service.css`, `src/app/terms-of-service-content.json`, `src/app/App.tsx`; backend `routes/web.php` and removed Terms view/style.
- **Risk level:** 2 — public legal information and site routing; no account actions or user data access added.
- **Owner provider:** Codex
- **Status:** complete
- **Last updated:** 2026-11-12T20:04:32Z by Codex

## Acceptance criteria

- [x] Public `/terms` page is implemented in the React website and follows supplied desktop/mobile references.
- [x] Website terms links point to `/terms`; Help/Connect links resolve to public `/help`.
- [x] Laravel Terms route, Blade view and stylesheet are removed.
- [x] Website lint/build and public route/browser responsive checks pass.

## Steps

### Done (verified)
- Built the standalone page with 21 content sections, section navigation, rendered safety bullets and purchase table, and responsive two-column mobile section index.
- Matched the full-page reference proportions: 14,467px at 390px (reference 14,373px); 9,152px at 1440px (reference 9,210px). No horizontal overflow at 320, 390, 820, 1024 or 1440px.
- Removed backend `/terms`, `resources/views/terms.blade.php` and `public/css/terms.css`.
- `pnpm lint` and `pnpm build` pass. Direct website `/terms` and `/help` routes render without login; browser reports 0 console errors and warnings.

### Pending
- none

### Blockers
- none

### Next action
- none. Legal copy retains its visible draft banner and operator/contact placeholders from the reference.

---

# Help & FAQ visual rebuild (2026-11-13)

- **Task ID:** 2026-11-13-luvzy-help-faq-design
- **Goal:** Rebuild the public `/help` page to match `/Users/edisonkpaul/Downloads/LUVZY_Help_FAQ` with production-quality responsive styling and interactions.
- **Module / area:** `src/app/HelpFAQPage.tsx`, `src/app/help-faq.css`, FAQ content, and app route metadata.
- **Risk level:** 2 — public user-facing page with search, FAQ, and support request preview; no backend actions added.
- **Owner provider:** Codex
- **Status:** complete
- **Last updated:** 2026-11-12T19:19:36Z by Codex

## Acceptance criteria

- [x] Match supplied desktop/mobile visual direction and retain LUVZY branding.
- [x] Include searchable FAQ catalog, topic navigation, popular questions, expandable answers, and support request preview.
- [x] Use valid website routes and avoid implying a support request was sent.
- [x] Keep responsive layouts free of horizontal overflow; support dialog has keyboard dismissal and focus restoration.
- [x] Lint, production build, and browser checks pass.

## Steps

### Done (verified)
- Reused reference layout, FAQ data, and scoped stylesheet; integrated as a standalone public `/help` page with the site’s routes and logo.
- Added accessible dialog focus and Escape handling; support form confirms preview-only behavior.
- `pnpm lint` and `pnpm build` pass. Browser checks pass at 320, 390, and 1200px; search returns filtered results; FAQ expands; support preview does not submit; no console errors or warnings.

### Pending
- none

### Blockers
- none

### Next action
- none

---

## Public Help page in website (2026-11-13)

- **Task ID:** 2026-11-13-luvzy-help-public
- **Goal:** Make `/help` publicly accessible in the React website and remove the duplicate Laravel Help page.
- **Module / area:** `src/app/App.tsx`; backend `routes/web.php`, `resources/views/terms.blade.php`
- **Risk level:** 2 — public route and user-facing support navigation; no authenticated actions or data access added.
- **Owner provider:** Codex
- **Status:** done
- **Last updated:** 2026-11-13 by Codex

### Acceptance criteria

- [x] A signed-out visitor can open `http://localhost:5173/help` without redirecting to login.
- [x] Backend `/help` route, view and duplicate stylesheet are removed.
- [x] Backend Terms links no longer target the removed Laravel route.
- [x] Website lint/build and signed-out browser check pass.

### Steps

#### Done (verified)
- Removed `<Protected>` from website `/help`, added a public-access FAQ, removed backend Help route/view/style, and verified signed-out route and build.

#### In progress
- none

#### Pending
- none

### Blockers

- none

### Next action

- none

## Previous task already in progress: privacy policy page

# Privacy policy page (2026-11-12)

- **Task ID:** 2026-11-12-luvzy-privacy-policy
- **Goal:** Add a public, responsive `/privacy-policy` page matching all six supplied desktop/tablet/mobile references.
- **Owner:** Codex
- **Risk:** Level 3 — public privacy disclosures and legal policy content.
- **Status:** In progress.
- **Source of truth:** `Downloads/LUVZY_Privacy_Policy_React_Design/` component, CSS, content JSON, screenshots, and launch checklist. Preserve the draft banner, placeholders, and review notes; do not imply legal approval or implement account deletion.
- **Acceptance:** Match reference structure and responsive layout; all 19 sections and tables render from the supplied draft; accessible TOC/menu; route works without login; footer, registration context, and settings link to the route; no horizontal overflow at 320/390/768/1024/1440px; lint/typecheck/build pass; browser has no React errors.
- **Done:** Inspected all supplied screenshots and supporting source/content. Confirmed app uses React Router and `/help` is protected; privacy page must remain public.
- **Pending:** Implement page, public navigation, and links; verify visual states and responsive widths; run independent review/security/judge if available; update continuity records.
- **Next action:** Add the page component, copied policy content, scoped styles, and public route.

# Landing page redesign (2026-11-12)

- **Task ID:** 2026-11-12-luvzy-landing
- **Goal:** Recreate supplied LUVZY desktop and mobile landing page references with responsive behavior between sizes.
- **Owner:** Codex
- **Risk:** Level 2 — multi-section public UI and responsive navigation.
- **Status:** Complete.
- **Reference interpretation:** `Downloads/desktop-preview.png` (1512px) is the large-screen reference; `Downloads/mobile-preview.png` (390px) is the small-screen reference. Filenames match their dimensions despite user wording describing their roles in reverse.
- **Done:** Rebuilt the landing page with responsive header/menu, hero, discovery steps, connection features, safety, FAQs, CTA, and multi-column footer. Used the supplied hero poster to match the static reference. Lint, typecheck, production build, browser layout checks, mobile menu, and console checks passed.
- **Follow-up complete (2026-11-12):** Replaced the hero poster image with `public/videos/intro-video.mp4`, copied from the neighboring backend project's defaults. Muted looping inline playback works; reduced-motion pauses it. Lint, typecheck, production build, and browser playback checks passed.
- **Responsive evidence:** No horizontal overflow at 320, 375, 390, 430, 768, 1024, or 1512px. Anchors resolve; mobile menu opens with all five links. Browser console has no errors or warnings.
- **Pending:** None for this request. Automated test suite was not run.
- **Next action:** None.

# Current task

## Fully dynamic authenticated home page (2026-11-14)

- **Goal:** Replace `/home` fixture/local listings and values with authenticated Laravel data, secure endpoints, server validation, and backend-persisted home interactions.
- **Risk level:** 3 — authenticated API, profile visibility, personal data, uploads, and database migrations.
- **Owner provider:** Codex.
- **Status:** In progress.
- **Context:** Website is React/Vite; backend is sibling Laravel 12 repository. Home currently consumes fictional `people`/`storyImages`, local `feed`, and persisted Zustand likes/interests. Both checkouts lack Git metadata. Existing backend has Sanctum session auth, `UserProfile`, `Story` moderation tables, and user/profile image metadata.
- **Acceptance:** Home profile, discovery listings, stories, community posts, interests/likes, and displayed counts come from authenticated backend data; mutations are backend-authoritative and validated; every endpoint is session-authenticated and owner-scoped; no home fixture lists or story/feed sample copy ship to the browser; loading/error/empty states work; backend feature tests cover auth, validation, scoping, and persistence; frontend tests/lint/types/build plus browser flows pass; independent Level-3 tester and judge PASS.
- **Plan:** Define additive backend persistence and `/home` API contract; implement authenticated, validated home reads/mutations and tests; replace HomePage fixture/local data and wire interactions; run separate review/security/test/judge checks where supported and exercise responsive UI.
- **Done:** Traced current home components and backend auth/profile/story conventions. Confirmed both repositories have no Git metadata; no diff/snapshot can be used.
- **In progress:** Inspecting current live API/app runtime and schema constraints before additive contract changes.
- **Pending:** Implementation, automated verification, UI/security review, continuity handoff.
- **Next action:** Complete backend schema/API design and implement the feature.

## Recovery checkpoint (2026-11-12)

- Taken over by Codex after interruption. Source inspection confirms implementation files exist; previous verification is treated as stale until rerun. All three projects lack Git metadata, so change scope cannot be proven with Git.
- Do not use configured DB or port 8002. Continue with isolated test database and local static/build checks.

## Real in-app notification inbox integration (2026-11-12)

- Owner: Codex. Risk: Level 3 (customer authentication and notification recipient data).
- User explicitly authorized integration for both the React website and Flutter app. Keep other prototype workflows local; use the backend session only for a real inbox identity.
- Planned: Laravel Sanctum stateful cookie auth, server-backed notification list/unread count/read actions, and preference sync. Never store bearer tokens in localStorage.
- Implemented: email/password login/registration use Laravel Sanctum stateful cookies and CSRF; inbox, unread badge, read actions, and notification preference use the backend. No bearer token is stored in browser storage. Other prototype workflows remain local.
- Status: implementation, lint, typecheck, tests, build, and responsive browser checks complete; live customer API journey remains unverified. Independent level-3 tester/judge gate unavailable.
- Next: exercise cookie login, inbox read, and logout against an allowed reachable backend; port 8002 was not accessed. Deployment must provide exact origins, stateful domains, HTTPS, and `VITE_API_BASE_URL`.

- **Task ID:** 2026-11-10-luvzy-react
- **Goal:** Build the static React website in this target directory with route and interaction parity to the supplied v23 web prototype.
- **Module / area:** Entire Vite React TypeScript application
- **Risk level:** 2 — broad multi-route UI and local simulated wallet/call workflows; no real payment or server integration.
- **Owner provider:** Codex
- **Status:** implementation complete; parity gaps documented
- **Last updated:** 2026-11-10T06:35:54Z by Codex

## Acceptance criteria

- [x] Inspect prototype routes, styles, assets, state rules, and meaningful controls.
- [x] Build responsive React + TypeScript app with route navigation and local data/state.
- [x] Preserve the violet dark design and local simulation boundaries.
- [x] Add architecture, parity, development, API integration and setup documents.
- [x] Run lint, typecheck, tests, build, and browser checks; report exact outcomes.

## Steps

### Done (verified)
- Confirmed target contained only `.DS_Store`, no Git repository or existing application.
- Inspected the 4.09 MB prototype structure, inline styles and script, all 24 registered routes, route handlers, sample data, role-specific rules, local interactions, responsive and reduced-motion styles.
- Reviewed the neighboring Flutter project's parity inventory and local assets as supporting context.

### Done
- Implemented multi-route responsive React app, local repositories/state, prototype assets, and local-only interactions.
- Corrected responsive membership layout and parity documentation based on fresh browser checks.
- Added timed call simulation controls, persistent local call history, filters, details, removal, and coverage.
- Ran lint, typecheck, 13 unit/component tests, production build, and 4 Playwright E2E tests; all passed.
- Confirmed fresh browser console has no errors and no horizontal overflow at all nine target widths.

### Pending
- Additional prototype parity work remains documented in `PROTOTYPE_PARITY.md` and `DEVELOPMENT_PLAN.md` (story/social details, call history/control details, exhaustive route journeys and screenshot diffs).

## Blockers

- Prototype file navigation via connected Playwright is blocked for `file:` URLs; use a local HTTP server for source comparison.
- Target is not a Git checkout, so Git snapshots and diff-based review are unavailable.

## Next action

Continue from documented parity gaps if further iteration is requested.

# Website registration location capture (2026-11-13)

- **Goal:** Remove website city lookup from registration and capture browser coordinates for phone-verified signup.
- **Risk level:** 3 — precise location and authentication data.
- **Status:** Implemented in source; backend migration not applied; independent level-3 reviews and runtime flow remain pending.
- **Done:** Website requests browser location on `/register`, submits coordinates plus browser accuracy, city UI/client call removed, website city API route/controller removed, location fields encrypted at rest by Laravel casts; privacy notice updated.
- **Verification:** `pnpm run build` passed. Targeted PHP syntax checks and Pint passed. No automated tests or live OTP/location API flow run.
- **Next action:** Run security, tester, reviewer and judge checks in a separate session; review migration/privacy retention before applying migration in an approved database.

# Registration validation UX (2026-11-13)

- **Goal:** Make adult consent validation readable and keep account creation unavailable until required registration fields are complete.
- **Risk level:** 2 — registration interaction and client-side validation.
- **Status:** Implemented; lint and production build pass. Browser interaction was not exercised.
- **Done:** Replaced backend adult-consent wording with a human-readable inline error; added accessible error association and high-contrast styling; disabled Create account until name (2+ characters), profile type, adult consent and location are present.
- **Verification:** `pnpm run lint` and `pnpm run build` passed. Automated tests and browser interaction not run.
- **Next action:** None for this change.

# Call-forward homepage redesign (2026-11-13)

- **Goal:** Make calls the primary home action for boy profiles, retain static demo data, and keep the page responsive.
- **Risk level:** 2 — multi-part home UI and existing call preview entry points; no API integration.
- **Status:** Implemented and browser-checked.
- **Done:** Added a boy-only featured call panel with sample profile, rate and clear demo disclosure; added call preview buttons to boy profile cards; retained the local call modal and existing calls route. Girl-profile home does not show the boy spotlight.
- **Verification:** Lint/build passed. Isolated browser checked 1440/1024/768/390/320px without horizontal overflow, confirmed call dialog opens, and confirmed girl profile omits spotlight. Isolated browser logged existing 401 errors from the notifications API because no backend auth session was configured.
- **Next action:** None; call data and profiles remain static fixtures for later API integration.

# Boy home call hub responsive follow-up (2026-11-14)

- **Goal:** Match the supplied active-users/random-video-calls design for boy profiles and keep it usable across phone, tablet and desktop.
- **Risk level:** 2 — multi-part React UI, demo data only; no API integration.
- **Status:** Complete. The earlier featured-only call banner was replaced by an active girls carousel and shuffleable random call panel on boy home. Girl home hides call initiation panels.
- **Done:** Each sample girl has a video-call preview action; random suggestion shuffle changes the profile; random call opens that profile's local call dialog. Static fixture data and demo-only disclosures remain.
- **Verification:** `pnpm run lint` and `pnpm run build` pass. Isolated browser checked 1440, 1024, 768, 390 and 320 px with no page overflow; profile carousel scrolls horizontally on narrower widths. Verified shuffle changes suggestion and CTA opens the corresponding call dialog. Girl role hides the new call hub.
- **Known environment issue:** Browser console shows two existing HTTP 401 responses from `/api/v1/notifications` without backend auth; unrelated to this UI.
- **Next action:** None.

# Center nested popup overlays (2026-11-14)

- **Goal:** Keep popups centered in the visible viewport after page scrolling, across screen sizes.
- **Status:** Complete. Root cause was the `.page` entry animation applying a transform, which made nested `position: fixed` backdrops use the page as their containing block. The page now fades in without a transform; modal entry animation is unchanged.
- **Verification:** Browser measured dialog centers at viewport midpoint at 1440×900, 390×700, and 320×320 after scrolling; dialogs remain fully within viewport. `pnpm run build` and `pnpm run lint` pass.
- **Next action:** None.

# Active girl contact options (2026-11-14)

- **Goal:** Show available video call, audio call and chat actions per profile in the boy-only Active girls section; keep cards usable with one, two or three actions.
- **Risk level:** 2 — multi-file UI and local interaction paths; static fixture data only.
- **Status:** Complete. Added optional typed `availableActions` per person and static fixtures covering one, two and three choices. Audio call opens a distinct local audio preview; chat opens the existing local conversation. Disabled actions are omitted and remaining buttons use a count-based responsive grid.
- **Verification:** Lint/build pass. Isolated browser checked 1440, 1024, 768, 390 and 320 px without page overflow; audio preview opens for Sara and chat navigates to `/chats/1` for Ananya.
- **Next action:** None.

# Reference-matched neon video dashboard (2026-11-14)

- **Goal:** Rebuild the boy `/home` visual hierarchy to closely match the supplied neon video-dating dashboard reference and stay responsive.
- **Risk level:** 2 — multi-section React/CSS home redesign; local fixtures and existing demo interactions.
- **Status:** Complete. Added a welcome/call hero with preview art and activity panel; enlarged photo-led Active Girls cards; retained per-person video/audio/chat choices; restyled random-call banner; left the profile/community dashboard below.
- **Verification:** `pnpm run build` and `pnpm run lint` pass. Browser visually checked 1600×900 and 390×844; checked 320px page width for overflow. Video-call modal and chat link still open correctly. Profile images and activity figures remain demo content.
- **Next action:** None.

# Prioritize video-call action on Active Girls cards (2026-11-14)

- **Goal:** Make video call the primary action while retaining available audio/chat controls as secondary actions.
- **Status:** Complete. Video action sorts first, uses a prominent pink filled button and keeps its label. Audio/chat remain compact circular icon buttons. Responsive sizing was adjusted for 320–1600 px widths.
- **Verification:** `pnpm run build` and `pnpm run lint` pass. Playwright checked 320, 390, 768, 1024 and 1600 px; no page overflow and video action content fits its button.
- **Next action:** None.

# Reference-matched video/audio call confirmation (2026-11-14)

- **Goal:** Restyle the pre-call dialog for video and audio to match the supplied neon cost-summary reference and remain usable on narrow screens.
- **Module / area:** `src/app/App.tsx`, `src/app/overrides.css`.
- **Risk level:** 2 — multi-state React UI with sample coin estimates and responsive modal layout.
- **Owner provider:** Codex.
- **Status:** Complete.

## Acceptance criteria

- [x] Video/audio confirmation includes profile details, call rate, current balance, estimated talk time, four-minute cost, balance guidance, and Cancel / Recharge / Start actions.
- [x] Values and labels adapt to the selected member and call mode; local-only demo and sample-coin disclosures remain clear.
- [x] Modal remains centered and usable at desktop and mobile widths without page-level horizontal overflow.

## Steps

### Done (verified)
- Rebuilt confirmation content and responsive styling — evidence: `verification.md`, 2026-11-14 call confirmation entry.

### In progress
- none.

### Pending
- none.

## Blockers

- none.

## Next action

None.

# Guided Random Call flow (2026-11-14)

- **Goal:** Make either Random Call button lead through the supplied choose-type, matching, match, balance-review, and preview-preparation flow.
- **Module / area:** `src/app/App.tsx`, `src/app/overrides.css`.
- **Risk level:** 2 — multi-step React call-preview flow with wallet estimates; static demo profiles only.
- **Owner provider:** Codex.
- **Status:** Complete.

## Acceptance criteria

- [x] Both Random Call buttons open the same guided flow with video/audio choice, matching, match summary, and balance review.
- [x] Coin rate, balance, available minutes, and four-minute top-up shortfall reflect current static profile and wallet values.
- [x] Continue begins the selected local audio/video preview; sample-only disclosures remain visible.
- [x] Modal adapts to desktop and mobile widths.

## Steps

### Done (verified)
- Implemented matching and preview transitions — evidence: `verification.md`, 2026-11-14 Random Call flow entry.
- Exercised video and audio routes, including a low-balance case — evidence: same verification entry.

### In progress
- none.

### Pending
- none.

## Blockers

- none.

## Next action

None.
## Restore dynamic Home sections (2026-11-15)

- **Goal:** Restore the existing Home sections (Active Girls, Random Video Calls, Stories, Featured Girl, Interest in You, and community posts) while keeping their listings, counters, and mutations backend-backed.
- **Risk level:** 3 — authenticated discovery data, interests, story uploads/reactions, and member content.
- **Owner provider:** Codex.
- **Status:** In progress. Current source reverted to fixture-driven Home and omits Stories, Featured Girl, and Interest in You; API service and backend contract remain present. No Git metadata is available.
- **Acceptance:** Preserve the existing sections/order and visual classes; use only `/home` snapshot data for Home; persist member actions through existing authenticated API; represent loading, error, incomplete-profile, empty-list, and mutation states without fixture fallback; verify frontend tests, types, lint/build, and browser layout.
- **Done:** Confirmed actual source disagrees with older dynamic Home verification. Current Home uses local `people`/demo store and hard-coded counts; `customerApi.home()` and secured mutation methods remain available.
- **In progress:** Restore dynamic Home state and the missing original sections using the existing API contract and styles.
- **Update:** After an API-backed implementation passed frontend checks, `src/app/App.tsx` changed again at 2026-11-15 13:02 local time. Current source renders only the hero. No Git metadata is available to identify the editor or diff; edits are preserved pending user direction. A separate reviewer confirmed the sections are currently missing.
- **Next action:** User is choosing between restoring prior static sample data and keeping the sections API-backed, consistent with the original requirement.

