import { useEffect, useState } from 'react';
import content from './privacy-policy-content.json';
import './privacy-policy.css';

type PolicySection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
  note?: string;
  reviewNote?: string;
};

const policySections = content.sections as PolicySection[];

export default function PrivacyPolicyPage() {
  const [activeId, setActiveId] = useState(policySections[0]?.id ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const sections = [...document.querySelectorAll<HTMLElement>('.luvzy-policy .policy-card[id]')];
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      }
    }, { rootMargin: '-18% 0px -70% 0px' });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return <div className="luvzy-policy">
    <div className="draft-bar"><strong>Draft for review.</strong> Confirm company details, vendors, retention and account deletion before publishing.</div>

    <main id="main">
    <div id="top" className="hero">
      <div className="container hero-inner">
        <div>
          <span className="eyebrow"><span className="star">✦</span> YOUR SPACE. YOUR PRIVACY.</span>
          <h1>Your privacy.<br /><span className="gradient">Always personal.</span></h1>
          <p className="lead">Your connections matter. So does your information. Here’s how LUVZY handles the details you share, the conversations you have, and the choices you make.</p>
          <div className="hero-meta">
            <span>Privacy policy</span><span className="meta-dot" aria-hidden="true" />
            <span>Last updated: {content.meta.lastUpdated}</span><span className="meta-dot" aria-hidden="true" />
            <span>18+ only</span>
          </div>
        </div>
        <div className="hero-mark" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none">
            <path d="M60 7 97 22v31c0 25-14 43-37 57C37 96 23 78 23 53V22L60 7Z" stroke="#D998FA" strokeWidth="3.5" />
            <path d="M60 80S38 66 38 49c0-15 17-19 22-7 7-12 23-8 23 7 0 17-23 31-23 31Z" fill="url(#privacy-gradient)" />
            <defs><linearGradient id="privacy-gradient" x1="34" y1="44" x2="88" y2="87"><stop stopColor="#AE75FF" /><stop offset="1" stopColor="#F077C9" /></linearGradient></defs>
          </svg>
        </div>
      </div>
    </div>

    <div className="container">
      <section className="glance" aria-label="Privacy principles">
        <article className="glance-card"><div className="glance-icon" aria-hidden="true">♧</div><h3>Know what you share</h3><p>Understand profile visibility and the information different features use.</p></article>
        <article className="glance-card"><div className="glance-icon" aria-hidden="true">♡</div><h3>Connect with confidence</h3><p>See how chats, stories, video introductions and safety reports are handled.</p></article>
        <article className="glance-card"><div className="glance-icon" aria-hidden="true">⚙</div><h3>Make your own choices</h3><p>Learn about permissions, data requests, account deletion and privacy controls.</p></article>
      </section>

      <div className="policy-layout">
        <aside className="toc" aria-label="Privacy policy contents">
          <h2>ON THIS PAGE</h2>
          <nav className="toc-links" aria-label="Policy sections">
            {policySections.map((section) => <a href={`#${section.id}`} key={section.id} className={activeId === section.id ? 'active' : undefined} aria-current={activeId === section.id ? 'location' : undefined}>{section.title}</a>)}
          </nav>
        </aside>

        <div className="policy-content">
          {policySections.map((section, index) => <section key={section.id} className="policy-card" id={section.id} aria-labelledby={`policy-title-${section.id}`}>
            <span className="section-label">Section {String(index + 1).padStart(2, '0')}</span>
            <h2 id={`policy-title-${section.id}`}>{section.title}</h2>
            {section.paragraphs?.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
            {section.bullets && section.bullets.length > 0 && <ul>{section.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}>{bullet}</li>)}</ul>}
            {section.table && <div className="table-wrap" role="region" aria-label={`${section.title} table`} tabIndex={0}>
              <table className="data-table">
                <thead><tr>{section.table.headers.map((heading) => <th key={heading} scope="col">{heading}</th>)}</tr></thead>
                <tbody>{section.table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
              </table>
            </div>}
            {section.note && <aside className="policy-note"><strong>Important:</strong> {section.note}</aside>}
            {section.reviewNote && <aside className="policy-note policy-review-note"><strong>Draft review:</strong> {section.reviewNote}</aside>}
          </section>)}

          <section className="contact-panel" id="privacy-contact-panel">
            <div><h2>Need help with your privacy?</h2><p>Get in touch with the verified LUVZY privacy contact after contact details have been configured for your launch.</p></div>
            <a className="primary-cta contact-cta" href="#contact">View contact details ↗</a>
          </section>
        </div>
      </div>
    </div>

    </main>
  </div>;
}
