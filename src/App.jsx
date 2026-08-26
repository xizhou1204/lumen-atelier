import { useEffect, useMemo, useState } from 'react'
import Lenis from 'lenis'
import {
  ArrowLeft, ArrowRight, Brush, Check, Clapperboard, Clock3, House,
  Mail, Menu, MonitorPlay, PenTool, Shapes, Sparkles, X,
} from 'lucide-react'
import { content, languageStorageKey, projectMeta, serviceMeta } from './content.js'

const serviceIcons = [PenTool, Shapes, Clapperboard, Brush, MonitorPlay]

function readRoute() {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (!parts.length || parts[0] === 'top') return { name: 'home' }
  if (parts[0] === 'services' && parts[1]) return { name: 'service', slug: parts[1] }
  if (parts[0] === 'work' && parts[1]) return { name: 'project', slug: parts[1] }
  if (['services', 'work', 'about', 'contact'].includes(parts[0])) return { name: parts[0] }
  return { name: 'not-found' }
}

function readLanguage() {
  const query = new URLSearchParams(window.location.search).get('lang')
  if (query === 'zh' || query === 'en') return query
  try { return window.localStorage.getItem(languageStorageKey) === 'zh' ? 'zh' : 'en' }
  catch { return 'en' }
}

function Button({ href = '#/contact', children, light = false, outline = false, icon = 'arrow', className = '' }) {
  const Icon = icon === 'home' ? House : icon === 'back' ? ArrowLeft : ArrowRight
  return <a className={`button ${light ? 'button-light' : ''} ${outline ? 'button-outline' : ''} ${className}`} href={href}>
    {icon === 'back' && <Icon size={16} />}{children}{icon !== 'back' && <Icon size={16} />}
  </a>
}

function Brand({ copy }) {
  return <a className="site-brand" href="#/" aria-label={copy.brandHomeLabel}>
    <img src="./logo.png" alt="" />
    <span><strong>Lumen Atelier</strong><small>{copy.brandSubtitle}</small></span>
  </a>
}

function Header({ route, copy, language, onLanguageChange }) {
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [route.name, route.slug])
  const keys = ['home', 'work', 'services', 'about', 'contact']
  return <header className="site-header">
    <Brand copy={copy} />
    <nav className={open ? 'open' : ''} aria-label={copy.navLabel}>
      {copy.nav.map(([label, href], index) => {
        const key = keys[index]
        const active = key === 'home' ? route.name === 'home' : route.name === key || (key === 'services' && route.name === 'service') || (key === 'work' && route.name === 'project')
        return <a key={href} className={active ? 'active' : ''} href={href} onClick={() => setOpen(false)}>{label}</a>
      })}
    </nav>
    <div className="header-actions">
      <div className="language-switch" role="group" aria-label={copy.languageLabel}>
        <button type="button" className={language === 'en' ? 'active' : ''} aria-pressed={language === 'en'} onClick={() => onLanguageChange('en')}>EN</button>
        <button type="button" className={language === 'zh' ? 'active' : ''} aria-pressed={language === 'zh'} onClick={() => onLanguageChange('zh')}>中文</button>
      </div>
      <Button>{copy.labels.startProject}</Button>
    </div>
    <button className="menu" onClick={() => setOpen(value => !value)} aria-label={copy.menuLabel} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
  </header>
}

function ServiceCard({ item, label }) {
  const Icon = item.icon
  return <a className="service-card glass-card" href={`#/services/${item.slug}`}>
    <span className="icon"><Icon strokeWidth={1.7} /></span>
    <div><h3>{item.title}</h3><p>{item.intro}</p></div>
    <span className="text-link">{label} <ArrowRight size={15} /></span>
  </a>
}

function ProjectArt({ item, large = false }) {
  return <div className={`project-art ${item.art} ${large ? 'project-art-large' : ''}`}><span>{item.copy}</span></div>
}

function ProjectCard({ item }) {
  return <a className="project-card" href={`#/work/${item.slug}`}>
    <ProjectArt item={item} />
    <div className="project-meta"><div><small>{item.category}</small><h3>{item.title}</h3></div><span aria-hidden="true"><ArrowRight /></span></div>
  </a>
}

function PageIntro({ eyebrow, title, text, copy }) {
  return <section className="page-intro wrap">
    <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-lead">{text}</p></div>
    <Button href="#/" outline icon="home">{copy.labels.backHome}</Button>
  </section>
}

function Process({ copy }) {
  return <section className="process wrap">
    <div><p className="eyebrow">{copy.process.eyebrow}</p><h2>{copy.process.title}</h2></div>
    <div className="process-list">{copy.process.steps.map(([number,title,text]) => <div className="process-row" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></div>)}</div>
  </section>
}

function ContactBanner({ copy, title }) {
  const banner = copy.banner
  return <section className="contact-banner wrap"><div><p className="eyebrow">{banner.eyebrow}</p><h2>{title || banner.title}</h2><p>{banner.text}</p><Button light>{copy.labels.startProject}</Button></div><div className="contact-art"><img src="./logo.png" alt="" /></div></section>
}

function Home({ copy, services, projects }) {
  const home = copy.home
  return <>
    <section className="hero wrap">
      <div className="hero-copy"><p className="eyebrow">{home.eyebrow}</p><h1>{home.heroTitle.map((line,index)=><span key={line}>{line}{index < home.heroTitle.length-1 && <br/>}</span>)}</h1><p>{home.heroText}</p><div className="button-row"><Button href="#/work">{home.viewWork}</Button><Button href="#/services" outline>{home.exploreServices}</Button></div></div>
      <div className="hero-art" aria-hidden="true"><span className="spark spark-a">✦</span><span className="spark spark-b">✦</span><img src="./logo.png" alt="" /></div>
    </section>
    <section className="home-services wrap" aria-labelledby="home-services-title"><div className="section-head"><div><p className="eyebrow">{home.whatWeDo}</p><h2 id="home-services-title">{home.servicesTitle}</h2></div><a className="section-link" href="#/services">{home.viewServices} <ArrowRight size={17}/></a></div><div className="service-grid">{services.map(item=><ServiceCard key={item.slug} item={item} label={copy.labels.moreAbout}/>)}</div></section>
    <section className="about wrap"><div className="about-copy"><p className="eyebrow">{home.meetStudio}</p><h2>{home.studioTitle[0]}<br/>{home.studioTitle[1]}</h2>{home.studioText.map(text=><p key={text}>{text}</p>)}<Button href="#/about">{home.moreAboutUs}</Button></div><div className="desk-scene"><div className="tablet"><img src="./logo.png" alt="Lumen Atelier" /></div><span className="note n1">{home.notes[0][0]}<br/>{home.notes[0][1]}</span><span className="note n2">{home.notes[1].map(word=><span key={word}>{word}<br/></span>)}</span></div></section>
    <section className="work wrap" aria-labelledby="selected-work-title"><div className="section-head"><div><p className="eyebrow">{home.firstLook}</p><h2 id="selected-work-title">{home.selectedWork}</h2></div><a className="section-link" href="#/work">{home.viewAllWork} <ArrowRight size={17}/></a></div><div className="work-grid">{projects.slice(0,5).map(item=><ProjectCard key={item.slug} item={item}/>)}</div><p className="template-note"><Sparkles size={15}/> {home.templateNote}</p></section>
    <Process copy={copy}/><ContactBanner copy={copy}/>
  </>
}

function Services({ copy, services }) {
  const page = copy.servicesPage
  return <><PageIntro eyebrow={page.eyebrow} title={page.title} text={page.text} copy={copy}/><section className="listing-section wrap"><div className="service-grid service-grid-full">{services.map(item=><ServiceCard key={item.slug} item={item} label={copy.labels.moreAbout}/>)}</div></section><section className="fit-section wrap glass-panel"><div><p className="eyebrow">{page.flexible}</p><h2>{page.moreThanOne}</h2></div><div><p>{page.packageText}</p><Button>{page.packageButton}</Button></div></section><Process copy={copy}/><ContactBanner copy={copy}/></>
}

function ServiceDetail({ copy, item }) {
  if (!item) return <NotFound copy={copy}/>
  const Icon = item.icon, page = copy.servicesPage
  return <><section className={`detail-hero wrap detail-${item.accent}`}><div className="detail-copy"><a className="back-link" href="#/services"><ArrowLeft size={16}/> {copy.labels.allServices}</a><p className="eyebrow">{copy.labels.serviceDetail}</p><h1>{item.title}</h1><p>{item.description}</p><div className="button-row"><Button>{copy.labels.askService}</Button><Button href="#/" outline icon="home">{copy.labels.backHome}</Button></div></div><div className="detail-symbol glass-card"><Icon strokeWidth={1.25}/><span>{item.intro}</span></div></section><section className="detail-columns wrap"><InfoList title={copy.labels.goodFor} items={item.goodFor}/><InfoList title={copy.labels.deliverables} items={item.deliverables}/></section><section className="detail-copy-section wrap"><div><p className="eyebrow">{page.howItWorks}</p><h2>{page.stepsTitle}</h2></div><div><p>{page.stepsText}</p><a className="section-link" href="#/about">{page.studioLink} <ArrowRight size={17}/></a></div></section><ContactBanner copy={copy} title={page.thinking(item.title)}/></>
}

function InfoList({ title, items }) {
  return <article className="info-card glass-card"><p className="eyebrow">{title}</p><ul>{items.map(item=><li key={item}><Check size={17}/>{item}</li>)}</ul></article>
}

function Work({ copy, projects }) {
  const page = copy.workPage
  return <><PageIntro eyebrow={page.eyebrow} title={page.title} text={page.text} copy={copy}/><section className="listing-section wrap"><div className="portfolio-grid">{projects.map(item=><ProjectCard key={item.slug} item={item}/>)}</div></section><section className="template-callout wrap glass-panel"><Sparkles/><div><h2>{page.replaceTitle}</h2><p>{page.replaceText}</p></div><Button>{page.replaceButton}</Button></section><ContactBanner copy={copy}/></>
}

function ProjectDetail({ copy, item }) {
  if (!item) return <NotFound copy={copy}/>
  const page = copy.workPage
  return <><section className="case-hero wrap"><div className="case-heading"><a className="back-link" href="#/work"><ArrowLeft size={16}/> {copy.labels.allWork}</a><p className="eyebrow">{item.category}</p><h1>{item.title}</h1><p>{item.year}</p><div className="button-row"><Button>{page.similar}</Button><Button href="#/" outline icon="home">{copy.labels.backHome}</Button></div></div><ProjectArt item={item} large/></section><section className="case-overview wrap"><div><p className="eyebrow">{copy.labels.overview}</p><h2>{item.overview}</h2></div><div className="case-services"><p className="eyebrow">{copy.labels.services}</p>{item.services.map(service=><span key={service}>{service}</span>)}</div></section><section className="case-story wrap"><article className="glass-card"><span>01</span><p className="eyebrow">{copy.labels.challenge}</p><h3>{item.challenge}</h3></article><article className="glass-card"><span>02</span><p className="eyebrow">{copy.labels.direction}</p><h3>{item.direction}</h3></article></section><section className="case-next wrap"><p>{page.templateCase}</p><a className="section-link" href="#/work">{page.browseCases} <ArrowRight size={17}/></a></section><ContactBanner copy={copy}/></>
}

function About({ copy }) {
  const page = copy.aboutPage
  return <><PageIntro eyebrow={page.eyebrow} title={page.title} text={page.text} copy={copy}/><section className="about-story wrap"><div className="about-visual glass-panel"><img src="./logo.png" alt="Lumen Atelier"/></div><div className="about-prose"><p className="eyebrow">{page.studio}</p><h2>{page.storyTitle}</h2>{page.story.map(text=><p key={text}>{text}</p>)}<Button>{page.tellUs}</Button></div></section><section className="values wrap">{page.values.map(([number,title,text])=><article className="glass-card" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</section><section className="detail-copy-section wrap"><div><p className="eyebrow">{page.bestTogether}</p><h2>{page.fitTitle}</h2></div><div><p>{page.fitText}</p><a className="section-link" href="#/services">{page.seeServices} <ArrowRight size={17}/></a></div></section><ContactBanner copy={copy}/></>
}

function Contact({ copy, services }) {
  const page = copy.contactPage
  const [message, setMessage] = useState('')
  const submit = event => { event.preventDefault(); const data = new FormData(event.currentTarget); const text = copy.locale === 'zh' ? `来自 ${data.get('name')} 的项目咨询\n\n服务：${data.get('service')}\n预算：${data.get('budget')}\n邮箱：${data.get('email')}\n\n项目详情：\n${data.get('message')}` : `Project enquiry from ${data.get('name')}\n\nService: ${data.get('service')}\nBudget: ${data.get('budget')}\nEmail: ${data.get('email')}\n\nProject details:\n${data.get('message')}`; setMessage(text) }
  const mailto = `mailto:hello@lumenatelier.studio?subject=${encodeURIComponent(page.subject)}&body=${encodeURIComponent(message)}`
  return <><PageIntro eyebrow={page.eyebrow} title={page.title} text={page.text} copy={copy}/><section className="contact-layout wrap"><aside className="contact-aside glass-panel"><p className="eyebrow">{page.whatHelps}</p><h2>{page.briefTitle}</h2><ul>{page.briefItems.map(item=><li key={item}><Check/>{item}</li>)}</ul><div className="contact-small"><Clock3/><span><strong>{page.responseTitle}</strong><br/>{page.responseText}</span></div><div className="contact-small"><Mail/><span><strong>{page.emailTitle}</strong><br/>hello@lumenatelier.studio</span></div></aside><form className="contact-form glass-card" onSubmit={submit}><label>{page.name}<input required name="name" placeholder={page.namePlaceholder}/></label><label>{page.email}<input required type="email" name="email" placeholder="you@example.com"/></label><label>{page.service}<select name="service" defaultValue={services[0].title}>{services.map(item=><option key={item.slug}>{item.title}</option>)}<option>{page.notSure}</option></select></label><label>{page.budget}<select name="budget" defaultValue={page.discuss}><option>{page.discuss}</option>{page.budgets.map(item=><option key={item}>{item}</option>)}</select></label><label className="full-field">{page.details}<textarea required name="message" rows="6" placeholder={page.detailsPlaceholder}/></label><button className="button form-submit" type="submit">{page.prepare} <ArrowRight size={16}/></button>{message && <div className="form-success full-field" role="status"><Check/><div><strong>{page.ready}</strong><p>{page.readyText}</p><a href={mailto}>{page.openEmail} <ArrowRight size={15}/></a></div></div>}</form></section><section className="back-home-panel wrap"><Button href="#/" outline icon="home">{page.backHomepage}</Button></section></>
}

function NotFound({ copy }) {
  const page = copy.notFound
  return <section className="not-found wrap"><p className="eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.text}</p><Button href="#/" icon="home">{copy.labels.backHome}</Button></section>
}

function Footer({ copy }) {
  return <footer className="footer wrap"><Brand copy={copy}/><div className="footer-links">{copy.nav.map(([label,href])=><a href={href} key={href}>{label}</a>)}</div><div className="footer-links"><span>{copy.footer.instagram}</span><span>{copy.footer.behance}</span><a href="#/contact">{copy.footer.enquiry}</a></div><small>{copy.footer.copyright}</small></footer>
}

export default function App() {
  const [route, setRoute] = useState(readRoute)
  const [language, setLanguage] = useState(readLanguage)
  const copy = content[language]
  const services = useMemo(() => serviceMeta.map(([slug,accent],index) => ({ slug, accent, icon: serviceIcons[index], ...copy.services[index] })), [copy])
  const projects = useMemo(() => projectMeta.map(([slug,art,projectCopy],index) => ({ slug, art, copy: projectCopy, ...copy.projects[index] })), [copy])

  useEffect(() => { const handler = () => setRoute(readRoute()); window.addEventListener('hashchange', handler); if (!window.location.hash) window.history.replaceState(null,'',`${window.location.pathname}${window.location.search}#/`); return () => window.removeEventListener('hashchange', handler) }, [])
  useEffect(() => { document.documentElement.lang = copy.htmlLang; document.title = copy.pageTitle; document.querySelector('meta[name="description"]')?.setAttribute('content', copy.metaDescription); try { window.localStorage.setItem(languageStorageKey, language) } catch {} }, [copy, language])
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: .88 }); let rafId; const raf = time => { lenis.raf(time); rafId = requestAnimationFrame(raf) }; rafId = requestAnimationFrame(raf); const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: .08 }); const timer = window.setTimeout(() => document.querySelectorAll('main > section, .glass-card, .project-card').forEach(node => { node.classList.add('reveal'); observer.observe(node) }), 0); return () => { clearTimeout(timer); cancelAnimationFrame(rafId); observer.disconnect(); lenis.destroy() } }, [route.name, route.slug])

  const changeLanguage = next => { if (next === language) return; setLanguage(next); const url = new URL(window.location.href); next === 'zh' ? url.searchParams.set('lang','zh') : url.searchParams.delete('lang'); window.history.replaceState(null,'',`${url.pathname}${url.search}${url.hash}`) }
  let page
  if (route.name === 'home') page = <Home copy={copy} services={services} projects={projects}/>
  else if (route.name === 'services') page = <Services copy={copy} services={services}/>
  else if (route.name === 'service') page = <ServiceDetail copy={copy} item={services.find(item=>item.slug===route.slug)}/>
  else if (route.name === 'work') page = <Work copy={copy} projects={projects}/>
  else if (route.name === 'project') page = <ProjectDetail copy={copy} item={projects.find(item=>item.slug===route.slug)}/>
  else if (route.name === 'about') page = <About copy={copy}/>
  else if (route.name === 'contact') page = <Contact copy={copy} services={services}/>
  else page = <NotFound copy={copy}/>

  return <><div className="ambient ambient-one"/><div className="ambient ambient-two"/><Header route={route} copy={copy} language={language} onLanguageChange={changeLanguage}/><main key={`${route.name}-${route.slug || ''}`}>{page}</main><Footer copy={copy}/></>
}
