import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { categories, contributionTypes, initialUseCases, validationStatuses, type Contribution, type Resource, type UseCase } from './data'

type Route = { page: 'home' | 'explore' | 'dashboard' | 'create' | 'detail' | 'contribute'; id?: string; query?: string }

function routeFromHash(): Route {
  const route = window.location.hash.slice(1) || '/'
  const [path, queryString = ''] = route.split('?')
  const query = new URLSearchParams(queryString).get('q') || ''
  if (path.startsWith('/use-cases/')) return { page: 'detail', id: path.split('/')[2] }
  if (path.startsWith('/contribute/')) return { page: 'contribute', id: path.split('/')[2] }
  if (path === '/explore') return { page: 'explore', query }
  if (path === '/dashboard') return { page: 'dashboard' }
  if (path === '/create') return { page: 'create' }
  return { page: 'home' }
}

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    arrowLeft: <><path d="M19 12H5m6 6-6-6 6-6" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5M12 15V3" /></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5M12 3v12" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h8" /></>,
    spark: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    filter: <><path d="M4 7h16M7 12h10m-7 5h4" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.file}</svg>
}

function App() {
  const [route, setRoute] = useState<Route>(routeFromHash)
  const [useCases, setUseCases] = useState<UseCase[]>(initialUseCases)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => localStorage.getItem('se-proper-theme') === 'light' ? 'light' : 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('se-proper-theme', theme)
  }, [theme])

  useEffect(() => {
    const update = () => { setRoute(routeFromHash()); setMobileNavOpen(false) }
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])

  function navigate(path: string) {
    if (window.location.hash === `#${path}`) setRoute(routeFromHash())
    else window.location.hash = path
    setMobileNavOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const activeCase = useCases.find((item) => item.id === route.id)

  function publishUseCase(values: Record<string, string>, files: File[]) {
    const now = new Date()
    const newCase: UseCase = {
      id: `${slug(values.title)}-${Date.now().toString().slice(-5)}`,
      title: values.title.trim(), summary: values.summary.trim(), category: values.category,
      tags: values.tags.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 6),
      author: values.author.trim(), date: formatDate(now), updated: formatDate(now),
      ask: values.ask.trim(), context: values.context.trim() || 'Not specified',
      technologies: values.technologies.trim() || 'Not specified', constraints: values.constraints.trim() || 'Not specified',
      solution: values.solution.trim(), implementation: values.implementation.trim() || 'No additional implementation details provided.',
      outcome: values.outcome.trim() || 'Not specified', lessons: values.lessons.trim() || 'Not specified',
      reusable: values.reusable.trim() || 'Not specified', resources: files.map((file) => fileToResource(file, values.fileDescription)), contributions: [],
    }
    setUseCases((items) => [newCase, ...items])
    navigate(`/use-cases/${newCase.id}`)
  }

  function addContribution(caseId: string, values: Record<string, string>, files: File[]) {
    const now = new Date()
    const contribution: Contribution = {
      id: `c-${Date.now()}`, title: values.title.trim(), type: values.type,
      description: values.description.trim(), author: values.author.trim(), date: formatDate(now),
      implementation: values.implementation.trim(), context: values.context.trim(),
      validation: values.validation, resources: files.map((file) => fileToResource(file, values.fileDescription)),
    }
    setUseCases((items) => items.map((item) => item.id === caseId ? { ...item, contributions: [contribution, ...item.contributions], updated: formatDate(now) } : item))
    navigate(`/use-cases/${caseId}`)
  }

  return (
    <div className="app-frame">
      <aside className={`sidebar ${mobileNavOpen ? 'sidebar-open' : ''}`}>
        <a href="#/" className="brand" onClick={(event) => { event.preventDefault(); navigate('/') }}>
          <span className="brand-mark"><span /><span /><span /></span>
          <span className="brand-name">SE Proper<small>Solutions, shared.</small></span>
        </a>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <NavItem icon="home" label="Home" active={route.page === 'home'} onClick={() => navigate('/')} />
          <NavItem icon="grid" label="Explore use cases" active={route.page === 'explore' || route.page === 'detail'} onClick={() => navigate('/explore')} />
          <NavItem icon="plus" label="Create use case" active={route.page === 'create'} onClick={() => navigate('/create')} />
          <NavItem icon="users" label="Community dashboard" active={route.page === 'dashboard'} onClick={() => navigate('/dashboard')} />
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon"><Icon name="spark" size={16} /></div>
            <div><strong>Good work travels.</strong><p>Share the solution so the next SE can start further ahead.</p></div>
          </div>
          <div className="sidebar-footer"><span className="footer-dot" /> Public demo <span className="footer-separator">·</span> no sign-in</div>
        </div>
      </aside>

      {mobileNavOpen && <button className="nav-scrim" aria-label="Close navigation" onClick={() => setMobileNavOpen(false)} />}

      <main className="main-shell">
        <header className="topbar">
          <button className="mobile-menu icon-button" onClick={() => setMobileNavOpen(!mobileNavOpen)} aria-label="Toggle navigation"><span className="menu-glyph">☰</span></button>
          <div className="breadcrumb"><span>SE Proper</span><Icon name="chevron" size={14} /><strong>{pageTitle(route.page)}</strong></div>
          <div className="topbar-actions">
            <button className="theme-toggle" onClick={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} /><span>{theme === 'dark' ? 'Light theme' : 'Dark theme'}</span></button>
            <div className="public-mode"><span className="footer-dot" /> Open community</div>
            <div className="avatar avatar-me" title="Public demo visitor">Y</div>
          </div>
        </header>

        <div className="prototype-notice"><Icon name="shield" size={16} /><span><strong>Prototype mode:</strong> sample content and anything you add live only in this browser tab. Posts and files are not shared or saved yet.</span></div>

        <div className="page-content">
          {route.page === 'home' && <HomePage cases={useCases} navigate={navigate} />}
          {route.page === 'explore' && <ExplorePage cases={useCases} initialQuery={route.query || ''} navigate={navigate} />}
          {route.page === 'dashboard' && <DashboardPage cases={useCases} navigate={navigate} />}
          {route.page === 'create' && <UseCaseForm onCancel={() => navigate('/explore')} onSubmit={publishUseCase} />}
          {route.page === 'detail' && activeCase && <DetailPage item={activeCase} navigate={navigate} />}
          {route.page === 'contribute' && activeCase && <ContributionForm item={activeCase} onCancel={() => navigate(`/use-cases/${activeCase.id}`)} onSubmit={(values, files) => addContribution(activeCase.id, values, files)} />}
          {(route.page === 'detail' || route.page === 'contribute') && !activeCase && <NotFound navigate={navigate} />}
        </div>
        <footer className="page-footer"><span>SE Proper</span><span>Solve it once. Share it. Build on it.</span><span>Portfolio demo · Fictional examples</span></footer>
      </main>
    </div>
  )
}

function NavItem({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return <button className={`nav-item ${active ? 'nav-active' : ''}`} onClick={onClick}><Icon name={icon} size={18} /><span>{label}</span>{active && <span className="nav-active-mark" />}</button>
}

function pageTitle(page: Route['page']) {
  return ({ home: 'Home', explore: 'Explore use cases', dashboard: 'Community dashboard', create: 'Create a use case', detail: 'Use case details', contribute: 'Add a contribution' })[page]
}

function HomePage({ cases, navigate }: { cases: UseCase[]; navigate: (path: string) => void }) {
  const allContributions = cases.reduce((sum, item) => sum + item.contributions.length, 0)
  const allFiles = cases.reduce((sum, item) => sum + item.resources.length + item.contributions.reduce((total, contribution) => total + contribution.resources.length, 0), 0)
  const [search, setSearch] = useState('')
  function submitSearch(event: FormEvent) {
    event.preventDefault()
    navigate(`/explore?q=${encodeURIComponent(search)}`)
  }
  return <>
    <section className="hero-panel">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> THE SOLUTIONS ENGINEERING PLAYBOOK</div>
        <h1>Good solutions<br /><em>should travel.</em></h1>
        <p>Find the work another SE has already done. Add what you learned. Make the next customer conversation easier.</p>
        <form className="hero-search" onSubmit={submitSearch}>
          <Icon name="search" size={20} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search use cases, technologies, or customer asks…" aria-label="Search the use-case library" />
          <button className="button button-primary" type="submit">Search <Icon name="arrow" size={16} /></button>
        </form>
        <div className="hero-actions"><button className="button button-dark" onClick={() => navigate('/create')}><Icon name="plus" size={17} /> Share a solution</button><button className="text-button" onClick={() => navigate('/explore')}>Browse the library <Icon name="arrow" size={15} /></button></div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        <div className="art-card art-card-back"><div className="art-lines"><i /><i /><i /></div><span className="art-dot" /></div>
        <div className="art-card art-card-front"><div className="art-card-head"><span className="art-mini-mark">✳</span><span>Shared solution</span><span className="art-check">✓</span></div><div className="art-card-title">One less thing<br />to solve twice.</div><div className="art-avatar-row"><span className="avatar avatar-small avatar-purple">JL</span><span className="avatar avatar-small avatar-peach">PN</span><span className="avatar avatar-small avatar-blue">AK</span><div className="art-people">Built on by<br /><strong>your team</strong></div></div></div>
        <div className="floating-note"><span className="note-check">✓</span><div><b>Knowledge shared</b><small>Everyone starts further ahead</small></div></div>
        <span className="art-sparkle sparkle-a">✳</span><span className="art-sparkle sparkle-b">✦</span>
      </div>
      <div className="hero-stats">
        <Stat value={String(cases.length).padStart(2, '0')} label="USE CASES" /><Stat value={String(allContributions).padStart(2, '0')} label="CONTRIBUTIONS" /><Stat value={String(allFiles).padStart(2, '0')} label="SHARED RESOURCES" />
        <div className="stats-caption"><span className="footer-dot" /> A little more knowledge collected every day</div>
      </div>
    </section>

    <section className="section-block category-section">
      <div className="section-heading"><div><div className="eyebrow eyebrow-quiet">START WITH A CATEGORY</div><h2>What are you working on?</h2></div><button className="text-button" onClick={() => navigate('/explore')}>All use cases <Icon name="arrow" size={15} /></button></div>
      <div className="category-grid">
        {[
          { icon: '◈', name: 'Identity & access', query: 'Identity & Access Management', count: countCategory(cases, 'Identity & Access Management'), color: 'lavender' },
          { icon: '⌘', name: 'APIs & integrations', query: 'API & Integrations', count: countCategory(cases, 'API & Integrations'), color: 'mint' },
          { icon: '↗', name: 'Workflow automation', query: 'Workflow Automation', count: countCategory(cases, 'Workflow Automation'), color: 'peach' },
          { icon: '▧', name: 'Demos & POCs', query: 'Demo & Proof of Concept', count: countCategory(cases, 'Demo & Proof of Concept'), color: 'blue' },
        ].map((category) => <button className="category-tile" key={category.name} onClick={() => navigate(`/explore?q=${encodeURIComponent(category.query)}`)}><span className={`category-icon ${category.color}`}>{category.icon}</span><span className="category-name">{category.name}</span><span className="category-count">{category.count ? `${category.count} use case${category.count === 1 ? '' : 's'}` : 'Explore examples'}</span><Icon name="arrow" size={15} /></button>)}
      </div>
    </section>

    <section className="section-block recent-section">
      <div className="section-heading"><div><div className="eyebrow eyebrow-quiet">FRESH FROM THE FIELD</div><h2>Recently shared</h2></div><button className="text-button" onClick={() => navigate('/explore')}>Explore all <Icon name="arrow" size={15} /></button></div>
      <div className="case-grid case-grid-home">{cases.slice(0, 3).map((item) => <CaseCard key={item.id} item={item} onClick={() => navigate(`/use-cases/${item.id}`)} />)}</div>
    </section>
  </>
}

function Stat({ value, label }: { value: string; label: string }) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div> }
function countCategory(cases: UseCase[], category: string) { return cases.filter((item) => item.category === category).length }

function ExplorePage({ cases, initialQuery, navigate }: { cases: UseCase[]; initialQuery: string; navigate: (path: string) => void }) {
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState('All categories')
  const [tag, setTag] = useState('All tags')
  const [sort, setSort] = useState('newest')
  const availableTags = Array.from(new Set(cases.flatMap((item) => item.tags))).sort()
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return cases.filter((item) => {
      const text = [item.title, item.summary, item.ask, item.solution, item.implementation, item.technologies, item.lessons, item.category, ...item.tags].join(' ').toLowerCase()
      return (!needle || text.includes(needle)) && (category === 'All categories' || item.category === category) && (tag === 'All tags' || item.tags.includes(tag))
    }).sort((a, b) => sort === 'most' ? b.contributions.length - a.contributions.length : sort === 'updated' ? Date.parse(b.updated) - Date.parse(a.updated) : Date.parse(b.date) - Date.parse(a.date))
  }, [cases, category, query, sort, tag])
  return <div className="inner-page">
    <PageIntro eyebrow="THE SHARED LIBRARY" title="Explore use cases" text="Practical starting points from the field. Search what you need, then build on what you find." action={<button className="button button-primary" onClick={() => navigate('/create')}><Icon name="plus" size={17} /> New use case</button>} />
    <div className="library-toolbar"><label className="library-search"><Icon name="search" size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by problem, tool, or keyword" aria-label="Search use cases" />{query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear search"><Icon name="close" size={16} /></button>}</label><label className="filter-select"><Icon name="filter" size={16} /><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter by category">{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="filter-select tag-filter"><select value={tag} onChange={(event) => setTag(event.target.value)} aria-label="Filter by tag"><option>All tags</option>{availableTags.map((item) => <option key={item}>{item}</option>)}</select></label><label className="sort-select"><span>Sort:</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort use cases"><option value="newest">Newest</option><option value="updated">Recently updated</option><option value="most">Most contributed</option></select></label></div>
    <div className="results-line"><span><strong>{filtered.length}</strong> use cases</span>{query && <span className="result-query">matching “{query}”</span>}<span className="results-demo"><span className="footer-dot" /> Public demo content</span></div>
    {filtered.length ? <div className="case-grid">{filtered.map((item) => <CaseCard key={item.id} item={item} onClick={() => navigate(`/use-cases/${item.id}`)} />)}</div> : <EmptyState title="No matches yet" text="Try another keyword or clear the category and tag filters to see more of the library." action={<button className="button button-outline" onClick={() => { setQuery(''); setCategory('All categories'); setTag('All tags') }}>Clear filters</button>} />}
  </div>
}

function PageIntro({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: ReactNode }) {
  return <div className="page-intro"><div><div className="eyebrow eyebrow-quiet">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div>{action && <div className="intro-action">{action}</div>}</div>
}

function CaseCard({ item, onClick }: { item: UseCase; onClick: () => void }) {
  return <button className="case-card" onClick={onClick}>
    <div className="case-card-top"><span className="category-pill">{item.category}</span><span className="card-date"><Icon name="clock" size={13} /> {item.date}</span></div>
    <h3>{item.title}</h3><p className="case-summary">{item.summary}</p>
    <div className="tag-row">{item.tags.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
    <div className="case-card-footer"><span className="author-chip"><span className={`avatar avatar-tiny ${avatarColor(item.author)}`}>{initials(item.author)}</span><span>{item.author}</span></span><span className="card-counts"><span><Icon name="users" size={14} /> {item.contributions.length}</span><span><Icon name="file" size={14} /> {item.resources.length}</span></span></div>
    <span className="card-corner-arrow"><Icon name="arrow" size={15} /></span>
  </button>
}

function DashboardPage({ cases, navigate }: { cases: UseCase[]; navigate: (path: string) => void }) {
  const contributions = cases.flatMap((item) => item.contributions.map((contribution) => ({ ...contribution, parent: item }))).sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
  return <div className="inner-page">
    <PageIntro eyebrow="COMMUNITY ACTIVITY" title="A better answer, together." text="See what the community has shared lately, then add a useful variation of your own." action={<button className="button button-primary" onClick={() => navigate('/create')}><Icon name="plus" size={17} /> Share a solution</button>} />
    <div className="community-metrics"><div><span className="metric-icon metric-lilac"><Icon name="grid" size={18} /></span><div><strong>{cases.length}</strong><span>use cases shared</span></div></div><div><span className="metric-icon metric-mint"><Icon name="users" size={18} /></span><div><strong>{contributions.length}</strong><span>ideas contributed</span></div></div><div><span className="metric-icon metric-peach"><Icon name="file" size={18} /></span><div><strong>{cases.reduce((sum, item) => sum + item.resources.length + item.contributions.reduce((n, c) => n + c.resources.length, 0), 0)}</strong><span>resources attached</span></div></div></div>
    <div className="dashboard-columns"><section className="activity-panel"><div className="panel-heading"><div><div className="eyebrow eyebrow-quiet">BUILDING ON GOOD WORK</div><h2>Recent contributions</h2></div><span className="live-pill"><span className="footer-dot" /> Community feed</span></div>
      {contributions.length ? <div className="activity-list">{contributions.map((entry) => <article className="activity-item" key={entry.id}><span className={`avatar avatar-medium ${avatarColor(entry.author)}`}>{initials(entry.author)}</span><div className="activity-body"><div className="activity-byline"><strong>{entry.author}</strong><span>added a contribution</span><time>{entry.date}</time></div><button className="activity-title" onClick={() => navigate(`/use-cases/${entry.parent.id}`)}>{entry.title}</button><p>{entry.description}</p><div className="activity-parent"><span>On</span><button onClick={() => navigate(`/use-cases/${entry.parent.id}`)}>{entry.parent.title}</button></div></div></article>)}</div> : <EmptyState title="Be the first to contribute" text="Find a use case and add a useful variation or lesson learned." action={<button className="button button-outline" onClick={() => navigate('/explore')}>Explore use cases</button>} />}
    </section><aside className="dashboard-side"><div className="side-callout"><span className="callout-icon"><Icon name="spark" size={18} /></span><div className="eyebrow eyebrow-quiet">THE IDEA</div><h3>Every contribution gives the next SE a head start.</h3><p>Found a different approach, a gotcha, or a useful file? Add it to the original solution.</p><button className="button button-dark button-full" onClick={() => navigate('/explore')}>Find something to build on <Icon name="arrow" size={15} /></button></div><div className="demo-note"><Icon name="shield" size={17} /><p><strong>Public demo</strong><br />Names are self-reported. Please use fictional examples and never upload sensitive information.</p></div></aside></div>
  </div>
}

function DetailPage({ item, navigate }: { item: UseCase; navigate: (path: string) => void }) {
  const totalFiles = item.resources.length + item.contributions.reduce((sum, contribution) => sum + contribution.resources.length, 0)
  return <div className="inner-page detail-page">
    <button className="back-link" onClick={() => navigate('/explore')}><Icon name="arrowLeft" size={16} /> Back to use cases</button>
    <div className="detail-heading"><div className="detail-heading-main"><span className="category-pill">{item.category}</span><h1>{item.title}</h1><p>{item.summary}</p><div className="detail-tags">{item.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div><div className="detail-meta"><span className={`avatar avatar-small ${avatarColor(item.author)}`}>{initials(item.author)}</span><span>Shared by <strong>{item.author}</strong></span><span className="meta-divider" /><span>{item.date}</span><span className="meta-divider" /><span>{item.contributions.length} contributions</span></div></div><div className="detail-heading-action"><button className="button button-primary" onClick={() => navigate(`/contribute/${item.id}`)}><Icon name="plus" size={17} /> Contribute</button><span className="button-caption">Add your approach to this solution</span></div></div>
    <div className="detail-layout"><div className="detail-main-column">
      <InfoSection icon="search" eyebrow="THE CUSTOMER ASK" title="The challenge"><p>{item.ask}</p>{item.context && item.context !== 'Not specified' && <div className="context-line"><span>CONTEXT</span>{item.context}</div>}</InfoSection>
      <InfoSection icon="spark" eyebrow="THE APPROACH" title="Solution overview"><p>{item.solution}</p>{item.outcome !== 'Not specified' && <div className="outcome-box"><span className="outcome-check">✓</span><div><strong>Outcome</strong><p>{item.outcome}</p></div></div>}</InfoSection>
      <InfoSection icon="file" eyebrow="HOW IT WORKS" title="Implementation notes"><p>{item.implementation}</p><div className="implementation-grid"><div><span>TECHNOLOGIES</span><p>{item.technologies}</p></div><div><span>CONSTRAINTS</span><p>{item.constraints}</p></div></div></InfoSection>
      {(item.lessons !== 'Not specified' || item.reusable !== 'Not specified') && <InfoSection icon="spark" eyebrow="FOR THE NEXT SE" title="Lessons & reusable notes"><div className="lesson-grid">{item.lessons !== 'Not specified' && <div><strong>Lessons learned</strong><p>{item.lessons}</p></div>}{item.reusable !== 'Not specified' && <div><strong>Reusable notes</strong><p>{item.reusable}</p></div>}</div></InfoSection>}
      <section className="contribution-section"><div className="detail-section-heading"><div className="section-icon"><Icon name="users" size={18} /></div><div><div className="eyebrow eyebrow-quiet">BUILD ON THIS SOLUTION</div><h2>Contributions <span>{item.contributions.length}</span></h2></div></div>
        {item.contributions.length ? <div className="contribution-list">{item.contributions.map((contribution) => <ContributionCard key={contribution.id} contribution={contribution} />)}</div> : <div className="empty-contributions"><span className="empty-contrib-icon"><Icon name="spark" size={18} /></span><div><strong>A fresh perspective starts here.</strong><p>No contributions yet. Add a variation, improvement, or lesson learned.</p></div><button className="button button-outline" onClick={() => navigate(`/contribute/${item.id}`)}>Add contribution</button></div>}
      </section>
    </div><aside className="detail-side-column"><div className="resource-panel"><div className="resource-panel-head"><div><div className="eyebrow eyebrow-quiet">ATTACHED FILES</div><h3>Resources <span>{totalFiles}</span></h3></div><span className="resource-head-icon"><Icon name="file" size={18} /></span></div>{item.resources.length ? <div className="resource-list">{item.resources.map((resource) => <ResourceRow resource={resource} key={resource.id} />)}</div> : <p className="no-resource">No files attached to the original use case.</p>}<p className="resource-notice"><Icon name="shield" size={14} /> Prototype files stay in this browser session.</p></div>
      <div className="quick-facts"><div className="eyebrow eyebrow-quiet">AT A GLANCE</div><div><span>Category</span><strong>{item.category}</strong></div><div><span>Shared by</span><strong>{item.author}</strong></div><div><span>Last activity</span><strong>{item.updated}</strong></div><div><span>Community additions</span><strong>{item.contributions.length}</strong></div></div>
      <div className="detail-callout"><div className="callout-icon"><Icon name="spark" size={17} /></div><strong>Have a different approach?</strong><p>Keep the original intact and add your contribution alongside it.</p><button className="text-button" onClick={() => navigate(`/contribute/${item.id}`)}>Share what you learned <Icon name="arrow" size={14} /></button></div>
    </aside></div>
  </div>
}

function InfoSection({ icon, eyebrow, title, children }: { icon: string; eyebrow: string; title: string; children: ReactNode }) {
  return <section className="info-section"><div className="detail-section-heading"><div className="section-icon"><Icon name={icon} size={18} /></div><div><div className="eyebrow eyebrow-quiet">{eyebrow}</div><h2>{title}</h2></div></div><div className="info-body">{children}</div></section>
}

function ContributionCard({ contribution }: { contribution: Contribution }) {
  const [expanded, setExpanded] = useState(false)
  return <article className={`contribution-card ${expanded ? 'contribution-expanded' : ''}`}><button className="contribution-card-head" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}><span className={`avatar avatar-medium ${avatarColor(contribution.author)}`}>{initials(contribution.author)}</span><span className="contribution-head-text"><span className="contribution-kind">{contribution.type}</span><strong>{contribution.title}</strong><span className="contribution-by">{contribution.author} <i>·</i> {contribution.date}</span></span><span className="contribution-status">{contribution.validation}</span><Icon name="chevron" size={17} /></button>{expanded && <div className="contribution-expanded-body"><p>{contribution.description}</p>{contribution.implementation && <p className="contribution-implementation"><strong>Implementation:</strong> {contribution.implementation}</p>}{contribution.context && <p className="contribution-implementation"><strong>Relevant context:</strong> {contribution.context}</p>}{contribution.resources.length > 0 && <div className="resource-list contribution-resources">{contribution.resources.map((resource) => <ResourceRow resource={resource} key={resource.id} />)}</div>}</div>}</article>
}

function ResourceRow({ resource }: { resource: Resource }) {
  return <div className="resource-row"><span className="resource-file-icon"><Icon name="file" size={17} /></span><div className="resource-info"><strong title={resource.name}>{resource.name}</strong><span>{resource.kind} <i>·</i> {resource.size}</span><small>{resource.description}</small></div><button className="download-button" aria-label={`Download ${resource.name}`} title="Download sample file" onClick={() => downloadResource(resource)}><Icon name="download" size={16} /></button></div>
}

function UseCaseForm({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (values: Record<string, string>, files: File[]) => void }) {
  const [preview, setPreview] = useState<{ values: Record<string, string>; files: File[] } | null>(null)
  return <FormLayout eyebrow="ADD TO THE LIBRARY" title="Share a use case" text="Capture the useful parts of a solution so another SE can pick it up and build on it." back={onCancel}>
    <form className="editor-form" onSubmit={(event) => handleFormSubmit(event, (values, files) => setPreview({ values, files }))}>
      <FormSection number="01" title="Identify the use case" help="Give the solution a clear, searchable starting point.">
        <div className="field-grid"><TextField name="title" label="Title" placeholder="What did you help solve?" required /><label className="form-field"><span>Category <i>Required</i></span><select name="category" defaultValue="" required><option value="" disabled>Select a category</option>{categories.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label></div>
        <TextAreaField name="summary" label="Short summary" placeholder="In a sentence or two, describe the problem and the approach." required maxLength={240} />
        <TextField name="tags" label="Tags" placeholder="SCIM, Okta, lifecycle (separate with commas)" hint="Add products, technologies, or keywords that help someone find this." />
        <TextField name="author" label="Your display name" placeholder="How should your contribution be credited?" required />
      </FormSection>
      <FormSection number="02" title="Customer request & context" help="Keep customer details fictional or anonymized.">
        <TextAreaField name="ask" label="What did the customer need?" placeholder="Describe the need and the problem they were trying to solve." required />
        <div className="field-grid"><TextField name="context" label="Industry or segment" placeholder="e.g. Mid-market software" /><TextField name="technologies" label="Technologies or products" placeholder="e.g. Okta, Workday, SCIM" /></div>
        <TextAreaField name="constraints" label="Technical constraints" placeholder="Anything about the environment or requirements the next SE should know?" />
      </FormSection>
      <FormSection number="03" title="What was created?" help="Share the approach and leave a trail for the next person.">
        <TextAreaField name="solution" label="Solution overview" placeholder="What approach did you take?" required />
        <TextAreaField name="implementation" label="Implementation details" placeholder="APIs, scripts, configuration, workflow steps, or design choices." />
        <div className="field-grid"><TextAreaField name="outcome" label="Outcome" placeholder="What did the solution accomplish?" /><TextAreaField name="lessons" label="Lessons learned" placeholder="What would you tell the next SE?" /></div>
        <TextAreaField name="reusable" label="Reusable components or notes" placeholder="What can someone reuse directly?" />
      </FormSection>
      <AttachmentPicker />
      <div className="publish-notice"><Icon name="shield" size={18} /><div><strong>Public portfolio demo</strong><p>Your display name, use case, and any attached files will be public when a backend is connected. Use fictional examples and never include credentials, personal data, or confidential customer information.</p></div></div>
      <div className="form-actions"><button className="button button-quiet" type="button" onClick={onCancel}>Cancel</button><div><span className="form-disclaimer">Prototype only · not saved to a server</span><button className="button button-primary" type="submit">Preview use case <Icon name="arrow" size={16} /></button></div></div>
    </form>
    {preview && <PreviewDialog values={preview.values} files={preview.files} onEdit={() => setPreview(null)} onPublish={() => onSubmit(preview.values, preview.files)} />}
  </FormLayout>
}

function PreviewDialog({ values, files, onEdit, onPublish }: { values: Record<string, string>; files: File[]; onEdit: () => void; onPublish: () => void }) {
  return <div className="modal-backdrop"><section className="preview-dialog" role="dialog" aria-modal="true" aria-labelledby="preview-title"><div className="preview-dialog-top"><div><div className="eyebrow eyebrow-quiet">READY TO SHARE?</div><h2 id="preview-title">Preview your use case</h2></div><button className="icon-button" onClick={onEdit} aria-label="Close preview"><Icon name="close" size={18} /></button></div><div className="preview-public-label"><Icon name="shield" size={15} /> This will be public. Author names are self-reported.</div><span className="category-pill preview-category">{values.category}</span><h3>{values.title}</h3><p className="preview-summary">{values.summary}</p><div className="preview-author">Shared by <strong>{values.author}</strong>{values.tags && <span> · {values.tags}</span>}</div><div className="preview-block"><span>CUSTOMER ASK</span><p>{values.ask}</p></div><div className="preview-block"><span>SOLUTION OVERVIEW</span><p>{values.solution}</p></div>{files.length > 0 && <div className="preview-files"><span>ATTACHED IN THIS SESSION</span>{files.map((file) => <span className="preview-file-name" key={`${file.name}-${file.lastModified}`}><Icon name="file" size={14} /> {file.name} <small>{formatSize(file.size)}</small></span>)}</div>}<div className="preview-actions"><button className="button button-outline" onClick={onEdit}>Back to edit</button><button className="button button-primary" onClick={onPublish}>Publish use case <Icon name="arrow" size={16} /></button></div><div className="preview-disclaimer">Prototype only · your post and files will be cleared when you refresh this page.</div></section></div>
}

function ContributionForm({ item, onCancel, onSubmit }: { item: UseCase; onCancel: () => void; onSubmit: (values: Record<string, string>, files: File[]) => void }) {
  return <FormLayout eyebrow="BUILD ON A SHARED SOLUTION" title="Add a contribution" text={`Share an alternative, improvement, or lesson learned for “${item.title}”. The original use case stays as it is.`} back={onCancel}>
    <div className="parent-reference"><span className="reference-icon"><Icon name="file" size={17} /></span><div><span>CONTRIBUTING TO</span><strong>{item.title}</strong><small>Originally shared by {item.author}</small></div><button className="text-button" type="button" onClick={onCancel}>View use case <Icon name="arrow" size={14} /></button></div>
    <form className="editor-form contribution-form" onSubmit={(event) => handleFormSubmit(event, onSubmit)}>
      <FormSection number="01" title="Your contribution" help="Describe what you added or learned.">
        <TextField name="title" label="Contribution title" placeholder="Give your approach a clear name" required />
        <div className="field-grid"><label className="form-field"><span>Contribution type <i>Required</i></span><select name="type" defaultValue="" required><option value="" disabled>Select a type</option>{contributionTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label className="form-field"><span>Validation status <i>Required</i></span><select name="validation" defaultValue="Proposed" required>{validationStatuses.map((status) => <option key={status}>{status}</option>)}</select></label></div>
        <TextAreaField name="description" label="What did you add, change, or learn?" placeholder="Describe your contribution and when it may be useful." required />
        <TextAreaField name="implementation" label="Implementation details" placeholder="Relevant steps or code notes." />
        <TextField name="context" label="Relevant technologies or context" placeholder="e.g. REST API, integration environment" />
        <TextField name="author" label="Your display name" placeholder="How should this contribution be credited?" required />
      </FormSection>
      <AttachmentPicker />
      <div className="publish-notice"><Icon name="shield" size={18} /><div><strong>Keep it public-safe</strong><p>This is an unauthenticated demo. Names are self-reported, and contributions and files will be public when a backend is connected.</p></div></div>
      <div className="form-actions"><button className="button button-quiet" type="button" onClick={onCancel}>Cancel</button><div><span className="form-disclaimer">Prototype only · not saved to a server</span><button className="button button-primary" type="submit">Add contribution <Icon name="arrow" size={16} /></button></div></div>
    </form>
  </FormLayout>
}

function FormLayout({ eyebrow, title, text, back, children }: { eyebrow: string; title: string; text: string; back: () => void; children: ReactNode }) {
  return <div className="inner-page form-page"><button className="back-link" onClick={back}><Icon name="arrowLeft" size={16} /> Back</button><div className="form-page-header"><div className="eyebrow eyebrow-quiet">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div><div className="form-page-layout"><div className="form-main">{children}</div><aside className="form-aside"><div className="aside-card"><div className="aside-card-mark"><Icon name="spark" size={18} /></div><div className="eyebrow eyebrow-quiet">A QUICK REMINDER</div><h3>Write for the next SE.</h3><p>Keep it clear enough to use, specific enough to trust, and safe to share.</p><div className="aside-rule" /><ul><li><span>01</span> Anonymize customer context</li><li><span>02</span> Include what you actually tried</li><li><span>03</span> Say what the next person can reuse</li></ul></div><div className="storage-aside-note"><Icon name="upload" size={16} /><span>File storage will be connected in a later milestone. Selected files are held in this tab only.</span></div></aside></div></div>
}

function FormSection({ number, title, help, children }: { number: string; title: string; help: string; children: ReactNode }) {
  return <section className="form-section"><div className="form-section-heading"><span>{number}</span><div><h2>{title}</h2><p>{help}</p></div></div><div className="form-section-fields">{children}</div></section>
}

function TextField({ name, label, placeholder, required, hint }: { name: string; label: string; placeholder: string; required?: boolean; hint?: string }) {
  return <label className="form-field"><span>{label}{required && <i>Required</i>}</span><input name={name} placeholder={placeholder} required={required} />{hint && <small>{hint}</small>}</label>
}

function TextAreaField({ name, label, placeholder, required, maxLength }: { name: string; label: string; placeholder: string; required?: boolean; maxLength?: number }) {
  return <label className="form-field"><span>{label}{required && <i>Required</i>}</span><textarea name={name} placeholder={placeholder} required={required} maxLength={maxLength} rows={3} /></label>
}

function AttachmentPicker() {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const allow = ['.md', '.txt', '.json', '.csv', '.pdf', '.png', '.jpg', '.jpeg', '.yaml', '.yml']
  function addFiles(list: FileList | null) {
    if (!list) return
    const next = Array.from(list)
    const invalid = next.find((file) => !allow.some((extension) => file.name.toLowerCase().endsWith(extension)) || file.size > 5 * 1024 * 1024)
    if (invalid) {
      setError(`${invalid.name} isn't allowed. Choose a supported file up to 5 MB.`)
      if (inputRef.current) {
        const transfer = new DataTransfer()
        files.forEach((file) => transfer.items.add(file))
        inputRef.current.files = transfer.files
      }
      return
    }
    setError('')
    const combined = [...files, ...next].slice(0, 5)
    setFiles(combined)
    if (inputRef.current) {
      const transfer = new DataTransfer()
      combined.forEach((file) => transfer.items.add(file))
      inputRef.current.files = transfer.files
    }
  }
  function removeFile(name: string) {
    const remaining = files.filter((file) => file.name !== name)
    setFiles(remaining)
    if (inputRef.current) {
      const transfer = new DataTransfer()
      remaining.forEach((file) => transfer.items.add(file))
      inputRef.current.files = transfer.files
    }
  }
  return <div className="attachment-form-section">
    <div className="form-section-heading"><span>04</span><div><h2>Supporting files <small>Optional</small></h2><p>Attach a small example or a short guide.</p></div></div>
    <div className="form-section-fields">
      <label className="dropzone"><input ref={inputRef} type="file" name="attachments" multiple accept={allow.join(',')} onChange={(event) => addFiles(event.target.files)} /><span className="dropzone-icon"><Icon name="upload" size={20} /></span><strong>Choose files to attach</strong><span>Markdown, text, JSON, CSV, PDF, PNG, JPG, YAML · up to 5 MB each</span><small>Prototype only. Files stay in this tab and are not uploaded.</small></label>
      {error && <div className="form-error" role="alert">{error}</div>}
      {files.length > 0 && <div className="selected-files">{files.map((file) => <div className="selected-file" key={`${file.name}-${file.lastModified}`}><span className="resource-file-icon"><Icon name="file" size={16} /></span><span><strong>{file.name}</strong><small>{formatSize(file.size)}</small></span><button type="button" aria-label={`Remove ${file.name}`} onClick={() => removeFile(file.name)}><Icon name="close" size={15} /></button></div>)}</div>}
      <TextField name="fileDescription" label="File description" placeholder="What should someone know before opening this file?" />
    </div>
  </div>
}

function handleFormSubmit(event: FormEvent<HTMLFormElement>, callback: (values: Record<string, string>, files: File[]) => void) {
  event.preventDefault()
  const form = event.currentTarget
  if (!form.reportValidity()) return
  const data = new FormData(form)
  const values: Record<string, string> = {}
  data.forEach((value, key) => { if (typeof value === 'string' && key !== 'attachments') values[key] = value })
  const files = data.getAll('attachments').filter((value): value is File => value instanceof File && value.name.length > 0)
  callback(values, files)
}

function EmptyState({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return <div className="empty-state"><span className="empty-icon"><Icon name="search" size={21} /></span><h3>{title}</h3><p>{text}</p>{action}</div>
}

function NotFound({ navigate }: { navigate: (path: string) => void }) {
  return <div className="inner-page"><EmptyState title="We couldn't find that use case" text="It may have moved or the link may be incomplete." action={<button className="button button-primary" onClick={() => navigate('/explore')}>Back to the library</button>} /></div>
}

function slug(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) }
function formatDate(date: Date) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date) }
function formatSize(bytes: number) { return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB` }
function fileToResource(file: File, description: string): Resource { return { id: `${file.name}-${file.lastModified}`, name: file.name, kind: file.name.split('.').pop()?.toUpperCase() || 'FILE', size: formatSize(file.size), description: description.trim() || 'Supporting file added in this demo.', file } }
function initials(name: string) { return name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'SE' }
function avatarColor(name: string) { const colors = ['avatar-purple', 'avatar-peach', 'avatar-blue', 'avatar-mint', 'avatar-pink']; const number = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0); return colors[number % colors.length] }
function downloadResource(resource: Resource) {
  let url: string
  if (resource.file) url = URL.createObjectURL(resource.file)
  else url = URL.createObjectURL(new Blob([resource.contents || `# ${resource.name}\n\n${resource.description}\n\nSynthetic portfolio demo file.`], { type: resource.kind === 'JSON' ? 'application/json' : 'text/plain' }))
  const link = document.createElement('a')
  link.href = url
  link.download = resource.name
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export default App
