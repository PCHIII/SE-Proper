import { useRef, useState } from 'react'
import { audiencePrompts, businessValueExamples, storyAudiences, type StoryAudience } from './businessValueExamples'
import type { LeadershipStory, UseCase } from './data'

const storyParts = [
  { key: 'challenge', sourceLabel: 'Customer challenge', label: 'What problem matters to this audience?', hint: 'Start with a situation, risk, or decision they recognize.' },
  { key: 'solution', sourceLabel: 'What changed', label: 'What changes in practice?', hint: 'Explain what people or systems do differently.' },
  { key: 'outcome', sourceLabel: 'Documented outcome', label: 'Why does that change matter?', hint: 'Use a supported result. If the outcome is still a goal, say so.' },
] as const

const emptyStory: LeadershipStory = { challenge: '', solution: '', outcome: '' }

export default function BusinessValueOutline({ item }: { item: UseCase }) {
  const [audience, setAudience] = useState<StoryAudience | ''>('')
  const [applying, setApplying] = useState(false)
  const [drafts, setDrafts] = useState<Partial<Record<StoryAudience, LeadershipStory>>>({})
  const [copyStatus, setCopyStatus] = useState('')
  const previewRef = useRef<HTMLParagraphElement>(null)
  const example = item.leadershipStory ? businessValueExamples[item.id] : undefined
  const preparedDraft = audience && example && item.leadershipStory
    ? { challenge: item.leadershipStory.challenge, ...example.audiences[audience] }
    : item.leadershipStory
  const draft = (audience && drafts[audience]) || preparedDraft || emptyStory
  const extractedValue = {
    challenge: item.leadershipStory?.challenge ?? item.ask,
    solution: item.leadershipStory?.solution ?? item.solution,
    outcome: item.outcome && item.outcome !== 'Not specified' ? item.outcome : 'No outcome has been documented for this use case yet.',
  }
  const paragraphs = storyParts.map(({ key }) => draft[key].trim())
  const talkTrack = paragraphs.every(Boolean) ? paragraphs.join(' ') : ''

  async function copyStory() {
    try {
      await navigator.clipboard.writeText(talkTrack)
      setCopyStatus('Talk track copied.')
    } catch {
      const selection = window.getSelection()
      if (selection && previewRef.current) {
        const range = document.createRange()
        range.selectNodeContents(previewRef.current)
        selection.removeAllRanges()
        selection.addRange(range)
        setCopyStatus('Story selected. Use your keyboard or menu to copy it.')
      }
    }
  }

  return <>
    <section className="story-outline-section" aria-labelledby="business-value-heading">
      <h3 id="business-value-heading">1. Extract the business value</h3>
      <div className="story-outline-grid">
        {storyParts.map(({ key, sourceLabel }) => <div key={key}><span>{sourceLabel}</span><p>{extractedValue[key]}</p></div>)}
      </div>
      <p className="story-validation"><strong>What to validate</strong><br />{example?.measure ?? 'Identify one result the customer cares about and what you could measure or show in the next demo.'}</p>
      <details className="feynman-disclosure">
        <summary>Business value discovery questions</summary>
        <ul className="story-question-list">
          <li>What business goal was the customer trying to reach?</li>
          <li>What changed for the people or process after this solution?</li>
          <li>What metric or evidence could demonstrate the impact?</li>
        </ul>
      </details>
    </section>

    <section className="story-outline-section feynman-option" aria-labelledby="feynman-heading">
      <h3 id="feynman-heading">2. Apply the Feynman Technique</h3>
      <p>The Feynman Technique takes the business value and customizes the story for your audience.</p>
      <div className="feynman-controls">
        <div className="form-field">
          <label htmlFor="feynman-audience">Audience</label>
          <select id="feynman-audience" value={audience} onChange={(event) => {
            setAudience(event.target.value as StoryAudience | '')
            setApplying(false)
            setCopyStatus('')
          }}>
            <option value="" disabled>Choose an audience</option>
            {storyAudiences.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>
        <button type="button" className="button button-outline" disabled={!audience} aria-expanded={applying} aria-controls="feynman-story-editor" onClick={() => { setApplying(!applying); setCopyStatus('') }}>
          {applying ? 'Hide talk track' : 'Apply the Feynman Technique'}
        </button>
      </div>
      {audience && <p>{audiencePrompts[audience]}</p>}
      <details className="feynman-disclosure">
        <summary>What is the Feynman Technique?</summary>
        <p>Inspired by physicist Richard Feynman, the technique uses a simple explanation to test your understanding. In a customer demo, start with a problem the audience knows, explain what changes in everyday language, and connect it to a business result you can support.</p>
        <p>Try it on a teammate unfamiliar with the implementation. Can they explain what changes and why it matters in their own words? If they get stuck, revise that part.</p>
      </details>

      <section id="feynman-story-editor" className="feynman-editor" aria-labelledby="feynman-story-heading" hidden={!applying}>
        <h4 id="feynman-story-heading">{audience} talk track</h4>
        <p>{preparedDraft ? 'Edit this prepared example to fit your demo.' : 'Use the business value above to write a short explanation for your chosen audience.'}</p>
        <div className="feynman-fields">
          {storyParts.map(({ key, label, hint }) => <div key={key} className="form-field">
            <label htmlFor={`feynman-${key}`}>{label}</label>
            <textarea id={`feynman-${key}`} aria-describedby={`feynman-${key}-hint`} rows={2} value={draft[key]} onChange={(event) => {
              const value = event.target.value
              if (audience) setDrafts((current) => ({ ...current, [audience]: { ...(current[audience] ?? draft), [key]: value } }))
              setCopyStatus('')
            }} />
            <small id={`feynman-${key}-hint`}>{hint}</small>
          </div>)}
        </div>
        {applying && talkTrack && <div className="feynman-preview">
          <h5>Preview</h5>
          <p ref={previewRef}>{talkTrack}</p>
          <div className="feynman-copy">
            <button type="button" className="button button-outline" onClick={copyStory}>Copy talk track</button>
            <span role="status">{copyStatus}</span>
          </div>
        </div>}
        {!talkTrack && <p className="feynman-preview-hint">Fill in all three answers to preview and copy your talk track.</p>}
      </section>
    </section>
  </>
}
