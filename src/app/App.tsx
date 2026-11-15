import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  AlertTriangle, ArrowLeft, ArrowRight, ArrowUpDown, Bell, CalendarDays, Check, ChevronDown, ChevronRight, CircleHelp, Clock3, Compass, Coins, Heart, ChartNoAxesColumn, Landmark,
  BriefcaseBusiness, Flame, Home, Layers3, LockKeyhole, LogOut, MapPin, MessageCircle, MoreVertical, Phone, Plus, Search, Send, Settings, Shield, SlidersHorizontal, Smile, Sparkles, Star, Trash2, UsersRound, Video, Wallet, X, Zap,
} from 'lucide-react';
import { cities, coinPacks, interests, people, storyImages } from '../mocks/fixtures';
import { LocalProfileRepository } from '../services/profileRepository';
import { useDemoStore } from '../stores/demoStore';
import type { CallRecord, ContactAction, Person, Role } from '../types/models';
import { ageFromDateOfBirth, withdrawalEligibility } from '../utils/validation';
import { ApiRequestError, customerApi, type Customer, type HomeProfile, type InboxNotification } from '../services/customerApi';
import PrivacyPolicyPage from './PrivacyPolicyPage';
import TermsOfServicePage from './TermsOfServicePage';
import HelpFAQPage from './HelpFAQPage';
import CommunityGuidelinesPage from './CommunityGuidelinesPage';
import DeleteAccountPage from './DeleteAccountPage';
import './shared-site-chrome.css';
import './chats.css';
import './earnings.css';

const repository = new LocalProfileRepository();
const EXPLORE_PAGE_SIZE = 8;
const profilePhotos = {
  boy: Array.from({ length: 38 }, (_, index) => `/images/users/men/man_${String(index + 1).padStart(3, '0')}.webp`),
  girl: Array.from({ length: 41 }, (_, index) => `/images/users/women/wome_${String(index + 1).padStart(3, '0')}.webp`),
} satisfies Record<Role, string[]>;
function randomProfilePhoto(role: Role) {
  const photos = profilePhotos[role];
  return photos[Math.floor(Math.random() * photos.length)];
}
const menu = [
  ['/home', 'Home', Home], ['/explore', 'Explore', Compass], ['/matches', 'Matches', Heart],
  ['/chats', 'Chats', MessageCircle], ['/calls', 'Calls', Video], ['/earnings', 'Earnings', Star],
] as const;
const allLinks = [
  ['/home', 'Home'], ['/explore', 'Explore people'], ['/matches', 'Matches'],
  ['/likes', 'Your likes'], ['/chats', 'Chats'], ['/calls', 'Calls'], ['/lounge', 'Video lounge'],
  ['/earnings', 'Earnings'], ['/wallet', 'Coin wallet'], ['/premium', 'Membership preview'], ['/notifications', 'Notifications'],
  ['/profile', 'My profile'], ['/settings', 'Settings'], ['/safety', 'Safety center'], ['/help', 'Help & FAQ'],
];
function notify(message: string) {
  window.dispatchEvent(new CustomEvent('luvzy:toast', { detail: message }));
}

function customerProfile(user: Customer) {
  return {
    name: user.name,
    age: user.date_of_birth ? ageFromDateOfBirth(user.date_of_birth) ?? 26 : 26,
    city: user.city ?? 'Nearby',
    role: user.profile_type ?? 'boy',
  };
}

function ModalPortal({ onClick, children }: { onClick: React.MouseEventHandler<HTMLDivElement>; children: React.ReactNode }) {
  return createPortal(<div className="modal-backdrop" role="presentation" onClick={onClick}>{children}</div>, document.body);
}

function ToastHost() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    const show = (event: Event) => {
      const custom = event as CustomEvent<string>;
      setMessage(custom.detail);
      window.setTimeout(() => setMessage(''), 2800);
    };
    window.addEventListener('luvzy:toast', show);
    return () => window.removeEventListener('luvzy:toast', show);
  }, []);
  return <div className={`toast ${message ? 'show' : ''}`} role="status" aria-live="polite">{message}</div>;
}

function useDialogAccessibility(open: boolean, onClose: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = document.querySelector<HTMLElement>('[role="dialog"][aria-modal="true"]');
    const focusable = () => dialog?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])');
    (focusable()?.[0] ?? dialog)?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { closeRef.current(); return; }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items?.length) { event.preventDefault(); dialog?.focus(); return; }
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); previous?.focus(); };
  }, [open]);
}

function App() {
  const { signedIn, signIn, signOut } = useDemoStore();
  const location = useLocation();
  const isPrivacyPolicy = location.pathname === '/privacy-policy';
  const isTermsOfService = location.pathname === '/terms';
  useEffect(() => {
    let current = true;
    void customerApi.me()
      .then(({ user }) => {
        if (current && useDemoStore.getState().authStatus === 'checking') signIn(customerProfile(user));
      })
      .catch(() => {
        if (current && useDemoStore.getState().authStatus === 'checking') signOut();
      });
    return () => { current = false; };
  }, [signIn, signOut]);
  useEffect(() => {
    if (location.hash) {
      document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.hash, location.pathname]);
  useEffect(() => {
    const isHelp = location.pathname === '/help';
    const isCommunityGuidelines = location.pathname === '/community-guidelines';
    const isDeleteAccount = location.pathname === '/delete-account';
    document.title = isDeleteAccount ? 'Delete Account · LUVZY' : isCommunityGuidelines ? 'Community Guidelines · LUVZY' : isHelp ? 'Help & FAQ · LUVZY' : isPrivacyPolicy ? 'Privacy Policy · LUVZY' : isTermsOfService ? 'Terms of Service · LUVZY' : `${location.pathname.split('/').filter(Boolean).at(-1)?.replace(/-/g, ' ') ?? 'Meet, Talk, Connect'} · LUVZY`;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = isDeleteAccount ? 'Learn about account deletion and review the available steps for your LUVZY account.' : isCommunityGuidelines ? 'Read LUVZY’s community standards for respectful, authentic and safer connections.' : isHelp ? 'Find answers about your LUVZY account, connections, Coins, safety and more.' : isPrivacyPolicy ? 'Review LUVZY’s draft Privacy Policy and how the service handles personal information.' : isTermsOfService ? 'Read LUVZY’s Terms of Service, including account, safety, privacy and purchase terms.' : 'LUVZY — meet, talk, connect.';
  }, [isPrivacyPolicy, isTermsOfService, location.pathname]);
  const standalonePage = isPrivacyPolicy ? <PrivacyPolicyPage />
    : isTermsOfService ? <TermsOfServicePage />
      : location.pathname === '/help' ? <HelpFAQPage />
        : location.pathname === '/community-guidelines' ? <CommunityGuidelinesPage />
          : location.pathname === '/delete-account' ? <DeleteAccountPage />
            : null;
  return <div className="app-shell">
    <Header />
    {standalonePage ? <div className="standalone-page">{standalonePage}</div> : <main id="main" className="wrap" tabIndex={-1}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/welcome" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/setup" element={<Protected><SetupPage /></Protected>} />
        <Route path="/home" element={<Protected><HomePage /></Protected>} />
        <Route path="/home/profile/:id" element={<Protected><HomeMemberProfilePage /></Protected>} />
        <Route path="/discover" element={<Navigate to="/explore" replace />} />
        <Route path="/explore" element={<Protected><ProfileDirectoryPage mode="explore" /></Protected>} />
        <Route path="/profile/:id" element={<Protected><PersonPage /></Protected>} />
        <Route path="/likes" element={<Protected><LikesPage /></Protected>} />
        <Route path="/matches" element={<Protected><ProfileDirectoryPage mode="matches" /></Protected>} />
        <Route path="/chats" element={<Protected><ChatsPage /></Protected>} />
        <Route path="/chats/:id" element={<Protected><ThreadPage /></Protected>} />
        <Route path="/calls" element={<Protected><CallsPage /></Protected>} />
        <Route path="/lounge" element={<Protected><LoungePage /></Protected>} />
        <Route path="/earnings" element={<Protected><EarningsPage /></Protected>} />
        <Route path="/wallet" element={<Protected><WalletPage /></Protected>} />
        <Route path="/premium" element={<Protected><MembershipPage /></Protected>} />
        <Route path="/notifications" element={<Protected><NotificationsPage /></Protected>} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
        <Route path="/edit" element={<Protected><EditPage /></Protected>} />
        <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
        <Route path="/safety" element={<Protected><SafetyPage /></Protected>} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="*" element={<Navigate to={signedIn ? '/home' : '/'} replace />} />
      </Routes>
    </main>}
    <Footer />
    <BottomNav />
    <ToastHost />
  </div>;
}

function Header() {
  const { signedIn, profile, walletCoins, online, setPreference } = useDemoStore();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletAlertOpen, setWalletAlertOpen] = useState(false);
  const [realUnread, setRealUnread] = useState(0);
  const walletAlertRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!walletAlertOpen) return;
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (event.target instanceof Node && !walletAlertRef.current?.contains(event.target)) setWalletAlertOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setWalletAlertOpen(false); };
    document.addEventListener('pointerdown', closeOnOutsidePress);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePress);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [walletAlertOpen]);
  useEffect(() => {
    if (!signedIn) { setRealUnread(0); return; }
    const refresh = () => { void customerApi.inbox().then((data) => setRealUnread(data.meta.unread_count)).catch(() => setRealUnread(0)); };
    refresh();
    window.addEventListener('luvzy:inbox-updated', refresh);
    return () => window.removeEventListener('luvzy:inbox-updated', refresh);
  }, [signedIn]);
  const shownCoins = walletCoins;
  const shownOnline = online;
  const setOnline = () => {
    setPreference('online', !online);
  };
  const letter = profile.name.trim().charAt(0).toUpperCase() || 'L';
  const landingHref = (section: string) => location.pathname === '/' ? `#${section}` : `/#${section}`;
  return <header className="top" id="header">
    <Link to={signedIn ? '/home' : '/'} className="logo luvzy-header-brand" aria-label="LUVZY home">
      <img className="luvzy-header-logo" src="/images/luvzy_logo.png" alt="LUVZY · Meet, Talk, Connect" />
    </Link>
    {signedIn ? <nav className="top-nav" aria-label="Main navigation">{menu.map(([path, label, Icon]) => <NavLink key={path} to={path} label={label} icon={<Icon size={17} />} />)}</nav> : <nav className="landing-nav" aria-label="Landing page"><a href={landingHref('how-it-works')}>How it works</a><a href={landingHref('why-luvzy')}>Why LUVZY</a><a href={landingHref('your-safety')}>Your safety</a><a href={landingHref('faqs')}>FAQs</a></nav>}
    <div className="top-right">
      {signedIn ? <>
        {profile.role === 'girl' ? <button className="nc-status-switch" role="switch" aria-checked={shownOnline} onClick={setOnline}><span className={`status-dot ${shownOnline ? 'online' : ''}`} />{shownOnline ? 'Online' : 'Offline'}</button> : shownCoins < 100 ? <div className="nc-wallet-alert-wrap" ref={walletAlertRef}>
          <button type="button" className={`nc-header-wallet is-low${walletAlertOpen ? ' is-open' : ''}`} aria-label={`Low balance: ${shownCoins} coins. ${walletAlertOpen ? 'Close' : 'Show'} wallet options`} aria-expanded={walletAlertOpen} aria-controls="nc-low-balance-popover" onClick={() => setWalletAlertOpen((open) => !open)}><Coins size={17} /> <span>{shownCoins.toLocaleString('en-IN')}</span><i aria-hidden="true">!</i></button>
          {walletAlertOpen && <section className="nc-low-balance-popover" id="nc-low-balance-popover" role="dialog" aria-labelledby="nc-low-wallet-title">
            <header className="nc-low-wallet-heading"><h2 id="nc-low-wallet-title">Your Luvzy Wallet</h2><span>Low Balance</span></header>
            <div className="nc-low-wallet-balance"><span className="nc-low-wallet-coin-art"><Coins size={34} /></span><div><p><strong>{shownCoins.toLocaleString('en-IN')}</strong> Coins</p><span>Available balance</span></div></div>
            <div className="nc-low-wallet-message"><span className="nc-low-wallet-video-icon"><Video size={21} /></span><div><strong>Keep the conversation going 💜</strong><p>Top up your coins for more audio and video calling time.</p></div></div>
            <Link to="/wallet" className="nc-low-wallet-recharge" onClick={() => setWalletAlertOpen(false)}><Wallet size={21} /> Recharge Coins Now <ArrowRight size={19} /></Link>
          </section>}
        </div> : <Link to="/wallet" className="nc-header-wallet"><Coins size={16} /> {shownCoins.toLocaleString('en-IN')}</Link>}
        <Link to="/notifications" className="round nc-notification-button" aria-label={`Notifications, ${realUnread} unread`}><Bell size={19} />{realUnread > 0 && <span className="nc-notification-badge">{realUnread}</span>}</Link>
        <Link to="/profile" className="avatar-top" aria-label="My profile">{profile.photo ? <img src={profile.photo} alt="" /> : letter}</Link>
        <button type="button" className="nc-site-menu-toggle" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><SlidersHorizontal size={19} /></button>
      </> : <><Link className="btn ghost landing-sign-in" to="/login">Sign in</Link><Link className="btn primary landing-join" to="/register">Join now</Link><button type="button" className="landing-mobile-menu" aria-label={menuOpen ? 'Close landing page menu' : 'Open landing page menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><SlidersHorizontal size={18} /></button></>}
    </div>
    {signedIn && menuOpen && <nav className="nc-site-menu" aria-label="All website sections">{allLinks.map(([path, label]) => <Link onClick={() => setMenuOpen(false)} key={path} to={path}>{label}<ArrowRight size={14} /></Link>)}<Link to="/settings" onClick={() => setMenuOpen(false)}>Preferences <Settings size={15} /></Link></nav>}
    {!signedIn && menuOpen && <nav className="landing-mobile-dropdown" aria-label="Website links">{[['how-it-works', 'How it works'], ['why-luvzy', 'Why LUVZY'], ['your-safety', 'Your safety'], ['faqs', 'FAQs']].map(([section, label]) => <a key={section} href={landingHref(section)} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={14} /></a>)}<Link to="/help" onClick={() => setMenuOpen(false)}>Help &amp; FAQ<ArrowRight size={14} /></Link><Link to="/privacy-policy" onClick={() => setMenuOpen(false)}>Privacy policy<ArrowRight size={14} /></Link><Link to="/terms" onClick={() => setMenuOpen(false)}>Terms of service<ArrowRight size={14} /></Link><Link to="/community-guidelines" onClick={() => setMenuOpen(false)}>Community Guidelines<ArrowRight size={14} /></Link><Link to="/login" onClick={() => setMenuOpen(false)}>Sign in<ArrowRight size={14} /></Link><Link to="/register" onClick={() => setMenuOpen(false)}>Join now<ArrowRight size={14} /></Link></nav>}
  </header>;
}

function NavLink({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) {
  const location = useLocation();
  return <Link to={to} className={`nav-btn ${location.pathname === to ? 'active' : ''}`}>{icon}{label}</Link>;
}

function Footer() {
  const { signedIn } = useDemoStore();
  const { pathname } = useLocation();
  const landingHref = (section: string) => pathname === '/' ? `#${section}` : `/#${section}`;
  if (signedIn || ['/login', '/register', '/setup'].includes(pathname)) {
    return <footer className="auth-footer"><div className="auth-footer-inner"><Link to="/" className="auth-footer-logo" aria-label="LUVZY home"><img src="/images/luvzy_logo.png" alt="LUVZY" /></Link><p>© 2026 LUVZY. All rights reserved.</p></div></footer>;
  }
  return <footer className="landing-footer"><div className="landing-footer-inner"><div className="landing-footer-brand"><Link to="/" className="footer-wordmark"><img src="/images/luvzy_logo.png" alt="LUVZY" /></Link><p>More meaningful conversations, more personal connections, and more room to be yourself.</p><span className="landing-adult-note"><Shield size={13} /> For adults 18 and above</span></div><div className="landing-footer-column"><strong>Explore</strong><a href={landingHref('how-it-works')}>How it works</a><a href={landingHref('why-luvzy')}>Features</a><a href={landingHref('your-safety')}>Safety</a></div><div className="landing-footer-column"><strong>Connect</strong><Link to="/register">Create account</Link><Link to="/login">Sign in</Link><Link to="/help">Help &amp; FAQ</Link><Link to="/delete-account">Delete account</Link></div><div className="landing-footer-column"><strong>Information</strong><Link to="/privacy-policy">Privacy policy</Link><Link to="/terms">Terms of service</Link><Link to="/community-guidelines">Community Guidelines</Link></div><div className="landing-footer-bottom"><span>© 2026 LUVZY. All rights reserved.</span><span>Preview experience: some communication and payment features may not be live yet.</span></div></div></footer>;
}

function BottomNav() {
  const { signedIn } = useDemoStore();
  const location = useLocation();
  if (!signedIn) return null;
  const tabs = [['/home', 'Home', Home], ['/explore', 'Explore', Compass], ['/calls', 'Calls', Video], ['/chats', 'Chats', MessageCircle], ['/earnings', 'Earnings', Star]] as const;
  return <nav className="bottom-nav" aria-label="Mobile app navigation">{tabs.map(([path, label, Icon]) => <Link key={path} to={path} className={`bottom-btn ${location.pathname.startsWith(path) ? 'active' : ''}`}><Icon size={19} /><span>{label}</span></Link>)}</nav>;
}

function Protected({ children }: { children: React.ReactNode }) {
  const { signedIn, authStatus } = useDemoStore();
  const location = useLocation();
  if (authStatus === 'checking') return <p className="nc-auth-notice" role="status">Checking your session…</p>;
  return signedIn ? <>{children}</> : <Navigate to="/login" state={{ from: location.pathname }} replace />;
}

function SectionTitle({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="page-hero-row"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

function Landing() {
  const { signedIn } = useDemoStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPlayback = () => {
      if (motionPreference.matches) videoRef.current?.pause();
      else void videoRef.current?.play().catch(() => undefined);
    };
    syncPlayback();
    motionPreference.addEventListener('change', syncPlayback);
    return () => motionPreference.removeEventListener('change', syncPlayback);
  }, []);
  if (signedIn) return <Navigate to="/home" replace />;
  return <section className="page landing-layout">
    <div className="landing-section landing-hero-section"><div className="landing-inner"><div className="hero-landing"><div className="landing-copy"><span className="landing-eyebrow-pill"><Sparkles size={13} /> A MORE PERSONAL WAY TO MEET</span><h1>Find your <span>kind of<br className="desktop-break" /> spark.</span></h1><p>Meet people who match your vibe. Start with a conversation, discover a real connection, and take the next step when it feels right.</p><div className="landing-actions"><Link className="btn primary" to="/register">Start connecting <ArrowRight size={16} /></Link><a className="btn outline" href="#how-it-works">See how it works</a></div><div className="landing-proof"><span><Shield size={13} /> For adults 18+</span><span><Heart size={13} /> Connect at your pace</span></div></div><div className="landing-photo"><video ref={videoRef} className="landing-hero-video" muted playsInline loop preload="metadata" poster="/images/welcome_poster.jpg" aria-label="A couple sharing a quiet moment together"><source src="/videos/intro-video.mp4" type="video/mp4" /></video><span className="landing-image-badge"><Sparkles size={12} /> Made for meaningful moments</span><span className="landing-photo-caption"><span className="eyebrow">✦ CONNECTIONS WORTH MAKING</span><strong>Meet people your way.</strong><small>Explore · Connect · Message · Video intro</small></span><span className="landing-photo-heart" aria-hidden="true"><Heart size={17} /></span></div></div><div className="landing-value-strip"><span><Compass size={15} /> Discover people who feel like your kind</span><span><MessageCircle size={15} /> Make the first hello meaningful</span><span><Video size={15} /> Get closer with video introductions</span></div></div></div>

    <div className="landing-section landing-how-section" id="how-it-works"><div className="landing-inner"><div className="landing-section-heading centered"><span className="landing-overline">SIMPLE BY DESIGN</span><h2>A little curiosity can lead to<br className="desktop-break" /> <em>something special.</em></h2><p>Real connections take more than a swipe. Explore, start talking, and see where your story goes.</p></div><div className="landing-step-grid"><article className="landing-step"><span className="landing-icon"><Compass size={17} /></span><span className="landing-step-number">01 / DISCOVER</span><h3>Find your vibe</h3><p>Explore profiles, discover interesting people, and notice the little things that catch your eye.</p></article><article className="landing-step"><span className="landing-icon"><MessageCircle size={17} /></span><span className="landing-step-number">02 / CONNECT</span><h3>Start with a hello</h3><p>Show interest, open a conversation, and get to know someone without rushing the moment.</p></article><article className="landing-step"><span className="landing-icon"><Video size={17} /></span><span className="landing-step-number">03 / GET CLOSER</span><h3>Make it more personal</h3><p>When you’re ready, take the conversation further with an in-app video introduction.</p></article></div></div></div>

    <div className="landing-section landing-chemistry-section" id="why-luvzy"><div className="landing-inner landing-chemistry"><div className="landing-chemistry-copy"><span className="landing-overline">MORE THAN JUST A MATCH</span><h2>Because chemistry<br className="desktop-break" /> is about <em>how you<br className="desktop-break" /> connect.</em></h2><p>Designed to make getting to know someone feel warm, real, and a little more human.</p><ul><li><Check size={14} /><span><strong>Discover with intention</strong><small>Find people you’d genuinely like to know.</small></span></li><li><Check size={14} /><span><strong>Go beyond an introduction</strong><small>From a first message to a more personal interaction.</small></span></li><li><Check size={14} /><span><strong>Always on your pace</strong><small>Choose the conversations and connections that feel right for you.</small></span></li></ul></div><div className="landing-moment-grid"><article className="landing-moment landing-moment-wide"><span className="landing-icon"><Video size={17} /></span><h3>From messages to moments.</h3><p>Take a conversation beyond text with a more personal, face-to-face video introduction.</p></article><article className="landing-moment"><span className="landing-icon"><Heart size={17} /></span><h3>Show your interest</h3><p>Let someone know they caught your attention.</p></article><article className="landing-moment landing-moment-blue"><span className="landing-icon"><MessageCircle size={17} /></span><h3>Keep talking</h3><p>Make room for conversations worth continuing.</p></article></div></div></div>

    <div className="landing-section landing-safety-section" id="your-safety"><div className="landing-inner"><div className="landing-safety-panel"><div><span className="landing-overline">YOUR SPACE, YOUR CHOICE</span><h2>Good connections<br /> begin with <em>feeling<br className="mobile-break" /> comfortable.</em></h2><p>LUVZY is designed around personal choice and respectful interactions. Set your boundaries and connect with confidence.</p><span className="landing-adult-note"><Shield size={13} /> Adults-only experience · 18+</span></div><div className="landing-safety-list"><article><span className="landing-icon"><LockKeyhole size={16} /></span><span><strong>Connect on your terms</strong><small>Choose when you want to engage and who you want to talk to.</small></span></article><article><span className="landing-icon"><Shield size={16} /></span><span><strong>Respect comes first</strong><small>Tools for reporting or blocking unwanted interactions.</small></span></article><article><span className="landing-icon"><Heart size={16} /></span><span><strong>Own your experience</strong><small>Stay in control of your profile and the pace of your conversations.</small></span></article></div></div><article className="landing-clear-card"><span className="landing-icon"><Coins size={17} /></span><span><strong>Clear before you connect</strong><small>Some interactions may use coins. Display any applicable cost before a paid call, so members can decide whether to continue. Coin use and availability depend on the feature and account.</small></span></article></div></div>

    <div className="landing-section landing-faq-section" id="faqs"><div className="landing-inner landing-faq-layout"><div><span className="landing-overline">GOOD TO KNOW</span><h2>A few things you<br className="desktop-break" /> might be <em>wondering.</em></h2><p>Start your journey with a little more clarity.</p></div><div className="landing-faq-list"><details><summary>Who can use LUVZY?<span>+</span></summary><p>LUVZY is designed for adults aged 18 and above.</p></details><details><summary>How do I start connecting with someone?<span>+</span></summary><p>Explore profiles, show interest, and start a conversation when someone feels right to you.</p></details><details><summary>Can I meet people through video?<span>+</span></summary><p>When you’re ready, you can use an in-app video introduction to make the conversation more personal.</p></details><details><summary>What are coins used for?<span>+</span></summary><p>Some features may use coins. Any applicable cost is shown before you choose to continue.</p></details><details><summary>How do I handle an uncomfortable interaction?<span>+</span></summary><p>You can set boundaries and use the available block and report tools. Visit the Safety Center for guidance.</p></details></div></div></div>

    <div className="landing-section landing-cta-section"><div className="landing-inner"><div className="landing-cta"><span className="landing-overline">YOUR NEXT HELLO STARTS HERE</span><h2>The right connection could<br className="desktop-break" /> start with <em>one hello.</em></h2><p>Come as you are. Discover people, start a conversation, and make moments that feel a little more meaningful.</p><Link className="btn primary" to="/register">Join LUVZY <ArrowRight size={16} /></Link><small>For adults 18+ · Join at your own pace</small></div></div></div>
  </section>;
}

function AuthPage({ mode }: { mode: 'login' | 'register' }) {
  const register = mode === 'register';
  const location = useLocation();
  const navigate = useNavigate();
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const routeState = location.state as { phone?: string; registrationChallengeId?: string; registrationToken?: string; registrationIntent?: boolean } | null;
  const initialPhone = routeState?.phone ?? '';
  const [phoneDigits, setPhoneDigits] = useState(() => initialPhone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '').slice(0, 10));
  const [otpDigits, setOtpDigits] = useState('');
  const [locationFix, setLocationFix] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [locationError, setLocationError] = useState('');
  const [locating, setLocating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [adultConsent, setAdultConsent] = useState(false);
  const [accountType, setAccountType] = useState<Role | ''>('girl');
  const [linkEmailValue, setLinkEmailValue] = useState('');
  const [linkPasswordValue, setLinkPasswordValue] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [linkOtpRequested, setLinkOtpRequested] = useState(false);
  const [accountLink, setAccountLink] = useState(false);
  const [challengeId, setChallengeId] = useState('');
  const registrationChallengeId = routeState?.registrationChallengeId ?? '';
  const registrationToken = routeState?.registrationToken ?? '';
  const registrationIntent = routeState?.registrationIntent === true;
  const registrationVerified = Boolean(registrationChallengeId && registrationToken && phoneDigits.length === 10);
  const registrationReady = Boolean(fullName.trim().length >= 2 && accountType && adultConsent);
  const signIn = useDemoStore((state) => state.signIn);
  const authStatus = useDemoStore((state) => state.authStatus);
  const otpStep = register ? !registrationVerified && otpRequested : otpRequested || linkOtpRequested;
  useEffect(() => {
    if (authStatus === 'authenticated') navigate('/home', { replace: true });
  }, [authStatus, navigate]);
  useEffect(() => {
    if (otpStep) otpRefs.current[0]?.focus();
  }, [otpStep]);
  const requestLocation = useCallback(async () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Location is unavailable in this browser. You can continue without sharing it.');
      return;
    }
    setLocating(true);
    try {
      const permission = navigator.permissions?.query
        ? await navigator.permissions.query({ name: 'geolocation' })
        : null;
      if (permission?.state === 'denied') {
        setLocationError('Location is blocked for this site. Open the site controls beside the address bar and change Location to Allow, then retry—or continue without sharing it.');
        setLocating(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          setLocationFix({ latitude: coords.latitude, longitude: coords.longitude, accuracy: coords.accuracy });
          setLocationError('');
          setLocating(false);
        },
        (cause) => {
          setLocationError(cause.code === cause.PERMISSION_DENIED
            ? 'Location is blocked for this site. Open the site controls beside the address bar and change Location to Allow, then retry—or continue without sharing it.'
            : cause.code === cause.POSITION_UNAVAILABLE
              ? 'Your device could not determine a location. Turn on device location services and retry, or continue without sharing it.'
              : 'Location took too long to respond. Check device location services and retry, or continue without sharing it.');
          setLocating(false);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
      );
    } catch {
      setLocationError('Location is blocked for this site. Open the site controls beside the address bar and change Location to Allow, then retry—or continue without sharing it.');
      setLocating(false);
    }
  }, []);
  useEffect(() => {
    if (register) requestLocation();
  }, [register, requestLocation]);
  function updatePhone(raw: string) {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2);
    setPhoneDigits(digits.slice(0, 10));
    clearFieldError('phone');
  }
  function updateOtp(index: number, raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 6);
    const start = digits.length === 6 ? 0 : Math.min(index, otpDigits.length);
    const next = Array.from({ length: 6 }, (_, position) => otpDigits[position] ?? '');
    for (let offset = 0; offset < digits.length && start + offset < 6; offset += 1) {
      next[start + offset] = digits[offset];
    }
    if (!digits && index < otpDigits.length) next.splice(index, 1);
    setOtpDigits(next.join(''));
    clearFieldError('otp');
    if (digits.length > 1) {
      const last = Math.min(start + digits.length - 1, 5);
      otpRefs.current[last < 5 ? last + 1 : last]?.focus();
    } else if (digits && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }
  function pasteOtp(index: number, event: React.ClipboardEvent<HTMLInputElement>) {
    const digits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!digits) return;
    event.preventDefault();
    updateOtp(index, digits);
  }
  function handleOtpKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      event.preventDefault();
      const next = otpDigits.split('');
      const target = next[index] ? index : Math.min(index - 1, next.length - 1);
      if (target >= 0 && target < next.length) next.splice(target, 1);
      setOtpDigits(next.join(''));
      otpRefs.current[Math.max(target, 0)]?.focus();
      clearFieldError('otp');
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      otpRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      event.preventDefault();
      otpRefs.current[index + 1]?.focus();
    }
  }
  function getFieldError(field: string) {
    if (field === 'adult_consent' && fieldErrors.adult_consent?.length) return 'Please confirm you are 18 or older to create an account.';
    return fieldErrors[field]?.[0];
  }
  function clearFieldError(field: string) {
    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }
  function showApiError(cause: unknown) {
    if (cause instanceof ApiRequestError) {
      setFieldErrors(cause.fieldErrors);
      setError(Object.keys(cause.fieldErrors).length ? '' : cause.message || 'The request could not be completed. Please try again.');
    } else {
      setFieldErrors({});
      setError(cause instanceof Error ? cause.message : 'Could not connect to LUVZY. Check your connection and try again.');
    }
  }
  async function resendCode() {
    setError(''); setNotice(''); setFieldErrors({}); setBusy(true);
    try {
      const result = accountLink
        ? await customerApi.requestWebsitePhoneLinkOtp(linkEmailValue.trim().toLowerCase(), linkPasswordValue, `+91${phoneDigits}`)
        : await customerApi.requestWebsiteLoginOtp(`+91${phoneDigits}`);
      if (!result.challenge_id) {
        setError(result.message);
        return;
      }
      setChallengeId(result.challenge_id);
      setNotice(result.message);
      setOtpDigits('');
    } catch (cause) {
      showApiError(cause);
    } finally { setBusy(false); }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (register && registrationVerified && !registrationReady) return;
    setError(''); if (!otpStep) setNotice(''); setFieldErrors({}); setBusy(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim().toLowerCase();
    const password = String(form.get('password') ?? '');
    const mobile = phoneDigits;
    try {
      let user: Customer;
      let destination = '/home';
      if (register && !registrationVerified) {
        const phone = `+91${mobile}`;
        if (!otpRequested) {
          const result = await customerApi.requestWebsiteLoginOtp(phone);
          if (!result.challenge_id) throw new Error(result.message);
          setChallengeId(result.challenge_id);
          setOtpRequested(true);
          setNotice(result.message);
          setOtpDigits('');
          return;
        }
        const result = await customerApi.verifyWebsiteLoginOtp(phone, challengeId, otpDigits);
        if (result.registration_required) {
          if (!result.challenge_id || !result.registration_token) throw new Error('Phone verification could not be completed. Request a new code and try again.');
          navigate('/register', { replace: true, state: { phone, registrationChallengeId: result.challenge_id, registrationToken: result.registration_token } });
          return;
        }
        if (!result.user) throw new Error('The server did not return an account. Please try signing in again.');
        user = result.user;
        destination = '/home';
      } else if (register) {
        const phone = `+91${mobile}`;
        user = (await customerApi.register({
          phone,
          challenge_id: registrationChallengeId,
          registration_token: registrationToken,
          name: fullName.trim(),
          ...(locationFix ? {
            latitude: locationFix.latitude,
            longitude: locationFix.longitude,
            location_accuracy_m: locationFix.accuracy,
          } : {}),
          account_type: accountType as Role,
          notifications_enabled: Boolean(form.get('notifications_enabled')),
          adult_consent: adultConsent,
        })).user;
      } else if (accountLink) {
        const phone = `+91${mobile}`;
        if (!linkOtpRequested) {
          const result = await customerApi.requestWebsitePhoneLinkOtp(email, password, phone);
          setChallengeId(result.challenge_id);
          setLinkOtpRequested(true);
          setNotice(result.message);
          setOtpDigits('');
          return;
        }
        user = (await customerApi.verifyWebsitePhoneLinkOtp(phone, challengeId, otpDigits)).user;
      } else {
        const phone = `+91${mobile}`;
        if (!otpRequested) {
          const result = await customerApi.requestWebsiteLoginOtp(phone);
          if (!result.challenge_id) throw new Error(result.message);
          setChallengeId(result.challenge_id);
          setOtpRequested(true);
          setNotice(result.message);
          setOtpDigits('');
          return;
        }
        const result = await customerApi.verifyWebsiteLoginOtp(phone, challengeId, otpDigits);
        if (result.registration_required) {
          if (!result.challenge_id || !result.registration_token) throw new Error('Phone verification could not be completed. Request a new code and try again.');
          navigate('/register', { replace: true, state: { phone, registrationChallengeId: result.challenge_id, registrationToken: result.registration_token } });
          return;
        }
        if (!result.user) throw new Error('The server did not return an account. Please try signing in again.');
        user = result.user;
      }
      const profile = customerProfile(user);
      signIn({ ...profile, ...(register ? { photo: randomProfilePhoto(profile.role) } : {}) });
      navigate(destination, { replace: true });
    } catch (cause) {
      showApiError(cause);
    } finally { setBusy(false); }
  }
  return <section className="auth-wrap page nc-auth-screen"><aside className="auth-art"><div><span className="pill"><Heart size={14} /> LUVZY</span><h2>Connection starts with a hello.</h2><p>A warm, modern space to discover people, chat, and introduce yourself.</p></div><video className="auth-art-video" src="/videos/intro-video.mp4" autoPlay muted loop playsInline aria-hidden="true" /></aside><div className="auth-card nc-auth-card"><Link className="link nc-back" to="/"><ArrowLeft size={16} /> Back</Link><div className="nc-auth-intro"><span className="nc-auth-icon">{register ? <Heart /> : <Shield />}</span><span className="eyebrow">{register ? 'JOIN THE COMMUNITY' : registrationIntent ? 'SECURE REGISTRATION' : 'WELCOME BACK'}</span><h1>{register ? (registrationVerified ? 'Create your account' : 'Verify your mobile number') : accountLink ? 'Link your mobile number' : registrationIntent ? 'Verify your mobile number' : 'Sign in to LUVZY'}</h1><p>{register ? (registrationVerified ? 'Your mobile number is verified. Complete your profile to continue.' : 'Enter your number and verify it first. Then complete your profile to join.') : accountLink ? 'Verify your existing account once to link a mobile number for future sign-ins.' : registrationIntent ? 'Enter your number and verify it first. New numbers will continue to account setup.' : 'Continue securely with your mobile number.'}</p></div>
    <form onSubmit={submit} noValidate><div className="form-stack">
      {otpStep && notice && <p className="nc-auth-notice" role="status">{notice}</p>}
      {!register && accountLink && !otpStep && <Field label="Email address" required error={fieldErrors.email?.[0]}><input name="email" type="email" autoComplete="email" placeholder="you@example.com" value={linkEmailValue} aria-invalid={Boolean(fieldErrors.email)} onChange={(event) => { setLinkEmailValue(event.currentTarget.value); clearFieldError('email'); }} /></Field>}
      {register && registrationVerified && <p className="nc-auth-notice" role="status">Mobile number verified: +91 {phoneDigits}</p>}
      {register && locationFix && <p className="nc-auth-notice" role="status">Location ready · reported accuracy ±{Math.round(locationFix.accuracy)} m.</p>}
      {register && !locationFix && <p className="nc-auth-notice" role="status">Location access is optional. Allow it to share your device location; you can continue registration without it.</p>}
      {register && locationError && <p className="nc-field-error" role="alert">{locationError} <button className="link" type="button" onClick={() => void requestLocation()} disabled={locating}>{locating ? 'Checking…' : 'Retry location'}</button></p>}
      {register && registrationVerified && <>
        <Field label="Full name" required error={getFieldError('name')}><input name="name" autoComplete="name" maxLength={120} required value={fullName} aria-invalid={Boolean(getFieldError('name'))} onChange={(event) => { setFullName(event.currentTarget.value); clearFieldError('name'); }} /></Field>
        <fieldset className={`nc-profile-type${getFieldError('account_type') ? ' is-invalid' : ''}`} aria-invalid={Boolean(getFieldError('account_type'))} aria-describedby={getFieldError('account_type') ? 'account-type-error' : undefined}><legend>Profile type <i>*</i></legend><div className="nc-profile-toggle" role="group" aria-label="Profile type"><button type="button" className={accountType === 'boy' ? 'selected' : ''} aria-pressed={accountType === 'boy'} onClick={() => { setAccountType('boy'); clearFieldError('account_type'); }}>Boy</button><button type="button" className={accountType === 'girl' ? 'selected' : ''} aria-pressed={accountType === 'girl'} onClick={() => { setAccountType('girl'); clearFieldError('account_type'); }}>Girl</button></div>{getFieldError('account_type') && <small id="account-type-error" className="nc-field-error" role="alert">{getFieldError('account_type')}</small>}</fieldset>
      </>}
      {accountLink && !otpStep && <Field label="Current account password" required error={fieldErrors.password?.[0]}><input name="password" type="password" autoComplete="current-password" value={linkPasswordValue} aria-invalid={Boolean(fieldErrors.password)} onChange={(event) => { setLinkPasswordValue(event.currentTarget.value); clearFieldError('password'); }} /></Field>}
      {(!register || !registrationVerified) && !otpStep && <Field label="Mobile number" required error={fieldErrors.phone?.[0]}><div className="nc-phone-input"><span aria-hidden="true">+91</span><input name="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="10-digit mobile number" value={phoneDigits} aria-invalid={Boolean(fieldErrors.phone)} onChange={(event) => updatePhone(event.currentTarget.value)} /></div></Field>}
      {otpStep && <Field label="Verification code" error={fieldErrors.otp?.[0]}><div className="nc-otp-cells" role="group" aria-label="Verification code">{Array.from({ length: 6 }, (_, index) => <input key={index} ref={(element) => { otpRefs.current[index] = element; }} className="nc-otp-cell" name={index === 0 ? 'otp' : undefined} type="text" inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} aria-label={`Verification code digit ${index + 1} of 6`} aria-invalid={Boolean(fieldErrors.otp)} value={otpDigits[index] ?? ''} onChange={(event) => updateOtp(index, event.currentTarget.value)} onKeyDown={(event) => handleOtpKeyDown(index, event)} onPaste={(event) => pasteOtp(index, event)} />)}</div></Field>}
      {register && registrationVerified && <><div className="nc-consent-field"><label className="check-line nc-consent"><input type="checkbox" name="adult_consent" required checked={adultConsent} aria-invalid={Boolean(getFieldError('adult_consent'))} aria-describedby={getFieldError('adult_consent') ? 'adult-consent-error' : undefined} onChange={(event) => { setAdultConsent(event.currentTarget.checked); clearFieldError('adult_consent'); }} /><span>I confirm I am 18 or older and accept the Terms and <Link to="/privacy-policy">Privacy Policy</Link>.</span></label>{getFieldError('adult_consent') && <p id="adult-consent-error" className="nc-field-error nc-consent-error" role="alert">{getFieldError('adult_consent')}</p>}</div><label className="check-line nc-consent"><input type="checkbox" name="notifications_enabled" /><span>Enable in-app notifications. You can change this later.</span></label></>}
    </div>{error && <p className="form-error" role="alert">{error}</p>}{otpStep && <div className="nc-otp-actions"><button className="link" type="button" onClick={() => { setOtpRequested(false); setLinkOtpRequested(false); setOtpDigits(''); setChallengeId(''); setError(''); setNotice(''); setFieldErrors({}); }}>Change number</button><button className="link" type="button" onClick={() => void resendCode()} disabled={busy}>Resend code</button></div>}<button className="btn primary nc-submit" type="submit" disabled={busy || (register && registrationVerified && !registrationReady)}>{busy ? 'Connecting…' : register ? registrationVerified ? 'Create account' : otpStep ? 'Verify phone number' : 'Send verification code' : otpStep ? accountLink ? 'Verify and link account' : 'Verify and sign in' : 'Send verification code'} <ArrowRight size={16} /></button></form>
    {!register && <button className="link nc-link-account" type="button" onClick={() => { setAccountLink((current) => !current); setOtpRequested(false); setLinkOtpRequested(false); setOtpDigits(''); setChallengeId(''); setError(''); setNotice(''); }}>{accountLink ? 'Back to phone sign in' : 'First time here? Link an existing account'}</button>}
    <div className="auth-bottom nc-auth-switch">{register ? 'Already have an account?' : 'New to LUVZY?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</Link></div><p className="nc-auth-disclaimer"><Shield size={14} /> Secure account sign-in. Other prototype features remain demo-only.</p>
  </div></section>;
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return <label className={`field nc-field${error ? ' is-invalid' : ''}`}><span>{label}{required && <i> *</i>}</span>{children}{error && <small className="nc-field-error" role="alert">{error}</small>}</label>;
}

function SetupPage() {
  const { profile, updateProfile } = useDemoStore();
  const [selected, setSelected] = useState(profile.interests);
  const navigate = useNavigate();
  function finish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const bio = String(new FormData(event.currentTarget).get('bio') ?? '').trim();
    if (selected.length < 2) return notify('Choose at least two interests.');
    updateProfile({ ...profile, bio, interests: selected }); navigate('/home'); notify('Demo profile saved.');
  }
  return <section className="auth-wrap page"><div className="auth-card"><span className="eyebrow">YOUR PROFILE</span><h1>Make it yours.</h1><p>Add a little about yourself, then start discovering.</p><form onSubmit={finish}><div className="form-stack"><Field label="A short introduction"><textarea name="bio" defaultValue={profile.bio} maxLength={230} placeholder="What makes you, you?" /></Field><Field label="Choose your interests (at least 2)"><div className="interest-picker">{interests.map((item) => <button type="button" key={item} className={selected.includes(item) ? 'selected' : ''} aria-pressed={selected.includes(item)} onClick={() => setSelected((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])}>{item}</button>)}</div></Field></div><button className="btn primary" type="submit">Finish profile <ArrowRight size={16} /></button></form><button className="link" onClick={() => navigate('/home')}>Do this later</button></div></section>;
}

function PersonCard({ person, onClick }: { person: Person | HomeProfile; onClick?: () => void }) {
  return <button type="button" className="profile-tile profile-card" onClick={onClick} aria-label={`View ${person.name}${person.age ? `, ${person.age}` : ''}`}><span className="pic-wrap">{person.photo && <img src={person.photo} alt="" loading="lazy" />}</span><span className="gradient" /><span className="topbadge">{person.city}</span><span className="info"><span><h3>{person.name}{person.age ? `, ${person.age}` : ''}</h3><p>{person.work}</p></span></span></button>;
}


function HomePage() {
  const { profile, likes, blocked, toggleLike } = useDemoStore();
  const candidates = people.filter((person) => person.role !== profile.role && !blocked.includes(person.id));
  const activePeople = candidates.slice(0, 5);
  const interestedPeople = people.filter((person) => likes.includes(person.id) && !blocked.includes(person.id));
  const randomCandidates = candidates.slice(0, 15);
  const suggestion = candidates[0];
  const randomCall = suggestion
    ? <CallButton person={suggestion} featured randomCandidates={randomCandidates} label="Start Random Call" />
    : null;
  return <section className="page nc-home">
    <HomeCallHero profile={profile} featuredPerson={activePeople[0]} onlineCount={activePeople.length} interestedCount={12} randomCall={randomCall} />
    <section className="nc-connect-section" aria-labelledby="home-connect-title">
      <div className="nc-connect-head">
        <div><span className="nc-connect-kicker"><i className="nc-connect-pulse" /> NOW ONLINE · <b>LIVE</b></span><h2 id="home-connect-title">Active Girls</h2><p>Choose someone and start a one-to-one video call.</p></div>
        <div className="nc-connect-tools"><span className="nc-connect-count"><i className="nc-activity-online" /> {activePeople.length} active now</span><Link className="nc-connect-viewall" to="/explore">View All <ChevronRight size={15} /></Link></div>
      </div>
      {activePeople.length ? <div className="nc-dashboard-people">{activePeople.map((person) => {
        const actions: ContactAction[] = person.availableActions?.length ? person.availableActions : ['video'];
        const hasVideo = actions.includes('video');
        return <article className="nc-dashboard-person" key={person.id}>
          <Link className="nc-dashboard-photo" to={`/profile/${person.id}`} aria-label={`View ${person.name}, ${person.age}`}><img src={person.photo} alt={`Fictional profile of ${person.name}`} loading="lazy"/><span className="nc-dashboard-online">Online</span></Link>
          <button className="nc-dashboard-like" type="button" aria-label={`${likes.includes(person.id) ? 'Unlike' : 'Like'} ${person.name}`} aria-pressed={likes.includes(person.id)} onClick={() => toggleLike(person.id)}><Heart size={18} fill={likes.includes(person.id) ? 'currentColor' : 'none'} /></button>
          <div className="nc-dashboard-person-info"><strong>{person.name}, {person.age} <span aria-label="Verified">✓</span></strong><small><MapPin size={13}/>{person.city}</small></div>
          <div className={`nc-dashboard-person-actions nc-dashboard-person-actions-${actions.length}${hasVideo ? ' has-video' : ''}`}>
            {actions.map((action) => action === 'chat'
              ? <Link key={action} className="nc-dashboard-icon-action nc-dashboard-action-icon" to={`/chats/${person.id}`} aria-label={`Chat with ${person.name}`}><MessageCircle size={18}/><span className="nc-active-action-label">Chat</span></Link>
              : <CallButton key={action} person={person} compact activeOption mode={action} label={action === 'video' ? 'Video Call' : 'Audio'} />)}
          </div>
        </article>;
      })}</div> : <p className="nc-home-empty">No profiles are available yet. Check back soon.</p>}
    </section>
    <section className="nc-random-call nc-random-call-home" aria-labelledby="home-random-title">
      <div className="nc-random-mark"><Video size={28}/></div>
      <div className="nc-random-copy"><span className="nc-random-tag">✦ DISCOVER A SURPRISE CONNECTION</span><h2 id="home-random-title">Random Video Calls</h2><p>Get a surprise suggestion from active profiles and start a spontaneous video call.</p></div>
      <div className="nc-random-selection"><div className="nc-random-avatar-stack">{activePeople.slice(0, 3).map((person) => <img key={person.id} src={person.photo} alt=""/>)}<span>+{Math.max(randomCandidates.length - 3, 0)}</span></div></div>
      <div className="nc-random-actions">{suggestion && <CallButton person={suggestion} featured randomCandidates={randomCandidates} label="Find Random Call" />}</div>
    </section>
    <HomeStories blocked={blocked} likes={likes} />
    {activePeople[0] && <HomeFeaturedProfile person={activePeople[0]} />}
    {interestedPeople.length > 0 && <HomeInterestedProfiles people={interestedPeople} />}
  </section>;
}

function HomeFeaturedProfile({ person }: { person: Person }) {
  return <section className="nc-featured-profile" aria-labelledby="home-featured-title" style={{ '--featured-photo': `url("${person.photo}")` } as React.CSSProperties}>
    <div className="nc-featured-profile-photo"><img src={person.photo} alt={`Portrait of ${person.name}`} loading="lazy" /></div>
    <div className="nc-featured-profile-details">
      <span className="nc-featured-profile-label"><Star size={15} fill="currentColor" /> Featured profile</span>
      <h2 id="home-featured-title">{person.name}, {person.age} <span aria-label="Verified profile"><Check size={15} /></span></h2>
      <p className="nc-featured-profile-location"><MapPin size={16} /> {person.city} <i /> <span className="nc-featured-profile-online"><b /> Online now</span></p>
      <p className="nc-featured-profile-bio">“{person.bio}”</p>
      <div className="nc-featured-profile-interests" aria-label="Interests">{person.interests.slice(0, 3).map((interest) => <span key={interest}>{interest}</span>)}</div>
    </div>
    <div className="nc-featured-profile-actions">
      <CallButton person={person} label="Video Call" />
      <Link to={`/chats/${person.id}`}><MessageCircle size={19} /> Chat now</Link>
    </div>
  </section>;
}

function HomeInterestedProfiles({ people: interestedPeople }: { people: Person[] }) {
  const featuredPeople = interestedPeople.slice(0, 3);
  const remainingCount = interestedPeople.length - featuredPeople.length;
  return <section className={`nc-interested${featuredPeople.length === 1 ? ' has-one' : featuredPeople.length === 2 ? ' has-two' : ''}`} aria-labelledby="home-interested-title">
    <header className="nc-interested-header">
      <div className="nc-interested-heading">
        <span className="nc-interested-icon"><Heart size={23} fill="currentColor" /></span>
        <div><h2 id="home-interested-title">People interested in you</h2><p>See who’s ready to connect.</p></div>
        <span className="nc-interested-count"><Flame size={15} fill="currentColor" /> {interestedPeople.length} {interestedPeople.length === 1 ? 'person' : 'people'}</span>
      </div>
      <Link className="nc-interested-all" to="/matches">View all matches <ArrowRight size={17} /></Link>
    </header>
    <div className="nc-interested-grid">
      {featuredPeople.map((person, index) => <Link className={`nc-interest-card${index === 0 ? ' is-featured' : ''}`} to={`/profile/${person.id}`} key={person.id}>
        <img src={person.photo} alt={`Portrait of ${person.name}`} loading="lazy" />
        <span className="nc-interest-online"><i /> Online</span>
        <span className="nc-interest-like" aria-hidden="true"><Heart size={18} /></span>
        <span className="nc-interest-card-copy"><strong>{person.name}, {person.age} <span aria-label="Verified">✓</span></strong><small><MapPin size={14} /> {person.city}</small></span>
        {index === 0 && <span className="nc-interest-you">♥ Interested in you</span>}
      </Link>)}
      {remainingCount > 0 && <Link className="nc-interested-more" to="/matches" aria-label={`View ${remainingCount} more interested ${remainingCount === 1 ? 'person' : 'people'} in matches`}>
        <span className="nc-interested-more-avatars">{interestedPeople.slice(3, 6).map((person) => <img key={person.id} src={person.photo} alt="" loading="lazy" />)}</span>
        <span><strong>And {remainingCount} more {remainingCount === 1 ? 'person is' : 'people are'} interested</strong><small>View everyone in Matches <ArrowRight size={15} /></small></span>
      </Link>}
    </div>
  </section>;
}

function HomeStories({ blocked, likes }: { blocked: number[]; likes: number[] }) {
  const [filter, setFilter] = useState<'all' | 'following'>('all');
  const [viewingStory, setViewingStory] = useState<number | null>(null);
  const storyPeople = people.filter((person) => !blocked.includes(person.id));
  const visiblePeople = filter === 'following' ? storyPeople.filter((person) => likes.includes(person.id)) : storyPeople;
  const activeStoryIndex = visiblePeople.findIndex((person) => person.id === viewingStory);
  const activeStory = activeStoryIndex >= 0 ? visiblePeople[activeStoryIndex] : null;

  return <section className="nc-home-stories" aria-labelledby="home-stories-title">
    <div className="nc-home-stories-top">
      <div className="nc-home-stories-heading">
        <span className="nc-home-stories-icon"><Video size={22} /></span>
        <div><span className="nc-home-stories-eyebrow">MOMENTS FROM LUVZY</span><h2 id="home-stories-title">Stories <span aria-hidden="true">▶</span></h2><p>Real moments, daily updates, and stories from people on Luvzy.</p></div>
      </div>
      <div className="nc-home-stories-filters" role="group" aria-label="Filter stories">
        <button type="button" className={filter === 'all' ? 'selected' : ''} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All Stories</button>
        <button type="button" className={filter === 'following' ? 'selected' : ''} aria-pressed={filter === 'following'} onClick={() => setFilter('following')}>Following</button>
      </div>
    </div>
    <div className="nc-home-stories-row" aria-label="Stories from Luvzy members">
      {visiblePeople.slice(0, 8).map((person, index) => <button className="nc-home-story-person" type="button" onClick={() => setViewingStory(person.id)} key={person.id} aria-label={`Watch ${person.name}'s story`}>
        <span className={`nc-home-story-ring${index === 2 ? ' seen' : ''}`}><img src={person.photo} alt="" loading="lazy" /></span>
        {index === 0 && <span className="nc-home-story-live">◉ LIVE</span>}
        {(index === 1 || index === 5) && <span className="nc-home-story-online" aria-label="Online" />}
        {index === 3 && <span className="nc-home-story-play" aria-hidden="true">▶</span>}
        {index === 4 && <span className="nc-home-story-video" aria-hidden="true"><Video size={15} fill="currentColor" /></span>}
        <strong>{person.name}</strong>
      </button>)}
      {filter === 'following' && visiblePeople.length === 0 && <p className="nc-home-stories-empty">Like profiles to see their stories here.</p>}
    </div>
    <div className="nc-home-stories-legend" aria-label="Story status key"><span><i className="live" />Live Stories</span><span><i className="video">▶</i>Video Moments</span><span><i className="online" />Online Now</span><span><i className="new"><Clock3 size={20} /></i>New Stories</span></div>
    {activeStory && <HomeStoryViewer person={activeStory} storyIndex={activeStoryIndex} storyCount={visiblePeople.length} onClose={() => setViewingStory(null)} onPrevious={() => setViewingStory(visiblePeople[(activeStoryIndex - 1 + visiblePeople.length) % visiblePeople.length].id)} onNext={() => setViewingStory(visiblePeople[(activeStoryIndex + 1) % visiblePeople.length].id)} />}
  </section>;
}

function HomeStoryViewer({ person, storyIndex, storyCount, onClose, onPrevious, onNext }: { person: Person; storyIndex: number; storyCount: number; onClose: () => void; onPrevious: () => void; onNext: () => void }) {
  const { profile, storyReactions, storyComments, toggleStoryReaction, addStoryComment } = useDemoStore();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});
  const comments = storyComments[person.id] ?? [];
  const commentBodies = new Map(comments.map((comment) => [comment, comment]));
  const repliesByParent = new Map<string, string[]>();
  for (const comment of comments) {
    if (!comment.startsWith('↳ ')) continue;
    const content = comment.slice(2);
    const parent = comments.filter((candidate) => candidate !== comment).sort((left, right) => right.length - left.length).find((candidate) => content.startsWith(`${candidate}: `));
    if (!parent) continue;
    commentBodies.set(comment, content.slice(parent.length + 2));
    repliesByParent.set(parent, [...(repliesByParent.get(parent) ?? []), comment]);
  }
  const rootComments = comments.filter((comment) => !comment.startsWith('↳ '));
  useDialogAccessibility(true, onClose);
  useEffect(() => {
    document.body.classList.add('nc-story-open');
    return () => document.body.classList.remove('nc-story-open');
  }, []);
  const submitComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    addStoryComment(person.id, replyTo ? `↳ ${replyTo}: ${text}` : text);
    if (replyTo) setExpandedThreads((current) => ({ ...current, [`${person.id}:${replyTo}`]: true }));
    setCommentText('');
    setReplyTo(null);
  };
  const renderComment = (comment: string, depth = 0): React.ReactNode => {
    const replies = repliesByParent.get(comment) ?? [];
    const threadKey = `${person.id}:${comment}`;
    const expanded = Boolean(expandedThreads[threadKey]);
    const threadId = `story-replies-${person.id}-${comments.indexOf(comment)}`;
    return <Fragment key={comment}>
      <article className={`nc-story-comment${depth > 0 ? ' nc-story-comment-reply' : ''}`}><span className="nc-story-comment-avatar">{profile.name.slice(0, 1).toUpperCase()}</span><div className="nc-story-comment-content"><strong>{profile.name}</strong><p>{commentBodies.get(comment) ?? comment}</p><div className="nc-story-comment-ops">{depth === 0 && <button type="button" onClick={() => setReplyTo(comment)}>Reply</button>}{replies.length > 0 && <button className={`nc-story-thread-toggle${expanded ? ' expanded' : ''}`} type="button" aria-expanded={expanded} aria-controls={threadId} onClick={() => setExpandedThreads((current) => ({ ...current, [threadKey]: !current[threadKey] }))}><ChevronDown size={13} />{expanded ? 'Hide replies' : `View ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}</button>}<span className="nc-story-comment-meta">Just now</span></div></div></article>
      {replies.length > 0 && <div className="nc-story-comment-children" id={threadId} hidden={!expanded}>{replies.map((reply) => renderComment(reply, depth + 1))}</div>}
    </Fragment>;
  };

  return createPortal(<div className="nc-story-overlay" onClick={onClose}>
    <section className="nc-story-shell nc-story-shell-fullscreen" role="dialog" aria-modal="true" aria-label={`${person.name}'s story`} onClick={(event) => event.stopPropagation()}>
      <div className="nc-story-progress" aria-label={`Story ${storyIndex + 1} of ${storyCount}`}><span className="nc-story-track"><span style={{ width: '100%' }} /></span></div>
      <header className="nc-story-header"><img className="nc-story-author-photo" src={person.photo} alt="" /><span className="nc-story-author"><strong>{person.name}</strong><small>{person.city} · Just now</small></span><button type="button" aria-label="Close story" onClick={onClose}><X /></button></header>
      <div className="nc-story-visual"><img className="nc-story-media" src={storyImages[storyIndex % storyImages.length]} alt={`${person.name}'s story`} /><button className="nc-story-tap prev" type="button" aria-label="Previous story" onClick={onPrevious} /><button className="nc-story-tap next" type="button" aria-label="Next story" onClick={onNext} /></div>
      <div className="nc-story-caption"><span>STORY · {person.city.toUpperCase()}</span><h3>{person.bio}</h3></div>
      <footer className="nc-story-footer">
        <div className="nc-story-reactions" aria-label="Story reactions">{[['❤️', 'Love'], ['😂', 'Laugh'], ['😮', 'Surprise'], ['😍', 'Adore'], ['😢', 'Sad'], ['🔥', 'Fire']].map(([emoji, label]) => <button className={`nc-story-react${storyReactions[person.id] === emoji ? ' selected' : ''}`} type="button" key={emoji} aria-label={`React with ${label}`} aria-pressed={storyReactions[person.id] === emoji} onClick={() => toggleStoryReaction(person.id, emoji)}><span className="emoji">{emoji}</span></button>)}</div>
        <div className="nc-story-footer-actions nc-story-instagram-actions"><button className="nc-story-comment-open" type="button" onClick={() => setCommentsOpen(true)}>Send a comment…</button><button className="nc-story-icon-action" type="button" aria-label={`Open ${comments.length} comments`} onClick={() => setCommentsOpen(true)}><MessageCircle size={24} />{comments.length > 0 && <span className="nc-story-small-count">{comments.length}</span>}</button></div>
        <p className="nc-story-hint">Tap either side to browse stories</p>
      </footer>
      <button className="nc-story-floating-nav prev" type="button" aria-label="Previous story" onClick={onPrevious}><ArrowLeft size={19} /></button><button className="nc-story-floating-nav next" type="button" aria-label="Next story" onClick={onNext}><ArrowRight size={19} /></button>
      {commentsOpen && <section className="nc-story-comments" aria-label="Story comments" onClick={(event) => event.stopPropagation()}>
        <span className="nc-story-sheet-handle" /><header className="nc-story-comments-header"><span className="nc-story-comments-title"><strong>Comments</strong><small>{comments.length} on {person.name}'s story</small></span><button className="nc-story-comments-close" type="button" aria-label="Close comments" onClick={() => { setCommentsOpen(false); setReplyTo(null); }}>×</button></header>
        <div className="nc-story-comments-list" aria-live="polite">{rootComments.length ? rootComments.map((comment) => renderComment(comment)) : <p className="nc-story-comment-empty">No comments yet. Start the conversation.</p>}</div>
        {replyTo && <div className="nc-story-reply-indicator">Replying to a comment <button type="button" onClick={() => setReplyTo(null)}>Cancel</button></div>}
        <form className="nc-story-comment-form" onSubmit={submitComment}><input autoFocus aria-label={replyTo ? 'Write a reply' : 'Write a comment'} placeholder={replyTo ? 'Write a reply…' : 'Write a comment…'} maxLength={240} value={commentText} onChange={(event) => setCommentText(event.target.value)} /><button type="submit" disabled={!commentText.trim()}>{replyTo ? 'Reply' : 'Send'}</button></form>
      </section>}
    </section>
  </div>, document.body);
}

function HomeCallHero({ profile, featuredPerson, onlineCount, interestedCount, randomCall }: { profile: { name: string }; featuredPerson?: Person; onlineCount: number; interestedCount: number; randomCall: React.ReactNode }) {
  return <section className="nc-home-hero" aria-labelledby="home-welcome-title">
    <div className="nc-home-hero-copy"><span className="nc-home-hero-eyebrow">YOUR VIDEO DATING COMMUNITY</span><h1 id="home-welcome-title">Good to see you, <em>{profile.name.split(' ')[0]}!</em> 👋</h1><p>Meet new people, start a video call, chat, and make real connections.</p><div className="nc-home-hero-actions">{randomCall}<Link className="nc-home-discover-button" to="/explore"><Compass size={18} /> Discover People</Link></div></div>
    <div className="nc-home-hero-visual" aria-label="Community profile preview"><div className="nc-home-hero-orbit" /><Heart className="nc-home-hero-heart" size={36} /><div className="nc-home-hero-portrait nc-home-hero-portrait-back" /> <div className="nc-home-hero-portrait nc-home-hero-portrait-main">{featuredPerson?.photo && <img src={featuredPerson.photo} alt={featuredPerson.name} />}<span><UsersRound size={17} /><i /></span></div></div>
    <aside className="nc-today-activity" aria-label="Community activity"><h2><Zap size={17} /> Today’s Activity</h2><Link to="/explore"><i className="nc-activity-online" /><span><strong>{onlineCount} Girls Online</strong></span><ChevronRight size={16} /></Link><Link to="/matches"><Heart size={17} /><span><strong>{interestedCount} New Matches</strong></span><ChevronRight size={16} /></Link><Link to="/chats"><MessageCircle size={17} /><span><strong>3 Unread Chats</strong></span><ChevronRight size={16} /></Link><small>Activity from your community</small></aside>
  </section>;
}

function ProfileDirectoryPage({ mode }: { mode: 'explore' | 'matches' }) {
  const navigate = useNavigate();
  const { profile, blocked, likes } = useDemoStore();
  const [query, setQuery] = useState(''); const [city, setCity] = useState('All'); const [interest, setInterest] = useState('All');
  const [result, setResult] = useState<Person[]>([]);
  const [visibleCount, setVisibleCount] = useState(EXPLORE_PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [actionFilters, setActionFilters] = useState<ContactAction[]>([]);
  const [ageRange, setAgeRange] = useState('any');
  const hasLoaded = useRef(false);
  useEffect(() => { setVisibleCount(EXPLORE_PAGE_SIZE); }, [query, city, interest, actionFilters, ageRange, likes]);
  useEffect(() => {
    let active = true;
    let timer: number | undefined;
    if (!hasLoaded.current) setLoading(true);
    const startedAt = performance.now();
    const searchResults = mode === 'matches'
      ? Promise.resolve(people.filter((person) => {
        const normalized = query.trim().toLowerCase();
        return likes.includes(person.id) && !blocked.includes(person.id) &&
          (!normalized || `${person.name} ${person.city} ${person.work} ${person.interests.join(' ')}`.toLowerCase().includes(normalized)) &&
          (city === 'All' || person.city === city) &&
          (interest === 'All' || person.interests.includes(interest));
      }))
      : repository.search(query, city, interest, profile.role, blocked);
    void searchResults.then(async (matches) => {
      await Promise.all(matches.map((person) => new Promise<void>((resolve) => {
        const image = new Image();
        const settle = () => resolve();
        image.onload = settle;
        image.onerror = settle;
        image.src = person.photo;
        if (image.complete) settle();
      })));
      if (!active) return;
      const finish = () => {
        if (!active) return;
        setResult(matches);
        setLoading(false);
        hasLoaded.current = true;
      };
      const remaining = hasLoaded.current ? 0 : Math.max(0, 280 - (performance.now() - startedAt));
      if (remaining) timer = window.setTimeout(finish, remaining);
      else finish();
    }).catch(() => {
      if (!active) return;
      setResult([]);
      setLoading(false);
      hasLoaded.current = true;
    });
    return () => { active = false; if (timer) window.clearTimeout(timer); };
  }, [query, city, interest, profile.role, blocked, likes, mode]);
  const availablePeople = mode === 'matches'
    ? people.filter((person) => likes.includes(person.id) && !blocked.includes(person.id))
    : people.filter((person) => person.role !== profile.role && !blocked.includes(person.id));
  const filteredResults = result.filter((person) => {
    const actions = person.availableActions ?? ['video'];
    const ageMatches = ageRange === 'any' || (ageRange === '18-24' && person.age <= 24) || (ageRange === '25-29' && person.age >= 25 && person.age <= 29) || (ageRange === '30+' && person.age >= 30);
    return ageMatches && (!actionFilters.length || actionFilters.some((action) => actions.includes(action)));
  });
  const visibleResults = filteredResults.slice(0, visibleCount);
  if (loading) return <ExplorePageSkeleton people={availablePeople.slice(0, EXPLORE_PAGE_SIZE)} mode={mode} />;
  return <section className="page nc-explore-page">
    <header className="nc-explore-heading"><span className="nc-explore-heading-mark" /><div><span className="nc-explore-eyebrow">{mode === 'matches' ? 'YOUR CONNECTIONS' : 'FIND YOUR PEOPLE'}</span><h1>{mode === 'matches' ? 'Matches' : 'Explore'}</h1><p>{mode === 'matches' ? 'Your saved connections, ready for a conversation.' : 'Discover amazing people in your city and beyond. Chat, call, and make real connections.'}</p></div></header>
    <div className="nc-explore-filters">
      <label className="nc-explore-search"><Search size={20} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={mode === 'matches' ? 'Search your matches...' : 'Search people by name, city, or interests...'} aria-label={mode === 'matches' ? 'Search matches by name, city, or interests' : 'Search people by name, city, or interests'} /></label>
      <label className="nc-explore-select"><MapPin size={19} /><select value={city} onChange={(event) => setCity(event.target.value)} aria-label="Filter by city"><option value="All">All Cities</option>{cities.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={17} /></label>
      <label className="nc-explore-select"><BriefcaseBusiness size={18} /><select value={interest} onChange={(event) => setInterest(event.target.value)} aria-label="Filter by interest"><option value="All">All Interests</option>{interests.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={17} /></label>
      <button className={`nc-explore-more${moreFiltersOpen ? ' is-open' : ''}`} type="button" aria-expanded={moreFiltersOpen} aria-controls="nc-explore-more-panel" onClick={() => setMoreFiltersOpen((open) => !open)}><SlidersHorizontal size={19} />More Filters<span className="nc-explore-filter-dot" aria-hidden="true" /></button>
    </div>
    {moreFiltersOpen && <section id="nc-explore-more-panel" className="nc-explore-more-panel" aria-label="More profile filters"><div><strong>Available for</strong><div className="nc-explore-filter-options">{(['video', 'audio', 'chat'] as ContactAction[]).map((action) => <button key={action} type="button" className={actionFilters.includes(action) ? 'selected' : ''} aria-pressed={actionFilters.includes(action)} onClick={() => setActionFilters((current) => current.includes(action) ? current.filter((item) => item !== action) : [...current, action])}>{action === 'video' ? <Video size={16} /> : action === 'audio' ? <Phone size={16} /> : <MessageCircle size={16} />}{action === 'video' ? 'Video call' : action === 'audio' ? 'Audio call' : 'Chat'}</button>)}</div></div><label><strong>Age range</strong><select value={ageRange} onChange={(event) => setAgeRange(event.target.value)}><option value="any">Any age</option><option value="18-24">18–24</option><option value="25-29">25–29</option><option value="30+">30+</option></select></label><button className="nc-explore-clear" type="button" onClick={() => { setActionFilters([]); setAgeRange('any'); setCity('All'); setInterest('All'); setQuery(''); }}>Clear filters</button></section>}
    {visibleResults.length ? <div className={`nc-explore-grid${mode === 'matches' ? ' nc-matches-grid' : ''}`}>{visibleResults.map((person) => <ExploreProfileCard key={person.id} person={person} onOpen={() => navigate(`/profile/${person.id}`)} />)}</div> : mode === 'matches' && availablePeople.length === 0 ? <Empty title="No matches yet" text="Explore profiles and save someone to see them here." action={<Link className="btn primary" to="/explore">Explore profiles</Link>} /> : <Empty title={mode === 'matches' ? 'No matches found' : 'No profiles found'} text="Try another search or clear a filter." />}
    {visibleResults.length < filteredResults.length && <section className="nc-explore-load-more" aria-label="More profiles">
      <div className="nc-explore-load-count"><UsersRound size={27} aria-hidden="true" /><span>Showing <strong>{visibleResults.length}</strong> of <strong>{filteredResults.length}</strong> {mode === 'matches' ? 'matches' : 'profiles'}</span></div>
      <div className="nc-explore-load-progress" role="progressbar" aria-label={mode === 'matches' ? 'Matches shown' : 'Profiles shown'} aria-valuemin={0} aria-valuemax={filteredResults.length} aria-valuenow={visibleResults.length}><span style={{ width: `${(visibleResults.length / filteredResults.length) * 100}%` }} /></div>
      <div className="nc-explore-load-decoration" aria-hidden="true"><i /><Heart size={20} /><i /></div>
      <button className="nc-explore-load-button" type="button" onClick={() => setVisibleCount((count) => Math.min(count + EXPLORE_PAGE_SIZE, filteredResults.length))}><UsersRound size={29} aria-hidden="true" /><span>Load More Profiles</span><ChevronDown size={24} aria-hidden="true" /></button>
    </section>}
  </section>;
}

function ExploreProfileCard({ person, onOpen }: { person: Person; onOpen: () => void }) {
  const actions: ContactAction[] = [...new Set<ContactAction>(person.availableActions ?? ['video'])];
  return <article className="nc-explore-card">
    <button type="button" className="nc-explore-photo" onClick={onOpen} aria-label={`View ${person.name}, ${person.age}`}><img src={person.photo} alt={`Fictional profile of ${person.name}`} loading="lazy" /><span className="nc-explore-photo-shade" /></button>
    <span className="nc-explore-city"><MapPin size={14} />{person.city}</span><span className="nc-explore-online"><i />Online</span>
    <div className="nc-explore-card-meta"><h2>{person.name}, {person.age}<span className="nc-explore-verified" aria-label="Verified sample profile"><Check size={11} /></span></h2><p><BriefcaseBusiness size={15} />{person.work}</p>
      <div className={`nc-explore-actions nc-active-actions nc-active-actions-${actions.length}${actions.includes('video') ? ' has-video' : ''}`} aria-label={`${person.name} contact options`}>
        {actions.map((action) => action === 'chat'
          ? <Link key={action} className="btn nc-active-contact-option nc-active-contact-option-chat" to={`/chats/${person.id}`} aria-label={`Chat with ${person.name}`} title={`Chat with ${person.name}`}><MessageCircle size={17} /><span className="nc-active-action-label">Chat</span></Link>
          : <CallButton key={action} person={person} compact activeOption mode={action} label={action === 'video' ? 'Video Call' : 'Audio'} />)}
      </div>
    </div>
  </article>;
}

function ExploreSkeletonBlock({ className = '' }: { className?: string }) {
  return <span aria-hidden="true" className={`nc-explore-skeleton-block ${className}`} />;
}

function ExplorePageSkeleton({ people: eligiblePeople, mode }: { people: Person[]; mode: 'explore' | 'matches' }) {
  return <section className="page nc-explore-page nc-explore-skeleton" aria-busy="true" aria-label={mode === 'matches' ? 'Loading matches' : 'Loading explore profiles'}>
    <span className="sr-only" role="status">Loading profiles</span>
    <header className="nc-explore-heading" aria-hidden="true"><span className="nc-explore-heading-mark" /><div><ExploreSkeletonBlock className="nces-eyebrow" /><ExploreSkeletonBlock className="nces-title" /><ExploreSkeletonBlock className="nces-description" /></div></header>
    <div className="nc-explore-filters" aria-hidden="true"><ExploreSkeletonBlock className="nces-search" /><ExploreSkeletonBlock className="nces-filter" /><ExploreSkeletonBlock className="nces-filter" /><ExploreSkeletonBlock className="nces-more" /></div>
    <div className={`nc-explore-grid${mode === 'matches' ? ' nc-matches-grid' : ''}`} aria-hidden="true">{eligiblePeople.map((person) => { const actions = person.availableActions ?? ['video']; return <article className="nc-explore-card nc-explore-card-skeleton" key={person.id}><ExploreSkeletonBlock className="nces-photo" /><ExploreSkeletonBlock className="nces-city" /><ExploreSkeletonBlock className="nces-online" /><div className="nc-explore-card-meta"><ExploreSkeletonBlock className="nces-name" /><ExploreSkeletonBlock className="nces-work" /><div className={`nc-explore-actions nc-active-actions nc-active-actions-${actions.length}${actions.includes('video') ? ' has-video' : ''}`}>{actions.map((action) => <ExploreSkeletonBlock className={`nces-action nc-active-contact-option nc-active-contact-option-${action}`} key={action} />)}</div></div></article>; })}</div>
  </section>;
}

function HomeMemberProfilePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof customerApi.homeProfile>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    setDetail(null);
    const profileId = Number(id);
    if (!Number.isSafeInteger(profileId) || profileId <= 0) {
      setError('This profile is not available.');
      setLoading(false);
      return () => { cancelled = true; };
    }
    void customerApi.homeProfile(profileId)
      .then((response) => { if (!cancelled) setDetail(response); })
      .catch((reason: unknown) => { if (!cancelled) setError(reason instanceof Error ? reason.message : 'Unable to load this profile.'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <section className="page" aria-busy="true"><p role="status">Loading profile…</p></section>;
  if (!detail) return <section className="page"><button className="link" onClick={() => navigate('/home')}><ArrowLeft size={16} /> Back to Home</button><Empty title="Profile unavailable" text={error || 'This profile is no longer available.'} /></section>;

  const person = detail.data;
  const toggleInterest = async () => {
    setSaving(true);
    try {
      const result = await customerApi.setHomeInteraction(person.id, 'interest', !detail.interest_sent);
      setDetail({ ...detail, interest_sent: result.active });
    } catch (reason) {
      notify(reason instanceof Error ? reason.message : 'Could not save your interest.');
    } finally {
      setSaving(false);
    }
  };

  return <section className="page"><button className="link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button><div className="profile-detail"><div className="profile-detail-photo">{person.photo ? <img src={person.photo} alt={`Profile photo of ${person.name}`} /> : <div className="profile-photo-placeholder" aria-label="No profile photo" />}</div><div className="profile-detail-info"><span className="pill"><Shield size={14} /> Community profile</span><h1>{person.name}{person.age === null ? '' : `, ${person.age}`}</h1><p>{[person.city, person.work].filter(Boolean).join(' · ')}</p><div className="separator" /><h3>About {person.name}</h3><p>{person.bio || 'No introduction added yet.'}</p><h3>Interests</h3>{person.interests.length ? <div className="chips">{person.interests.map((item) => <span className="chip" key={item}>{item}</span>)}</div> : <p className="muted-line">No interests added yet.</p>}<div className="profile-detail-actions"><button className={`btn ${detail.interest_sent ? 'outline' : 'pink'}`} disabled={saving} onClick={() => void toggleInterest()}><Heart size={16} />{detail.interest_sent ? 'Withdraw interest' : 'Send interest'}</button></div></div></div></section>;
}

function PersonPage() {
  const { id } = useParams(); const navigate = useNavigate();
  const [reportOpen, setReportOpen] = useState(false);
  useDialogAccessibility(reportOpen, () => setReportOpen(false));
  const person = people.find((item) => item.id === Number(id));
  const { profile, likes, interestsSent, toggleLike, toggleInterest, blockPerson, saveReport } = useDemoStore();
  if (!person) return <Empty title="Profile not found" text="That sample profile is not available." />;
  const girl = profile.role === 'girl';
  return <section className="page"><button className="link" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back to explore</button><div className="profile-detail"><div className="profile-detail-photo"><img src={person.photo} alt={`Fictional profile of ${person.name}`} /></div><div className="profile-detail-info"><span className="pill"><Shield size={14} /> Fictional demo profile</span><h1>{person.name}, {person.age}</h1><p>{person.city} · {person.work} · {person.distance}</p><div className="separator" /><h3>About {person.name}</h3><p>{person.bio}</p><h3>Interests</h3><div className="chips">{person.interests.map((item) => <span className="chip" key={item}>{item}</span>)}</div><div className="profile-detail-actions">{girl ? <button className="btn pink" onClick={() => toggleInterest(person.id)}><Heart size={16} />{interestsSent.includes(person.id) ? 'Withdraw interest' : 'Send interest'}</button> : <><button className="btn pink" onClick={() => toggleLike(person.id)}><Heart size={16} />{likes.includes(person.id) ? 'Liked' : 'Like'}</button><button className="btn outline" onClick={() => navigate(`/chats/${person.id}`)}><MessageCircle size={16} /> Message</button><CallButton person={person} /></>}</div><div className="separator" /><div className="profile-detail-actions"><button className="link" onClick={() => setReportOpen(true)}><Shield size={15} /> Report</button><button className="link" onClick={() => { blockPerson(person.id); navigate('/safety'); notify('Profile blocked in this browser.'); }}><X size={15} /> Block</button></div><p className="muted-line">This is a fictional sample person. No real communication or matching occurs.</p></div></div>{reportOpen && <ModalPortal onClick={() => setReportOpen(false)}><section className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="report-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close report" onClick={() => setReportOpen(false)}><X /></button><h2 id="report-title">Report {person.name}</h2><p>This report is saved in this browser only. No moderator is notified.</p><form className="form-stack" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); const reason = String(form.get('reason') ?? ''); if (!reason) return; saveReport({ id: crypto.randomUUID(), personId: person.id, reason, details: String(form.get('details') ?? '').slice(0, 500), createdAt: new Date().toISOString() }); setReportOpen(false); notify('Sample report saved locally. No moderator was notified.'); }}><Field label="Reason"><select name="reason" required defaultValue=""><option value="" disabled>Choose a reason</option><option>Inappropriate content</option><option>Spam</option><option>Something else</option></select></Field><Field label="Additional details"><textarea name="details" maxLength={500} placeholder="Add optional details" /></Field><button className="btn primary" type="submit">Save sample report</button></form></section></ModalPortal>}</section>;
}

function callRateFor(personId: number) {
  return [70, 90, 120, 60, 80][personId % 5];
}

type RandomCallStep = 'type' | 'searching' | 'match';

function RandomCallFlowDialog({ person, candidates, step, mode, rate, walletCoins, setStep, setMode, onSearch, onClose, onConnect }: {
  person: Person;
  candidates?: Person[];
  step: RandomCallStep;
  mode: 'video' | 'audio' | null;
  rate: number;
  walletCoins: number;
  setStep: React.Dispatch<React.SetStateAction<RandomCallStep>>;
  setMode: React.Dispatch<React.SetStateAction<'video' | 'audio' | null>>;
  onSearch: () => void;
  onClose: () => void;
  onConnect: () => void;
}) {
  const [shuffleIndex, setShuffleIndex] = useState(0);
  const [shuffleSettled, setShuffleSettled] = useState(false);
  const shuffleCandidates = candidates ?? people.filter((item) => item.role === 'girl');
  const reelPeople = shuffleCandidates.length ? shuffleCandidates : [person];
  const targetIndex = Math.max(0, reelPeople.findIndex((item) => item.id === person.id));
  const reelCount = reelPeople.length;
  useEffect(() => {
    if (step !== 'searching') return;
    setShuffleSettled(false);
    let timeout: number;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShuffleIndex(targetIndex);
      setShuffleSettled(true);
      timeout = window.setTimeout(() => setStep('match'), 680);
      return () => window.clearTimeout(timeout);
    }
    let tick = 0;
    const durations = [120, 130, 145, 165, 190, 225, 270, 335, 420];
    const advance = () => {
      tick += 1;
      const isFinalTick = tick === durations.length;
      setShuffleIndex((index) => isFinalTick ? targetIndex : (index + 1) % reelCount);
      if (isFinalTick) {
        setShuffleSettled(true);
        timeout = window.setTimeout(() => setStep('match'), 680);
      } else {
        timeout = window.setTimeout(advance, durations[tick]);
      }
    };
    timeout = window.setTimeout(advance, durations[0]);
    return () => window.clearTimeout(timeout);
  }, [step, targetIndex, reelCount, setStep]);

  const callMode = mode ?? 'video';
  const CallModeIcon = callMode === 'audio' ? Phone : Video;
  const threeMinuteCost = rate * 3;
  const stageIndex = step === 'type' ? 0 : step === 'searching' ? 1 : 2;
  const stages = ['Call type', 'Shuffle', 'Connect'];
  const activeReelIndex = shuffleIndex % reelCount;
  const leftProfile = reelPeople[(activeReelIndex - 1 + reelCount) % reelCount];
  const centerProfile = reelPeople[activeReelIndex];
  const rightProfile = reelPeople[(activeReelIndex + 1) % reelCount];
  const shuffleAgain = () => {
    setShuffleSettled(false);
    onSearch();
  };

  return <section className="nc-random-flow-dialog" role="dialog" aria-modal="true" aria-labelledby="random-flow-title" onClick={(event) => event.stopPropagation()}>
    <header className="nc-random-flow-header"><Link to="/home" className="nc-random-flow-brand" aria-label="LUVZY home" onClick={onClose}><Heart size={18} fill="currentColor" /> LUVZY</Link><span>RANDOM CALL · DEMO</span><button className="nc-random-flow-close" onClick={onClose} aria-label="Close random call"><X size={18} /></button></header>
    <ol className="nc-random-flow-steps" aria-label="Random call steps">{stages.map((stage, index) => <li key={stage} className={index < stageIndex ? 'complete' : index === stageIndex ? 'current' : ''} aria-current={index === stageIndex ? 'step' : undefined}><i>{index < stageIndex ? <Check size={12} /> : index + 1}</i><span>{stage}</span></li>)}</ol>

    {step === 'type' && <div className="nc-random-flow-body">
      <div className="nc-random-flow-title"><h2 id="random-flow-title">How would you like to connect?</h2><p>Choose a call type, then shuffle through the profiles.</p></div>
      <div className="nc-random-type-options">
        <button className={`nc-random-type-card ${mode === 'video' ? 'selected' : ''}`} aria-pressed={mode === 'video'} onClick={() => setMode('video')}><i><Video size={23} fill="currentColor" /></i><strong>Video call</strong><span>Face-to-face introduction</span><small>{rate} demo coins / min</small>{mode === 'video' && <Check className="nc-random-selected-check" size={17} />}</button>
        <button className={`nc-random-type-card ${mode === 'audio' ? 'selected' : ''}`} aria-pressed={mode === 'audio'} onClick={() => setMode('audio')}><i><Phone size={22} /></i><strong>Audio call</strong><span>Voice-only conversation</span><small>{rate} demo coins / min</small>{mode === 'audio' && <Check className="nc-random-selected-check" size={17} />}</button>
      </div>
      <button className="nc-random-flow-primary" disabled={!mode} onClick={onSearch}>Shuffle profiles <ArrowRight size={16} /></button>
    </div>}

    {step === 'searching' && <div className="nc-random-flow-body nc-random-search-state">
      <div className="nc-random-flow-title" aria-live="polite"><h2 id="random-flow-title">{shuffleSettled ? 'Your profile is picked!' : 'Shuffling profiles'}</h2><p>{shuffleSettled ? `Here’s who you’ll meet for your ${callMode} call.` : 'Cycling through available profiles and picking someone for your call.'}</p></div>
      <div className={`nc-random-shuffle-stage ${shuffleSettled ? 'settled' : ''}`}>
        <div className="nc-random-shuffle-orbit" aria-hidden="true" />
        <div className="nc-random-shuffle-card side left"><img src={leftProfile.photo} alt="" /></div>
        <div className="nc-random-shuffle-card center" key={centerProfile.id}><img src={centerProfile.photo} alt={`${centerProfile.name}, fictional profile`} /><span className="nc-random-shuffle-name">{centerProfile.name}</span><small>{shuffleSettled ? 'YOUR PICK' : 'SHUFFLING'}</small></div>
        <div className="nc-random-shuffle-card side right"><img src={rightProfile.photo} alt="" /></div>
      </div>
      <div className="nc-random-shuffle-caption"><span className={shuffleSettled ? 'done' : ''}>{shuffleSettled ? <Check size={15} /> : <i />}</span><strong>{shuffleSettled ? `${person.name} is ready` : 'Profiles are rotating'}</strong><small>{callMode === 'video' ? 'Video' : 'Audio'} call · fictional profiles</small></div>
      <button className="nc-random-flow-secondary" onClick={() => setStep('type')}>Cancel shuffle</button>
    </div>}

    {step === 'match' && <div className="nc-random-flow-body nc-random-match-stage">
      <div className="nc-random-flow-title"><h2 id="random-flow-title">It’s a match!</h2><p>Ready for your {callMode} call?</p></div>
      <div className="nc-random-match-card"><img src={person.photo} alt={`Fictional profile of ${person.name}`} /><div><span className="nc-random-match-badge"><Check size={13} /> YOUR RANDOM PICK</span><h3>{person.name}, {person.age}</h3><p>{person.city} · Fictional profile</p><div className="nc-random-match-rate"><span>1 minute of {callMode} call</span><strong><Coins size={17} /> {rate} <small>coins / min</small></strong></div></div></div>
      {walletCoins < threeMinuteCost && <div className="nc-random-recharge-warning" role="status"><AlertTriangle size={18} /><div><strong>Low balance for a 3-minute call</strong><p>You have {walletCoins} coins. Add {threeMinuteCost - walletCoins} to reach the {threeMinuteCost}-coin cost.</p></div><Link to="/wallet" onClick={onClose}><Coins size={14} /> Buy coins</Link></div>}
      <div className="nc-random-match-actions"><button className="nc-random-flow-secondary" onClick={shuffleAgain}><Sparkles size={15} /> Shuffle again</button><button className="nc-random-flow-primary" onClick={onConnect}><CallModeIcon size={16} /> Start {callMode} call</button></div>
      {walletCoins < rate && <p className="nc-random-insufficient-note">You need {rate} sample coins to start this call.</p>}
    </div>}
    <footer className="nc-random-flow-footer">FICTIONAL DEMO · NO LIVE USERS OR PAYMENTS CONNECTED</footer>
  </section>;
}

function CallButton({ person, featured = false, compact = false, activeOption = false, mode = 'video', label, dock = false, randomCandidates }: { person: Person; featured?: boolean; compact?: boolean; activeOption?: boolean; mode?: 'video' | 'audio'; label?: string; dock?: boolean; randomCandidates?: Person[] }) {
  const [open, setOpen] = useState(false); const [active, setActive] = useState(false); const [seconds, setSeconds] = useState(0);
  const [randomStep, setRandomStep] = useState<RandomCallStep>('type'); const [randomMode, setRandomMode] = useState<'video' | 'audio' | null>(null);
  const [randomPerson, setRandomPerson] = useState(person);
  const [muted, setMuted] = useState(false); const [cameraOff, setCameraOff] = useState(false); const [flipped, setFlipped] = useState(false); const saved = useRef(false); const charged = useRef(0); const skipNextCharge = useRef(false);
  const callPerson = featured ? randomPerson : person;
  const rate = callRateFor(callPerson.id);
  const callMode = featured ? randomMode ?? 'video' : mode;
  const MediaIcon = callMode === 'audio' ? Phone : Video;
  const { walletCoins, spendCoins, recordCall } = useDemoStore();
  useDialogAccessibility(open, endCall);
  useEffect(() => { if (!active) return; const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000); return () => window.clearInterval(timer); }, [active]);
  const saveSession = useCallback((durationSeconds: number, coinsSpent: number, status: CallRecord['status'] = 'completed') => {
    if (saved.current) return;
    saved.current = true;
    recordCall({ id: crypto.randomUUID(), personId: callPerson.id, createdAt: new Date().toISOString(), mode: callMode, durationSeconds, coinsSpent, status, direction: 'outgoing' });
  }, [callPerson.id, callMode, recordCall]);
  useEffect(() => {
    if (!active || seconds === 0 || seconds % 60 !== 0) return;
    if (skipNextCharge.current) { skipNextCharge.current = false; return; }
    if (spendCoins(rate)) charged.current += rate;
    else { saveSession(seconds, charged.current); setActive(false); notify('Call preview ended because the demo coin balance is low.'); }
  }, [active, seconds, rate, spendCoins, saveSession]);
  const start = useCallback(() => {
    if (!spendCoins(rate)) return notify(`You need ${rate} sample coins for the first simulated minute.`);
    saved.current = false; charged.current = rate; skipNextCharge.current = false; setOpen(true); setActive(true); setSeconds(0); setMuted(false); setCameraOff(false); setFlipped(false);
  }, [rate, spendCoins]);
  const startSearch = useCallback(() => {
    const eligible = randomCandidates ?? people.filter((candidate) => candidate.role === 'girl');
    const candidates = eligible.length > 1 ? eligible.filter((candidate) => candidate.id !== randomPerson.id) : eligible;
    if (candidates.length) setRandomPerson(candidates[Math.floor(Math.random() * candidates.length)]);
    setRandomStep('searching');
  }, [randomCandidates, randomPerson.id]);
  function endCall() { if (active) saveSession(seconds, charged.current); setActive(false); setOpen(false); }
  function advanceMinute() { if (!spendCoins(rate)) return notify('Not enough sample coins to simulate another minute.'); charged.current += rate; skipNextCharge.current = true; setSeconds((value) => value + 60); }
  const activeModeClass = activeOption ? ` nc-active-contact-option nc-active-contact-option-${mode}` : '';
  const estimatedMinutes = Math.floor(walletCoins / rate);
  const fourMinuteCost = rate * 4;
  const canStart = walletCoins >= rate;
  return <>
    <button className={`btn ${featured ? 'nc-home-call-button' : compact ? `nc-card-call-button${activeModeClass}` : 'primary'}${dock ? ' nc-random-dock-trigger' : ''}`} onClick={() => { if (featured) { setRandomPerson(person); setRandomStep('type'); setRandomMode(null); } setOpen(true); }} aria-label={dock ? 'Open Random Call' : activeOption ? `${mode} call with ${person.name}` : undefined}>
      {dock ? <span className="nc-random-dock-icon" aria-hidden="true"><Video size={34} strokeWidth={1.8} /></span> : <MediaIcon size={16} />}{dock && <span className="nc-random-dock-badge" aria-hidden="true"><Heart size={11} fill="currentColor" /></span>}<span className={dock ? 'nc-random-dock-copy' : activeOption ? 'nc-active-action-label' : undefined}>{label ?? (featured ? 'Preview a video intro' : compact ? 'Call' : `Video intro · ${rate}/min`)}{dock && <small>Meet someone new now</small>}</span>{dock && <span className="nc-random-dock-dots" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</span>}
    </button>
    {open && <ModalPortal onClick={() => { if (!active) setOpen(false); }}>
      {featured && !active ? <RandomCallFlowDialog person={callPerson} candidates={randomCandidates} step={randomStep} mode={randomMode} rate={rate} walletCoins={walletCoins} setStep={setRandomStep} setMode={setRandomMode} onSearch={startSearch} onClose={endCall} onConnect={start} /> : <section className={`dialog-card ${active ? 'nc-call-active-dialog' : 'nc-call-confirmation'}`} role="dialog" aria-modal="true" aria-labelledby="callDialogTitle" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={endCall} aria-label="Close call dialog"><X /></button>
        {active ? <>
          <div className="nc-call-active-heading">
            <span className="nc-call-live-label"><i /> LOCAL PREVIEW</span>
            <h2 id="callDialogTitle">{callMode === 'audio' ? 'Audio' : 'Video'} preview · {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</h2>
            <p>{rate} sample coins per minute · {walletCoins.toLocaleString('en-IN')} coins remain.</p>
          </div>
          <div className={`call-sample-media ${callMode === 'audio' ? 'call-sample-audio' : ''}`}>
            <img src={callPerson.photo} alt={`Fictional profile of ${callPerson.name}`} style={callMode === 'video' ? { transform: flipped ? 'scaleX(-1)' : undefined, opacity: cameraOff ? 0.3 : 1 } : undefined} />
            <span>{callMode === 'audio' ? 'AUDIO PREVIEW' : cameraOff ? 'CAMERA PREVIEW OFF' : 'LOCAL VIDEO PREVIEW'}</span>
          </div>
          <p className="call-disclaimer">Fictional local preview only. No live caller or remote camera is connected.</p>
          <div className="call-demo-controls">
            <button className="btn outline" aria-pressed={muted} onClick={() => setMuted((value) => !value)}>{muted ? 'Unmute' : 'Mute'}</button>
            {callMode === 'video' && <><button className="btn outline" aria-pressed={cameraOff} onClick={() => setCameraOff((value) => !value)}>{cameraOff ? 'Camera on' : 'Camera off'}</button><button className="btn outline" aria-pressed={flipped} onClick={() => setFlipped((value) => !value)}>Flip preview</button></>}
            <button className="btn outline" onClick={advanceMinute}>Simulate +1 minute</button>
          </div>
          <button className="btn outline" onClick={endCall}>End preview</button>
        </> : <>
          <header className="nc-call-confirm-heading">
            <span className="nc-call-confirm-icon"><MediaIcon size={35} fill="currentColor" /></span>
            <span className="nc-call-confirm-heart" aria-hidden="true"><Heart size={24} /></span>
            <h2 id="callDialogTitle">Start {callMode} call with <em>{callPerson.name}?</em></h2>
            <p>Review your sample coin usage before starting.</p>
          </header>
          <section className="nc-call-person-panel" aria-label={`Call profile: ${callPerson.name}`}>
            <div className="nc-call-person-photo"><img src={callPerson.photo} alt={`Fictional profile of ${callPerson.name}`} /></div>
            <div className="nc-call-person-info">
              <span className="nc-call-online"><i /> ONLINE NOW · DEMO</span>
              <strong>{callPerson.name}, {callPerson.age}</strong>
              <span className="nc-call-location"><MapPin size={16} /> {callPerson.city}, India</span>
              <small>Fictional sample profile</small>
            </div>
            <span className="nc-call-person-mode" aria-label={`${mode} call`}><MediaIcon size={28} /></span>
          </section>
          <section className="nc-call-cost-grid" aria-label="Call coin estimate">
            <article><Coins /><div><span>Call rate</span><strong>{rate} <small>coins / min</small></strong></div></article>
            <article><Wallet /><div><span>Your balance</span><strong>{walletCoins.toLocaleString('en-IN')} <small>coins</small></strong></div></article>
            <article className="nc-call-time-card"><Clock3 /><div><span>Estimated talk time</span><strong>{estimatedMinutes} <small>{estimatedMinutes === 1 ? 'min' : 'mins'}</small></strong></div></article>
            <article><Coins /><div><span>4-minute call cost</span><strong>{fourMinuteCost.toLocaleString('en-IN')} <small>coins</small></strong></div></article>
          </section>
          <div className={`nc-call-balance-note ${estimatedMinutes < 4 ? 'is-low' : 'is-ready'}`} role="status">
            {estimatedMinutes < 4 ? <AlertTriangle size={29} /> : <Check size={29} />}
            <div><strong>{canStart ? `Your balance covers about ${estimatedMinutes} ${estimatedMinutes === 1 ? 'minute' : 'minutes'}.` : `You need ${rate} sample coins to start.`}</strong><p>{canStart ? `If the call continues beyond ${estimatedMinutes} ${estimatedMinutes === 1 ? 'minute' : 'minutes'}, you may need to recharge.` : 'Add sample coins to your demo balance to begin a preview.'}</p></div>
          </div>
          <div className="nc-call-cost-summary">
            <span><Coins size={22} /> 1 minute cost: <strong>{rate} coins</strong></span>
            <i aria-hidden="true" />
            <span><Bell size={21} /> Preview ends if your sample balance runs out</span>
          </div>
          <p className="nc-call-demo-disclaimer">Demo only · No payment processed · No live caller connected</p>
          <div className="nc-call-confirm-actions">
            <button className="btn outline" onClick={endCall}>Cancel</button>
            <Link className="btn nc-call-recharge" to="/wallet"><Coins size={17} /> Recharge coins</Link>
            {canStart ? <button className="btn primary nc-call-start" onClick={start}><MediaIcon size={19} /> Start {mode} call</button> : <Link className="btn primary nc-call-start" to="/wallet"><Coins size={18} /> Add coins to start</Link>}
          </div>
        </>}
      </section>}
    </ModalPortal>}
  </>;
}

function LikesPage() {
  const navigate = useNavigate(); const { likes, profile } = useDemoStore();
  const interestsSent = useDemoStore((state) => state.interestsSent);
  const peopleLiked = people.filter((person) => likes.includes(person.id) || (profile.role === 'girl' && interestsSent.includes(person.id)));
  return <section className="page"><SectionTitle eyebrow="YOUR CONNECTIONS" title="Your likes" description="Profiles you have saved in this demo." />{peopleLiked.length ? <div className="profile-grid">{peopleLiked.map((person) => <PersonCard key={person.id} person={person} onClick={() => navigate(`/profile/${person.id}`)} />)}</div> : <Empty title="No likes yet" text="Explore profiles and save someone who catches your eye." action={<Link to="/explore" className="btn primary">Explore profiles</Link>} />}</section>;
}

function ChatsPage() {
  const { messages, sendMessage, profile } = useDemoStore();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | 'Unread' | 'Online'>('All');
  const [draft, setDraft] = useState('');
  const ids = [...new Set([...people.filter((person) => messages.some((message) => message.personId === person.id)).map((person) => person.id), ...people.slice(0, 6).map((person) => person.id)])];
  const chats = ids.map((id) => ({ person: people.find((item) => item.id === id)!, thread: messages.filter((message) => message.personId === id) }));
  const filteredChats = chats.filter(({ person, thread }) => person.name.toLowerCase().includes(query.toLowerCase()) && (filter !== 'Unread' || thread.length > 0) && (filter !== 'Online' || person.id !== people[2].id));
  const selected = chats.find(({ person }) => person.id === selectedId);
  const previewMessages = selected ? selected.thread.length ? selected.thread.map((message) => ({ text: message.text, mine: message.mine, time: '10:24 PM' })) : selected.person.id === people[0].id ? [
    { text: 'Hey there! 👋', mine: false, time: '10:08 PM' },
    { text: `Hi ${selected.person.name}! How’s your day going?`, mine: true, time: '10:12 PM' },
    { text: 'Pretty good! Just unwinding after a busy day. What about you?', mine: false, time: '10:18 PM' },
    { text: 'Same here! Would love to know more about you. 😊', mine: true, time: '10:24 PM' },
  ] : [] : [];
  return <section className="page nc-chats-page">
    <header className="nc-chats-heading"><div><span className="eyebrow">SAY HELLO</span><h1>Chats</h1><p>Continue your conversations and connect instantly.</p></div></header>
    <div className={`nc-chat-workspace${selectedId !== null ? ' has-selected-chat' : ''}`}>
      <aside className="nc-chat-sidebar"><div className="nc-chat-search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search conversations..." aria-label="Search conversations" /><button type="button" aria-label="Conversation filters"><SlidersHorizontal size={19} /></button></div><div className="nc-chat-filters" role="group" aria-label="Filter conversations">{(['All', 'Unread', 'Online'] as const).map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}{item === 'Unread' && <span>3</span>}{item === 'Online' && <i />}</button>)}</div><div className="nc-chat-list">{filteredChats.map(({ person, thread }, index) => { const last = thread.at(-1); return <button type="button" key={person.id} className={`nc-chat-row${selectedId === person.id ? ' selected' : ''}`} onClick={() => setSelectedId(person.id)}><span className="nc-chat-avatar"><img src={person.photo} alt="" />{person.id !== people[2].id && <i />}</span><span className="nc-chat-row-copy"><strong>{person.name}</strong><span>{last?.text ?? ['Hey! How’s your day going? 🌸', 'That sounds fun! Tell me more 😊', 'Are you free for a quick call later?', 'I loved that movie too! 🎬', 'Let’s catch up tomorrow?', 'Haha true! 😄'][index % 6]}</span></span><span className="nc-chat-row-side"><time>{['10:24 PM', '9:51 PM', '7:38 PM', '6:20 PM', '4:11 PM', '1:36 PM'][index % 6]}</time>{index < 2 && <b>{index ? '1' : '2'}</b>}</span></button>; })}</div></aside>
      <section className="nc-chat-conversation">{selected ? <><header className="nc-chat-person"><button type="button" className="nc-chat-back" aria-label="Back to conversations" onClick={() => { setSelectedId(null); setDraft(''); }}><ArrowLeft size={20} /></button><span className="nc-chat-avatar"><img src={selected.person.photo} alt="" /><i /></span><span><strong>{selected.person.name}</strong><small><i /> Online now · Fictional demo profile</small></span><div className="nc-chat-person-actions"><button aria-label="Start video call" onClick={() => navigate(`/calls`)}><Video size={20} /></button><button aria-label="Start audio call" onClick={() => navigate(`/calls`)}><Phone size={20} /></button><button aria-label="More conversation options"><MoreVertical size={20} /></button></div></header>
        <div className="nc-chat-messages"><div className="nc-chat-day"><span>Demo Chat — Fictional Conversation</span></div>{previewMessages.length ? previewMessages.map((message, index) => <div key={`${index}-${message.time}`} className={`nc-chat-message ${message.mine ? 'mine' : ''}`}>{!message.mine && <img src={selected.person.photo} alt="" />}<p>{message.text}<time>{message.time}{message.mine && <span>✓✓</span>}</time></p></div>) : <div className="nc-chat-empty">Say hello to {selected.person.name} to start a local demo conversation.</div>}<div className="nc-chat-local-note"><CircleHelp size={22} /><span>This is a demo conversation. Messages are stored locally and are not delivered to real users.</span></div></div>
        <form className="nc-chat-compose" onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; sendMessage(selected.person.id, draft.trim()); setDraft(''); }}><button type="button" aria-label="Add attachment"><Plus size={24} /></button><input value={draft} onChange={(event) => setDraft(event.currentTarget.value)} placeholder="Type a message..." aria-label="Type a message" /><button type="button" aria-label="Add emoji"><Smile size={20} /></button><button type="submit" aria-label="Send message" disabled={!draft.trim()}><Send size={20} /></button></form>
      </> : <div className="nc-chat-welcome"><span className="nc-chat-welcome-icon"><MessageCircle size={31} /></span><span className="eyebrow">A LITTLE HELLO GOES A LONG WAY</span><h2>Your next conversation starts with a connection.</h2><p>Explore people, find someone you’d like to know, and start a conversation when you’re ready.</p><Link to="/explore" className="btn primary"><Search size={16} /> Explore people</Link><div className="nc-chat-suggestions"><strong>People you might like</strong><div>{people.filter((person) => person.role !== profile.role).slice(0, 3).map((person) => <Link key={person.id} to={`/profile/${person.id}`}><img src={person.photo} alt="" /><span><b>{person.name}, {person.age}</b><small>{person.city} · Sample profile</small></span><ArrowRight size={15} /></Link>)}</div></div><small className="nc-chat-welcome-note">Your messages stay private in this local demo.</small></div>}</section>
    </div>
  </section>;
}

function ThreadPage() {
  const { id } = useParams(); const person = people.find((item) => item.id === Number(id)) ?? people[0];
  const { messages, sendMessage, profile } = useDemoStore(); const [text, setText] = useState(''); const navigate = useNavigate();
  const thread = messages.filter((message) => message.personId === person.id);
  return <section className="page thread-page"><button className="link" onClick={() => navigate('/chats')}><ArrowLeft size={16} /> All chats</button><header className="thread-header"><img src={person.photo} alt="" /><span><strong>{person.name}</strong><small>Fictional demo profile · messages stay local</small></span>{profile.role === 'boy' && <CallButton person={person} />}</header><div className="thread-history" aria-live="polite">{thread.length ? thread.map((message) => <p key={message.id} className={`chat-bubble ${message.mine ? 'mine' : ''}`}>{message.text}<small>Local demo</small></p>) : <Empty title="Say hello" text={`Send a message to ${person.name}. A sample reply appears locally.`} />}</div><form className="message-compose" onSubmit={(event) => { event.preventDefault(); if (!text.trim()) return; sendMessage(person.id, text); setText(''); }}><input aria-label="Message" value={text} onChange={(event) => setText(event.target.value)} maxLength={1000} placeholder="Write a message" /><button className="btn primary" type="submit" disabled={!text.trim()} aria-label="Send message"><ArrowRight size={17} /></button></form><p className="muted-line">Messages are fictional and never sent to another account.</p></section>;
}

function formatCallTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  const time = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return `Today, ${time}`;
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${time}`;
}

function callModeFor(call: CallRecord): 'video' | 'audio' {
  return call.mode ?? (call.id === 'sample-call-2' ? 'audio' : 'video');
}

function formatTalkTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
}

function CallsPage() {
  const { profile, calls, removeCall } = useDemoStore();
  const [filter, setFilter] = useState<'all' | 'missed'>('all');
  const [period, setPeriod] = useState<'7' | '30' | 'all'>('7');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<CallRecord | null>(null);
  const now = Date.now();
  const rangeStart = period === 'all' ? 0 : now - Number(period) * 24 * 60 * 60 * 1000;
  const periodCalls = calls.filter((call) => new Date(call.createdAt).getTime() >= rangeStart);
  const missedCount = periodCalls.filter((call) => call.status === 'missed').length;
  const videoCalls = periodCalls.filter((call) => callModeFor(call) === 'video').length;
  const audioCalls = periodCalls.filter((call) => callModeFor(call) === 'audio').length;
  const talkSeconds = periodCalls.filter((call) => call.status === 'completed').reduce((total, call) => total + call.durationSeconds, 0);
  const visibleCalls = [...periodCalls]
    .filter((call) => filter !== 'missed' || call.status === 'missed')
    .filter((call) => (people.find((person) => person.id === call.personId)?.name ?? '').toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => sort === 'newest' ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt));

  return <section className="page nc-calls-page">
    <header className="nc-call-activity-hero">
      <div className="nc-call-activity-copy"><span className="nc-call-activity-eyebrow">CALL ACTIVITY</span><h1>Calls</h1><p>Your call history, missed calls, and call activity in one place.</p></div>
      <div className="nc-call-hero-art" aria-hidden="true"><span className="nc-call-art-heart nc-call-art-heart-one"><Heart size={23} fill="currentColor" /></span><span className="nc-call-art-video"><Video size={58} strokeWidth={1.6} /></span><span className="nc-call-art-phone"><Phone size={27} /></span><span className="nc-call-art-heart nc-call-art-heart-two"><Heart size={18} fill="currentColor" /></span></div>
    </header>

    <section className="nc-call-overview" aria-labelledby="nc-call-overview-title">
      <div className="nc-call-overview-lead"><h2 id="nc-call-overview-title">Call Overview</h2><label className="nc-call-period-select"><CalendarDays size={15} /><select value={period} onChange={(event) => setPeriod(event.target.value as '7' | '30' | 'all')} aria-label="Call history date range"><option value="7">Last 7 Days</option><option value="30">Last 30 Days</option><option value="all">All Time</option></select><ChevronDown size={15} /></label></div>
      <div className="nc-call-stat-grid">
        <article className="nc-call-stat nc-call-stat-video"><span className="nc-call-stat-icon"><Video size={24} /></span><div><strong>{videoCalls}</strong><span>Video Calls</span></div></article>
        <article className="nc-call-stat nc-call-stat-audio"><span className="nc-call-stat-icon"><Phone size={23} /></span><div><strong>{audioCalls}</strong><span>Audio Calls</span></div></article>
        <article className="nc-call-stat nc-call-stat-time"><span className="nc-call-stat-icon"><Clock3 size={24} /></span><div><strong>{formatTalkTime(talkSeconds)}</strong><span>Total Talk Time</span></div></article>
        <article className="nc-call-stat nc-call-stat-rating"><span className="nc-call-stat-icon"><Star size={24} /></span><div><strong>4.8</strong><span>Avg. Rating</span></div></article>
      </div>
    </section>

    <div className="nc-call-activity-toolbar">
      <div className="nc-call-activity-tabs" role="group" aria-label="Filter call activity">
        <button type="button" className={filter === 'all' ? 'active' : ''} aria-pressed={filter === 'all'} onClick={() => setFilter('all')}><Layers3 size={18} />All Activity <span>({periodCalls.length})</span></button>
        <button type="button" className={filter === 'missed' ? 'active' : ''} aria-pressed={filter === 'missed'} onClick={() => setFilter('missed')}><Phone size={17} />Missed Calls <span>({missedCount})</span></button>
      </div>
      <div className="nc-call-activity-tools"><label className="nc-call-search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name..." aria-label="Search calls by name" /></label><label className="nc-call-sort"><ArrowUpDown size={17} /><select value={sort} onChange={(event) => setSort(event.target.value as 'newest' | 'oldest')} aria-label="Sort call history"><option value="newest">Newest First</option><option value="oldest">Oldest First</option></select><ChevronDown size={16} /></label></div>
    </div>

    {visibleCalls.length ? <div className="nc-call-activity-list" aria-label="Call history">{visibleCalls.map((call) => {
      const person = people.find((item) => item.id === call.personId);
      if (!person) return null;
      const mode = callModeFor(call);
      const ModeIcon = mode === 'video' ? Video : Phone;
      return <article className="nc-call-activity-row" key={call.id}>
        <button type="button" className="nc-call-activity-person" onClick={() => setSelected(call)} aria-label={`View ${mode} call with ${person.name}`}><span className="nc-call-activity-avatar"><img src={person.photo} alt="" /><i aria-hidden="true" /></span><span className="nc-call-activity-person-copy"><strong>{person.name}</strong><time>{formatCallTimestamp(call.createdAt)}</time></span></button>
        <span className="nc-call-activity-divider" aria-hidden="true" />
        <div className="nc-call-activity-type"><ModeIcon size={25} /><div><strong>{mode === 'video' ? 'Video Call' : 'Audio Call'}</strong><span>Duration: {Math.floor(call.durationSeconds / 60)} min <i>·</i> {call.coinsSpent} coins</span></div></div>
        <span className={`nc-call-activity-status ${call.status}`}><i aria-hidden="true" />{call.status === 'missed' ? 'Missed' : 'Completed'}</span>
        <div className="nc-call-activity-actions"><Link className="nc-call-chat-action" to={`/chats/${person.id}`} aria-label={`Chat with ${person.name}`} title={`Chat with ${person.name}`}><MessageCircle size={20} /></Link>{profile.role === 'boy' && <span className="nc-call-retry"><CallButton person={person} mode={mode} label="Call Again" /></span>}<button type="button" className="nc-call-delete-action" aria-label={`Delete call with ${person.name}`} onClick={() => removeCall(call.id)}><Trash2 size={19} /></button></div>
      </article>;
    })}</div> : <div className="nc-call-activity-empty"><span><Phone size={25} /></span><strong>{filter === 'missed' ? 'No missed calls here' : 'No calls found'}</strong><p>{query ? 'Try another name or clear your search.' : 'Your call activity for this time period will appear here.'}</p></div>}
    <p className="nc-call-activity-note">Fictional demo call history · No live calls or payments are connected.</p>
    {selected && <ModalPortal onClick={() => setSelected(null)}><section className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="call-detail-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" aria-label="Close call details" onClick={() => setSelected(null)}><X /></button><h2 id="call-detail-title">{callModeFor(selected) === 'video' ? 'Video' : 'Audio'} call with {people.find((person) => person.id === selected.personId)?.name}</h2><p>{selected.status === 'missed' ? 'Missed sample call' : `Duration ${Math.floor(selected.durationSeconds / 60)}m ${selected.durationSeconds % 60}s · ${selected.coinsSpent} demo coins`}</p><p className="call-disclaimer">Fictional local call history only. No call was connected and coins have no cash value.</p><button className="btn outline" onClick={() => { removeCall(selected.id); setSelected(null); }}>Remove from history</button></section></ModalPortal>}
  </section>;
}

function LoungePage() {
  const { profile } = useDemoStore(); const members = people.filter((person) => person.role !== profile.role);
  return <section className="page lounge-page"><SectionTitle eyebrow="MEET AT YOUR PACE" title="Video lounge" description="Browse fictional profiles. Camera and microphone are not connected in this demo." /><div className="privacy-box"><Video size={18} /> No remote callers or live broadcast exist. Call previews are local illustrations only.</div><div className="profile-grid">{members.map((person) => <div className="person-wrap" key={person.id}><PersonCard person={person} /><CallButton person={person} /></div>)}</div></section>;
}

function EarningsPage() {
  const { profile, rewardCoins, withdrawals, requestWithdrawal } = useDemoStore();
  const amount = Math.round(rewardCoins / 4 * 100) / 100;
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [range, setRange] = useState<'7d' | '30d' | 'month'>('7d');
  const pending = withdrawals.some((item) => item.status === 'Pending review');
  const chartSets = {
    '7d': { labels: ['8 Nov', '9 Nov', '10 Nov', '11 Nov', '12 Nov', '13 Nov', '14 Nov'], values: [1.1, 2.3, 1.6, 3.8, 2.9, 5.8, 3.6] },
    '30d': { labels: ['16 Oct', '21 Oct', '26 Oct', '31 Oct', '5 Nov', '9 Nov', '14 Nov'], values: [2.1, 3.2, 2.7, 4.4, 3.6, 5.1, 4.3] },
    month: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [2.8, 3.5, 4.2, 3.8, 5.3, 4.7, 5.8] },
  };
  const chart = chartSets[range];
  const recent = [...withdrawals].reverse().slice(0, 3);
  const formatRupees = (value: number) => `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return <section className="page nc-earnings-page">
    <header className="earnings-heading"><div><span className="nc-kicker">YOUR REWARDS</span><h1>Earnings</h1><p>Track your earnings, withdrawal balance, and performance.</p></div><div className="earnings-hero-art" aria-hidden="true"><span className="earnings-coin coin-one">★</span><span className="earnings-coin coin-two">★</span><span className="earnings-moneybag">★</span></div></header>
    <div className="earnings-dashboard">
      <div className="earnings-main-column">
        <div className="earnings-summary-grid">
          <section className="earnings-balance-card"><div className="earnings-card-title"><Wallet size={23} /><h2>Withdrawal Balance</h2></div><strong className="earnings-balance">{formatRupees(amount)}</strong><div className="earnings-coin-balance"><span>★</span>{rewardCoins.toLocaleString('en-IN')} coins <i /> 1 coin = ₹0.25</div><div className="earnings-balance-actions"><button className="earnings-primary-action" onClick={() => setFormOpen(!formOpen)}><ArrowRight size={17} /> Request Withdrawal</button><a className="earnings-secondary-action" href="#recent-withdrawals"><Clock3 size={17} /> Withdrawal History</a></div></section>
          <div className="earnings-stat-stack">{[['Today', '1.24K', '+12%'], ['This Week', '8.92K', '+28%'], ['This Month', '31.6K', '+46%']].map(([label, value, growth]) => <article className="earnings-stat-card" key={label}><span className="earnings-stat-icon"><CalendarDays size={18} /></span><div><small>{label}</small><strong>★ {value}</strong></div><b>↑ {growth}</b></article>)}</div>
        </div>
        <section className="earnings-chart-card"><div className="earnings-section-heading"><h2><ChartNoAxesColumn size={22} /> Earnings Overview</h2><div className="earnings-periods" role="group" aria-label="Chart period">{([['7d', 'Last 7 Days'], ['30d', 'Last 30 Days'], ['month', 'This Month']] as const).map(([key, label]) => <button type="button" key={key} className={range === key ? 'active' : ''} onClick={() => setRange(key)}>{label}</button>)}</div></div><div className="earnings-chart" role="img" aria-label={`${range === '7d' ? 'Last 7 days' : range === '30d' ? 'Last 30 days' : 'This month'} earnings in thousands of sample coins`}><div className="earnings-y-axis">{['6K', '5K', '4K', '3K', '2K', '1K', '0'].map((label) => <span key={label}>{label}</span>)}</div><div className="earnings-plot">{[6, 5, 4, 3, 2, 1, 0].map((line) => <i key={line} style={{ bottom: `${(line / 6) * 100}%` }} />)}<div className="earnings-bars">{chart.values.map((value, index) => <div className={`earnings-bar-column${index === 5 ? ' highlighted' : ''}`} key={`${chart.labels[index]}-${index}`}><span className="earnings-bar" style={{ height: `${(value / 6) * 100}%` }} /><small>{chart.labels[index]}</small></div>)}</div></div></div><p className="earnings-chart-caption">Sample coin activity · Coins are illustrative and have no cash value until eligible demo withdrawal.</p></section>
      </div>
      <aside className="earnings-side-column">
        <section className="earnings-quick-card"><div className="earnings-card-title"><Wallet size={23} /><h2>Quick Withdraw</h2></div><p>Transfer your earnings to your bank account.</p><button className="earnings-quick-button" onClick={() => setFormOpen(!formOpen)}>Request Withdrawal <ArrowRight size={18} /></button>{formOpen && <div className="earnings-inline-form"><h3>Request a sample withdrawal</h3><p>Fictional details only. No money will be transferred.</p><form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); const requested = Number(data.get('amount')); const problem = withdrawalEligibility(profile.age, amount, pending); if (problem) return setFormError(problem); if (!Number.isFinite(requested) || requested < 500 || requested > amount || Math.round(requested * 4) !== requested * 4) return setFormError('Enter an amount from ₹500 to your available balance, in ₹0.25 increments.'); requestWithdrawal({ id: crypto.randomUUID(), amount: requested, method: data.get('method') as 'UPI' | 'Bank transfer', status: 'Pending review', createdAt: new Date().toISOString() }); setFormOpen(false); setFormError(''); notify('Sample withdrawal request saved locally. No transfer was sent.'); }}><label>Amount in rupees<input name="amount" type="number" min="500" max={amount} step="0.25" required placeholder="500.00" /></label><label>Sample method<select name="method"><option>UPI</option><option>Bank transfer</option></select></label><label className="earnings-consent"><input type="checkbox" required /> I understand this is fictional and no money will be sent.</label>{formError && <p className="form-error" role="alert">{formError}</p>}<button type="submit">Submit sample request</button></form></div>}</section>
        <section className="earnings-eligibility-card"><div className="earnings-section-heading"><h2><Shield size={20} /> Withdrawal Eligibility</h2><CircleHelp size={17} /></div><ul><li><Check size={17} /> Minimum balance: ₹500 <b className={amount >= 500 ? 'met' : 'unmet'}>{amount >= 500 ? 'Met' : 'Not met'}</b></li><li><Check size={17} /> Adult account <b className={profile.age >= 18 ? 'met' : 'unmet'}>{profile.age >= 18 ? 'Verified' : 'Not met'}</b></li><li><Check size={17} /> No pending request <b className={!pending ? 'met' : 'unmet'}>{pending ? 'Pending' : 'Ready'}</b></li></ul></section>
        <section className="earnings-recent-card" id="recent-withdrawals"><div className="earnings-section-heading"><h2><Clock3 size={20} /> Recent Withdrawals</h2><a href="#recent-withdrawals">View All</a></div>{recent.length ? <div className="earnings-recent-list">{recent.map((item) => <article key={item.id}><span className="earnings-bank-icon"><Landmark size={18} /></span><span><strong>{formatRupees(item.amount)}</strong><small>{new Date(item.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</small></span><b className={item.status === 'Pending review' ? 'pending' : 'completed'}>{item.status === 'Pending review' ? 'Pending' : item.status}</b></article>)}</div> : <div className="earnings-no-withdrawals"><span><Clock3 size={18} /></span><strong>No withdrawals yet</strong><small>Your withdrawal requests will appear here.</small></div>}</section>
      </aside>
    </div>
    <p className="nc-earn-demo-note">All figures are fictional samples. No real cash earnings, withdrawals, payments, or transfers are processed.</p>
  </section>;
}

function WalletPage() {
  const { walletCoins, addCoins } = useDemoStore(); const [selected, setSelected] = useState<(typeof coinPacks)[number] | null>(null);
  return <section className="page"><SectionTitle eyebrow="CALLING BALANCE" title="Coin wallet" description="Calling coins are fictional. No payment is processed." action={<span className="nc-sample-badge">DEMO ONLY</span>} /><div className="wallet-balance"><span><Coins size={22} /> Your sample balance</span><strong>{walletCoins.toLocaleString('en-IN')} <small>coins</small></strong><p>Purchased demo coins are for calls only. They cannot be withdrawn.</p></div><div className="nc-wallet-grid">{coinPacks.map((pack) => <article className={`nc-wallet-pack ${pack.id === 'popular' ? 'popular' : ''}`} key={pack.id}><span className="nc-pack-badge">{pack.label.toUpperCase()}</span><h2>🪙 {pack.coins.toLocaleString('en-IN')} coins</h2><p>Displayed price: ₹{pack.price}</p><button className="btn primary" onClick={() => setSelected(pack)}>Add sample coins</button><small>No checkout or payment is connected.</small></article>)}</div><p className="privacy-box">Adding coins changes only your local demo balance. No card, UPI, money, or external checkout is involved.</p>{selected && <ModalPortal onClick={() => setSelected(null)}><section className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="coin-title" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close"><X /></button><h2 id="coin-title">Confirm sample coin pack</h2><p>{selected.coins} fictional coins · displayed price ₹{selected.price}. No payment will be taken.</p><button className="btn primary" onClick={() => { addCoins(selected.coins); setSelected(null); notify(`${selected.coins} sample coins added to your local balance.`); }}>Add demo coins</button><button className="btn outline" onClick={() => setSelected(null)}>Cancel</button></section></ModalPortal>}</section>;
}

function MembershipPage() {
  const { membership, setMembership } = useDemoStore();
  const plans = [
    { id: 'Starter' as const, price: 'FREE', desc: 'Explore your spark', perks: ['Browse sample profiles', 'Send sample messages', 'Demo video lounge'] },
    { id: 'Plus' as const, price: 'PREVIEW', desc: 'A little more connection', perks: ['Everything in Starter', 'Priority profile visibility UI', 'Extra discovery filters UI'] },
    { id: 'Unlimited' as const, price: 'PREVIEW', desc: 'The full LUVZY experience', perks: ['Everything in Plus', 'Enhanced privacy options UI', 'Unlimited demo discovery'] },
  ];
  return <section className="page"><SectionTitle eyebrow="MEMBERSHIP" title="Make more meaningful connections" description="All plans are visual previews. No payment or purchase is processed." /><div className="plan-grid" style={{ marginTop: 22 }}>{plans.map((plan) => <article className={`plan-card ${membership === plan.id ? 'selected' : plan.id === 'Plus' ? 'recommended' : ''}`} key={plan.id}><span className="pill">{plan.id === 'Plus' ? 'MOST POPULAR' : plan.id === 'Unlimited' ? 'COMPLETE EXPERIENCE' : 'GET STARTED'}</span><h2>{plan.id}</h2><p className="muted-line">{plan.desc}</p><div className="plan-price">{plan.price}</div><ul>{plan.perks.map((perk) => <li key={perk}>{perk}</li>)}</ul><button className={`btn ${membership === plan.id ? 'outline' : 'primary'}`} aria-pressed={membership === plan.id} onClick={() => { setMembership(plan.id); notify(`${plan.id} membership preview selected. No payment was processed.`); }}>{membership === plan.id ? 'Selected' : `Preview ${plan.id}`}</button></article>)}</div><div className="privacy-box"><Shield size={16} /><span>Demonstration states only. No billed subscription or real account benefits are connected.</span></div></section>;
}

function NotificationsPage() {
  const [items, setItems] = useState<InboxNotification[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setBusy(true); setError('');
    try { const result = await customerApi.inbox(); setItems(result.data); window.dispatchEvent(new Event('luvzy:inbox-updated')); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Sign in to view notifications.'); }
    finally { setBusy(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  async function markAllRead() { try { await customerApi.readAll(); await refresh(); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not update notifications.'); } }
  async function markRead(id: number) { try { await customerApi.read(id); setItems((current) => current.map((item) => item.id === id ? { ...item, read_at: new Date().toISOString() } : item)); window.dispatchEvent(new Event('luvzy:inbox-updated')); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not update notification.'); } }
  return <section className="page"><SectionTitle eyebrow="IN THE LOOP" title="Notifications" description="Updates sent to your LUVZY in-app inbox." action={items.some((item) => !item.read_at) ? <button className="btn outline" onClick={() => void markAllRead()}>Mark all read</button> : undefined} />{error && <div role="alert" className="privacy-box"><Shield size={16} /><span>{error} <Link to="/login">Sign in</Link></span></div>}{busy ? <p className="muted-line">Loading your inbox…</p> : items.length ? <div className="notice-list">{items.map((item) => <button key={item.id} className={`notice ${!item.read_at ? 'unread' : ''}`} onClick={() => !item.read_at && void markRead(item.id)}><span className="notice-icon"><Bell size={18} /></span><span><h3>{item.title}</h3><p>{item.message}</p><small>{new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.created_at))}</small></span>{!item.read_at && <i className="status-dot online" />}</button>)}</div> : !error && <div className="privacy-box"><Bell size={16} /><span>Your in-app inbox is empty.</span></div>}</section>;
}

function ProfilePage() {
  const { profile, membership, likes, signOut, reset } = useDemoStore(); const navigate = useNavigate();
  async function handleSignOut() {
    try {
      await customerApi.logout();
      signOut();
      navigate('/');
    } catch (cause) {
      notify(cause instanceof Error ? cause.message : 'Could not close your account session. Please try again.');
    }
  }
  return <section className="page"><SectionTitle eyebrow="YOUR OWN SPACE" title="My profile" description="Your account and notification inbox are server-managed; demo activity stays local." /><div className="premium-banner"><div className="profile-summary"><span className="avatar-top large">{profile.photo ? <img src={profile.photo} alt="" /> : profile.name[0]}</span><div><h2>{profile.name}</h2><p>{profile.age} years · {profile.city} · {profile.role} profile · {membership} preview</p></div></div><Link className="btn outline" to="/edit">Edit profile</Link></div><div className="settings-layout"><div className="settings-panel"><h2>About me</h2><p>{profile.bio}</p><div className="chips">{profile.interests.map((item) => <span className="chip" key={item}>{item}</span>)}</div><div className="separator" /><h2>My connections</h2><div className="grid-2"><Link className="setting-row" to="/likes"><span><strong>{likes.length} Likes</strong><small>Profiles you’ve saved</small></span><ArrowRight /></Link><Link className="setting-row" to="/matches"><span><strong>{likes.length} Matches</strong><small>Sample connections</small></span><ArrowRight /></Link></div></div><div className="settings-panel"><h2>Account & preferences</h2>{[['/edit', 'Edit profile', 'Update your introduction'], ['/settings', 'Settings', 'Discovery and notifications'], ['/wallet', 'Buy coins', 'Purchase calling coins (demo)'], ['/premium', 'Membership preview', 'Visual plan selection · no payments'], ['/notifications', 'Notifications', 'Your latest updates'], ['/safety', 'Safety center', 'Block and report tools'], ['/help', 'Help & FAQ', 'Answers about this demo']].map(([path, title, subtitle]) => <Link key={path} className="setting-row" to={path}><span><strong>{title}</strong><small>{subtitle}</small></span><ArrowRight size={17} /></Link>)}<button className="setting-row" onClick={() => void handleSignOut()}><span><strong>Sign out</strong><small>Return to welcome screen</small></span><LogOut size={17} /></button><button className="setting-row danger" onClick={() => { if (window.confirm('Clear all locally saved LUVZY demo activity?')) { reset(); navigate('/'); } }}><span><strong>Delete local demo account</strong><small>Clear all browser-stored demo activity</small></span><X size={17} /></button></div></div></section>;
}

function EditPage() {
  const { profile, updateProfile, setRole } = useDemoStore(); const [selected, setSelected] = useState(profile.interests); const navigate = useNavigate(); const [error, setError] = useState('');
  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const data = new FormData(event.currentTarget); const name = String(data.get('name') ?? '').trim(); const age = Number(data.get('age')); const city = String(data.get('city') ?? '').trim(); const role = String(data.get('role')) as Role;
    if (name.length < 2 || age < 18 || age > 99 || !city) return setError('Complete the name, adult age and city fields.');
    if (selected.length < 2) return setError('Select at least two interests.');
    const next = { ...profile, name, age, city, role, bio: String(data.get('bio') ?? '').trim(), interests: selected };
    updateProfile(next); setRole(role); navigate('/profile'); notify('Demo profile saved.');
  }
  return <section className="page"><SectionTitle eyebrow="YOUR PROFILE" title="Edit profile" description="Updates are saved in this browser only." /><form className="settings-panel edit-form" onSubmit={save}><div className="form-stack"><Field label="Full name"><input name="name" defaultValue={profile.name} maxLength={45} required /></Field><div className="grid-2"><Field label="Age"><input name="age" type="number" min="18" max="99" defaultValue={profile.age} required /></Field><Field label="City"><input name="city" defaultValue={profile.city} maxLength={60} required /></Field></div><Field label="Profile type"><select name="role" defaultValue={profile.role}><option value="boy">Boy</option><option value="girl">Girl</option></select></Field><Field label="A short introduction"><textarea name="bio" defaultValue={profile.bio} maxLength={230} /></Field><Field label="Interests (at least two)"><div className="interest-picker">{interests.map((item) => <button type="button" key={item} className={selected.includes(item) ? 'selected' : ''} aria-pressed={selected.includes(item)} onClick={() => setSelected((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item])}>{item}</button>)}</div></Field></div>{error && <p className="form-error" role="alert">{error}</p>}<div className="profile-detail-actions"><button className="btn primary" type="submit">Save profile</button><Link className="btn outline" to="/profile">Cancel</Link></div></form></section>;
}

function SettingsPage() {
  const state = useDemoStore();
  const toggles = [['discoverable', 'Visible in discovery', 'Demo-only profile visibility setting'], ['online', 'Show online status', 'Display an online indicator'], ['quietMode', 'Quiet mode', 'Reduce demo notifications'], ['notificationsEnabled', 'Push notifications', 'Preview toggle; no push service connected']] as const;
  const [inAppEnabled, setInAppEnabled] = useState(false);
  useEffect(() => { void customerApi.me().then(({ user }) => setInAppEnabled(user.notifications_enabled)).catch(() => undefined); }, []);
  async function toggleInApp() { const next = !inAppEnabled; setInAppEnabled(next); try { await customerApi.preference(next); } catch { setInAppEnabled(!next); notify('Sign in again to update notification preferences.'); } }
  return <section className="page"><SectionTitle eyebrow="PREFERENCES" title="Settings" description="Control your demo profile and privacy." /><div className="settings-layout"><div className="settings-panel"><h2>Privacy and discovery</h2>{toggles.slice(0, 3).map(([key, heading, subtitle]) => <button className="setting-row" key={key} aria-pressed={state[key]} onClick={() => state.setPreference(key, !state[key])}><span><strong>{heading}</strong><small>{subtitle}</small></span><span className={`toggle ${state[key] ? 'on' : ''}`} /></button>)}<Link className="setting-row" to="/safety"><span><strong>Blocked profiles</strong><small>{state.blocked.length} profiles hidden</small></span><ArrowRight size={17} /></Link><Link className="setting-row" to="/privacy-policy"><span><strong>Privacy policy</strong><small>Read how LUVZY handles personal information</small></span><ArrowRight size={17} /></Link></div><div className="settings-panel"><h2>Account</h2><button className="setting-row" aria-pressed={inAppEnabled} onClick={() => void toggleInApp()}><span><strong>In-app notifications</strong><small>Receive messages in your LUVZY inbox</small></span><span className={`toggle ${inAppEnabled ? 'on' : ''}`} /></button><Link className="setting-row" to="/help"><span><strong>Help center</strong><small>FAQs and support information</small></span><ArrowRight size={17} /></Link><Link className="setting-row" to="/wallet"><span><strong>Buy coins</strong><small>Calling wallet · demo only</small></span><ArrowRight size={17} /></Link><Link className="setting-row" to="/profile"><span><strong>My profile</strong></span><ArrowRight size={17} /></Link></div></div></section>;
}

function SafetyPage() {
  const { blocked, unblockPerson, reports } = useDemoStore();
  return <section className="page"><SectionTitle eyebrow="YOUR SAFETY" title="Safety center" description="Private, respectful connections start with control." /><div className="safety-list"><SafetyCard icon={<Shield />} title="Consent before calling" text="This preview never connects your camera or microphone to another person." /><SafetyCard icon={<Heart />} title="Connect on your terms" text="Block fictional profiles at any point. They disappear from browsing." /><SafetyCard icon={<MessageCircle />} title="Report inappropriate behaviour" text="Reports in this prototype are only local UI demonstrations." /><SafetyCard icon={<Check />} title="Keep sensitive details private" text="Never share passwords, account numbers, or sensitive identifiers in a chat." /></div><div className="settings-panel"><h2>Blocked demo profiles</h2>{blocked.length ? blocked.map((id) => { const person = people.find((item) => item.id === id); return person && <div className="blocked-row" key={id}><strong>{person.name}</strong><button className="btn outline" onClick={() => unblockPerson(id)}>Unblock</button></div>; }) : <p className="muted-line">You haven’t blocked any profiles.</p>}</div><div className="settings-panel"><h2>Local report history</h2>{reports.length ? reports.map((report) => { const person = people.find((item) => item.id === report.personId); return <p className="muted-line" key={report.id}>{person?.name ?? 'Sample profile'} · {report.reason} · Saved locally</p>; }) : <p className="muted-line">No sample reports filed.</p>}</div></section>;
}

function SafetyCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <article className="safety-tile-v2">{icon}<h3>{title}</h3><p>{text}</p></article>;
}

function HelpPage() {
  const { faqOpen, setFaqOpen } = useDemoStore();
  const faqs = [
    ['Can I read Help without signing in?', 'Yes. Help & FAQ is a public page. You do not need an account or login to read it.'],
    ['Is LUVZY a real dating service?', 'No. This is a frontend concept with fictional sample profiles and local demo interactions.'],
    ['Can I send messages to another user?', 'No. Chat messages are saved in this browser only. Nothing is transmitted to real people.'],
    ['Does video calling connect two people?', 'No. Call controls open a local preview. No WebRTC or backend service is connected.'],
    ['Are memberships or coins paid?', 'No. Coin packs are interactive previews. No payment details are collected and no money is charged.'],
    ['How do I manage privacy?', 'Use Settings to change demo visibility, or Safety Center to block a sample profile.'],
    ['Can I remove my data?', 'Yes. Use Settings > Delete local demo account to clear locally saved activity.'],
  ];
  return <section className="page"><SectionTitle eyebrow="WE ARE HERE TO HELP" title="Help & FAQ" description="Answers to common questions about this concept." /><div className="settings-panel faq-panel">{faqs.map(([question, answer], index) => <button className="setting-row faq-row" key={question} aria-expanded={faqOpen === index} onClick={() => setFaqOpen(faqOpen === index ? null : index)}><span><strong>{question}</strong>{faqOpen === index && <small>{answer}</small>}</span>{faqOpen === index ? <X size={16} /> : <ChevronDown size={16} />}</button>)}</div><div className="privacy-box"><CircleHelp size={17} /> No live support service is connected.</div></section>;
}

function Empty({ title, text, action }: { title: string; text: string; action?: React.ReactNode }) {
  return <div className="empty-state"><Heart size={26} /><h3>{title}</h3><p>{text}</p>{action}</div>;
}

export default App;
