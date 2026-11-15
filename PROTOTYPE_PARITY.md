# Prototype parity report

## Source reviewed

`/Users/edisonkpaul/Downloads/LUVZY_Website_Prototype_v23.html` (read only; about 4.09 MB, with two inline CSS blocks and one large inline JavaScript program). The prototype has a web landing mode and a mobile mode. The React app uses the web landing mode and combines the shared account workflows with responsive navigation. It reuses the prototype's 157 KB stylesheet, local LUVZY wordmark, portrait/story images, and 2.2 MB welcome video from the adjacent local assets extracted from the same prototype family.

The source declares 24 routes: `landing`, `welcome`, `login`, `register`, `otp`, `setup`, `home`, `discover`, `explore`, `detail`, `likes`, `matches`, `chats`, `thread`, `calls`, `lounge`, `earnings`, `premium`, `notifications`, `profile`, `edit`, `settings`, `safety`, and `help`. `welcome` is the mobile onboarding; `landing` is the public desktop entry. Profile detail and chat thread are parameterized in React Router.

## Parity checklist

| Prototype area | React implementation | Status / difference |
|---|---|---|
| Public landing, sign-in, registration, adult/phone validation, OTP `123456`, profile setup | `/`, `/login`, `/register`, `/otp`, `/setup` | Implemented. OTP and local session only. |
| Top navigation, section menu, notification badge, account avatar, mobile bottom navigation | Shared `Header`, `BottomNav`, `Footer` | Implemented responsively; SVG source icons use Lucide equivalents. |
| Home profile card, role switch, stories, posts, community profiles, coin entry | `/home` | Core interactions implemented. Story viewer supports sample frame progression, reactions/comments, and session-only image/video upload. Story view tracking, comment likes/replies, live preview, and gallery are not implemented. |
| Profile browsing | `/explore` | Replaces the retired Discover swipe page with searchable profile cards and filters. Legacy `/discover` visits redirect to `/explore`. |
| Search, city/interest filters, profile detail, report/block | `/explore`, `/profile/:id`, `/safety` | Search/filter/detail/block implemented. Reports are stored in local demo state and shown in the Safety Center. |
| Likes, matches, chats, local messages | `/likes`, `/matches`, `/chats`, `/chats/:id` | Local interactions implemented. Matching is an immediate local sample state; the prototype has richer match/reply treatment. |
| Calls, lounge, role rules, coin deduction | `/calls`, `/lounge`, call preview dialog | Local timed simulation, sample coin deduction, mute/camera/flip preview controls, simulated minute advance, persistent local call history, missed filter, detail, and removal implemented. No camera/microphone is connected. Girl role cannot initiate calls. |
| Coin packs, membership preview | `/wallet`, `/premium` | Four coin packs and local balance updates implemented. Membership plans are represented on a separate preview screen; selecting a plan changes only local demo state. |
| Earnings chart and sample balance | `/earnings` | Sample chart and summary implemented. Withdrawal requests are simulated locally and disclose that no payment is sent. |
| Notifications, profile/edit, settings, safety, FAQ | `/notifications`, `/profile`, `/edit`, `/settings`, `/safety`, `/help` | Core states implemented. Settings/profile deletion, notification read, role toggle, blocked profiles, and FAQ work locally. |

## Responsive behavior

Retained source media rules and added fluid responsive layouts. The app uses desktop top navigation, tablet/mobile bottom navigation, two/three/four-column profile grids, collapsible all-sections menu, stacked forms/details, safe-area padding, and `prefers-reduced-motion` rules. Browser checks cover 320–1920px widths for overflow, with interactive journeys at mobile and desktop sizes. Pixel-level screenshot comparisons at all requested widths have not been produced.

## Known differences and evidence limits

- The source's 25 inline SVG symbols are represented with Lucide React icons, so silhouettes differ slightly.
- The source applies many historical CSS overrides; the original stylesheet is preserved, with application-specific layout overrides appended. Small layout or interaction differences may remain.
- Story, live, call, chat, and wallet features remain local illustrations; no remote service or real media communication exists. Story view tracking, comment likes/replies, live preview, and gallery remain absent.
- Automated screenshot pixel-diff coverage across all routes and all nine requested viewport widths has not been produced. Compare matching source and React screenshots before claiming exact pixel parity.
- Images/videos in the adjacent Flutter project were previously extracted from the matching local prototype family; the original HTML file was not modified.
