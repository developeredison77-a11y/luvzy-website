import { useEffect, useRef, useState } from 'react';
import content from './community-guidelines-content.json';
import './community-guidelines.css';

/**
 * LUVZY Community Guidelines
 * Suggested public route: /community-guidelines
 * Draft policy. Verify in-app reporting/blocking, child safety, age gates, enforcement, contacts.
 * Existing application header/footer can replace the included public shell.
 */
export default function LuvzyCommunityGuidelines() {
  const [activeId, setActiveId] = useState(content.sections[0]?.id ?? '');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const sections = root.querySelectorAll('.policy-card[id]');
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      }
    }, { rootMargin: '-18% 0px -72% 0px' });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return <div className="luvzy-guidelines" ref={rootRef}>
    <div className="draft-bar"><strong>Publication draft — review required.</strong> Verify reporting, moderation, child safety response and support contacts before launch.</div>
    <main id="top">
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="eyebrow"><span className="star">✦</span> A SAFER SPACE STARTS WITH US</span>
            <h1>Connection is better<br /><span className="gradient">with respect.</span></h1>
            <p className="lead">Real people. Clear boundaries. Meaningful conversations. These guidelines explain the behavior we expect across LUVZY—from the first hello to every video call.</p>
            <div className="hero-meta"><span>Community Guidelines</span><span className="meta-dot"/><span>Updated: {content.lastUpdated}</span><span className="meta-dot"/><span>Adults 18+ only</span></div>
          </div>
          <div className="hero-mark" aria-hidden="true"><div className="shield-glass"><svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 9C62 19 75 21 87 23V48C87 68 73 82 50 92C27 82 13 68 13 48V23C25 21 38 19 50 9Z" fill="#8B3BCB" fillOpacity=".22" stroke="#E7B3FA" strokeWidth="4"/><path d="M31 50L44 63L70 36" stroke="#F4C5FC" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div>
        </div>
      </section>
      <div className="container">
        <section className="glance" aria-label="Community values">
          <div className="glance-card"><div className="glance-icon">♡</div><h3>Respect every boundary</h3><p>Consent is ongoing. Accept a no, a declined call or a block.</p></div>
          <div className="glance-card"><div className="glance-icon">✦</div><h3>Keep it real</h3><p>Show up as yourself. No scams, impersonation or manipulation.</p></div>
          <div className="glance-card"><div className="glance-icon">♧</div><h3>Look out for each other</h3><p>Protect privacy and report behavior that puts people at risk.</p></div>
        </section>
        <section className="standards-section" aria-labelledby="standards-title">
          <h2 id="standards-title" className="standards-title">A few things we live by.</h2>
          <p className="standards-kicker">Simple expectations that make meeting someone new feel better for everyone.</p>
          <div className="standards-grid">
            <div className="standard-card do"><h3 className="standard-heading"><span className="standard-icon">✓</span> Do more of this</h3><ul><li>Be honest, kind and considerate.</li><li>Ask, listen and respect consent.</li><li>Keep your account and others’ data secure.</li><li>Speak up when something feels unsafe.</li></ul></div>
            <div className="standard-card dont"><h3 className="standard-heading"><span className="standard-icon">×</span> Never do this</h3><ul><li>Harass, threaten, discriminate or stalk.</li><li>Share explicit or non-consensual content.</li><li>Exploit minors or facilitate their abuse.</li><li>Scam, extort, impersonate or bypass protections.</li></ul></div>
          </div>
        </section>
        <section className="critical-panel" aria-label="Child safety standards">
          <div className="critical-icon" aria-hidden="true">♢</div>
          <div><h2>Zero tolerance for child sexual abuse &amp; exploitation</h2><p>LUVZY explicitly prohibits CSAE, CSAM, grooming and any attempt to endanger a child. The service is strictly 18+.</p></div>
          <a className="critical-link" href="#child-safety">Read our standards ↗</a>
        </section>
        <div className="policy-layout">
          <aside className="toc" aria-label="Community Guidelines contents">
            <h2>EXPLORE THE GUIDELINES</h2>
            <p className="section-count">{content.sections.length} community standards</p>
            <nav className="toc-links" aria-label="Guidelines sections">
              {content.sections.map(s => <a key={s.id} href={`#${s.id}`} className={activeId===s.id?'active':undefined} aria-current={activeId===s.id?'location':undefined}>{s.title}</a>)}
            </nav>
          </aside>
          <div className="policy-content">
            {content.sections.map((s,i) => <section key={s.id} className="policy-card" id={s.id} aria-labelledby={`heading-${s.id}`}>
              <span className="section-label">Section {String(i+1).padStart(2,'0')} <span className="section-tag">{s.tag}</span></span>
              <h2 id={`heading-${s.id}`}>{s.title}</h2>
              <p>{s.intro}</p>
              <ul>{s.bullets.map((item,j) => <li key={j}>{item}</li>)}</ul>
              {s.callout && <aside className={`policy-note ${s.id==='child-safety'?'danger-note':''}`}><strong>Before publishing:</strong> {s.callout}</aside>}
            </section>)}
            <section className="contact-panel" id="reporting-help">
              <div><h2>Something doesn’t feel right?</h2><p>You don’t have to keep a conversation going. End the interaction, block or report when those controls are available, and contact support through the official Help Centre.</p>
                <div className="extra-actions"><a href="/help#contact-support">Get help ↗</a><a href="#report-and-block">How to report</a></div>
              </div>
            </section>
            <div className="report-steps" aria-label="Safety reporting steps">
              <div className="report-step"><span className="step-no">01</span><strong>Stop engaging</strong><p>Leave a chat or call that makes you uncomfortable.</p></div>
              <div className="report-step"><span className="step-no">02</span><strong>Report or block</strong><p>Use available in-app controls and the right category.</p></div>
              <div className="report-step"><span className="step-no">03</span><strong>Contact support</strong><p>Share a concise account of the issue without posting private evidence.</p></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>;
}
