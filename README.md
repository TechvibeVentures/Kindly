# Kindly — Intentional Co-Parenting Platform

A full-stack, invite-only web app for people exploring intentional co-parenting. Members complete guided onboarding, build profiles (values, custody preferences, lifestyle), discover and shortlist compatible candidates, and message matches—all with clear structure and privacy.

**Live:** [getkindly.ch](https://getkindly.ch)

**Role:** UI and visual design were created by a non-technical client; I implemented all functionality (auth, backend, realtime messaging, admin tools, integrations).

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, TypeScript, Vite |
| **UI** | Tailwind CSS, Radix UI (shadcn/ui), Framer Motion |
| **State & Data** | TanStack Query, React Hook Form, Zod |
| **Backend** | Supabase (PostgreSQL, Auth, Row Level Security, Storage, Edge Functions) |
| **Realtime** | Supabase Realtime (WebSocket) for live conversation list and messaging |
| **Deploy** | Vite build, custom domain (getkindly.ch) |

---

## Features

- **Invite-only signup** — Request flow from landing; admins create invitation links; signup + email confirmation with redirect handling
- **Guided onboarding** — Multi-step profile (values, custody, lifestyle, photo upload) with validation and progress
- **Profiles & discover** — Rich profiles (values, qualities, bio, preferences); browse candidates with grid/list views; shortlist and preview
- **Messaging** — Conversations between matched users; real-time-style structure with topic coverage
- **Realtime updates** — Conversations list and chat use **Supabase Realtime (WebSocket)** so new messages and new conversations appear instantly without refresh
- **Admin dashboard** — Member management, invitation creation/revoke, invitation requests, user deletion (with Supabase Auth admin API)
- **App UX** — Responsive layout, i18n (EN/DE), settings (safety, notifications, account), resources, terms & privacy

---

## Security & Backend

- **RLS (Row Level Security)** on all main tables; policies for own-profile, admin, and signup triggers
- **RPCs** for invitation validation and acceptance (no direct anon read on invitations)
- **Edge Functions** for sending invitation and admin-invitation emails
- **Storage** RLS for profile photos (path scoped by user id)
- **Auth** — Email/password, redirect URL config for confirmation links; optional admin role by domain (e.g. @impactfuel.ch)
- **Realtime** — Supabase Realtime (WebSocket) subscriptions on `conversations` and `messages`; conversation list and open chat update live when new messages arrive or new conversations are created

---

## Running Locally

```bash
git clone <repo-url>
cd kindley-new
npm install
```

Create `.env` with:

- `VITE_SUPABASE_URL` — your Supabase project URL  
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon key  

Then:

```bash
npm run dev
```

For local Supabase (migrations, auth, functions):

```bash
npx supabase start
npx supabase db reset   # apply migrations
```

---

## Project Structure

- `src/pages/` — Route-level screens (Landing, Auth, Onboarding, Discover, Conversations, Admin, Settings, etc.)
- `src/components/` — Shared UI and layout (ProtectedRoute, ResponsiveLayout, forms, cards)
- `src/contexts/` — Auth, App, Language
- `src/lib/` — Supabase client, db helpers (profiles, invitations, conversations, shortlist), utils
- `src/hooks/` — useAuth, useInvitations, useUserRoles, etc.
- `supabase/migrations/` — Schema, RLS policies, triggers, RPCs
- `supabase/functions/` — send-invitation, send-admin-invitation, admin-delete-user

---

## License

Private / proprietary. All rights reserved.
