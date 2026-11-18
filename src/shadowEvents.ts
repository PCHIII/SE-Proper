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
      id: 'identity', host: 'maya', topic: 'Automate employee onboarding and offboarding', customerContext: 'Healthcare IT team',
      takeaway: 'Watch Maya connect the buyer’s onboarding delays to single sign-on and automated provisioning, then handle questions about rolling it out department by department.',
      workdays: 1, hour: 14, minute: 0, duration: 45, spots: 2, requests: ['riley'],
    },
    {
      id: 'webhooks', host: 'jordan', topic: 'Keep payment processing reliable during outages', customerContext: 'Payments engineering team',
      takeaway: 'See how Jordan turns the buyer’s outage scenario into a live demo of retrying a failed payment event and answers questions about duplicate processing.',
      workdays: 2, hour: 11, minute: 30, duration: 30, spots: 1, requests: [],
    },
    {
      id: 'discovery', host: 'riley', topic: 'Route shipment exceptions to the right team', customerContext: 'Logistics operations team',
      takeaway: 'Watch Riley use the buyer’s dispatch process to tailor a demo of shipment exception routing and agree on what the team should validate in a pilot.',
      workdays: 4, hour: 13, minute: 0, duration: 60, spots: 2, requests: [],
    },
    {
      id: 'poc-handoff', host: 'jordan', topic: 'POC hand-off and use case outline', customerContext: 'IT operations team evaluating workflow automation',
      takeaway: 'Watch Jordan turn discovery notes into a use case outline, confirm the buyer’s success criteria, and hand off scope, owners, and next steps for the proof of concept.',
      workdays: 5, hour: 13, minute: 0, duration: 45, spots: 2, requests: [],
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
