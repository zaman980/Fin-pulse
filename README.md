# FinPulse — Personal Banking Dashboard

A responsive fintech dashboard where users can view account balances, track
spending trends, and search/filter transaction history. Built as a portfolio
project to demonstrate enterprise-style data fetching, caching, and UI
patterns used in financial/banking applications.

**Live demo:** https://YOUR-APP.vercel.app *(replace with your Vercel URL after deploying)*

<!-- Add 2-3 screenshots here, e.g. ![Dashboard](./screenshots/dashboard.png) -->

## Features

- **Dashboard overview** — balance summary cards, a spending trend chart, and
  a recent activity feed
- **Transactions (full CRUD)** — add, edit and delete transactions through a
  form modal, plus a searchable, filterable history table. Account balances
  update automatically when transactions change.
- **Accounts** — account list with a detail view per account
- **Sign up & sign in** — create an account with your name, email and
  password, then sign in. Routes are protected, the session persists across
  reloads, and the signed-in user's name is shown in the app. Accounts are
  stored in the browser's `localStorage` (demo only — see Notes).
- **Data fetching with TanStack Query** — all data goes through `useQuery`
  hooks with caching, loading and error states (with retry), and stale-time
  configuration. Create, update and delete use `useMutation` and refresh the
  cached data with `invalidateQueries`. Everything is backed by a mock API layer (`src/api/mockApi.ts`) that
  simulates network latency. In a real deployment, only that one file would
  change to point at a live backend — the rest of the app is unaffected.
- **Responsive layout** — collapsible navigation on mobile, horizontally
  scrollable tables on small screens
- **Light, purposeful optimization** — `useMemo` for derived/filtered data,
  `React.memo` on the repeated transaction row, and route-level code
  splitting with `React.lazy`
- **PKR formatting** — amounts are stored in paisa (integers) to avoid
  floating-point errors and formatted only at display time

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · TanStack Query · React Router ·
Recharts · Lucide icons

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Click **Sign up** to create an
account, then sign in with it. There is no backend, so accounts live only in
your own browser.

## Scripts

```bash
npm run build     # type-check and build for production
npm run preview   # preview the production build
npm run lint      # lint with oxlint
```

## Deploying to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects the Vite preset (build command `npm run build`,
   output directory `dist`).
4. Deploy. The included `vercel.json` rewrites all routes to `index.html`,
   so refreshing or deep-linking to pages like `/transactions` works with
   client-side routing.

## Project structure

```
src/
  api/        mock API layer (simulated backend)
  components/ shared UI components (Layout, StatCard, TransactionRow, …)
  context/    AuthContext (sign up, login, session)
  data/       sample account and transaction data
  hooks/      TanStack Query hooks (queries and mutations)
  pages/      route-level pages
  types/      shared TypeScript types
  utils/      formatting helpers
```

## Possible next steps

- Connect to a real backend (replace `mockApi.ts`)
- Replace the client-side auth with a real backend (JWT/session cookies,
  passwords hashed server-side)
- Unit/component tests with Vitest and React Testing Library
- Optimistic updates for add/edit/delete
- Pagination or virtualization for long transaction lists

## Notes

This is a demo/portfolio project. There is no backend, so authentication is
handled entirely in the browser for demonstration purposes:

- Accounts are stored in `localStorage`, and **passwords are stored as plain
  text**. This is fine for a demo but must never be done in a real app — a real
  backend would store only a hash. Please don't sign up with a real password.
- Account and transaction data starts as hand-written sample data, shown to every
  user. Any transactions you add, edit or delete are saved in `localStorage`, so
  they persist in your browser but are shared by all accounts on it. No real
  money, accounts, or backend are involved.
