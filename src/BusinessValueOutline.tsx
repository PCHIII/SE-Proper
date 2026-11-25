import { useRef, useState } from 'react'
import type { LeadershipStory, UseCase } from './data'

const storyParts = [
  { key: 'challenge', sourceLabel: 'The challenge', label: 'What problem does leadership care about?', hint: 'Start with a situation, risk, or decision they recognize.' },
  { key: 'solution', sourceLabel: 'The solution', label: 'What changes in practice?', hint: 'Explain what people or systems do differently in everyday language.' },
  { key: 'outcome', sourceLabel: 'The business outcome', label: 'Why does that change matter?', hint: 'Use a supported result. If the outcome is still a goal, say so.' },
] as const

const emptyStory: LeadershipStory = { challenge: '', solution: '', outcome: '' }

export default function BusinessValueOutline({ item }: { item: UseCase }) {
  const [applying, setApplying] = useState(false)
  const [draft, setDraft] = useState(item.leadershipStory ?? emptyStory)
  const [copyStatus, setCopyStatus] = useState('')
  const previewRef = useRef<HTMLParagraphElement>(null)
  const original = {
    challenge: item.ask,
    solution: item.solution,
    outcome: item.outcome === 'Not specified' ? 'Add the customer’s desired outcome and how success could be measured.' : item.outcome,
  }
  const paragraphs = storyParts.map(({ key }) => draft[key].trim())
  const leadershipVersion = paragraphs.every(Boolean) ? paragraphs.join(' ') : ''
  const sourceOutline = <div className="story-outline-grid">
    {storyParts.map(({ key, sourceLabel }) => <div key={key}><span>{sourceLabel}</span><p>{original[key]}</p></div>)}
  </div>

  async function copyStory() {
    try {
      await navigator.clipboard.writeText(leadershipVersion)
      setCopyStatus('Leadership version copied.')
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

  return <section className="story-outline-section">
    <div className="eyebrow eyebrow-quiet">STORY OUTLINE</div>
    <h3>A value story the customer can share</h3>
    {applying ? <details className="feynman-disclosure"><summary>Review the original story</summary>{sourceOutline}</details> : sourceOutline}

    <div className="feynman-option">
      <div className="feynman-option-heading">
        <div><h4>Presenting to business leadership?</h4><p>{item.leadershipStory ? 'Edit a prepared talk track that explains this use case in everyday language.' : 'Use this outline to write a short talk track about this use case in everyday language.'}</p></div>
        <button type="button" className="button button-outline" aria-expanded={applying} aria-controls="feynman-story-editor" onClick={() => { setApplying(!applying); setCopyStatus('') }}>
          {applying ? 'Hide leadership version' : 'Apply the Feynman Technique'}
        </button>
      </div>
      <details className="feynman-disclosure">
        <summary>What is the Feynman Technique?</summary>
        <p>Inspired by physicist Richard Feynman, the technique uses a simple explanation to test your understanding. In a customer demo, start with a problem the audience knows, explain what changes in everyday language, and connect it to a business result you can support.</p>
        <p>Try it on a teammate unfamiliar with the implementation. Can they explain what changes and why it matters in their own words? If they get stuck, revise that part.</p>
      </details>
    </div>

    <section id="feynman-story-editor" className="feynman-editor" aria-labelledby="feynman-story-heading" hidden={!applying}>
      <h4 id="feynman-story-heading">{item.leadershipStory ? 'Sample AI draft' : 'Leadership version'}</h4>
      <p>{item.leadershipStory ? 'Edit this draft to fit your audience before you share it.' : 'The demo use cases have sample AI drafts. Use the original story above to write a short explanation in your own words.'}</p>
      <div className="feynman-fields">
        {storyParts.map(({ key, label, hint }) => <div key={key} className="form-field">
          <label htmlFor={`feynman-${key}`}>{label}</label>
          <textarea id={`feynman-${key}`} aria-describedby={`feynman-${key}-hint`} rows={2} value={draft[key]} onChange={(event) => {
            setDraft({ ...draft, [key]: event.target.value })
            setCopyStatus('')
          }} />
          <small id={`feynman-${key}-hint`}>{hint}</small>
        </div>)}
      </div>
      {leadershipVersion && <div className="feynman-preview">
        <h5>Talk track</h5>
        <p ref={previewRef}>{leadershipVersion}</p>
        <div className="feynman-copy">
          <button type="button" className="button button-outline" onClick={copyStory}>Copy leadership version</button>
          <span role="status">{copyStatus}</span>
        </div>
      </div>}
      {!leadershipVersion && <p className="feynman-preview-hint">Fill in all three answers to preview and copy your talk track.</p>}
    </section>
  </section>
}
