import { useState, type Dispatch, type FormEvent, type ReactNode } from 'react'
import { initials } from './initials'
import { remainingSpots, shadowProfiles, shadowStages, type ShadowAction, type ShadowDraft, type ShadowEvent, type ShadowProfile } from './shadowEvents'
import './shadow.css'

const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
const shortMonth = new Intl.DateTimeFormat('en-US', { month: 'short' })
const dayOfMonth = new Intl.DateTimeFormat('en-US', { day: 'numeric' })
const fullDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })
const shortDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const views = ['Upcoming', 'My requests', 'Hosting'] as const
const stageDescriptions: Record<ShadowEvent['stage'], string> = {
  Discovery: 'Often the first customer call. Listen for how the team learns what the customer needs.',
  Demo: 'Watch how the SE shows a solution in the context of the customer’s needs.',
  POC: 'Listen for what the team will test in the proof of concept and how they’ll judge success.',
}

function dateKey(value: Date | number) {
  const date = new Date(value)
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map((part) => String(part).padStart(2, '0')).join('-')
}

function spotLabel(spots: number) {
  return `${spots} ${spots === 1 ? 'spot' : 'spots'}`
}

function requestLabel(event: ShadowEvent, profile: ShadowProfile, now: number) {
  if (event.guests.includes(profile)) return 'Invited'
  if (event.start <= now) return 'Session started'
  return remainingSpots(event) ? 'Pending approval' : 'No spots left'
}

export default function Shadow({ events, dispatch }: { events: ShadowEvent[]; dispatch: Dispatch<ShadowAction> }) {
  const [profile, setProfile] = useState<ShadowProfile>('maya')
  const [view, setView] = useState<typeof views[number]>('Upcoming')
  const [layout, setLayout] = useState<'Calendar' | 'List'>('Calendar')
  const [month, setMonth] = useState(() => new Date(events.find((event) => event.start > Date.now())?.start ?? Date.now()))
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [composing, setComposing] = useState(false)
  const [message, setMessage] = useState('')
  const now = Date.now()
  const ordered = [...events].sort((first, second) => first.start - second.start)
  const upcoming = ordered.filter((event) => event.start > now)
  const hosting = ordered.filter((event) => event.host === profile)
  const requested = ordered.filter((event) => event.requests.includes(profile))
  const pending = hosting.reduce((count, event) => {
    if (event.start <= now || !remainingSpots(event)) return count
    return count + event.requests.filter((requester) => !event.guests.includes(requester)).length
  }, 0)
  const calendarEvents = upcoming.filter((event) => {
    const date = new Date(event.start)
    return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear()
  })
  const visibleEvents = layout === 'List' ? upcoming : calendarEvents.filter((event) => selectedDay === null || new Date(event.start).getDate() === selectedDay)

  function publish(draft: ShadowDraft) {
    dispatch({ type: 'publish', actor: profile, now: Date.now(), draft })
    setComposing(false)
    setMonth(new Date(draft.start))
    setSelectedDay(null)
    setView('Hosting')
    setMessage(`${draft.topic} was added to the Shadow calendar.`)
  }

  function changeView(nextView: typeof view) {
    setView(nextView)
    setMessage('')
  }

  return (
    <div className="inner-page shadow-page">
      <header className="shadow-heading">
        <div>
          <h1>Shadow</h1>
          <p>Join a customer call to listen and learn how another SE leads it. Use the engagement stage to choose what to observe. Once the host approves your request, you’ll be added to the meeting invite.</p>
        </div>
        <button className="button button-primary" type="button" aria-expanded={composing} aria-controls="shadow-compose" onClick={() => setComposing(!composing)}>
          {composing ? 'Close form' : 'Open for shadowing'}
        </button>
      </header>

      <div className="shadow-demo-bar">
        <p><strong>Calendar demo</strong> Changes stay in this tab. Email invitations are simulated.</p>
        <label>Demo profile
          <select value={profile} onChange={(event) => {
            setProfile(event.currentTarget.value as ShadowProfile)
            setComposing(false)
            setMessage('')
          }}>
            {Object.entries(shadowProfiles).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
          </select>
        </label>
      </div>

      <div id="shadow-compose" hidden={!composing}>
        {composing && <ShadowForm profile={profile} onPublish={publish} onCancel={() => setComposing(false)} />}
      </div>

      <nav aria-label="Shadow views" className="shadow-views">
        {views.map((item) => <button key={item} type="button" aria-current={view === item ? 'page' : undefined} onClick={() => changeView(item)}>
          {item}{item === 'Hosting' && pending > 0 && <span className="shadow-count" aria-label={`${pending} pending ${pending === 1 ? 'request' : 'requests'}`}>{pending}</span>}
        </button>)}
      </nav>
      <div className="shadow-announcement" role="status">{message}</div>

      {view === 'Upcoming' && <section aria-labelledby="shadow-upcoming-title">
        <div className="shadow-section-heading">
          <h2 id="shadow-upcoming-title">Upcoming customer sessions</h2>
          <div className="shadow-toggle" role="group" aria-label="Schedule view">
            {(['Calendar', 'List'] as const).map((item) => <button key={item} type="button" aria-pressed={layout === item} onClick={() => setLayout(item)}>{item}</button>)}
          </div>
        </div>
        <div className={layout === 'Calendar' ? 'shadow-calendar-layout' : ''}>
          {layout === 'Calendar' && <ShadowCalendar month={month} selectedDay={selectedDay} events={calendarEvents} onMonthChange={(offset) => {
            setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1))
            setSelectedDay(null)
          }} onDayChange={(day) => setSelectedDay(selectedDay === day ? null : day)} />}
          <div className="shadow-events">
            {layout === 'Calendar' && selectedDay !== null && <div className="shadow-date-filter">
              <strong>{shortDate.format(new Date(month.getFullYear(), month.getMonth(), selectedDay))}</strong>
              <button className="text-button" type="button" onClick={() => setSelectedDay(null)}>Show all dates</button>
            </div>}
            {visibleEvents.map((event) => {
              const available = remainingSpots(event)
              const alreadyRequested = event.requests.includes(profile)
              return <ShadowCard key={event.id} event={event}>
                <div className="shadow-card-actions">
                  <span>{available ? `${spotLabel(available)} open` : 'Session full'}</span>
                  {event.host === profile ? <button className="button button-outline" type="button" onClick={() => changeView('Hosting')}>Manage requests</button>
                    : alreadyRequested ? <span className="shadow-status" data-invited={event.guests.includes(profile)}>{requestLabel(event, profile, now)}</span>
                    : available > 0 && <button className="button button-outline" type="button" aria-label={`Request to shadow ${event.topic}`} onClick={() => {
                      dispatch({ type: 'request', actor: profile, eventId: event.id, now: Date.now() })
                    }}>Request to shadow</button>}
                </div>
              </ShadowCard>
            })}
            {!visibleEvents.length && <p className="shadow-empty">No upcoming sessions {layout === 'Calendar' ? 'this month.' : 'yet.'}</p>}
          </div>
        </div>
      </section>}

      {view === 'My requests' && <section className="shadow-events" aria-label="My shadow requests">
        {requested.map((event) => {
          const invited = event.guests.includes(profile)
          return <ShadowCard key={event.id} event={event}>
            <div className="shadow-card-actions"><span className="shadow-status" data-invited={invited}>{requestLabel(event, profile, now)}</span></div>
            {invited && <p className="shadow-invite">You’re on the guest list for this Shadow calendar event.</p>}
          </ShadowCard>
        })}
        {!requested.length && <p className="shadow-empty">Your requests will appear here after you ask to shadow a session.</p>}
      </section>}

      {view === 'Hosting' && <section className="shadow-events" aria-label="Sessions I’m hosting">
        {hosting.map((event) => <ShadowCard key={event.id} event={event}>
          <div className="shadow-hosting">
            <div className="shadow-roster"><strong>Guest list</strong><span>{event.guests.map((guest) => shadowProfiles[guest]).join(', ') || 'No shadow guests yet'}</span></div>
            <h4>Shadow requests</h4>
            {event.requests.length === 0 && <p>No requests yet.</p>}
            {event.requests.map((requester) => {
              const invited = event.guests.includes(requester)
              const canApprove = !invited && event.start > now && remainingSpots(event) > 0
              return <div className="shadow-request-row" key={requester}>
                <span>{shadowProfiles[requester]}</span>
                {canApprove ? <button className="button button-outline" type="button" aria-label={`Approve ${shadowProfiles[requester]} for ${event.topic}`} onClick={() => {
                  dispatch({ type: 'approve', actor: profile, eventId: event.id, requester, now: Date.now() })
                }}>Approve and invite</button> : <span className="shadow-status" data-invited={invited}>{requestLabel(event, requester, now)}</span>}
              </div>
            })}
          </div>
        </ShadowCard>)}
        {!hosting.length && <p className="shadow-empty">Open a session for shadowing to see requests and manage its guest list here.</p>}
      </section>}
    </div>
  )
}

function ShadowCalendar({ month, events, selectedDay, onMonthChange, onDayChange }: {
  month: Date
  events: ShadowEvent[]
  selectedDay: number | null
  onMonthChange: (offset: number) => void
  onDayChange: (day: number) => void
}) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const offset = new Date(year, monthIndex, 1).getDay()
  const lastDay = new Date(year, monthIndex + 1, 0).getDate()
  const today = dateKey(Date.now())
  const scheduleByDay = new Map<number, { count: number; openHosts: Set<ShadowProfile> }>()
  for (const event of events) {
    const day = new Date(event.start).getDate()
    const schedule = scheduleByDay.get(day) ?? { count: 0, openHosts: new Set<ShadowProfile>() }
    schedule.count++
    if (remainingSpots(event) > 0) schedule.openHosts.add(event.host)
    scheduleByDay.set(day, schedule)
  }

  return <section className="shadow-calendar" aria-label="Shadow calendar">
    <div className="shadow-calendar-heading">
      <h3 aria-live="polite">{monthYear.format(month)}</h3>
      <div className="shadow-month-controls">
        <button type="button" aria-label="Previous month" onClick={() => onMonthChange(-1)}>‹</button>
        <button type="button" aria-label="Next month" onClick={() => onMonthChange(1)}>›</button>
      </div>
    </div>
    <div className="shadow-calendar-grid">
      {weekdays.map((day) => <span className="shadow-weekday" key={day}>{day}</span>)}
      {Array.from({ length: offset }, (_, index) => <span key={`offset-${index}`} aria-hidden="true" />)}
      {Array.from({ length: lastDay }, (_, index) => {
        const day = index + 1
        const date = new Date(year, monthIndex, day)
        const schedule = scheduleByDay.get(day)
        const isToday = dateKey(date) === today
        if (!schedule) return <span className="shadow-day" key={day} aria-current={isToday ? 'date' : undefined}>{day}</span>

        const { count, openHosts } = schedule
        const names = Array.from(openHosts, (host) => shadowProfiles[host])
        const availability = names.length ? `open spots with ${names.join(', ')}` : 'no open spots'
        return <button
          key={day}
          className="shadow-day shadow-day-event"
          type="button"
          aria-current={isToday ? 'date' : undefined}
          aria-pressed={selectedDay === day}
          aria-label={`${fullDate.format(date)}, ${count} ${count === 1 ? 'session' : 'sessions'}, ${availability}`}
          onClick={() => onDayChange(day)}
        >
          {names.length > 0 && <span className="shadow-day-hosts" aria-hidden="true">
            {names.map((name) => <span key={name} className="shadow-day-initials" title={name}><span>{initials(name)}</span></span>)}
          </span>}
          {day}
        </button>
      })}
    </div>
    <p>Initials show SEs with open spots. Select a marked date to see its sessions.</p>
  </section>
}

function ShadowCard({ event, children }: { event: ShadowEvent; children: ReactNode }) {
  return <article className="shadow-card">
    <div className="shadow-card-main">
      <div className="shadow-date-tile" aria-hidden="true"><span>{shortMonth.format(event.start)}</span><strong>{dayOfMonth.format(event.start)}</strong></div>
      <div className="shadow-card-info">
        <time dateTime={new Date(event.start).toISOString()}>{shortDate.format(event.start)} · {time.formatRange(event.start, event.end)}</time>
        <h3>{event.topic}</h3>
        <dl className="shadow-details">
          <div><dt>AE name</dt><dd>{event.aeName || 'Unspecified'}</dd></div>
          <div><dt>SE name</dt><dd>{shadowProfiles[event.host]}</dd></div>
          <div><dt>Customer name</dt><dd>{event.customerName || 'Unspecified'}</dd></div>
          <div><dt>Stage</dt><dd><span className="shadow-stage">{event.stage}</span><span className="shadow-stage-description">{stageDescriptions[event.stage]}</span></dd></div>
        </dl>
        {event.customerContext && <p className="shadow-context">{event.customerContext}</p>}
        <p className="shadow-takeaway">{event.takeaway}</p>
        {event.notes && <div className="shadow-notes">
          <h4>Planned agenda</h4>
          <p>{event.notes}</p>
        </div>}
      </div>
    </div>
    {children}
  </article>
}

function ShadowForm({ profile, onPublish, onCancel }: { profile: ShadowProfile; onPublish: (draft: ShadowDraft) => void; onCancel: () => void }) {
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const topic = String(fields.get('topic')).trim()
    const takeaway = String(fields.get('takeaway')).trim()
    const stage = shadowStages.find((option) => option === fields.get('stage'))
    const start = new Date(String(fields.get('start'))).getTime()
    if (!topic || !takeaway) return setError('Enter a session title and what an SE can learn.')
    if (!stage) return setError('Choose an engagement stage.')
    if (!Number.isFinite(start) || start <= Date.now()) return setError('Choose a date and start time in the future.')

    onPublish({
      id: crypto.randomUUID(),
      topic,
      aeName: String(fields.get('aeName')).trim(),
      customerName: String(fields.get('customerName')).trim(),
      stage,
      takeaway,
      notes: String(fields.get('notes')).trim(),
      start,
      end: start + Number(fields.get('duration')) * 60_000,
      spots: Number(fields.get('spots')),
      customerContext: String(fields.get('customerContext')).trim(),
    })
  }

  return <form className="shadow-form" onSubmit={submit}>
    <h2>Open a customer session for shadowing</h2>
    <label>Customer-facing session title<input name="topic" required maxLength={100} placeholder="e.g. Automate employee onboarding and offboarding" /></label>
    <div className="shadow-form-details">
      <label>AE name<input name="aeName" maxLength={100} /></label>
      <label>SE name<input value={shadowProfiles[profile]} readOnly /></label>
      <label>Customer name<input name="customerName" maxLength={100} /></label>
      <label>Engagement stage<select name="stage" defaultValue="" required>
        <option value="" disabled>Choose a stage</option>
        {shadowStages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
      </select></label>
    </div>
    <div className="shadow-form-fields">
      <label>Start time ({Intl.DateTimeFormat().resolvedOptions().timeZone})<input name="start" type="datetime-local" required /></label>
      <label>Duration<select name="duration" defaultValue="45">{[15, 30, 45, 60, 90, 120].map((minutes) => <option key={minutes} value={minutes}>{minutes} minutes</option>)}</select></label>
      <label>Shadow spots<input name="spots" type="number" min="1" max="5" defaultValue="2" required /></label>
    </div>
    <label>Customer context (optional)<input name="customerContext" maxLength={80} placeholder="e.g. Healthcare IT team evaluating automated provisioning" /></label>
    <label>What should observers listen for?<textarea name="takeaway" required maxLength={300} rows={3} placeholder="e.g. How I ask about a recent delay and find out what needs to change." /></label>
    <label>Planned agenda (optional)<textarea name="notes" maxLength={1000} rows={3} placeholder="What topics or questions will this session cover?" /></label>
    {error && <p className="shadow-error" role="alert">{error}</p>}
    <div className="shadow-form-actions">
      <button className="button button-primary" type="submit">Post to Shadow calendar</button>
      <button className="button button-quiet" type="button" onClick={onCancel}>Cancel</button>
    </div>
  </form>
}
