# 2026-11-14 — Low coin balance header alert

- **Area:** Signed-in boy header and wallet navigation.
- **Decision:** Show an animated wallet warning only when the demo balance is below 100 coins. Clicking it opens the supplied-style anchored popover; its CTA links to `/wallet`.
- **Rationale:** Use the persisted demo balance and existing wallet destination without changing payment handling.
- **Approved by:** user request.
- **Recorded by:** Codex.

# 2026-11-13 — Terms page belongs to the public website

- **Area:** Public `/terms` route.
- **Decision:** Implement the supplied Terms design as a standalone React website page, render it without authentication, and remove the duplicate Laravel route/view/style. Keep the screenshot’s draft banner and legal placeholders visible.
- **Rationale:** User explicitly assigned the page to `luvzy-website` and requested exact responsive reference matching. A page-local layout preserves the screenshot’s header/footer and keeps it independent of the admin shell.
- **Approved by:** user request.
- **Recorded by:** Codex.

# Decisions

## 2026-11-15 — Preserve Home section structure during data integration

- **Area:** Website `/home` presentation.
- **Decision:** Keep the established welcome hero, Active Girls, Random Video Calls, and profile/community dashboard sections in their existing order while sourcing profile suggestions and Home values from the protected Home API.
- **Rationale:** The user requested dynamic data and explicitly corrected a redesign that changed the Home sections.
- **Approved by:** User request.
- **Recorded by:** Codex.

## 2026-11-15 — Home profile detail navigation

- **Area:** Profile cards shown on `/home`.
- **Decision:** Route Home cards to `/home/profile/:id`, load authorized profile details from the backend, and persist interest changes there. API failures show unavailable state with no fixture fallback.
- **Rationale:** Dynamic Home data must remain dynamic after opening a member card.
- **Approved by:** User request; follow-up to independent judge NEEDS-FIX finding.
- **Recorded by:** Codex.

## 2026-11-13 — Local OTP result routing (SUPERSEDED by OTP-first registration handoff)

- **Area:** Website and App OTP login.
- **Decision:** Historical behavior: local/testing requests for unlinked numbers returned `registration_required` before OTP verification. Superseded: all valid numbers now receive OTP; verified unknown numbers receive a one-time registration token. Production request responses remain generic.
- **Rationale:** The fixed demo code was previously advertised for placeholder challenges that could never verify. Returning a registration result only in local/testing fixes the development flow without exposing account existence in production.
- **Approved by:** User request for existing-account home routing and new-number registration routing.
- **Recorded by:** Codex.

## 2026-11-13 — Preserve backend OTP guidance during verification

- **Area:** Website login OTP flow.
- **Decision:** Keep the request notice visible when OTP verification fails. API guidance must clarify demo OTP eligibility and account-linking steps without changing authentication eligibility.
- **Rationale:** Unknown or ineligible numbers receive placeholder challenge IDs to preserve anti-enumeration; those IDs cannot verify. A notice that says only “use 123456” was misleading for this case.
- **Approved by:** User request to fix immediate OTP rejection.
- **Recorded by:** Codex.

## 2026-11-13 — Website phone OTP API boundary

- **Area:** Website `/login` and Laravel customer authentication.
- **Decision:** Use `/api/v1/website/auth/otp/*` and Website-scoped controllers, FormRequests, services and helpers. Preserve the existing `/api/v1/auth/*` contract for the Flutter app until its corresponding API migration.
- **Security:** OTPs are six-digit random values stored only as HMACs, expire after five minutes, allow five attempts, and are one-use. Challenge identifiers are UUIDs; phone fingerprints are keyed; SMS requests and verification have phone/IP throttles. Browser login uses Sanctum's stateful session and rotates the session after verification. SMS uses a fail-closed Twilio adapter.
- **Account linking:** Existing email-only accounts re-authenticate with email/password, then prove control of the new phone by SMS before linking; future sign-ins use phone OTP. New accounts can use the same link flow after registration.
- **Pending:** Twilio credentials must be configured and migrations applied before delivery works. Never use the app's demo `123456` code for authentication.
- **Approved by:** User requested website SMS OTP authentication.
- **Recorded by:** Codex.

## 2026-11-13 — One shared site header and footer

- **Area:** site-wide React routes.
- **Decision:** Render the existing landing page `Header` and `Footer` from one shared app shell on every route. Remove page-local copies from standalone public pages. Keep signed-in controls and mobile app navigation functional within that shared header.
- **Rationale:** User asked for the landing page header and footer to be consistent everywhere. A single source prevents routes from drifting and allows one navigation update to apply across the site.
- **Approved by:** user request.
- **Recorded by:** Codex.

## 2026-11-13 — Public Privacy Policy page

- **Area:** public `/privacy-policy` route and site entry points.
- **Decision:** Integrate the supplied React design, 19-section draft and data tables as a standalone public responsive page. Preserve the draft banner, review notes and operator placeholders; link it from registration consent and Settings. Keep account deletion non-clickable until a real workflow exists.
- **Rationale:** The supplied reference bundle is the visual and draft-content source of truth. The app does not yet provide verified operator details or account-deletion operations, so those must remain explicit launch requirements.
- **Approved by:** user request.
- **Recorded by:** Codex.

## 2026-11-13 — Public Help page route

- Keep the existing React `/help` page as the website Help page and render it outside `<Protected>`. Add a visible FAQ confirming it can be read while signed out.
- Remove the duplicate Laravel Help route, view and stylesheet. Do not make the backend Help links point to a dead route.
- Preserve the website prototype's accurate disclosure that live support is not connected.

## 2026-11-12 — Notifications API integration

- User approved both website and Flutter integration. Use Laravel Sanctum stateful browser sessions with HttpOnly cookies and CSRF; never persist bearer tokens in browser storage. Other demo features remain local.
- Historical decision superseded by phone OTP sign-in and OTP-first registration; email/password remains only for existing-account phone linking and the legacy auth endpoints. By default, the API base follows the browser hostname on port 8002; set `VITE_API_BASE_URL` when hosted elsewhere and configure matching Laravel stateful domains and allowed web origins.

## Approved

### 2026-11-12 — Landing page references
- **Area:** public landing UI
- **Decision:** Treat the 1512px `desktop-preview.png` as the large-screen reference and the 390px `mobile-preview.png` as the small-screen reference; use the supplied static hero poster instead of the animated video on the landing page.
- **Rationale:** Image dimensions and composition identify the intended responsive variants; the poster matches the still image in both references.
- **Approved by:** user request
- **Recorded by:** Codex

### 2026-11-12 — Landing hero video
- **Area:** public landing UI
- **Decision:** Serve `intro-video.mp4` from this site's `public/videos` directory; play muted, inline, and looped, and pause when reduced motion is requested.
- **Rationale:** The user's screenshot identifies the hero media section; a local public asset keeps playback self-contained and supports browser autoplay rules.
- **Approved by:** user request
- **Recorded by:** Codex

### 2026-11-10 — React application boundaries
- **Area:** architecture
- **Decision:** Use Vite, React, TypeScript, React Router, Zustand, Vitest and Testing Library; keep data access behind local repository contracts. Do not add a server API.
- **Rationale:** Matches the requested stack and supports route-based static UI with a later Laravel repository implementation.
- **Approved by:** user request
- **Recorded by:** Codex

### 2026-11-10 — Prototype visual source
- **Area:** UI
- **Decision:** Reuse the prototype's CSS and available local assets; preserve its branding, route labels, role rules, and demo disclaimers.
- **Rationale:** The prototype is the stated source of truth.
- **Approved by:** user request
- **Recorded by:** Codex

## Awaiting approval

- none

## 2026-11-13 — Help & FAQ design integration

- **Area:** public `/help` page.
- **Decision:** Use the supplied React FAQ structure, content and responsive stylesheet, integrated as a standalone page so its public header/footer and visual system remain intact. Adapt navigation to existing site routes.
- **Rationale:** The supplied folder is the visual and content source of truth; the existing shared app shell has a different header and footer. Keep support submission preview-only until a secure backend endpoint exists.
- **Approved by:** user request.
- **Recorded by:** Codex.

## 2026-11-13 — Community Guidelines page integration

- **Area:** public `/community-guidelines` page and site footer.
- **Decision:** Integrate the supplied design, all 18 policy sections, the publication-draft banner and operator review callouts. Keep draft warnings visible; use the existing public site routes for navigation.
- **Rationale:** Reference README requires operational review before publication. Existing app does not implement every report/moderation flow described in the draft.
- **Approved by:** user request.
- **Recorded by:** Codex.

## 2026-11-13 — Delete Account page integration

- **Area:** public `/delete-account` UI and landing/footer links.
- **Decision:** Preserve the supplied design and explanatory content. Keep preview banner visible and make the public request form a local-only preview that explicitly confirms no request was sent or stored. Do not connect a deletion API or present success.
- **Rationale:** Reference launch checklist says requests require verified identity, backend persistence, anti-enumeration, and data/financial retention handling; those systems are not implemented in this UI task.
- **Approved by:** user request for page implementation.
- **Recorded by:** Codex.

## 2026-11-13 — Phone-only registration and managed cities (luvzy-website)

- Registration requires a backend-issued OTP challenge, then name, active city ID, profile type and adult consent. Email, DOB and password are removed from App/Website signup UI.
- Keep App and Website auth controllers, FormRequests and city endpoints split. Share the challenge, city directory and registration services.
- City options come from active admin-managed rows. Seed important India cities and Kerala district centers; Kochi is the stable default and cannot be deactivated, renamed or moved.
- Preserve legacy `/api/v1/auth/register` compatibility. Phone-only accounts store a random hashed password and nullable email; verified phone values are written internally without broadening User mass assignment.

## 2026-11-13 — OTP-first registration proof (luvzy-website)

- A valid phone enters the same OTP request/verify flow whether it is an existing or new number. Do not reveal account existence until OTP verification succeeds.
- Existing account verification authenticates normally. A verified unlinked number gets a registration-only token made from ten random decimal digits plus sixteen random alphanumeric characters.
- Persist only a keyed HMAC of the registration token; bind it to the phone fingerprint, client-specific login challenge and ten-minute expiry; cap token guesses at five; consume it atomically when creating the account. The registration UI submits that token and shows no OTP entry.

## 2026-11-13 — Website signup location capture

- **Area:** Website OTP registration and Laravel customer profile storage.
- **Decision:** Request browser geolocation when `/register` opens; require a successful fix to submit registration; send latitude, longitude and reported accuracy; store them in encrypted profile columns. Remove only the website city endpoint; retain `/app/cities` for the native app.
- **Rationale:** Website registration should collect device coordinates instead of selecting an admin-managed city. Browser permission remains required, and the browser's accuracy value is shown as an estimate rather than guaranteed GPS precision.
- **Approved by:** User request.
- **Recorded by:** Codex.

## 2026-11-13 — Boy-profile call spotlight on home

- **Area:** React `/home` experience.
- **Decision:** Give boy profiles a full-width featured sample-call panel and call actions on sample profile cards; preserve the existing girl-profile home flow. Keep profile content, rates and interactions local/static until a future API integration.
- **Rationale:** Make calls immediately discoverable while keeping demo charges and the lack of a live connection clear before starting.
- **Approved by:** User request.
- **Recorded by:** Codex.

## 2026-11-14 — Boy-only active girls and random-call home hub

- **Area:** React `/home` experience.
- **Decision:** For boy profiles, put a horizontally scrollable active girls row with video-call preview buttons before the social feed, followed by a shuffleable random-call suggestion with a direct preview entry point. Hide both call initiation panels for girl profiles.
- **Rationale:** Match the supplied reference and make the shortest call path visible near the top. Keep all profiles and online labels explicitly fictional/static until future API integration.
- **Approved by:** User request and supplied screenshot.
- **Recorded by:** Codex.

## 2026-11-14 — Per-profile contact availability in Active girls

- **Area:** Boy home Active girls cards and static profile fixtures.
- **Decision:** Add optional `availableActions` (`video`, `audio`, `chat`) to `Person`. Render only enabled actions; use a responsive grid based on the number available. Keep sample values static until API integration.
- **Rationale:** Profiles may offer different contact methods without leaving empty buttons or breaking the card layout. Audio uses the local call preview with audio-specific labels and controls; chat links to the existing local thread.
- **Approved by:** User request.
- **Recorded by:** Codex.

## 2026-11-14 — Neon video dashboard reference

- **Area:** Boy-only `/home` visual design.
- **Decision:** Match the supplied reference's hero, call/discovery CTAs, sample activity card, portrait-led Active Girls cards, and vivid random-call banner using existing profile fixture images and app components. Keep girl-profile home separate and preserve all contact availability behavior.
- **Rationale:** Reuse current static profiles and local previews while adopting the reference's layout, contrast, neon accents and content hierarchy.
- **Approved by:** User request and supplied dashboard image.
- **Recorded by:** Codex.

## 2026-11-14 — Video call as primary Active Girls action

- **Area:** Boy home Active Girls profile cards.
- **Decision:** Sort video first and render it as the wide filled primary action. Keep audio and chat as secondary circular icon actions when available; retain full-width labeled action when it is the sole option.
- **Rationale:** Match the supplied action hierarchy while preserving optional contact methods and compact responsive cards.
- **Approved by:** User request and supplied screenshot.
- **Recorded by:** Codex.

## 2026-11-14 — Reference-matched call confirmation

- **Area:** Video/audio pre-call dialog.
- **Decision:** Show the selected sample member, mode-specific heading, live sample balance, per-minute rate, estimated minutes, four-minute cost, balance guidance, and Cancel / Recharge / Start actions in the supplied neon visual style. Retain fictional-profile and local-preview disclosures.
- **Rationale:** Make call cost and available time clear before starting, while matching the requested design and preserving the demo-only behavior.
- **Approved by:** User request and supplied screenshot.
- **Recorded by:** Codex.

## 2026-11-14 — Guided Random Call flow

- **Area:** Boy home Random Call entry points.
- **Decision:** Route both featured Random Call buttons through call-type selection, brief sample matching, match confirmation, coin-balance review, and preview preparation before starting the existing local audio/video preview. Keep profile-specific call buttons on their direct confirmation flow.
- **Rationale:** Follow the supplied demo sequence while explaining sample costs and preserving the local-only behavior.
- **Approved by:** User request and supplied MP4.
- **Recorded by:** Codex.

## 2026-11-14 — Random-call profile shuffle

- **Area:** Boy home Random Call flow.
- **Decision:** Replace the text-first matching indicator with a portrait carousel that cycles fictional profiles, slows down, settles on the chosen match, and hands that same profile to the match details. Respect reduced-motion preference by showing the selected portrait without animated cycling.
- **Rationale:** Make random selection visible and feel deliberate, while preserving continuity between the shuffle and the profile presented as the match.
- **Approved by:** User request.
- **Recorded by:** Codex.

## 2026-11-14 — Random-call selected-profile actions

- **Area:** Boy home Random Call flow.
- **Decision:** Make the selected-profile screen the final call decision point. Show the selected profile’s one-minute rate, provide Shuffle again and Start call actions, and bypass the separate balance review. Shuffle again excludes the current pick when multiple eligible profiles exist.
- **Rationale:** Keep the call price visible beside the profile and reduce the flow to the two requested choices. Preserve the existing first-minute coin check with inline low-balance guidance.
- **Approved by:** User request.
- **Recorded by:** Codex.

## 2026-11-14 — Three-minute random-call balance warning

- **Area:** Selected-profile screen in the Random Call flow.
- **Decision:** When the current balance is below three minutes at the selected profile’s rate, show the exact three-minute cost and coin shortfall with a direct Buy coins link to the wallet. Keep Shuffle again and Start call available.
- **Rationale:** Surface a useful top-up path before a short call runs out while preserving the requested two primary choices.
- **Approved by:** User request.
- **Recorded by:** Codex.

## 2026-11-14 — Floating Random Call dock

- **Area:** Boy home Random Call entry point.
- **Decision:** Add a fixed, circular video-call shortcut at the lower-right. Expand it to show “Random Call” and “Meet someone new now” on hover or focus; reuse the existing Random Call call flow. Provide a dedicated drag handle with pointer and arrow-key repositioning, clamp it to viewport bounds, and keep the handle available on touch devices.
- **Rationale:** Keep random calling visible across the home feed while reducing its footprint until invited. A separate grip avoids triggering the call flow while moving the shortcut.
- **Approved by:** User request and supplied screenshot.
- **Recorded by:** Codex.

## 2026-11-14 — Fixed animated Random Call shortcut

- **Area:** Boy home Random Call entry point.
- **Decision:** Supersede the earlier draggable-dock interaction. Keep the shortcut fixed in the lower-right with no drag grip or repositioning. Add a gentle pulse ring, animated gradient, subtle icon lift, and heart accent; disable animations for reduced-motion preferences.
- **Rationale:** Preserve a stable predictable location while making the primary action more noticeable without a disruptive animation.
- **Approved by:** User request.
- **Recorded by:** Codex.

## 2026-11-14 — Reference match for Random Call shortcut

- **Area:** Boy home floating Random Call shortcut.
- **Decision:** Style the expanded hover/focus state to match the supplied neon pill: layered purple glow, circular video/play medallion, heart accent, floating decorative details, title/subtitle hierarchy, and six-dot ornament. Keep the six dots decorative and the control fixed in place.
- **Rationale:** Match the visual reference while preserving the user’s explicit request to prevent moving the shortcut.
- **Approved by:** User request and screenshot.
- **Recorded by:** Codex.

## 2026-11-14 — Center video mark in Random Call medallion

- **Area:** Floating Random Call icon.
- **Decision:** Center a single video-camera icon inside the circular medallion and remove the overlapping play glyph.
- **Rationale:** Keep the camera mark visually contained and balanced within the round icon.
- **Approved by:** User request and screenshot.
- **Recorded by:** Codex.


## 2026-11-14 — Home skeleton readiness and motion

- **Area:** Signed-in `/home` initial rendering.
- **Decision:** Show a role-specific skeleton while the profile images used by that home layout load; treat image errors as settled so the page cannot remain stuck. Avoid a timer-based delay. Use a subtle stationary shimmer, with animation disabled for reduced-motion users.
- **Rationale:** Home data is synchronous and static today; image readiness is the only real async resource to wait on. The skeleton should preserve the final page’s section order and item counts.
- **Approved by:** User request.
- **Recorded by:** Codex.


## 2026-11-14 — Explore profile discovery reference

- **Area:** Signed-in `/explore` route.
- **Decision:** Use the reference’s full-width neon heading, responsive search/filter toolbar, and image-led profile cards. Preserve opposite-role search and provide eight distinct fictional girl fixtures for the reference grid. Cards use the profile’s available contact actions. The initial skeleton uses the eligible profile count and corresponding action layout, waits for profile photos, and has a short 280 ms minimum visibility to avoid a one-frame flash with the local demo search.
- **Rationale:** Match the visual hierarchy with distinct profiles and keep first-load presentation stable in the static demo while remaining ready for a slower API later.
- **Approved by:** User request.
- **Recorded by:** Codex.

## 2026-11-14 — Explore progressive profile loading

- **Area:** Signed-in `/explore` profile grid.
- **Decision:** Show eight profiles per batch. Add eight distinct fictional girl profiles so the static demo can exercise load-more behavior. Display an accessible shown/total count, progress indicator, and responsive neon CTA; reset the shown count whenever search or filters change. Hide the control after all matching profiles are shown.
- **Rationale:** Match the supplied reference’s progression affordance while keeping the static demo interaction real and avoiding repeated cards.
- **Approved by:** User request.
- **Recorded by:** Codex.

## 2026-11-14 — Shared Explore and Matches directory design

- **Area:** Signed-in `/explore` and `/matches` routes.
- **Decision:** Use one shared profile-directory UI for both routes. Explore searches eligible profiles; Matches searches only profiles in the signed-in member’s existing `likes` state. Keep the same filters, card actions, skeleton, and progressive loading on both pages.
- **Rationale:** Keep the requested page design consistent without treating every profile as a match or duplicating the UI implementation.
- **Approved by:** User request.
- **Recorded by:** Codex.

## 2026-11-14 — Calls activity dashboard reference

- **Area:** Signed-in `/calls` page and local call-history records.
- **Decision:** Rebuild the page around a dark neon call overview, four activity metrics, filters, and compact history rows. Add optional video/audio mode to `CallRecord` for backward compatibility; records without a mode default to video except the known seeded `sample-call-2`, which is audio. Preserve local detail, chat, delete, and call-again behavior. Keep the average rating as the 4.8 fictional demo metric shown by the reference.
- **Rationale:** Match the supplied dashboard while keeping activity tied to the existing local demo state.
- **Approved by:** User request.
- **Recorded by:** Codex.
# 2026-11-14 — Backend session is the only authentication source

- **Area:** Website login, registration, protected routes and persisted demo state.
- **Decision:** Resolve auth from Laravel `/auth/me` at startup; always rehydrate the frontend with `signedIn: false` and `authStatus: checking`, regardless of stored payload version. Keep auth fields out of persisted demo state. Clear client auth only after the backend confirms logout; on failure, retain signed-in state and ask the user to retry.
- **Rationale:** Local storage is editable and cannot prove a user exists or that a session is valid. A failed logout request cannot prove the backend invalidated its session.
- **Approved by:** User request for dynamic, database-backed authentication and session handling.
- **Recorded by:** Codex.

# 2026-11-15 — Dynamic Website Home API scope

- **Area:** Authenticated Website Home listings and actions.
- **Decision:** Fetch Home profile/listing/story/post/presence/wallet data from the backend and persist user actions there. Keep loading, error, incomplete-profile, and empty states explicit, with no local Home fixture fallback.
- **Rationale:** The browser must not hold static or fabricated member data or authoritative business values.
- **Approved by:** User request to make Home fully dynamic and keep data on backend.
- **Recorded by:** Codex.



## 2026-11-15 — Simplified Home page content

- **Decision:** Keep the welcome/activity hero on `/home`; keep the low-balance wallet alert in the shared header and the shared footer; remove the other Home page sections and align the loading skeleton with the reduced page.
- **Rationale:** Match the two supplied reference screenshots while keeping the global wallet and footer UI available.


## 2026-11-15 — Restore static Neon Home dashboard

- **Area:** `/home` dashboard and random-call entry points.
- **Decision:** Render the reference dashboard using local fixture profiles and demo-store values. Both hero “Start Random Call” and banner “Find Random Call” reuse the existing guided random-call dialog.
- **Rationale:** Match the requested static dashboard and preserve the established call interaction.


## 2026-11-15 — Availability-aware dashboard actions

- **Area:** Home profile card actions.
- **Decision:** Show only each profile’s available video, audio, and chat actions; if the list is empty or missing, show video call as the guaranteed fallback. Adapt action layout to one, two, or three visible options.
- **Rationale:** Match the supplied action row without leaving gaps or collapsing cards when a capability is unavailable.


## 2026-11-15 — Keep Home hero, wallet alert, and footer

- **Area:** Authenticated Website `/home`.
- **Decision:** Render only the welcome/activity hero in the Home route. Preserve the shared-header wallet alert and shared footer; remove all other Home feed sections and their Home-only interaction code. Keep the hero visible while API data loads or is unavailable, using the signed-in profile and zero activity counts as fallbacks.
- **Rationale:** Match the two supplied screenshots and keep the requested page content available without other Home sections.
- **Approved by:** User request.


## 2026-11-15 — Restore static Neon Home dashboard

- **Area:** Authenticated Website `/home`.
- **Decision:** Use local `people` fixtures and the persisted demo store for Home profiles, likes, wallet coins, and call history. Restore the hero, active profile cards, random-call banner, profile summary, and daily streak. Connect both random-call entry buttons to the existing guided random-call dialog.
- **Rationale:** Match the supplied dashboard reference and its local demo interaction behavior.
- **Supersedes:** The latest request to keep only the welcome hero on `/home`.
- **Approved by:** User correction.

## Home Stories viewer (2026-11-15T08:38Z)

- Use the existing local `storyImages`, `storyReactions`, and `storyComments` state for the Home Stories demo viewer; do not add a backend dependency or change the persisted model.
- Each avatar opens one sample story; reaction selection, comments, reply entries, and story navigation remain local. Reply entries keep their marker in persisted strings and render as nested replies.
- Lock ring and image width/height and `box-sizing` so avatar circles remain round at every breakpoint.

## Instagram-style Home story controls (2026-11-15T08:42Z)

- Keep emoji reactions visually unlabeled while retaining `aria-label` text; use the existing full-screen story CSS, floating reaction tray, and message-style comment action.

## Collapsible story reply threads (2026-11-15T08:48Z)

- Keep replies grouped under their parent and collapsed by default. Each parent exposes an accessible View replies / Hide replies toggle; new replies are added to the existing local comment store.
- Use a neutral translucent capsule for emoji reactions, with visible labels removed and screen-reader names retained.

## Featured Home profile section (2026-11-15)

- Place the feature directly after Stories and use the first available active profile, its existing portrait, bio, city, interests, and existing call/chat destinations.
- Use a wide image/details/actions banner on desktop and a single-column, touch-friendly card on phones; preserve the supplied purple/pink neon treatment.
- Use the direct video call confirmation from the featured profile's Video Call button. Keep audio/video selection in the random-call flow only.

## Home interested profiles panel (2026-11-15)

- Reuse saved profile likes as the Home interest list because `/matches` already presents that same list and no separate incoming-interest dataset exists in the frontend. Apply the same blocked-profile exclusion.
- Show up to three profiles on Home, with an overflow tile and header count linked to `/matches`; hide the entire panel when there are no profiles. Layout adapts for one or two profiles rather than reserving empty cards.
