export const shadowProfiles = {
  maya: 'Maya Patel',
  jordan: 'Jordan Lee',
  riley: 'Riley Morgan',
} as const

export type ShadowProfile = keyof typeof shadowProfiles

export type ShadowEvent = {
  id: string
  topic: string
  customerContext: string
  takeaway: string
  host: ShadowProfile
  start: number
  end: number
  spots: number
  requests: ShadowProfile[]
  guests: ShadowProfile[]
}

export type ShadowDraft = Pick<ShadowEvent, 'id' | 'topic' | 'customerContext' | 'takeaway' | 'start' | 'end' | 'spots'>

export type ShadowAction = { actor: ShadowProfile; now: number } & (
  | { type: 'publish'; draft: ShadowDraft }
  | { type: 'request'; eventId: string }
  | { type: 'approve'; eventId: string; requester: ShadowProfile }
)

function upcomingWorkday(now: Date, workdays: number, hour: number, minute: number) {
  const date = new Date(now)
  while (workdays > 0) {
    date.setDate(date.getDate() + 1)
    if (date.getDay() !== 0 && date.getDay() !== 6) workdays--
  }
  date.setHours(hour, minute, 0, 0)
  return date.getTime()
}

export function createShadowState(now = new Date()): ShadowEvent[] {
  const samples: (Omit<ShadowEvent, 'start' | 'end' | 'guests'> & { workdays: number; hour: number; minute: number; duration: number })[] = [
    {
      id: 'identity', host: 'maya', topic: 'SSO and SCIM provisioning', customerContext: 'Enterprise healthcare',
      takeaway: 'See how Maya handles identity-provider questions and scopes a phased rollout.',
      workdays: 1, hour: 14, minute: 0, duration: 45, spots: 2, requests: ['riley'],
    },
    {
      id: 'webhooks', host: 'jordan', topic: 'Webhook retries and replay', customerContext: 'Fintech platform',
      takeaway: 'Watch Jordan reproduce a failed delivery, then explain how replay and deduplication work together.',
      workdays: 2, hour: 11, minute: 30, duration: 30, spots: 1, requests: [],
    },
    {
      id: 'discovery', host: 'riley', topic: 'Discovery into a live workflow demo', customerContext: 'Logistics operations',
      takeaway: 'See how Riley uses a buyer’s discovery answers to decide what to show live and what to skip.',
      workdays: 4, hour: 13, minute: 0, duration: 60, spots: 2, requests: [],
    },
  ]

  return samples.map(({ workdays, hour, minute, duration, ...event }) => {
    const start = upcomingWorkday(now, workdays, hour, minute)
    return { ...event, start, end: start + duration * 60_000, guests: [] }
  })
}

export function remainingSpots(event: ShadowEvent) {
  return event.spots - event.guests.length
}

export function shadowReducer(events: ShadowEvent[], action: ShadowAction): ShadowEvent[] {
  if (action.type === 'publish') {
    const { draft } = action
    if (events.some((event) => event.id === draft.id)) return events
    return [...events, { ...draft, host: action.actor, requests: [], guests: [] }]
  }

  const event = events.find((item) => item.id === action.eventId)
  if (!event || event.start <= action.now || remainingSpots(event) <= 0) return events

  if (action.type === 'request') {
    if (event.host === action.actor || event.requests.includes(action.actor)) return events
    return events.map((item) => item === event ? { ...item, requests: [...item.requests, action.actor] } : item)
  }

  const { requester } = action
  if (event.host !== action.actor || !event.requests.includes(requester) || event.guests.includes(requester)) return events
  return events.map((item) => item === event ? { ...item, guests: [...item.guests, requester] } : item)
}
