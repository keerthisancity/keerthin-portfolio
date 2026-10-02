import { useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, Download, Mail, MapPin, Menu, Moon, Phone, Sun, X } from 'lucide-react'
import { getAchievements, getBio, getEducation, getExperience, getProjects, getSkills } from './api'
import { useApi } from './hooks'
import { AchievementList, ProjectCard, Section, SectionError, Skeleton, SkillCloud, Timeline } from './components'
import type { Bio } from './types'

const nav = [['about', 'About'], ['experience', 'Experience'], ['skills', 'Skills'], ['projects', 'Projects']]
function App() {
  const bio = useApi(getBio); const skills = useApi(getSkills); const experience = useApi(getExperience); const education = useApi(getEducation); const projects = useApi(getProjects); const achievements = useApi(getAchievements)
  const [dark, setDark] = useState(() => localStorage.getItem('portfolio-theme') === 'dark')
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('home')
  const person: Partial<Bio> = bio.data || {}
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('portfolio-theme', dark ? 'dark' : 'light') }, [dark])
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }), { rootMargin: '-35% 0px -55%' })
    nav.forEach(([id]) => { const el = document.getElementById(id); if (el) observer.observe(el) }); return () => observer.disconnect()
  }, [])
  const stats = useMemo(() => {
    const companies = experience.data ? new Set(experience.data.map(item => item.company).filter(Boolean)).size : null
    const firstStart = experience.data?.map(item => item.startDate).filter(Boolean).sort()[0]
    const years = firstStart ? Math.max(1, new Date().getFullYear() - new Date(firstStart).getFullYear()) : null
    return [{ n: companies, label: 'Companies' }, { n: years, label: 'Years experience' }, { n: projects.data?.length ?? null, label: 'Projects completed' }]
  }, [experience.data, projects.data])
  const scroll = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenu(false) }
  const resumeHref = person.resumeUrl?.startsWith('http')
    ? person.resumeUrl
    : person.resumeUrl ? `${import.meta.env.BASE_URL}${person.resumeUrl}` : undefined
  return <div>
    <header className="navbar"><a className="brand" href="#home" onClick={() => scroll('home')}><strong>{person.fullName?.toUpperCase() || 'PORTFOLIO'}</strong></a><nav className={menu ? 'open' : ''}>{nav.map(([id, label]) => <a className={active === id ? 'active' : ''} href={`#${id}`} key={id} onClick={() => scroll(id)}>{label}</a>)}</nav><div className="nav-actions"><a className="nav-contact" href="#contact" onClick={() => scroll('contact')}>Contact</a><button className="icon-button" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">{dark ? <Sun size={18} /> : <Moon size={18} />}</button><button className="menu-button" onClick={() => setMenu(!menu)} aria-label="Toggle menu">{menu ? <X /> : <Menu />}</button></div></header>
    <main>
      <section id="home" className="hero"><div className="hero-copy"><p className="eyebrow">Hello, I'm</p><h1>{person.shortName || person.fullName || ' '}</h1><h2>{person.title || ' '}</h2><p className="hero-text">{person.summary || ' '}</p><div className="hero-actions"><a className="primary" href="#contact" onClick={() => scroll('contact')}>Get in touch <ArrowUpRight size={17} /></a>{resumeHref && <a className="secondary" href={resumeHref} download>Download resume <Download size={15} /></a>}</div></div><div className="hero-visual"><div className="orange-orb" /><img src={`${import.meta.env.BASE_URL}Profile_pic.jpg`} alt={person.fullName ? `${person.fullName} profile` : 'Profile image'} onError={event => { event.currentTarget.src = `${import.meta.env.BASE_URL}profile-placeholder.svg` }} /><div className="float-card"><strong>Open to Work</strong><span>{person.location || 'Available for opportunities'}</span></div></div></section>
      <div className="stats">{stats.map(s => <div key={s.label}><strong>{s.n ?? '—'}{typeof s.n === 'number' && '+'}</strong><span>{s.label}</span></div>)}</div>
      <Section id="about" eyebrow="" title="A little bit about who I am"><div className="about-grid"><div className="about-lead"><p>{person.aboutMe || person.summary || ' '}</p><span className="line-accent" /><div className="contact-mini">{person.location && <span><MapPin size={13} />{person.location}</span>}{person.title && <span>{person.title}</span>}</div></div>
        <div className="education-lower"><h3 className="subheading">Education</h3>{education.loading ? <Skeleton lines={2} /> : education.error ? <SectionError retry={education.retry} /> : <Timeline items={education.data || []} education />}</div></div></Section>
      <Section id="experience" eyebrow="" title="Experience, Skills & more"><div className="profile-layout"><div><h3 className="subheading">Experience</h3>{experience.loading ? <Skeleton /> : experience.error ? <SectionError retry={experience.retry} /> : <Timeline items={experience.data || []} />}</div><div><h3 className="subheading">Achievements</h3>{achievements.loading ? <Skeleton lines={3} /> : achievements.error ? <SectionError retry={achievements.retry} /> : <AchievementList items={achievements.data || []} />}</div></div><div className="skills-achievements" id="skills"><div><h3 className="subheading">Skills</h3>{skills.loading ? <Skeleton lines={4} /> : skills.error ? <SectionError retry={skills.retry} /> : <SkillCloud skills={skills.data || []} />}</div></div></Section>
      <Section id="projects" eyebrow="03 / Selected work" title="Things I've built"><div className="project-grid">{projects.loading ? <><Skeleton /><Skeleton /></> : projects.error ? <SectionError retry={projects.retry} /> : projects.data?.length ? projects.data.map((p, i) => <ProjectCard project={p} index={i} key={p.id ?? i} />) : <p className="empty">Projects will appear here soon.</p>}</div></Section>
      <section className="contact-section" id="contact"><div><p className="eyebrow">04 / Get in touch</p><h2>Have a project in mind?<br /><em>Let's talk.</em></h2></div><div className="contact-cta"><p>{person.location}</p>{person.email && <a className="primary" href={`mailto:${person.email}`}>Say hello <Mail size={17} /></a>}{person.linkedIn && <a className="secondary" href={person.linkedIn} target="_blank" rel="noreferrer">LinkedIn</a>}{person.gitHub && <a className="secondary" href={person.gitHub} target="_blank" rel="noreferrer">GitHub</a>}</div></section>
      <section className="hidden-architecture" aria-hidden="true"><span>Testimonials architecture ready</span><span>Latest updates architecture ready</span></section>
    </main>
    <footer><span>© {new Date().getFullYear()} {person.fullName || 'Portfolio'}. Crafted with care.</span><a href="#home" onClick={() => scroll('home')}>Back to top ↑</a></footer>
  </div>
}
export default App
