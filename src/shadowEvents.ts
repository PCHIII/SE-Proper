export const shadowProfiles = {
  maya: 'Maya Patel',
  jordan: 'Jordan Lee',
  riley: 'Riley Morgan',
} as const

export type ShadowProfile = keyof typeof shadowProfiles

export const shadowStages = ['Discovery', 'Demo', 'POC'] as const

export type ShadowEvent = {
  id: string
  topic: string
  aeName: string
  customerName: string
  stage: (typeof shadowStages)[number]
  customerContext: string
  takeaway: string
  notes: string
  host: ShadowProfile
  start: number
  end: number
  spots: number
  requests: ShadowProfile[]
  guests: ShadowProfile[]
}

export type ShadowDraft = Omit<ShadowEvent, 'host' | 'requests' | 'guests'>

export type ShadowAction = { actor: ShadowProfile; now: number } & (
  | { type: 'publish'; draft: ShadowDraft }
  | { type: 'request'; eventId: string }
  | { type: 'approve'; eventId: string; requester: ShadowProfile }
)

export function createShadowState(): ShadowEvent[] {
  const samples: (Omit<ShadowEvent, 'start' | 'end' | 'guests'> & { localStart: string; duration: number })[] = [
    {
      id: 'identity', host: 'maya', topic: 'Automate employee onboarding and offboarding', customerContext: 'Healthcare IT team',
      aeName: 'Alex Rivera', customerName: 'Cedar Grove Health', stage: 'Demo',
      takeaway: 'Watch Maya connect the buyer’s onboarding delays to single sign-on and automated provisioning, then handle questions about rolling it out department by department.',
      notes: 'The demo will cover single sign-on and automatic access changes when employees join or leave.',
      localStart: '2026-11-23T14:00', duration: 45, spots: 2, requests: ['riley'],
    },
    {
      id: 'ai-agent-ownership', host: 'riley', topic: 'Detect AI agents and assign ownership', customerContext: 'AI platform and governance team',
      aeName: 'Sam Chen', customerName: 'Fieldstone Financial', stage: 'Demo',
      takeaway: 'Watch Riley identify AI agents in a customer’s LLM environment and decide who should be accountable for each one.',
      notes: 'Riley will use sample gateway and workflow logs to identify which AI agents are active, then show how to record each agent and its owner.',
      localStart: '2026-11-23T10:00', duration: 30, spots: 2, requests: [],
    },
    {
      id: 'webhooks', host: 'jordan', topic: 'Keep payment processing reliable during outages', customerContext: 'Payments engineering team',
      aeName: 'Casey Brooks', customerName: 'Harborline Payments', stage: 'Demo',
      takeaway: 'See how Jordan turns the buyer’s outage scenario into a live demo of retrying a failed payment event and answers questions about duplicate processing.',
      notes: '',
      localStart: '2026-11-24T11:30', duration: 30, spots: 1, requests: [],
    },
    {
      id: 'discovery', host: 'riley', topic: 'Discovery call on shipment exception handling', customerContext: 'First discovery call with the logistics operations team',
      aeName: 'Sam Chen', customerName: 'Wayline Logistics', stage: 'Discovery',
      takeaway: 'Listen for how Riley and Sam ask about shipment delays and decide what to explore in a follow-up demo.',
      notes: 'Sam plans to ask who makes the buying decision and how soon the team needs a fix. Riley will ask the customer for a recent example of a shipment problem and explore where the handoff slowed down, who should respond, and how quickly.',
      localStart: '2026-12-02T13:00', duration: 60, spots: 2, requests: [],
    },
    {
      id: 'poc-handoff', host: 'jordan', topic: 'POC hand-off and use case outline', customerContext: 'IT operations team evaluating workflow automation',
      aeName: 'Casey Brooks', customerName: 'Elm Ridge Systems', stage: 'POC',
      takeaway: 'Watch Jordan turn discovery notes into a use case outline, confirm the buyer’s success criteria, and hand off scope, owners, and next steps for the proof of concept.',
      notes: '',
      localStart: '2026-12-04T13:00', duration: 45, spots: 2, requests: [],
    },
  ]

  return samples.map(({ localStart, duration, ...event }) => {
    const start = new Date(localStart).getTime()
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
