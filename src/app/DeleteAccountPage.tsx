import { useId, useState, type FormEvent, type KeyboardEvent } from 'react';
import './delete-account.css';

/**
 * Standalone public account-deletion page.
 * This page is a design preview. It never sends deletion requests or persists form data.
 */
type Feedback = { type: 'error' | 'info'; message: string };

export default function DeleteAccountPage() {
  const accountSettingsPath = '/settings';
  const showPreviewBanner = true;
  const uid = useId().replaceAll(':', '');
  const [method, setMethod] = useState<'signed' | 'recovery'>('signed');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function chooseMethod(value: 'signed' | 'recovery') {
    setMethod(value);
    setFeedback(null);
  }

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>) {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []);
    const currentIndex = tabs.indexOf(event.currentTarget);
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (currentIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  }

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    const normalizedPhone = phone.replace(/[\s().-]/g, '');
    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      setFeedback({ type: 'error', message: 'Enter the phone number linked to your LUVZY account, including its country code.' });
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFeedback({ type: 'error', message: 'Please enter a valid contact email address or leave the optional field blank.' });
      return;
    }
    if (!acknowledged) {
      setFeedback({ type: 'error', message: 'Please confirm that you understand the deletion request before continuing.' });
      return;
    }
    setPhone('');
    setEmail('');
    setDetails('');
    setAcknowledged(false);
    setFeedback({ type: 'info', message: 'Design preview only. No deletion request was sent or stored. Visit Help & FAQ for general account information.' });
  }

  const faqItems = [
    { q: 'Is deleting my account the same as deactivating it?', a: 'No. Deactivation hides or restricts an account, while deletion is intended to remove the account and associated personal data, subject to applicable legal retention obligations.' },
    { q: "Can I delete my account if I can't sign in?", a: "This page is public, but its deletion form is a design preview and cannot accept requests yet. The real recovery process must verify account ownership before any deletion." },
    { q: 'Will my unused coins or pending withdrawals be refunded?', a: 'Do not assume that coins can be refunded or that withdrawals will be completed automatically. Please review the final Terms of Service and outstanding balances before requesting deletion.' },
    { q: 'What about messages I sent to other people?', a: 'LUVZY must handle data within its systems according to its deletion and retention policies. Content already received, saved or copied by another person may not be fully retractable.' },
    { q: "Can I get my account back after it's deleted?", a: 'Permanent deletion may be irreversible. Whether there is any cancellation window depends on the implemented deletion workflow; do not assume one is available.' },
  ];

  return (
    <div className="luvzy-delete">
      {showPreviewBanner && <div className="review-bar"><strong>Design preview only.</strong> Deletion requests cannot be sent until the Laravel endpoint and identity verification are connected.</div>}
      <main><div className="container">
        <div className="breadcrumb"><a href="/">Home</a><span>›</span><a href="/help">Support</a><span>›</span><strong>Delete account</strong></div>
        <section className="hero" aria-labelledby={`${uid}-title`}>
          <div><span className="eyebrow">✦ &nbsp; YOUR ACCOUNT. YOUR CHOICE.</span><h1 id={`${uid}-title`}>In control, <br /><span className="grad">every step.</span></h1>
            <p className="hero-lead">Thinking about leaving LUVZY? We’re here to make the process clear. Learn what account deletion means, what happens to your information, and how to request it securely.</p>
            <div className="hero-tags"><span className="hero-tag"><span>✓</span> Your privacy matters</span><span className="hero-tag"><span>✓</span> Identity checks planned</span><span className="hero-tag"><span>✓</span> Clear next steps</span></div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="art-ring"><svg viewBox="0 0 160 160" fill="none"><rect x="32" y="24" width="96" height="111" rx="23" fill="#995BC8" fillOpacity=".12" stroke="#E0B0FF" strokeWidth="4"/><path d="M57 61H102M57 83H90" stroke="#E1BCFA" strokeWidth="5" strokeLinecap="round"/><path d="M80 111L89 120L108 100" stroke="#F4BDE7" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/></svg></div><div className="mini-label one"><span className="dot"/> Privacy first</div><div className="mini-label two"><span className="dot"/> You're in control</div></div>
        </section>
        <section className="intro-strip" aria-label="Our approach">
          <div className="strip-item"><div className="strip-icon">♡</div><div><h3>Your decision</h3><p>A live deletion option can let you request account removal—not just deactivation.</p></div></div>
          <div className="strip-item"><div className="strip-icon">♢</div><div><h3>Identity protected</h3><p>A real process must verify account ownership before handling a request.</p></div></div>
          <div className="strip-item"><div className="strip-icon">✧</div><div><h3>Know what to expect</h3><p>Review possible effects on conversations, coins and records.</p></div></div>
        </section>
        <section className="steps-section" id="how-it-works"><span className="section-kicker">A SIMPLE, TRANSPARENT PROCESS</span><h2 className="section-title">How account deletion will work</h2><p className="section-lead">The steps below describe the planned process. Account deletion is not available through this design preview yet.</p>
          <div className="steps"><article className="step"><span className="step-index">01</span><h3>Review your options</h3><p>The settings link and recovery form below are previews; neither can submit a deletion request yet.</p></article><article className="step"><span className="step-index">02</span><h3>Verify it's you</h3><p>The future flow must confirm ownership using an approved authentication or recovery process. Never share your OTP with support.</p></article><article className="step"><span className="step-index">03</span><h3>Process deletion</h3><p>The final process must define which associated account data is removed and which records require lawful retention.</p></article></div>
        </section>
        <section className="form-section" id="request-form" aria-label="Account deletion request">
          <div className="form-shell"><div className="form-head"><span className="section-kicker">ACCOUNT DELETION PREVIEW</span><h2>Request account deletion</h2><p>Choose a preview path. This form does not send or store a deletion request. A real process will never need your password, OTP or payment information.</p></div>
            <div className="form-body">
              <div className="choice-tabs" role="tablist" aria-label="Choose how to request deletion">
                <button type="button" className="choice-tab" id={`${uid}-tab-signed`} role="tab" aria-selected={method === 'signed'} aria-controls={`${uid}-panel-signed`} tabIndex={method === 'signed' ? 0 : -1} onClick={() => chooseMethod('signed')} onKeyDown={navigateTabs}>I can sign in</button>
                <button type="button" className="choice-tab" id={`${uid}-tab-recovery`} role="tab" aria-selected={method === 'recovery'} aria-controls={`${uid}-panel-recovery`} tabIndex={method === 'recovery' ? 0 : -1} onClick={() => chooseMethod('recovery')} onKeyDown={navigateTabs}>I can't sign in</button>
              </div>
              <div className="panel signin-panel" role="tabpanel" id={`${uid}-panel-signed`} aria-labelledby={`${uid}-tab-signed`} hidden={method !== 'signed'}><h3>Account settings preview</h3><p>Account deletion is not available in settings yet. This link opens general account settings; it cannot start a deletion request.</p><a className="button-main" href={accountSettingsPath}>Open account settings <span aria-hidden="true">↗</span></a><div className="text-help"><span aria-hidden="true">ⓘ</span><span>Deletion is unavailable until secure identity checks and the real deletion process are connected.</span></div></div>
              <div className="panel" role="tabpanel" id={`${uid}-panel-recovery`} aria-labelledby={`${uid}-tab-recovery`} hidden={method !== 'recovery'}>
                <form onSubmit={submitRequest} noValidate>
                  <label className="field"><span className="field-label">Mobile number linked to LUVZY *</span><input type="tel" name="phone" autoComplete="tel" inputMode="tel" maxLength={25} required value={phone} onChange={event => setPhone(event.target.value)} placeholder="e.g. +91 98765 43210"/><span className="field-hint">Use your country code. If you no longer have access to this number, explain that below.</span></label>
                  <label className="field"><span className="field-label">Contact email (optional)</span><input type="email" name="email" autoComplete="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com"/><span className="field-hint">Only for request updates or a verified recovery process.</span></label>
                  <label className="field"><span className="field-label">Additional details (optional)</span><textarea name="details" maxLength={500} value={details} onChange={event => setDetails(event.target.value)} placeholder="e.g. I no longer have access to my registered phone number."/><span className="field-hint">Do not include passwords, OTPs, identity documents or sensitive chat content.</span></label>
                  <label className="checkbox-row"><input type="checkbox" required checked={acknowledged} onChange={event => setAcknowledged(event.target.checked)} /><span>I understand this preview does not submit a request. A real deletion process may be permanent and require identity verification. I have reviewed the <a href="/privacy-policy">Privacy Policy</a> and <a href="/terms">Terms of Service</a>.</span></label>
                  <div className="submit-row"><button className="button-main" type="submit">Preview request ↗</button><span className="sub-note">Preview only · No request submitted.</span></div>
                  {feedback && <div className={`feedback ${feedback.type}`} role="status" aria-live="polite">{feedback.message}</div>}
                </form>
              </div>
            </div>
          </div>
          <aside className="form-sidebar"><div className="side-card notice"><div className="notice-icon">!</div><h3>Before you continue</h3><p>Deletion can affect your access to LUVZY, your profile, chats, connections, stories, and available services.</p><p>Unspent coins, earnings and pending withdrawal requests need special treatment under the final Terms. Review outstanding balances before proceeding.</p></div><div className="side-card"><h3>Need another option?</h3><p>The recovery form is not connected yet. Visit Help &amp; FAQ for general account information; do not include passwords or OTPs.</p><p><a href="/help">Visit Help &amp; FAQ ↗</a></p><p>We will never ask for your login password or OTP through email or chat.</p></div></aside>
        </section>
        <section className="data-section" id="your-data"><span className="section-kicker">ABOUT YOUR INFORMATION</span><h2 className="section-title">What happens to your data?</h2><p className="section-lead">Deleting an account is different from signing out or temporarily hiding your profile. The specifics below must match LUVZY’s final backend behavior and published retention policy.</p><div className="data-grid"><article className="data-card"><div className="data-icon">♙</div><h3>Account and profile</h3><p>Your account, profile details, interests, and uploaded content are in scope for deletion, along with associated data held by LUVZY, subject to lawful exceptions.</p></article><article className="data-card"><div className="data-icon">♡</div><h3>Chats, calls and stories</h3><p>Associated messages, story media, and call-related records require a defined deletion process. Copies already held by other users may have different handling.</p></article><article className="data-card"><div className="data-icon">♧</div><h3>Payments and records</h3><p>Some transaction, fraud-prevention or legal records may need limited retention. Unused coins and pending withdrawals must follow the confirmed financial rules.</p></article></div><p className="data-caveat">No fixed deletion timeline or retention period is promised here. Publish actual timeframes and specific retained data categories after confirming your processes and legal obligations.</p></section>
        <section className="faq-section" id="faq"><div className="faq-grid"><div className="faq-intro"><span className="section-kicker">GOOD TO KNOW</span><h2 className="section-title">A few more answers.</h2><p>We want you to make an informed decision. For any question not covered here, our Help Centre is the right starting point.</p><a href="/help">Explore Help &amp; FAQ ↗</a></div><div className="faq-list">{faqItems.map((faq, index) => <details className="faq-item" key={index}><summary>{faq.q}</summary><p>{faq.a}</p></details>)}</div></div></section>
        <section className="help-cta"><div><span className="section-kicker">A PLACE TO START</span><h2>Have a question before you go?</h2><p>Visit Help &amp; FAQ for general information about your account, data, and balances.</p></div><a className="help-button" href="/help">Visit Help &amp; FAQ ↗</a></section>
      </div></main>
    </div>
  );
}
