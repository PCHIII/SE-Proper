# SE Proper
## Codex Project Brief and MVP Specification

**Product tagline:** Solve it once. Share it. Build on it.

**Document purpose:** This file defines the initial product scope and implementation guidance for Codex. Treat it as the source of truth for the first release. Build the MVP described here before proposing or implementing additional use cases or advanced features.

---

## 1. Product Vision

SE Proper is a centralized knowledge-sharing hub for Solutions Engineering (SE) teams.

Solutions Engineers regularly create custom scripts, workflows, integrations, demos, API examples, troubleshooting guides, and other solutions to meet customer needs. Too often, that work remains scattered across individual repositories, documents, and personal workspaces. Other SEs then repeat work that has already been done.

SE Proper helps SEs document what a customer asked for, explain what was created, attach supporting files, and contribute additional approaches or improvements to use cases shared by other SEs.

### Core principle

**If an SE has solved a problem once, another SE should be able to find that work, understand it, and build on it.**

### Primary MVP outcome

A user can:
1. Browse and search a shared library of use cases.
2. Create and publish a new use case describing a customer request and the solution created.
3. Upload supporting files to a use case.
4. Open another user's use case and add a separately attributed contribution, including its description and supporting files.
5. View the original use case and all contributions in one place without overwriting the original content.

The first release is a portfolio demo of a collaboration and knowledge-sharing product. It should be usable from a public GitHub Pages site and use free-tier services. There is no sign-in: content and attachments are public, and author names are self-reported. Do not use it for confidential customer information. AI features and additional use cases will be introduced in later phases, after the core workflow is reliable.

---

## 2. Product Scope

### In scope for the MVP

- A clean, responsive web application.
- Home page with search and entry points to key workflows.
- Use-case library with browse, search, filters, and sorting.
- Use-case detail page.
- Create and publish a use case without signing in.
- Add a contribution to an existing published use case.
- Upload, describe, list, and download supporting files.
- Self-reported attribution for original authors and individual contributors.
- Basic categories and tags.
- Seed/demo data using fictional customers and synthetic content.
- Basic input validation, error states, and automated tests.
- Setup documentation and a `.env.example` for local development and deployment.
- Public demo notice explaining that posts, self-reported names, and files are visible to anyone.

### Explicitly out of scope for the first release

Do not build these unless asked in a later phase:

- AI chat assistant or AI agent.
- AI-generated use-case descriptions.
- Semantic/vector search.
- GitHub repository synchronization.
- Enterprise SSO or complex identity integrations.
- Any sign-in, registration, or account management.
- Private drafts, per-user dashboards, or author-only editing and deletion.
- Approval workflows or peer-review queues.
- Version control or branching for contributions.
- Comments, reactions, messaging, or notifications.
- Analytics dashboards or contributor rankings.
- CRM, ticketing, or sales enablement integrations.
- Automatic execution of uploaded code or scripts.

Keep the architecture extensible enough to support future phases, but do not over-engineer the MVP.

---

## 3. Target Users

### Solutions Engineer
Creates and publishes use cases, finds existing solutions, downloads resources, and contributes improvements.

### Use-case author
The SE who created the original use case. Their authorship must remain visible, but they do not own or control other users' contributions.

### Contributor
An SE who adds a distinct implementation, variation, resource, lesson learned, or improvement to an existing use case.

There is no authentication in this portfolio demo. Authors and contributors enter a display name that is shown as unverified attribution. Anyone can read, create, and contribute to public content. Do not represent the demo as secure for confidential customer information or as proving who submitted a post.

---

## 4. Primary Navigation

Use a simple navigation structure:

- **Home**
- **Explore Use Cases**
- **Create Use Case**
- **Community Dashboard**

The home page should include:

- A prominent search field.
- A clear **New Use Case** action.
- Recently added use cases.
- Recently contributed use cases.
- Browse-by-category options.
- Empty states that explain what users can do next.

Avoid filling the first screen with dashboards or AI chat features.

---

## 5. Use-case Library

Each use-case card should show enough information for an SE to decide whether to open it.

Display:

- Title.
- Short summary.
- Category.
- Relevant tags.
- Original author.
- Date created or last updated.
- Number of contributions.
- Number of attached resources, where useful.
- Publication status when relevant.

### Library capabilities

- Search by title, summary, customer ask, solution description, and tags.
- Filter by category and tags.
- Sort by newest, recently updated, or most contributed.
- Open a use case to see its full details.
- Clearly label the site as a public demo and show only submitted, public use cases.

Use PostgreSQL full-text search or another simple keyword-search approach for the MVP. Do not add vector search yet.

---

## 6. Create a Use Case

The creation experience should be a short, guided form. Make it easy to capture the useful information without requiring an exhaustive technical document.

### Section A: Identify the use case

Fields:

- **Title** (required): Describe the problem or outcome, not just a customer or project name.
- **Category** (required): Select from a manageable initial list.
- **Summary** (required): Briefly describe the problem and solution.
- **Tags** (optional): Technologies, products, integrations, and relevant terms.

Suggested initial categories:

- Identity & Access Management
- API & Integrations
- Workflow Automation
- Demo & Proof of Concept
- Data Transformation
- Troubleshooting
- Reporting & Analytics
- Other

Make categories easy to extend without requiring a code change for every new category, if practical.

### Section B: Customer request and context

Fields:

- **Customer ask** (required): What did the customer need, and what problem were they trying to solve?
- **Industry or customer segment** (optional).
- **Relevant technologies or products** (optional).
- **Technical constraints or environment** (optional).

Do not require the actual customer name. Encourage anonymized customer context. Include a reminder not to publish confidential customer information, credentials, tokens, personal data, or proprietary material without authorization.

### Section C: What was created?

Fields:

- **Solution overview** (required): What approach was taken?
- **Implementation details** (optional): How it works, relevant APIs, scripts, configurations, workflow steps, or design decisions.
- **Outcome** (optional): What was accomplished and how it was validated?
- **Challenges and lessons learned** (optional).
- **Reusable components or notes for the next SE** (optional).

Keep the form approachable. Optional fields should not prevent someone from sharing an early-stage solution.

### Section D: Supporting files

Allow users to attach files with:

- Original filename.
- File type.
- Short description.
- Uploader.
- Upload date.
- Download action.

Examples include source-code examples, Markdown documentation, JSON configuration, API examples, Postman collections, architecture diagrams, workflow exports, synthetic sample data, and PDFs.

Apply a small file-size limit and an allowlist of file types in the storage service. Do not execute uploaded files. Use generated storage keys and retain the original filename only as display metadata. Since there is no authentication, all attached files are public and downloadable; the UI must say so before upload. Do not upload secrets, personal data, or confidential content.

### Section E: Save and publish

Provide actions to:

- Preview.
- Publish.
- Cancel.

Publishing immediately makes the use case visible to every site visitor. Do not implement drafts or autosave in the unauthenticated demo.

---

## 7. Contribute to an Existing Use Case

Every published use-case detail page must offer a clear **Contribute** action.

A contribution is a separate record linked to the original use case. It must not silently overwrite the original use case or another contributor's work.

### Contribution fields

- **Contribution title** (required).
- **Contribution type** (required).
- **Description** (required): What was added, changed, learned, or created?
- **Implementation details** (optional).
- **Relevant technologies or context** (optional).
- **Validation status** (required).
- **Supporting files** (optional).

Suggested contribution types:

- Alternative implementation
- New integration
- Script or code improvement
- Workflow improvement
- Documentation
- Troubleshooting or lesson learned
- Demo or example
- Other

Suggested validation statuses:

- Proposed
- Tested in demo or development environment
- Validated in a customer environment
- Deployed in production

Display the status as a contributor-provided statement, not as an automatic guarantee that the asset is safe or suitable for every environment.

### Contribution behavior

- Each contribution has its own author and timestamps.
- Contributions never overwrite the original use case.
- Contributions appear on the original use-case page.
- Users can open a contribution to see its description, status, and attachments.
- The original author and contributors receive clear attribution.
- Do not implement editing or deletion after submission in the unauthenticated demo. A correction can be submitted as a new contribution.

---

## 8. Use-case Detail Page

Organize each detail page into clear sections or tabs:

### Overview
- Title and summary.
- Category and tags.
- Original author and dates.
- Customer ask and anonymized context.
- Solution overview and outcome.

### Implementation
- Technical details.
- Prerequisites or constraints, if supplied.
- Challenges and lessons learned.
- Reusable components.

### Resources
- Original use-case attachments.
- File descriptions and download actions.

### Contributions
- List of contributions with title, type, author, date, validation status, and short description.
- Open each contribution for full details and its attachments.
- Clear **Contribute to This Use Case** action.

### Activity
For the MVP, show basic created and updated timestamps. A full audit timeline can be added in a later phase.

Also show related use cases based on shared categories or tags if this is straightforward. Do not block the release on recommendation logic.

---

## 9. Community Dashboard

Provide a public dashboard that helps visitors browse community activity. It is not personalized because users do not sign in.

Include:

- Recently published use cases.
- Recently added contributions.
- Browse and search entry points.
- Basic status and timestamps.

Show each self-reported author name beside that person's use case or contribution, without implying that the name has been verified.

---

## 10. Suggested Data Model

Use a relational model with explicit parent-child relationships. There is no users table or authenticated identity in the portfolio demo; store author and uploader display names as unverified text fields on submitted records.

### UseCases
- `id`
- `title`
- `summary`
- `customer_ask`
- `customer_context`
- `technologies`
- `technical_constraints`
- `solution_overview`
- `implementation_details`
- `outcome`
- `lessons_learned`
- `reusable_components`
- `category_id` or category value
- `author_name`
- `status` (published only for the demo)
- `created_at`
- `updated_at`
- `published_at`

### Contributions
- `id`
- `use_case_id`
- `title`
- `contribution_type`
- `description`
- `implementation_details`
- `technologies_or_context`
- `validation_status`
- `author_name`
- `created_at`
- `updated_at`

### Attachments
- `id`
- `use_case_id` (nullable when attached to a contribution)
- `contribution_id` (nullable when attached directly to a use case)
- `original_filename`
- `storage_key`
- `content_type`
- `file_size`
- `description`
- `uploader_name`
- `created_at`

Enforce that an attachment belongs to exactly one parent: either a use case or a contribution.

### Categories
- `id`
- `name`
- `slug`
- `description` (optional)

### Tags and UseCaseTags
Use a many-to-many relationship for tags if time permits. Keep tag handling simple and prevent duplicate tags caused only by capitalization or whitespace.

### Data integrity requirements
- Every use case has one self-reported author name.
- Every contribution belongs to one use case and has one self-reported author name.
- Every attachment belongs to exactly one use case or contribution.
- Deleting a parent must not leave orphaned database records or stored files.
- Store timestamps consistently, preferably in UTC, and display them in the user's local time.
- Validate foreign keys and required fields with database constraints and any available service-side validation, not just in the frontend.

Use migrations for schema changes. Avoid hard-coding demo records into application logic.

---

## 11. Recommended Technical Approach

Use the following free-tier-oriented stack unless the existing repository establishes a different, reasonable pattern:

- **Frontend:** React + TypeScript.
- **Styling:** Tailwind CSS or the styling system already present in the repository.
- **Hosting:** GitHub Pages for the static frontend, built and deployed with GitHub Actions.
- **Backend services:** Supabase Free for PostgreSQL, the Data API, and Storage; no separately hosted application server.
- **Database schema:** SQL migration files committed with the project and applied to Supabase.
- **File storage:** A public Supabase Storage bucket with an upload size cap and allowed MIME types configured. Public access is an explicit consequence of the no-auth demo.
- **Search:** Simple PostgreSQL keyword search through the Supabase Data API.
- **Testing:** Frontend tests and checks for database policies and storage configuration.
- **Local development:** Vite dev server and a Supabase project; local Supabase is optional.
- **Configuration:** Public Supabase URL and publishable key in build environment variables, documented in `.env.example`. Never put service-role or secret keys in the frontend or GitHub Pages build.

Before choosing or installing dependencies, inspect the existing repository. Preserve working conventions where sensible and do not replace existing technologies without a reason. GitHub Pages serves static sites and does not run server-side Python. Check current free-tier limits before deployment and keep uploads small to fit them. The current Supabase Free plan is listed with 500 MB database storage, 1 GB file storage, and 5 GB each of cached and uncached egress; free projects may pause after one week of inactivity. These quotas and terms can change, so verify them before launch.

Keep UI, database access, and file-storage helpers separate within the frontend. Do not add a custom server or unnecessary services for this demo.

---

## 12. Security and Privacy Requirements

Treat submitted content and uploaded files as untrusted. This is a public, unauthenticated portfolio demo, not a private or production collaboration service.

- Never commit secrets or real customer data to the repository.
- Include a visible reminder against uploading secrets, credentials, tokens, personal data, or unauthorized customer-confidential material.
- Use synthetic and fictional demo data.
- Configure storage-level file size and MIME-type restrictions, and use a client-side allowlist for clear feedback. Generate safe storage keys and never execute uploaded files.
- Files are public and downloadable by anyone in this demo; disclose this before upload.
- Do not execute uploaded scripts, workflow files, or other attachments.
- Protect against path traversal and unsafe filenames.
- Keep the Supabase service-role key and database credentials out of the client and repository. The browser may use only the publishable key; it is not a secret and must be constrained by database and storage policies.
- Enable row-level security (RLS) on exposed tables. Allow the unauthenticated `anon` role to read public content and insert only the records needed for the demo. Do not grant public update or delete access.
- Configure the Storage bucket for public downloads and narrowly scoped anonymous uploads; do not grant anonymous update or delete access.
- Use database constraints and safe generated storage paths. Limit uploads and accepted file types in Supabase Storage.
- Do not promise private drafts, verified identity, or author-only controls; there are no accounts.
- Add a visible notice that names and content are user submitted and unverified, and that content and files are public.
- Do not upload credentials, tokens, personal data, real customer data, or proprietary material.

Because public visitors can submit content without accounts, keep this as a low-traffic demo with synthetic examples. Add simple input and upload limits where the service supports them, and provide a way to reset demo data if spam or unwanted uploads appear. Do not claim enterprise-grade security. GitHub Pages only hosts the static frontend; the browser communicates directly with Supabase under the configured RLS and Storage policies.

---

## 13. UX and Visual Direction

The product should look like a polished SaaS-style portfolio demo.

Design principles:

- Clear information hierarchy.
- Search-first home page.
- Clean typography and restrained use of color.
- Responsive layouts for desktop and tablet.
- Accessible form labels, keyboard focus, and adequate contrast.
- Clear loading, success, empty, and error states.
- Descriptive buttons such as **Create Use Case**, **Publish**, and **Contribute**.
- Avoid unnecessary animations, clutter, and oversized dashboards.
- Preserve self-reported author attribution while recognizing contributors; make clear that identities are not verified.
- Make the distinction between a use case and a contribution obvious.

Use realistic sample content, but make it clear that demo customers and scenarios are fictional.

Do not spend excessive time polishing visual details before the main workflows work end to end.

---

## 14. MVP Acceptance Criteria

The MVP is ready when all of the following work:

### Library
- A user can browse published use cases.
- A user can search by relevant text and filter by category.
- A user can open a use-case detail page.
- All use cases in the library are public; there is no draft state.

### Create and publish
- A user can create a use case with the required fields.
- Database constraints or service-side validation reject invalid submissions where available.
- A visitor can preview and publish a use case without signing in.
- The original author's self-reported display name is shown.

### Contributions
- A user can add a contribution to a published use case.
- The contribution has its own author, description, type, and validation status.
- The contribution appears on the parent use-case page.
- The original use case is not overwritten by the contribution.
- Contributions are separate from the original use case and cannot overwrite it.
- Visitors cannot edit or delete submitted records after submission.

### Attachments
- A user can attach a file to a use case.
- A user can attach a file to a contribution.
- Each file has a description and metadata.
- Visitors can download public attachments.
- The UI makes clear that uploads are public; no private drafts or downloads are promised.
- Invalid file types and oversized uploads are rejected.
- Uploads cannot be executed by the application.

### Quality
- The application has clear loading, empty, and error states.
- Core workflows have automated tests.
- SQL migrations can initialize a clean Supabase project.
- Demo data can be loaded through a repeatable seed process.
- Setup instructions work on a clean development environment.
- No secrets or customer-confidential data are committed.

---

## 15. Implementation Plan for Codex

Build incrementally. Do not attempt to implement the entire product in a single pass.

### Phase 1: Inspect and plan
1. Inspect the repository and existing tools.
2. Summarize the current state and identify any existing conventions.
3. Propose a minimal implementation plan and directory structure.
4. Identify any decisions that genuinely block progress.
5. Do not overwrite or remove existing work without understanding it.

### Phase 2: Application foundation
- Set up the static frontend and GitHub Pages deployment.
- Configure public Supabase URL and publishable key.
- Set up SQL migrations, RLS policies, and Storage bucket restrictions.
- Add consistent loading and error handling for service requests.
- Create the navigation shell and basic visual system.

### Phase 3: Use-case library
- Implement categories, use-case listing, search, filters, and detail pages.
- Add fictional seed data.
- Add tests for visibility and search behavior.

### Phase 4: Create and publish
- Implement create, preview, and publish workflows with self-reported author display names.
- Add client validation and database constraints.
- Add tests for public insert/read policies and rejected update/delete operations.

### Phase 5: Contributions
- Implement contribution creation, listing, and detail views with self-reported contributor names.
- Preserve the parent use case and original author attribution.
- Add tests for parent-child relationships and public submission policies.

### Phase 6: Attachments
- Implement public file upload/download using Supabase Storage.
- Add metadata, safe generated storage paths, file type allowlists, and upload limits.
- Test allowed and rejected file types, size limits, and download behavior.

### Phase 7: Finish and verify
- Run frontend tests and verify database and storage policies.
- Run linting and type checks where configured.
- Fix issues found rather than merely reporting them.
- Verify the application from a clean setup.
- Document environment variables, migrations, seed data, local startup, GitHub Pages deployment, free-tier constraints, and known limitations.
- Update this file only if requirements change; do not silently expand scope.

---

## 16. Future Phases: Possible Extensions

These are future options, not MVP requirements. Do not implement them until the core sharing workflow is complete and tested.

### Phase 2: AI-assisted documentation
- Draft a use-case summary from notes and uploaded text.
- Suggest tags and categories.
- Identify missing documentation fields.
- Require the author to review and approve generated content.

### Phase 3: Better discovery
- Semantic search for natural-language questions.
- Related-use-case recommendations.
- Potential duplicate warnings during creation.
- Search answers grounded in the library, with links to source use cases and contributions.
- Evaluation tests to measure whether relevant assets are retrieved.

### Phase 4: Richer collaboration
- Comments or review feedback.
- Optional peer review and verification.
- Revision history for use cases and contributions.
- Notifications for meaningful updates.
- More detailed contribution activity.

### Phase 5: Engineering integrations
- Optional links to GitHub repositories, commits, and pull requests.
- Import or reference external documentation.
- Carefully scoped integrations with internal tools.
- More advanced access control and enterprise SSO.

### Phase 6: Insights
- Search queries with no useful results.
- Most reused assets.
- Stale or unverified content.
- Self-reported or estimated time saved.
- Team-level contribution and reuse trends.

Future features should be driven by demonstrated user needs. Do not add AI merely for appearance; each AI feature should reduce contribution effort or improve discovery.

---

## 17. Instructions for Codex

Treat this specification as the product source of truth.

When working on the project:

1. Read this file before implementing features.
2. Inspect the existing codebase before making architectural decisions.
3. Build the smallest complete vertical slice first.
4. Keep changes focused and explain the purpose of each major change.
5. Write or update tests for every important workflow.
6. Do not invent credentials, integrations, or external service capabilities.
7. Do not add an AI dependency to core CRUD workflows.
8. Do not execute uploaded files.
9. Do not imply that public demo attachments or posts are private.
10. Do not implement out-of-scope features without explicit direction.
11. Prefer maintainable, readable code over unnecessary abstractions.
12. When a requirement is ambiguous but not blocking, choose a sensible simple default and document it.
13. At the end of each milestone, summarize what changed, tests run, any remaining issues, and the next recommended step.

### First task

Start with **Phase 1: Inspect and plan**. Inspect the repository, report what is already present, propose the minimal structure and first vertical slice, and identify any blockers. Do not start implementing all phases at once.

The first vertical slice should eventually demonstrate this end-to-end workflow:

**Create a use case → publish it → find it in the library → open it → contribute to it → view the contribution and its files alongside the original use case.**
