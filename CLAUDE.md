# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Dev server (Turbopack)
npm run build    # Production build
npm run lint     # ESLint
npx prisma studio          # DB GUI
npx prisma db push         # Push schema to DB (no migration file)
npx prisma generate        # Regenerate client after schema change
```

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Prisma 7 + Neon (PostgreSQL) · NextAuth v5 beta · Vercel Blob · Framer Motion

**Styling convention:** No Tailwind class names on public-facing pages — all styles are inline `style={{}}` objects. Tailwind is used only in the admin panel and shadcn components. Do not introduce Tailwind classes in files that already use inline styles.

### Route map

| Path | What it does |
|---|---|
| `/` | Home page — server component, fetches SiteContent + reviews + portfolio |
| `/portfolio` | Full portfolio grid |
| `/portfolio/[slug]` | Project detail |
| `/about`, `/tarif` | Static pages |
| `/espace` | Client space — shows `EspaceGate` if not logged in, `EspaceClient` if logged in |
| `/admin/*` | Admin panel — protected by `session.user.email === ADMIN_EMAIL` in layout |

### Auth (`auth.ts`)

NextAuth v5 with two providers: **Credentials** (email + bcrypt) and **Discord**.

Discord login has two paths:
- `account.providerAccountId === ADMIN_DISCORD_ID` → resolves to the admin account (forces `token.email = ADMIN_EMAIL`)
- Otherwise → links/creates a user by Discord email, saves `discordId` on the User record

Admin access everywhere is gated on `session.user.email === process.env.ADMIN_EMAIL`. The `/admin` layout redirects to `/` if this check fails.

### Database (`prisma/schema.prisma`)

Key models and their purpose:
- `User` — clients and admin (admin is identified by email, not role field)
- `Project` — a client's project request. `status`: `pending → accepted → active → completed | rejected`. `kanbanVisible` controls whether the client can see the Kanban.
- `KanbanColumn` / `KanbanTask` — per-project board visible to client and admin
- `Invoice` — devis/factures, `type`: `"devis" | "facture"`
- `Review` — per-project client review. `status`: `idle → requested → submitted → approved | hidden`
- `Deliverable` — files uploaded by admin for client approval. `status`: `pending → approved | rejected`
- `MoodboardItem` — images shared between admin and client per project
- `SiteContent` — key/value store for all editable site text (section name → JSON blob). Defaults live in `lib/site-content.ts` as `SITE_DEFAULTS`.
- `PageView` / `LoginEvent` — analytics

### Prisma client (`lib/prisma.ts`)

Uses `@prisma/adapter-neon` (HTTP adapter for serverless). The client is a singleton on `globalThis` in dev.

### Content system (`lib/site-content.ts`)

`SiteContentMap` defines the shape of all editable sections (hero, about, tarifs, footer, aboutPage, features). `SITE_DEFAULTS` is the fallback. The home page fetches from `SiteContent` table and deep-merges with defaults. Admin can edit via `/admin/contenu`.

### Client space (`components/ui/espace-client.tsx`)

Single large client component (~1700 lines). All client-side tabs (accueil, messages, devis, projets, kanban, galerie, moodboard, avis, signalements, parametres) are rendered here with `useState` tab switching. Uses `safeFetch` helper for all API calls with a fallback value.

### Admin panel (`components/ui/admin-shell.tsx` + `admin-*.tsx`)

`AdminShell` provides the sidebar layout. Each `/admin/*` route renders one `admin-*.tsx` component as its content. All admin API routes are under `app/api/admin/` and check `session.user.email === ADMIN_EMAIL`.

### Image storage

Uploaded files (portfolio images, deliverables, moodboard, about image) go to **Vercel Blob** via `@vercel/blob`. The API routes under `app/api/admin/` handle uploads and return blob URLs.

## Environment variables

```
DATABASE_URL           # Neon PostgreSQL connection string
NEXTAUTH_SECRET        # NextAuth JWT secret
NEXTAUTH_URL           # e.g. http://localhost:3000
DISCORD_CLIENT_ID      # Discord OAuth app (empty = Discord login disabled)
DISCORD_CLIENT_SECRET
ADMIN_EMAIL            # Email address of the site owner (gates all admin access)
ADMIN_DISCORD_ID       # Discord providerAccountId of the admin
BLOB_STORE_ID          # Vercel Blob store ID
BLOB_READ_WRITE_TOKEN  # Vercel Blob token
```

`DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` being empty disables the Discord provider entirely (see `auth.ts` conditional spread).
