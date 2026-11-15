import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import content from './faq-content.json';
import './help-faq.css';

const iconMarkup: Record<string, ReactNode> = {
 search:<><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></>,
 'arrow-up-right':<path d="M7 17 17 7M8 7h9v9"/>,
 'arrow-right':<path d="M5 12h14m-6-6 6 6-6 6"/>,
 'chevron-down':<path d="m6 9 6 6 6-6"/>,
 plus:<path d="M12 5v14M5 12h14"/>,
 heart:<path d="M20.5 4.8a5.6 5.6 0 0 0-7.9 0L12 5.4l-.6-.6a5.6 5.6 0 0 0-7.9 7.9L12 21l8.5-8.3a5.6 5.6 0 0 0 0-7.9Z"/>,
 'shield-check':<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
 video:<><rect x="3" y="5" width="13" height="14" rx="3"/><path d="m16 10 5-3v10l-5-3"/></>,
 wallet:<><rect x="3" y="6" width="18" height="15" rx="3"/><path d="M3 10h18M16 15h1M7 6V4h11"/></>,
 'user-round':<><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
 'message-circle':<><path d="M20 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20l1.1-4.3A8.5 8.5 0 1 1 20 11.5Z"/><path d="M8 12h8"/></>,
 settings:<><circle cx="12" cy="12" r="3"/><path d="m18.5 6.5 1.5 1.5-1.1 2a8 8 0 0 1 0 4l1.1 2-2.1 2.1-2-1.1a8 8 0 0 1-4 0l-2 1.1L7.8 16l1.1-2a8 8 0 0 1 0-4l-1.1-2L10 5.9l2 1.1a8 8 0 0 1 4 0l2-1.1Z"/></>,
 'badge-indian-rupee':<><circle cx="12" cy="12" r="9"/><path d="M8 7h8m-8 3h8m-5 6 4 2M10 7c5 0 5 8 0 8"/></>,
 sparkles:<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>,
 'life-buoy':<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.5 3.5m5.8 5.8 3.5 3.5m-12.8 0 3.5-3.5m5.8-5.8 3.5-3.5"/></>,
 lock:<><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
 menu:<path d="M4 7h16M4 12h16M4 17h16"/>,
 x:<path d="M6 6l12 12M18 6 6 18"/>,
 'book-open':<path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1v14"/>,
 headphones:<path d="M3 13v-2a9 9 0 0 1 18 0v2M4 13h3v7H4Zm13 0h3v7h-3Z"/>,
};
const Icon=({name,className='icon'}:{name:string;className?:string})=><svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconMarkup[name]||iconMarkup.heart}</svg>;
const countFor=(category:string)=>content.faqs.filter(item=>item.category===category).length;
const quick=[{category:'account',name:'Account & login',desc:'Sign in, verification, and your settings',icon:'user-round'},{category:'video',name:'Video & Coins',desc:'Calls, balances, and how usage works',icon:'video'},{category:'safety',name:'Safety & privacy',desc:'Reporting, blocking, and staying in control',icon:'shield-check'},{category:'technical',name:'Troubleshooting',desc:'Get back to what matters, faster',icon:'life-buoy'}];
const popular=[{id:'faq-03',category:'account',text:'Not receiving an OTP?'},{id:'faq-19',category:'video',text:'Are video calls charged?'},{id:'faq-24',category:'coins',text:'Missing Coins after paying?'},{id:'faq-34',category:'safety',text:'How do I report someone?'}];

/**
 * Integration: use your established site routes and shared layout where possible.
 * onCreateSupportRequest(form) must be implemented against a secure Laravel API.
 * The component deliberately does NOT pretend a ticket was sent if this is missing.
 */
export default function LuvzyHelpFAQ(){
 const [category,setCategory]=useState('all'),[query,setQuery]=useState(''),[openItems,setOpenItems]=useState<string[]>([]),[showDialog,setShowDialog]=useState(false),[formStatus,setFormStatus]=useState('');
 const currentUserEmail='',sending=false;
 const faqRef=useRef<HTMLElement>(null), searchRef=useRef<HTMLInputElement>(null);
 const dialogRef=useRef<HTMLDivElement>(null), openerRef=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  if(!showDialog)return;
  const dialog=dialogRef.current;
  const opener=openerRef.current;
  const focusable=()=>dialog?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled])');
  focusable()?.[0]?.focus();
  const onKeyDown=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){setShowDialog(false);return;}
   if(event.key!=='Tab')return;
   const items=focusable();
   if(!items?.length)return;
   if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items[items.length-1].focus();}
   else if(!event.shiftKey&&document.activeElement===items[items.length-1]){event.preventDefault();items[0].focus();}
  };
  document.addEventListener('keydown',onKeyDown);
  return()=>{document.removeEventListener('keydown',onKeyDown);opener?.focus();};
 },[showDialog]);
 const filtered=useMemo(()=>content.faqs.filter(item=>(category==='all'||item.category===category)&&(`${item.question} ${item.answer}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))),[category,query]);
 const groups=content.categories.filter(group=>filtered.some(item=>item.category===group.id));
 const allExpanded=filtered.length>0&&filtered.every(item=>openItems.includes(item.id));
 function chooseCategory(id:string,clearSearch=false){setCategory(id);if(clearSearch)setQuery('');setOpenItems([]);faqRef.current?.scrollIntoView({behavior:'smooth',block:'start'});}
 function openPopular(item:{id:string;category:string}){setCategory(item.category);setQuery('');setOpenItems([item.id]);faqRef.current?.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>document.getElementById(item.id)?.scrollIntoView({behavior:'smooth',block:'center'}),50)}
 function toggleFaq(id:string){setOpenItems(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);}
 function submitTicket(e:FormEvent<HTMLFormElement>){e.preventDefault();setFormStatus('Preview only: no support request was sent. Support requests are not connected yet.');}
 return <div className="luvzy-help">
 <main id="top"><section className="hero"><div className="container hero-grid"><div className="hero-text"><span className="eyebrow"><Icon name="sparkles"/> THE LUVZY HELP CENTER</span><h1>Here for the <span className="gradient">little questions.</span><br/>And the big ones.</h1><p>Everything you need for smoother conversations, safer connections, and a better LUVZY experience — all in one place.</p><form className="help-search" role="search" onSubmit={e=>{e.preventDefault();faqRef.current?.scrollIntoView({behavior:'smooth',block:'start'})}}><label htmlFor="faq-search" className="sr-only">Search help articles</label><Icon name="search"/><input ref={searchRef} id="faq-search" value={query} type="search" onChange={e=>{setQuery(e.target.value);setCategory('all')}} autoComplete="off" placeholder="Search topics, questions, or keywords…"/><button type="submit">Search <Icon name="arrow-right"/></button></form><div className="search-hint"><span>Popular:</span>{popular.map(item=><button key={item.id} className="popular-chip" onClick={()=>openPopular(item)}>{item.text} <Icon name="arrow-up-right"/></button>)}</div></div><div className="hero-art" aria-hidden="true"><div className="orb orb-one"/><div className="orb orb-two"/><div className="art-star art-star-one">✦</div><div className="art-star art-star-two">✧</div><div className="art-card"><div className="art-card-head"><span className="art-round-icon"><Icon name="heart"/></span><div><strong>You're in good hands.</strong><small>Your LUVZY guide</small></div><span className="art-online"/></div><div className="art-bubble art-question">What if I need help?</div><div className="art-bubble art-answer">We’ve got answers for that <span>♡</span></div><div className="art-typing"><i/><i/><i/></div></div><div className="mini-ticket"><Icon name="shield-check"/> A safer space starts with clarity</div></div></div></section>
 <section className="quick-section"><div className="container"><div className="section-overline">START HERE</div><div className="quick-section-heading"><h2>What can we help you with?</h2><p>Jump into the topic that feels right.</p></div><div className="quick-grid">{quick.map(item=><button className="quick-card" key={item.category} onClick={()=>chooseCategory(item.category,true)}><span className="quick-icon"><Icon name={item.icon}/></span><span className="quick-card-copy"><strong>{item.name}</strong><small>{item.desc}</small></span><span className="quick-arrow"><Icon name="arrow-up-right"/></span></button>)}</div></div></section>
 <section className="help-section" id="faq" ref={faqRef}><div className="container"><div className="section-overline">FREQUENTLY ASKED QUESTIONS</div><div className="faq-heading"><div><h2>Answers, without the guesswork.</h2><p>Browse by topic or search for something specific.</p></div><div className="answer-total"><strong>{content.faqs.length}+</strong><span>helpful answers</span></div></div><div className="faq-layout"><aside className="faq-sidebar" aria-label="FAQ categories"><div className="sidebar-title">BROWSE TOPICS</div><button className={'category-button '+(category==='all'?'selected':'')} onClick={()=>chooseCategory('all')} aria-pressed={category==='all'}><Icon name="book-open"/><span>All questions</span><span className="cat-count">{content.faqs.length}</span></button>{content.categories.map(item=><button key={item.id} className={'category-button '+(category===item.id?'selected':'')} onClick={()=>chooseCategory(item.id)} aria-pressed={category===item.id}><Icon name={item.icon}/><span>{item.label}</span><span className="cat-count">{countFor(item.id)}</span></button>)}<div className="side-tip"><Icon name="lock"/><span>Never share your password, OTP or complete payment details with anyone.</span></div></aside><div className="faq-content"><div className="faq-tools"><div><span id="result-label" role="status" aria-live="polite">{filtered.length?`Showing ${filtered.length} ${filtered.length===1?'answer':'answers'}`:'No answers found'}</span><p id="category-subtitle">{query.trim()?`Results for “${query.trim()}”`:category==='all'?'Clear answers to your most common questions.':`Browsing ${content.categories.find(c=>c.id===category)?.label||'this topic'}.`}</p></div><button className="expand-button" disabled={!filtered.length} onClick={()=>setOpenItems(allExpanded?[]:filtered.map(x=>x.id))}>{allExpanded?'Collapse all':'Expand all'} <Icon name="chevron-down"/></button></div>{groups.map(group=><section className="faq-group" key={group.id} data-group={group.id} aria-labelledby={'group-'+group.id}><div className="faq-group-head"><span className="group-icon"><Icon name={group.icon}/></span><div><h3 id={'group-'+group.id}>{group.label}</h3><p>{group.description}</p></div></div><div className="faq-items">{filtered.filter(i=>i.category===group.id).map(item=><details className="faq-item" key={item.id} id={item.id} open={openItems.includes(item.id)} onToggle={e=>{if(e.currentTarget.open!==openItems.includes(item.id))toggleFaq(item.id)}}><summary><span className="faq-q">{item.question}</span><span className="faq-plus"><Icon name="plus"/></span></summary><div className="faq-answer"><p>{item.answer}</p>{item.answer.toLowerCase().includes('privacy policy')&&<a href="/privacy-policy">Read our Privacy Policy <Icon name="arrow-up-right"/></a>}{!item.answer.toLowerCase().includes('privacy policy')&&item.answer.includes('Terms of Service')&&<a href="/terms">View Terms of Service <Icon name="arrow-up-right"/></a>}</div></details>)}</div></section>)}{!filtered.length&&<div className="no-results"><Icon name="search"/><h3>We couldn't find a match</h3><p>Try a shorter search or browse all of our help topics.</p><button className="reset-button" onClick={()=>{setQuery('');setCategory('all');searchRef.current?.focus()}}>View all questions <Icon name="arrow-right"/></button></div>}</div></div></div></section>
 <section className="contact-section" id="contact-support"><div className="container"><div className="support-box"><div className="support-glow"/><div className="support-icon"><Icon name="headphones"/></div><div className="support-copy"><span>STILL NEED A HAND?</span><h2>Every good connection<br/>starts with a conversation.</h2><p>Didn't find your answer? Tell us what’s going on and prepare a support request. Our support form is a design preview until connected to your backend.</p><div className="support-actions"><button ref={openerRef} className="support-primary" onClick={()=>{setShowDialog(true);setFormStatus('')}}>Prepare a support request <Icon name="arrow-up-right"/></button><a className="support-secondary" href="/community-guidelines">Safety guidelines <Icon name="arrow-right"/></a></div></div></div></div></section>
 </main>
 {showDialog&&<div className="support-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setShowDialog(false)}}><div ref={dialogRef} className="support-dialog react-dialog" role="dialog" aria-modal="true" aria-labelledby="support-title"><div className="dialog-header"><div><span className="dialog-overline">LUVZY SUPPORT</span><h2 id="support-title">Tell us how we can help</h2><p>Please don't include passwords, OTPs or complete payment details.</p></div><button type="button" className="close-dialog" onClick={()=>setShowDialog(false)} aria-label="Close support request"><Icon name="x"/></button></div><form onSubmit={submitTicket}><div className="form-grid"><label>Your email address<input name="email" type="email" defaultValue={currentUserEmail} placeholder="you@example.com" autoComplete="email" maxLength={180} required/></label><label>Topic<select name="topic" defaultValue="" required><option value="">Choose a topic</option>{content.categories.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label></div><label>Subject<input name="subject" type="text" minLength={5} maxLength={140} placeholder="A short description of the issue" required/></label><label>How can we help?<textarea name="message" rows={5} minLength={15} maxLength={3000} placeholder="Tell us what happened and any steps you already tried…" required/></label><label className="optional-label">Transaction or call reference <small>(optional)</small><input type="text" name="reference" maxLength={120} placeholder="Order ID or call reference, if relevant"/></label><div className="form-notice" role="status" aria-live="polite">{formStatus||'Never share passwords, OTPs or full payment credentials.'}</div><div className="form-actions"><button type="button" className="cancel-button" onClick={()=>setShowDialog(false)}>Cancel</button><button type="submit" className="support-primary" disabled={sending}>{sending?'Sending…':'Send request'} <Icon name="arrow-right"/></button></div></form></div></div>}
 </div>
}

