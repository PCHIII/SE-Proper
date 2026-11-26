import type { LeadershipStory } from './data'

export const storyAudiences = ['Executive Sponsor', 'Business Process Owner', 'Technical Evaluator', 'Security & Compliance Reviewer', 'Day-to-Day User'] as const
export type StoryAudience = typeof storyAudiences[number]

export const audiencePrompts: Record<StoryAudience, string> = {
  'Executive Sponsor': 'Explain why the change is worth investing in and how to measure its impact.',
  'Business Process Owner': 'Show how the workflow changes and how to tell whether it’s working.',
  'Technical Evaluator': 'Explain how the solution fits the existing systems and what to test.',
  'Security & Compliance Reviewer': 'Explain what risk the change addresses, what safeguards apply, and what evidence is available.',
  'Day-to-Day User': 'Show what someone will do differently and what gets easier in their daily work.',
}

type BusinessValueExample = {
  measure: string
  audiences: Record<StoryAudience, Pick<LeadershipStory, 'solution' | 'outcome'>>
}

export const businessValueExamples: Partial<Record<string, BusinessValueExample>> = {
  'govern-ai-agent-access': {
    measure: 'Check whether an access reviewer can find the owner, approval, granted scope, and expiry for a sample AI tool.',
    audiences: {
      'Executive Sponsor': {
        solution: 'Every AI tool gets a named employee responsible for its purpose. The teams that own the apps and data decide what the tool can use.',
        outcome: 'Leadership can see who is accountable for each tool and which access would need review before expanding the pilot.',
      },
      'Security & Compliance Reviewer': {
        solution: 'Each AI tool has its own identity. The data or app owner approves only the access it needs and sets an expiry.',
        outcome: 'Security can review who approved access, what they granted, and when it ends, then remove access if the tool’s purpose changes.',
      },
      'Technical Evaluator': {
        solution: 'Give the agent its own identity and link it to an employee sponsor. Route each request for a tool or data source to its owner and grant only the approved permissions.',
        outcome: 'We can walk through a request and verify the identity, approved permissions, and expiry on the resulting grant.',
      },
      'Business Process Owner': {
        solution: 'The person sponsoring the AI tool explains what it needs. Each app or data owner decides what access to grant and for how long.',
        outcome: 'The team can follow a sample request from submission through approval and check that it reached the right owner.',
      },
      'Day-to-Day User': {
        solution: 'If the AI tool needs to use an app or data source, submit a request that explains what it needs and why.',
        outcome: 'You can see what access was approved and when you’ll need to request it again.',
      },
    },
  },
  'scim-provisioning': {
    measure: 'Compare manual setup steps before and during the pilot, and time how long access removal takes after a Workday update.',
    audiences: {
      'Executive Sponsor': {
        solution: 'Changes in Workday update work accounts through Okta, reducing the routine setup the IT team has to do by hand.',
        outcome: 'The pilot reduced manual setup steps. We can measure how much staff time those steps used to take.',
      },
      'Security & Compliance Reviewer': {
        solution: 'A departure recorded in Workday triggers an account deactivation in Okta.',
        outcome: 'The pilot gave the team a checklist for testing departures. We can verify how quickly access is removed after the HR update.',
      },
      'Technical Evaluator': {
        solution: 'A worker status change in Workday drives a SCIM update to Okta. A departure sends an update that marks the account inactive.',
        outcome: 'Use the pilot checklist to verify that the update reaches the right account and that access is removed as expected.',
      },
      'Business Process Owner': {
        solution: 'HR updates the employee record in Workday. The workflow carries that change through to the employee’s work account in Okta.',
        outcome: 'HR and IT can use the pilot checklist to verify that the handoff works when someone joins, changes roles, or leaves.',
      },
      'Day-to-Day User': {
        solution: 'When HR updates someone’s employment status, the workflow handles the matching account change for you.',
        outcome: 'The pilot removed some manual setup steps. Use the checklist to confirm that the person has the right access.',
      },
    },
  },
  'webhook-replay': {
    measure: 'Replay a sample payment event and verify that the receiving service can identify the repeat without creating another record.',
    audiences: {
      'Executive Sponsor': {
        solution: 'Each payment update has a reference number the receiving system remembers when the update is sent again.',
        outcome: 'The demo shows how the team can recover a delayed update while avoiding a second record that someone would have to investigate.',
      },
      'Security & Compliance Reviewer': {
        solution: 'The service checks whether the payment provider sent the update and uses the event reference to recognize a retry.',
        outcome: 'The demo can verify that a repeated, valid update is recognized and that an update with an invalid signature is rejected.',
      },
      'Technical Evaluator': {
        solution: 'Store the provider’s event ID before processing. When the same ID arrives again, return the earlier result.',
        outcome: 'Replay the event in the demo and check that the service detects the duplicate without starting a second downstream job.',
      },
      'Business Process Owner': {
        solution: 'The receiving system uses a payment update’s reference number to tell a new event from a retry.',
        outcome: 'The team can walk through how it handles a delayed update and check whether the retry left just one record.',
      },
      'Day-to-Day User': {
        solution: 'When you resend a delayed payment update, the receiving system checks its reference number.',
        outcome: 'You can see whether the update was already received before you go looking for a missing payment record.',
      },
    },
  },
  'csv-normalization': {
    measure: 'Compare the time it takes an operator to prepare a sample partner file and resolve rejected rows.',
    audiences: {
      'Executive Sponsor': {
        solution: 'A standard import step does the routine reformatting and shows staff which rows still need attention.',
        outcome: 'The team has a consistent import process. We can compare how much time staff spend preparing each partner file.',
      },
      'Security & Compliance Reviewer': {
        solution: 'The import checks required values and flags rows it can’t interpret, including dates that don’t match an approved format.',
        outcome: 'The team can verify that unexpected data is surfaced for review before it enters the receiving system.',
      },
      'Technical Evaluator': {
        solution: 'Map known column names to a standard format, validate each row, and preserve the source row number in the error report.',
        outcome: 'Test a supported file and a file with invalid values to confirm which rows can be imported and which are reported.',
      },
      'Business Process Owner': {
        solution: 'Each partner file goes through the same checks. Staff get a clean import file and a list of rows they need to review.',
        outcome: 'You can check whether the team can finish a weekly import and trace rejected rows back to the source file.',
      },
      'Day-to-Day User': {
        solution: 'Run the partner spreadsheet through the import checker. It standardizes the layout and shows the row number for each problem.',
        outcome: 'You can go straight to the rows that need fixing and use the clean file for import.',
      },
    },
  },
  'demo-data-reset': {
    measure: 'Time a reset, confirm the expected demo records are restored, and check that shared settings stay intact.',
    audiences: {
      'Executive Sponsor': {
        solution: 'A standard reset lets presenters start consecutive demos from the same set of sample records.',
        outcome: 'The team can measure the prep time between sessions and see whether the reset makes back-to-back demos easier to support.',
      },
      'Security & Compliance Reviewer': {
        solution: 'The presenter verifies the demo environment and clears only the records marked for that session.',
        outcome: 'A preflight check can confirm that the demo is ready and that the reset stayed within its intended scope.',
      },
      'Technical Evaluator': {
        solution: 'Check the tenant ID, remove records tagged for the prior session, reload the sample data, and run a smoke test.',
        outcome: 'The next SE can verify the expected starting state from the same checklist before the next customer session.',
      },
      'Business Process Owner': {
        solution: 'Each presenter follows the same checklist after a session to clear the previous demo’s records and reload the sample data.',
        outcome: 'The team can hand the environment to the next presenter with a shared way to check that it’s ready.',
      },
      'Day-to-Day User': {
        solution: 'Before your next demo, check that you’re in the demo space, clear the previous session’s records, and reload the sample data.',
        outcome: 'Run through the preflight checklist so you know the examples you’ll need are ready before the call.',
      },
    },
  },
  'oauth-troubleshooting': {
    measure: 'Run the demo sign-in again after correcting the approved return address and confirm the connection completes.',
    audiences: {
      'Executive Sponsor': {
        solution: 'The team compared the address the app tried to return to with the one the sign-in service expected.',
        outcome: 'That narrowed the investigation to one outdated setting. We can time the checklist on a repeat setup to see how quickly it isolates the issue.',
      },
      'Security & Compliance Reviewer': {
        solution: 'Compare the app’s return address with the exact address approved by the sign-in service.',
        outcome: 'The team found an outdated preview address. A retest can confirm that the intended address works and an unapproved address is rejected.',
      },
      'Technical Evaluator': {
        solution: 'Read the actual redirect URI in the request, decode it once, and compare it with the provider’s approved callback URL.',
        outcome: 'The team found the outdated preview URL. Retry sign-in with the intended configuration and verify that the callback route is reachable.',
      },
      'Business Process Owner': {
        solution: 'The setup owner uses a checklist to compare the app’s return address with the sign-in service’s settings for that environment.',
        outcome: 'The team can see which setting held up the connection and repeat the sign-in check after it’s corrected.',
      },
      'Day-to-Day User': {
        solution: 'If the demo sign-in fails, check that the app is using the approved return address for the environment you’re in.',
        outcome: 'In this example, that check gave the presenter one outdated setting to correct before trying sign-in again.',
      },
    },
  },
  'usage-report': {
    measure: 'Check that the same reporting window yields repeatable totals and compare preparation time with the manual process.',
    audiences: {
      'Executive Sponsor': {
        solution: 'The report pulls workspace activity into a weekly summary that the team can produce on a regular schedule.',
        outcome: 'Leadership gets a consistent view of adoption. The team can track how much time it takes to prepare each report.',
      },
      'Security & Compliance Reviewer': {
        solution: 'The report collects activity at the workspace level and exports weekly totals.',
        outcome: 'The team can verify that the export shows the reporting window and workspace activity without exposing individual activity.',
      },
      'Technical Evaluator': {
        solution: 'Read the usage API page by page, roll up the results by week, and export the totals with the reporting window.',
        outcome: 'The sample response can verify that pagination picks up all workspace records and produces repeatable totals.',
      },
      'Business Process Owner': {
        solution: 'The team can produce the same workspace-level report each week. Every export shows which reporting period it covers.',
        outcome: 'You can check that repeated runs cover the intended dates and give the team consistent numbers to compare.',
      },
      'Day-to-Day User': {
        solution: 'Open the weekly export to see workspace activity totals and the dates covered by the report.',
        outcome: 'You have a file ready for the weekly review without building the summary from spreadsheets by hand.',
      },
    },
  },
}
