const coreScenarios = [
  {
    question: 'I get pressed on an answer I don’t know?',
    action: 'Clarify the question. Say what you can verify, then agree on when you’ll follow up and who needs the answer.',
    script: 'I want to verify how that works in your configuration. Is that answer needed for a decision today? I’ll confirm when I can get it back to you.',
  },
  {
    question: 'The demo throws an error?',
    action: 'Pause and say what happened. Try one quick fix, then switch to a screenshot, recording, or walkthrough of the result.',
    script: 'This view didn’t load. Let me pull up the result we expected so we can still talk through what your team would see.',
  },
  {
    question: 'They say a competitor already does it better?',
    action: 'Ask which part works better for them. Compare on that criterion and stick to what you can show or verify.',
    script: 'What part works better for your team today? If it’s the approval flow, let’s compare what your team would have to do in each setup.',
  },
  {
    question: 'Someone keeps pushing for another product?',
    action: 'Address their strongest objection directly. Ask whether it’s a decision criterion for the group, then agree on what evidence would settle it.',
    script: 'That sounds like an important requirement. Is this something the team needs to validate before moving forward? What would a successful test look like?',
  },
  {
    question: 'A partner joins unexpectedly?',
    action: 'Ask for a quick introduction and clarify the partner’s role. Hand off only the part they’re ready to cover.',
    script: 'Glad you could join. Could you give us a quick intro and tell us which part you’re involved in? I can pause there if you’d like to weigh in.',
  },
  {
    question: 'They ask to see something I didn’t prepare?',
    action: 'Ask what they want to validate. Show it if your setup can handle it reliably, or agree on a focused follow-up.',
    script: 'What are you hoping to confirm with that example? If I can show it reliably in this setup, let’s take a look.',
  },
  {
    question: 'We suddenly have five minutes left?',
    action: 'Jump to the customer outcome that matters most. Save a minute to hear their reaction and agree on a next step.',
    script: 'Let me jump to what your team would see at the end. Then I’d like to check whether that solves the problem you came in with.',
  },
]

const additionalScenarios = [
  {
    question: 'Nobody reacts or asks questions?',
    action: 'Pause and ask one specific question about their workflow. Give the room a few seconds to think before you continue.',
    script: 'Where would this fit into your process today? I’m especially curious who would own the approval step.',
  },
  {
    question: 'They need a feature we don’t support?',
    action: 'Say plainly what’s available today. Ask whether the requirement is mandatory and discuss only alternatives you can validate.',
    script: 'We don’t support that workflow directly today. Is that exact workflow required, or would another way to get the same result work for your team?',
  },
  {
    question: 'A teammate contradicts me live?',
    action: 'Ask whether you’re talking about the same setup or version. Correct the record if you can, or agree to verify it together after the call.',
    script: 'We may be thinking of different setups. Which one are you referring to? I want to make sure we give everyone a clear answer.',
  },
  {
    question: 'A key decision-maker is missing?',
    action: 'Ask what the people present can validate today. Agree on what to bring back to the person who’s missing.',
    script: 'What can we usefully validate with this group today? Then we can decide what we need to bring back to the decision-maker.',
  },
  {
    question: 'They ask for a price or a discount on the spot?',
    action: 'Capture what they want priced and any deadline. Bring in the person who owns pricing to confirm the numbers.',
    script: 'Is the quote for the team we discussed, or does it need to cover the wider rollout? I’ll take that scope to our account lead for confirmed pricing.',
  },
  {
    question: 'They tell me the priority has changed?',
    action: 'Check what matters now and ask the room to confirm it. Adapt what you can show today and agree on a follow-up if the new priority needs a different demo.',
    script: 'Thanks for flagging that. What would make this call worthwhile for you now? Let’s use the time we have for that.',
  },
]

function Scenario({ question, action, script }: (typeof coreScenarios)[number]) {
  return <details className="zen-scenario" name="go-time-scenarios">
    <summary>{question}</summary>
    <div className="zen-scenario-response">
      <strong>What to do first</strong>
      <p>{action}</p>
      <div className="zen-scenario-script">
        <strong>What to say</strong>
        <blockquote>“{script}”</blockquote>
      </div>
    </div>
  </details>
}

export default function DemoPlaybook() {
  return <section className="zen-card zen-playbook" aria-labelledby="zen-playbook-title">
    <h2 id="zen-playbook-title">What if…?</h2>
    <p>Pick the moment you’re worried about. Practice your first sentence.</p>
    <div className="zen-scenario-list">
      {coreScenarios.map((scenario) => <Scenario key={scenario.question} {...scenario} />)}
    </div>
    <details className="zen-more-scenarios">
      <summary>More situations</summary>
      <div className="zen-scenario-list">
        {additionalScenarios.map((scenario) => <Scenario key={scenario.question} {...scenario} />)}
      </div>
    </details>
  </section>
}
