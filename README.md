# Mock Interview Platform

An interactive mock interview platform built with Next.js (App Router), TypeScript and Firebase. The project includes an interview listing UI, authentication pages, API endpoints, and integrations with an AI assistant for generating interview content.

This README explains why the project exists, how to run it step-by-step, and the repository structure so you can quickly contribute or extend it.

## Quick overview — why this project exists

- Purpose: provide a lightweight platform to run and manage mock interviews, collect feedback, and demo AI-assisted question generation.
- Audience: developers who want to run a local instance, extend the UI, or integrate the AI interview generator and Firebase auth.

## Key features

- Modern Next.js app (App Router) with TypeScript
- Authentication flows (sign-in / sign-up) and guarded routes
- Interview listing and detail pages (including feedback)
- API route(s) for generating content (AI integration)
- Firebase client + admin usage for auth and backend data
- Tailwind CSS + component-driven UI

## Tech stack

- Next.js (app router) — UI + server components
- React 19 + TypeScript
- Tailwind CSS (and tailwind-animate)
- Firebase (client + admin SDK)
- VAPI / AI libraries for content generation
- ESLint for linting

## Prerequisites

- Node.js (recommend LTS >= 18, but this repo works with recent Node versions)
- npm (or yarn / pnpm if you prefer) — commands below use npm
- A Firebase project if you want authentication and persistence

## Install and run (step-by-step)

1. Clone the repo

```powershell
git clone https://github.com/Rishi-Rana01/mock_interview_platform.git
cd mock_interview_platform
```

2. Install dependencies

```powershell
npm install
```

3. Create environment variables

Create a `.env.local` file in the project root (Next.js will load it automatically). Add the following placeholders and replace with your actual values from Firebase and any AI provider:

```text
# Firebase (client)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase admin credentials (used server-side only - keep secure)
# For local development you can set GOOGLE_APPLICATION_CREDENTIALS to a path
# or paste credentials into the server environment if your setup requires it.

# VAPI / AI keys (if used by `lib/vapi.sdk.ts` / api routes)
VAPI_API_KEY=your_vapi_key
```

Notes:
- Never commit secret keys to source control. Use `.gitignore` to exclude `.env.local`.
- The repo contains `firebase/client.ts` and `firebase/admin.ts` showing how the client and admin SDKs are wired.

4. Run the development server

```powershell
npm run dev
# open http://localhost:3000
```

Scripts available (from `package.json`):

- `npm run dev` — start Next.js dev server (this repo uses turbopack in dev script)
- `npm run build` — build for production
- `npm run start` — run the built app
- `npm run lint` — run ESLint

## Firebase quick setup (local development)

1. Create a Firebase project at https://console.firebase.google.com/
2. Add a Web App and copy the config to `NEXT_PUBLIC_FIREBASE_*` variables above.
3. If you need server-side admin access (upload data, secure operations), generate a service account JSON and either set `GOOGLE_APPLICATION_CREDENTIALS` to the JSON path or configure `firebase/admin.ts` accordingly.

See `firebase/client.ts` and `firebase/admin.ts` for usage examples.

## Project structure (what's where)

Top-level layout (short descriptions):

- `app/` — Next.js App Router pages and layouts (server + client components). Key subfolders:
  - `app/globals.css` — global styles
  - `app/layout.tsx` — root layout
  - `app/(auth)/` — auth-related layouts and pages
    - `sign-in/page.tsx`, `sign-up/page.tsx` — authentication pages
  - `app/(root)/` — main app pages
    - `page.tsx` — home/dashboard
    - `interview/` — interview listing and details
      - `page.tsx` — interview list
      - `[id]/page.tsx` — interview detail page
      - `[id]/feedback/page.tsx` — feedback page for an interview

- `components/` — React components used across the app
  - `Agent.tsx` — likely AI agent integration component
  - `AuthForm.tsx` — sign-in / sign-up form
  - `InterviewCard.tsx` — card UI for interview items
  - `DisplayTechicons.tsx`, `FormField.tsx` — smaller UI helpers
  - `ui/` — design system primitives (button, input, label, form, sonner)

- `api/` — API routes (server-side endpoints)
  - `api/vapi/generate/route.ts` — AI generation endpoint (vapi)

- `lib/` — utilities and SDK wrappers
  - `lib/vapi.sdk.ts` — wrapper for AI / VAPI usage
  - `lib/utils.ts` — general helpers

- `firebase/` — firebase setup files
  - `client.ts` — firebase client SDK initialization
  - `admin.ts` — firebase admin SDK initialization (server-side)

- `constants/`, `types/` — shared constants and TypeScript definitions

- `public/` — static assets (images, covers)

- `tools/` — developer utilities (if present)

Files you will likely edit when building features:

- `app/(root)/interview/*` — add or change interview UI and logic
- `components/*` — add reusable UI components
- `api/vapi/generate/route.ts` — modify generation endpoint or authentication
- `lib/vapi.sdk.ts` — change AI request logic or provider

## How authentication is wired

- Client-side auth is initialized in `firebase/client.ts` and used in UI pages and components.
- Server-only operations that require elevated privileges are prepared in `firebase/admin.ts`. Only use admin SDK on the server (API routes or server components) and never expose admin credentials to the client.

## Development tips

- Use the `app/` directory for server components where possible and add `use client` at the top of files that need client-side behavior.
- Keep environment secrets out of source control. Use `.env.local` for local dev and environment variables in your hosting platform for production (Vercel, Netlify, etc.).
- Linting: `npm run lint`. Fix problems shown by ESLint and follow TypeScript hints to keep types healthy.

## Deployment

This repository uses Next.js and can be deployed to Vercel with minimal changes. Common steps:

1. Push your repo to GitHub.
2. Create a new project on Vercel and link the repo.
3. Add production environment variables in Vercel's settings (same names as `.env.local`).
4. Deploy — Vercel will run `npm run build` then `npm run start`.

If you use another host (Netlify, Render, custom server), ensure you set environment variables and run the same build steps.

## Troubleshooting

- Blank or broken auth: verify `NEXT_PUBLIC_FIREBASE_*` variables and check console/network for Firebase errors.
- API generation failing: confirm `VAPI_API_KEY` (or provider key) is present and server code is reading it from `process.env`.
- Build errors: run `npm run build` locally and fix TypeScript or missing import errors reported.

## Contributing

1. Fork the repository and create a feature branch.
2. Run and test your changes locally.
3. Open a pull request with a clear description of changes and rationale.

Small, focused PRs are preferred. Mention if your PR requires environment changes or secret access.

## License

This project does not include a license file in the repository. If you plan to open-source it, add a `LICENSE` file (for example MIT) and document any external services' license requirements.

---

If you'd like, I can also:

- Add a short `CONTRIBUTING.md` with local dev checks,
- Add a `docs/` folder that documents the `api/vapi/generate/route.ts` inputs/outputs,
- Or wire a sample `.env.local.example` file with placeholders for the required variables.

Tell me which of those you'd like next.
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
