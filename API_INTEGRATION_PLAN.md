# Laravel 12 API integration plan

## Current implementation

- Website OTP request, verification, one-time registration handoff, and registration use the Laravel Website API. Authentication is restored and revoked through Laravel's Sanctum-backed web session; the browser's persisted demo state is not an authentication source.
- Customer inbox, notification preferences, and the authenticated Home page use the API. Home profile completion, eligible discovery cards, likes/interests, stories, community posts, presence, and displayed wallet balance are read from or persisted by Laravel.
- The API defaults to `<current-protocol>//<current-host>:8002` for local development; set `VITE_API_BASE_URL` to the backend's HTTPS origin in production. The backend must allow the frontend origin and Sanctum stateful domain, and support credentialed requests.

## Remaining integration

- `GET /api/v1/home` returns the authenticated member profile, a `profile_complete` eligibility flag, eligible opposite-role adult profiles, owned likes/interests, received interests, active unexpired stories, recent community posts, and coin balance. Incomplete or under-18 profiles receive no discovery data.
- `GET /api/v1/home/profiles/{user}` returns only an eligible opposite-role adult profile to an active, eligible signed-in member. Home cards use this route for detail views; missing or unauthorized profiles do not fall back to browser fixtures.
- `PATCH /api/v1/home/profile`, `PATCH /api/v1/home/presence`, `PUT /api/v1/home/interactions/{user}`, `POST /api/v1/home/posts`, and `POST /api/v1/home/stories` validate and persist Home mutations. Story reactions use `PUT /api/v1/home/stories/{story}/reaction`; replies use `POST /api/v1/home/stories/{story}/comments`. Story/profile media routes require an active, eligible authenticated member; uploads are private, limited to 50 MiB per account per rolling 24 hours, and expired media is pruned hourly while moderation history is retained. Failed file deletions retain retryable paths; stale unreferenced upload files are swept after 24 hours.
- Post author payloads expose only the author's ID and name. Profile and story visibility share adult, account-role, and usable-city checks; canonical city IDs and text city values are supported. Home age eligibility currently uses a backend-validated, user-entered date of birth; independent age assurance needs a separate product decision.
- Apply the additive Laravel migration before serving the updated website against a database. The migration has not been applied to the configured database. Home remains empty when the database has no eligible records; it has no client fixture fallback.
- Local browser-to-API integration still needs CORS validation against the intended website origin; unit and isolated API tests do not establish live cookie/CORS behavior.
- Other routes (Explore, Matches, chats, calls, wallet and earnings) still contain prototype-local state and are outside this Home integration.
- Keep payment, withdrawal, WebRTC, and messaging marked as simulations until their backend and security contracts exist.
- Use TanStack Query when actual remote asynchronous server state expands beyond the current API calls.
