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

const aiAgentAccessBlueprint = `# AI Agent Access Policy & Approval Workflow

> Portfolio demo sample. All names, systems, and decisions below are fictional.

## Agent profile

| Field | Example |
| --- | --- |
| Agent | Order Assist QA |
| Identity | agent-order-assist-qa |
| Business purpose | Summarize test order issues for the support team |
| Human sponsor | Jordan Lee, Support Operations |
| Backup sponsor | Morgan Patel, Support Operations |
| Environment | Non-production only |
| Review cadence | Every 90 days |
| Access expiry | 30 days after approval |

The agent has its own non-human identity. The sponsor is accountable for its purpose but does not lend the agent their personal credentials or inherited permissions.

## Example policy

**Policy:** Support QA agent — read-only, non-production

- Permit only the registered agent identity and approved runtime.
- Allow read access to the synthetic order-support dataset and test-status API.
- Deny customer production records, write actions, credential stores, and unlisted tools.
- Require a business justification, named sponsor, resource-owner approval, and an expiry date.
- Require security approval for any production, write, export, or elevated-risk request.
- Revoke access when the agent is retired, its sponsor is no longer responsible, or its purpose changes.

## Approval route

1. **Sponsor submits** the agent identity, business purpose, requested resources, actions, environment, and duration.
2. **Identity governance checks** that the identity is unique, linked to an active employee sponsor, and within policy.
3. **Resource owner reviews** each requested application or dataset and approves or rejects its specific scope with a reason.
4. **Security reviews elevated access** when the request includes production data, writes, exports, or sensitive tools.
5. **Provision only approved permissions**, record the decision, and set the expiry and next review date.
6. **Review or revoke** at the scheduled review, on sponsor change, or when the agent is no longer needed.

## Example request and decision

- **Requested:** Read orders-test records and call test-status in the staging environment for 30 days.
- **Business reason:** Help support staff identify recurring issues in synthetic test orders.
- **Sponsor:** Jordan Lee, Support Operations.
- **Dataset owner:** Avery Brooks — approved read-only test data; production data excluded.
- **API owner:** Casey Rivera — approved GET /test-status only; write routes excluded.
- **Security reviewer:** Sam Kim — approved non-production scope; no elevated access requested.
- **Decision:** Approved with the listed limits. Expires after 30 days; review on day 25.

## Audit record to retain

Record the agent identity, sponsor, purpose, requested and approved scopes, each owner's decision and reason, security review where required, provisioned permissions, expiry, review outcome, and revocation date. Never store tokens, passwords, customer records, or other secrets in this sample.
`

export const initialUseCases: UseCase[] = [
  {
    id: 'govern-ai-agent-access',
    title: 'Govern AI agent access with accountable ownership',
    summary: 'Link every AI agent identity to a responsible person, then gate its tools and data access through least-privilege policies and owner approvals.',
    category: 'Identity & Access Management',
    tags: ['AI Agents', 'IGA', 'Access Policies', 'Approvals'], author: 'Jordan Lee', date: 'Oct 21, 2026', updated: 'Oct 21, 2026',
    ask: 'A fictional enterprise started piloting AI agents that could call internal APIs and use business data. Security and application owners needed each agent to have a clearly accountable human, access limited to its approved purpose, and an auditable approval process for new permissions.',
    context: 'Enterprise identity governance · Synthetic AI agent scenario', technologies: 'Identity Governance, non-human identities, access policies, approval workflows',
    constraints: 'Each agent needs its own identity rather than shared human credentials. Business sponsorship must remain tied to an employee, while access approvals are routed to the owners of the requested applications or data. Permissions should be limited, time-bound, reviewable, and revocable.',
    solution: 'Register a distinct non-human identity for each agent and link it to an accountable employee sponsor. Define access policies around the agent’s purpose, approved tools and data, allowed actions, risk level, and expiry. Route requests to the owners of the target applications or data, require a business justification, and provision access only after approval. Add periodic owner reviews and revoke access when the agent or its business need ends.',
    implementation: '1. Inventory the agent and record its purpose, technical identity, business sponsor, and backup contact. 2. Create a policy template that scopes approved applications, data, tools, actions, environment, and assignment duration. 3. Route each request to the relevant application or data owner; require an additional security approver for elevated access. 4. Record the decision and justification, grant only the approved scope, and set an expiry or review date. 5. Reassign sponsorship if the owner leaves, and disable the identity and remove its access when the agent is retired.',
    outcome: 'The governance pattern makes each agent’s human accountability visible, gives resource owners control over approvals, and creates a reviewable path to limit or remove access.',
    lessons: 'Keep the business sponsor who owns the agent’s purpose distinct from the application or data owner who approves access to that resource. Linking an agent to a person establishes accountability; it should not make the agent inherit that person’s credentials or permissions.',
    reusable: 'For each agent, capture its unique identity, accountable human sponsor, business purpose, approved tools and data, allowed actions, resource owners, approval record, access expiry, review date, and retirement owner.',
    resources: [resource('ai-agent-access-policy-and-approval-workflow.md', 'Markdown', '4 KB', 'Fictional access policy, owner approval route, sample decision, and audit checklist.', aiAgentAccessBlueprint)],
    contributions: [],
  },
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
