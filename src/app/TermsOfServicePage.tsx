import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import content from './terms-of-service-content.json';
import './terms-of-service.css';

export default function TermsOfServicePage() {
  const [activeId, setActiveId] = useState(content.sections[0]?.id ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const sections = [...document.querySelectorAll<HTMLElement>('.luvzy-terms .terms-card[id]')];
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      }
    }, { rootMargin: '-18% 0px -70% 0px' });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return <div className="luvzy-terms">
    <a className="terms-skip-link" href="#terms-main">Skip to terms</a>
    <div className="terms-draft-bar"><strong>Legal draft · not for publication.</strong> Confirm the operator, payment rules, user-protection systems and contact details.</div>

    <main id="terms-main">
      <div className="terms-container">
        <section className="terms-hero" id="top" aria-labelledby="terms-title">
          <div className="terms-hero-copy">
            <div className="terms-eyebrow"><span aria-hidden="true">✦</span> The rules behind real connections</div>
            <h1 id="terms-title">Respect first.<br /><span>Connections always.</span></h1>
            <p className="terms-lead">A better dating experience starts with<br className="terms-mobile-break" /> clarity and care. These terms explain how<br className="terms-mobile-break" /> LUVZY works, what you can expect, and<br className="terms-mobile-break" /> how we keep our community respectful.</p>
            <div className="terms-meta"><span>Terms of service</span><i aria-hidden="true" /><span>Updated: {content.lastUpdated}</span><i aria-hidden="true" /><span>Adults 18+ only</span></div>
          </div>
          <div className="terms-hero-mark" aria-hidden="true">
            <svg viewBox="0 0 80 80" fill="none"><path d="M24 12h23l13 13v39H24V12Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" /><path d="M47 13v14h13M32 39h20M32 48h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><circle cx="54" cy="56" r="11" fill="#9143d8" stroke="#d9a0ff" strokeWidth="2" /><path d="m49 56 3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </section>

        <section className="terms-principles" aria-label="LUVZY principles">
          <article className="terms-principle"><span aria-hidden="true">♡</span><div><h2>Be kind &amp; genuine</h2><p>Respect boundaries, consent, and the privacy of people you meet.</p></div></article>
          <article className="terms-principle"><span aria-hidden="true">✧</span><div><h2>Know what costs</h2><p>Understand coins, call charges, purchases, and any earnings rules.</p></div></article>
          <article className="terms-principle"><span aria-hidden="true">♧</span><div><h2>Stay in control</h2><p>Learn your choices for reports, blocking, account settings and deletion.</p></div></article>
        </section>

        <div className="terms-layout">
          <aside className="terms-toc" aria-label="On this page">
            <p>On this page</p>
            <nav aria-label="Terms sections">
              {content.sections.map((section) => <a key={section.id} href={`#${section.id}`} className={activeId === section.id ? 'active' : undefined} aria-current={activeId === section.id ? 'location' : undefined}>{section.title}</a>)}
              <a href="#questions">Questions about these terms?</a>
            </nav>
          </aside>

          <div className="terms-content">
            {content.sections.map((section, index) => <section className="terms-card" id={section.id} key={section.id} aria-labelledby={`terms-${section.id}`}>
              <span className="terms-section-label">Section {String(index + 1).padStart(2, '0')}</span>
              <h2 id={`terms-${section.id}`}>{section.title}</h2>
              {section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
              {section.bullets && <ul className="terms-bullets">{section.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}>{bullet}</li>)}</ul>}
              {section.table && <div className="terms-table-wrap" role="region" aria-label={`${section.title} table`} tabIndex={0}>
                <table>
                  <thead><tr>{section.table.headers.map((heading) => <th key={heading} scope="col">{heading}</th>)}</tr></thead>
                  <tbody>{section.table.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
                </table>
              </div>}
              {section.note && <aside className="terms-note"><span aria-hidden="true">✦</span>{section.note}</aside>}
            </section>)}

            <section className="terms-questions" id="questions" aria-labelledby="terms-questions-title">
              <div><p className="terms-section-label">Need a hand?</p><h2 id="terms-questions-title">Questions about these terms?</h2><p>Find answers and support options in our Help Center.</p></div>
              <Link to="/help">View help <span aria-hidden="true">↗</span></Link>
            </section>
          </div>
        </div>
      </div>
    </main>

  </div>;
}
