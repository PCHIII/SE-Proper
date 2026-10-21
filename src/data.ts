export type Resource = {
  id: string
  name: string
  kind: string
  size: string
  description: string
  contents?: string
  file?: File
}

export type Contribution = {
  id: string
  title: string
  type: string
  description: string
  implementation?: string
  context?: string
  author: string
  date: string
  validation: string
  resources: Resource[]
}

export type UseCase = {
  id: string
  title: string
  summary: string
  category: string
  tags: string[]
  author: string
  date: string
  updated: string
  ask: string
  context: string
  technologies: string
  constraints: string
  solution: string
  implementation: string
  outcome: string
  lessons: string
  reusable: string
  resources: Resource[]
  contributions: Contribution[]
}

const resource = (name: string, kind: string, size: string, description: string, contents: string): Resource => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name, kind, size, description, contents,
})

export const initialUseCases: UseCase[] = [
  {
    id: 'scim-provisioning',
    title: 'Automate identity provisioning with SCIM',
    summary: 'A repeatable pattern for connecting an HR source to a SaaS identity provider and keeping access in sync.',
    category: 'Identity & Access Management',
    tags: ['SCIM', 'Okta', 'Lifecycle'], author: 'Jordan Lee', date: 'Oct 18, 2026', updated: 'Oct 20, 2026',
    ask: 'A fictional 800-person software company needed new hires provisioned automatically and leavers deprovisioned on the same day.',
    context: 'Mid-market technology · Fictional customer scenario', technologies: 'Workday, Okta, SCIM 2.0, Slack',
    constraints: 'The HR system remained the source of truth. Existing group assignments needed to stay intact during migration.',
    solution: 'Mapped the HR worker lifecycle to SCIM user and group events, then added a staged rollout with a small pilot group before enabling the full directory.',
    implementation: 'Normalize department and location attributes before mapping. Use an immutable employee ID as the external identifier. Send deactivation as an active=false update and retain the original HR record for audit context.',
    outcome: 'The pilot reduced manual account setup steps and gave the team a consistent checklist for validating joiner, mover, and leaver flows.',
    lessons: 'Resolve attribute ownership before building mappings. A clear reactivation path is as important as deprovisioning.',
    reusable: 'Start with the included attribute mapping worksheet and run the lifecycle checklist for each pilot group.',
    resources: [resource('scim-mapping-example.csv', 'CSV', '18 KB', 'Synthetic attribute mapping worksheet.', 'source,target,required\nworker_id,externalId,true\nwork_email,userName,true\ndepartment,department,false\nmanager_email,manager.value,false')],
    contributions: [
      { id: 'c-scim-1', title: 'Add a safe reactivation check', type: 'Workflow improvement', description: 'Before reactivating an account, check that the HR record is still active and that the primary email matches the current worker profile.', implementation: 'Add a preflight lookup by immutable worker ID and stop the reactivation if the HR status is inactive.', context: 'Workday, SCIM 2.0', author: 'Priya Nair', date: 'Oct 20, 2026', validation: 'Tested in demo or development environment', resources: [] },
      { id: 'c-scim-2', title: 'SCIM pagination troubleshooting notes', type: 'Troubleshooting or lesson learned', description: 'If a directory import appears incomplete, verify that the client follows the pagination cursor until the response has no next page.', author: 'Alex Kim', date: 'Oct 19, 2026', validation: 'Proposed', resources: [] },
    ],
  },
  {
    id: 'webhook-replay',
    title: 'Make webhook retries safe to replay',
    summary: 'An idempotency-key pattern that prevents duplicate downstream work when an event delivery needs a retry.',
    category: 'API & Integrations', tags: ['Webhooks', 'REST API', 'Reliability'], author: 'Morgan Ellis', date: 'Oct 16, 2026', updated: 'Oct 18, 2026',
    ask: 'A fictional payments platform needed a clear way to retry delayed webhook events without creating duplicate records.',
    context: 'Fintech · Synthetic integration exercise', technologies: 'REST, HMAC signatures, PostgreSQL',
    constraints: 'Events may arrive more than once and out of order. The receiver must acknowledge quickly and process asynchronously.',
    solution: 'Use the provider event ID as an idempotency key, persist it before processing, and return the original result when the same event is replayed.',
    implementation: 'Validate the signature against the raw request body, write the event ID to a table with a unique constraint, enqueue work, and return a 2xx response. Keep retry handling separate from business logic.',
    outcome: 'The receiving service now has an explicit replay path and a simple way to detect duplicate deliveries during a demo.',
    lessons: 'Document the idempotency window and define what happens if processing fails after the event ID is stored.',
    reusable: 'Use the included request examples to test duplicate delivery and signature failure paths.',
    resources: [resource('webhook-replay.postman_collection.json', 'JSON', '9 KB', 'Synthetic Postman request collection.', '{\n  "info": { "name": "Webhook replay example" },\n  "item": [{ "name": "Replay duplicate event", "request": { "method": "POST", "url": "{{baseUrl}}/events" } }]\n}')],
    contributions: [{ id: 'c-hook-1', title: 'Include signature rotation', type: 'Documentation', description: 'Keep the current and next signing keys available during rotation, and remove the old key after the overlap window closes.', author: 'Taylor Brooks', date: 'Oct 17, 2026', validation: 'Tested in demo or development environment', resources: [] }],
  },
  {
    id: 'csv-normalization',
    title: 'Normalize partner CSV files before import',
    summary: 'A low-friction validation pipeline for inconsistent partner exports, with clear row-level feedback.',
    category: 'Data Transformation', tags: ['CSV', 'ETL', 'Validation'], author: 'Sam Rivera', date: 'Oct 14, 2026', updated: 'Oct 15, 2026',
    ask: 'A fictional operations team received weekly partner exports with different headers, date formats, and blank values.',
    context: 'Business operations · Synthetic sample data', technologies: 'Python, CSV, JSON Schema',
    constraints: 'Operators needed to understand rejected rows without reading application logs.',
    solution: 'Add a normalization step that maps known header aliases, validates each row, and exports a clean file alongside a concise error report.',
    implementation: 'Trim whitespace, normalize headers, parse dates against an explicit format list, and validate required values. Never silently coerce unknown values.',
    outcome: 'The workflow turns partner files into a consistent import shape and gives operators a short list of corrections to make.',
    lessons: 'Keep source row numbers in the error report so a rejected record can be found quickly.',
    reusable: 'The sample file contains synthetic records only. Duplicate it and change values to test the validation rules.',
    resources: [resource('partner-export-sample.csv', 'CSV', '4 KB', 'Synthetic example input file.', 'partner_id,customer_name,created_date\nP-001,Example North,2026-09-14\nP-002,Example South,2026-09-15')],
    contributions: [],
  },
  {
    id: 'demo-data-reset',
    title: 'Reset demo data between customer sessions',
    summary: 'A lightweight environment reset checklist for keeping a shared proof-of-concept clean and predictable.',
    category: 'Demo & Proof of Concept', tags: ['Demo', 'Environment', 'Checklist'], author: 'Casey Bennett', date: 'Oct 12, 2026', updated: 'Oct 15, 2026',
    ask: 'A fictional SE team wanted the same proof-of-concept environment to be ready for back-to-back demo sessions.',
    context: 'Enterprise software · Fictional demo account', technologies: 'REST API, seed data, environment variables',
    constraints: 'Reset actions must not affect shared configuration or customer-facing environments.',
    solution: 'Separate the demo tenant from shared configuration, then run a checklist-driven reset that clears only session records and re-seeds synthetic examples.',
    implementation: 'Tag demo-only records with a session namespace. Confirm the tenant ID before each reset, clear only records with that namespace, then run a smoke test against the starting state.',
    outcome: 'The team can restore the demo flow consistently and has a clear preflight checklist to hand off to another SE.',
    lessons: 'Put a visible environment label on every reset screen. Avoid destructive buttons that rely on a remembered account context.',
    reusable: 'Use the preflight checklist before customer sessions and after each reset.',
    resources: [resource('demo-reset-checklist.md', 'MD', '2 KB', 'Checklist for synthetic demo environments.', '# Demo reset checklist\n\n- Confirm the environment label\n- Verify the demo tenant ID\n- Clear only session-scoped records\n- Re-seed synthetic examples\n- Run the preflight smoke test')],
    contributions: [],
  },
  {
    id: 'oauth-troubleshooting',
    title: 'Troubleshoot an OAuth redirect mismatch',
    summary: 'A short checklist to isolate redirect URI, environment, and encoding issues during an OAuth setup.',
    category: 'Troubleshooting', tags: ['OAuth 2.0', 'Redirect URI', 'Debugging'], author: 'Jamie Chen', date: 'Oct 10, 2026', updated: 'Oct 12, 2026',
    ask: 'A fictional integration returned an authorization error even though the client ID and scopes appeared correct.',
    context: 'SaaS integration · Synthetic troubleshooting example', technologies: 'OAuth 2.0, browser network tools',
    constraints: 'The same integration had separate local, preview, and production callback URLs.',
    solution: 'Compare the exact redirect URI sent in the authorization request to the provider allowlist, including scheme, host, path, and encoded characters.',
    implementation: 'Inspect the authorize URL, decode the redirect_uri once, compare it to the configured value, then verify the callback route is available in the active environment.',
    outcome: 'The team narrowed the issue to an outdated preview URL in the provider configuration.',
    lessons: 'Avoid copying callback URLs across environments without checking the hostname and trailing slash.',
    reusable: 'Use the included checklist before rotating credentials or changing requested scopes.',
    resources: [resource('oauth-debug-checklist.txt', 'TXT', '1 KB', 'Synthetic quick-check guide.', '1. Inspect the authorization request URL\n2. Decode redirect_uri once\n3. Compare exact scheme, host, and path\n4. Verify the active environment callback route\n5. Retry without changing scopes')],
    contributions: [],
  },
  {
    id: 'usage-report',
    title: 'Build a weekly usage report from an API',
    summary: 'A paginated API-to-CSV workflow that creates a compact weekly adoption snapshot for a demo team.',
    category: 'Reporting & Analytics', tags: ['REST API', 'Pagination', 'CSV'], author: 'Riley Foster', date: 'Oct 8, 2026', updated: 'Oct 11, 2026',
    ask: 'A fictional platform team wanted a weekly summary of active workspaces and feature usage without manual spreadsheet cleanup.',
    context: 'Developer tools · Synthetic reporting scenario', technologies: 'REST API, Python, CSV',
    constraints: 'The report should stay within API rate limits and avoid exposing personal-level activity.',
    solution: 'Fetch workspace-level usage records with cursor pagination, aggregate them by week, and export a synthetic-friendly CSV summary.',
    implementation: 'Read the next-page cursor, apply a bounded retry with backoff for rate limits, and aggregate only the fields needed for the report.',
    outcome: 'The demo team now has a repeatable summary file and a clear record of the reporting window.',
    lessons: 'Store the report window with the output and keep the API token out of scripts checked into source control.',
    reusable: 'Use the sample response fixture to test pagination without a live API.',
    resources: [resource('usage-report-response.json', 'JSON', '6 KB', 'Synthetic API response fixture.', '{\n  "data": [{ "workspace": "Example Alpha", "activeUsers": 12, "week": "2026-W40" }],\n  "nextCursor": null\n}')],
    contributions: [],
  },
]

export const categories = [
  'All categories', 'Identity & Access Management', 'API & Integrations', 'Workflow Automation',
  'Demo & Proof of Concept', 'Data Transformation', 'Troubleshooting', 'Reporting & Analytics', 'Other',
]

export const contributionTypes = [
  'Alternative implementation', 'New integration', 'Script or code improvement', 'Workflow improvement',
  'Documentation', 'Troubleshooting or lesson learned', 'Demo or example', 'Other',
]

export const validationStatuses = [
  'Proposed', 'Tested in demo or development environment', 'Validated in a customer environment', 'Deployed in production',
]
