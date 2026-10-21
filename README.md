# SE Proper

SE Proper is a portfolio demo for sharing reusable Solutions Engineering work.

## Current stage

This first frontend milestone uses fictional, in-memory sample data. Search, browse, detail views, and the create/contribute flows work in the current browser session. New posts, contributions, and selected files are **not shared with other visitors or saved after a refresh**. The public database and file storage backend will be added later.

The demo has no sign-in. Names are self-reported, and the eventual hosted demo will make posts and attachments public. Use fictional examples only; do not enter confidential customer information, credentials, tokens, or personal data.

## Run locally

1. Install Node.js and npm.
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev`.
4. Create a production build with `npm run build`.

The frontend uses React, TypeScript, and Vite. The Vite base path is relative so the static build can be hosted under a GitHub Pages project path.

## Deploy to GitHub Pages

The `main` branch is configured to build and deploy the static site through GitHub Actions. In the repository settings, open **Pages** and select **GitHub Actions** as the deployment source. Each push to `main` will publish the latest build.

The hosted demo is public. Content created in the current frontend is kept only in the browser session and is not shared with other visitors.

## Next milestone

Connect the current interface to a free-tier backend for shared use cases, contributions, and file uploads/downloads. Keep the static GitHub Pages frontend and public-demo disclosures.
