# Flash Fingers

A minimalist typing game at [flash-fingers.com](https://flash-fingers.com). Type a short
sentence, race a ghost cursor set to your own rolling average, and see your words per
minute. Sign in to save rounds, track your trend, and appear on the leaderboard.

## Stack

- Next.js (App Router) on Bun, React, Tailwind
- SQLite via Drizzle (`bun-sqlite` driver), migrations in `drizzle/`
- better-auth (email/password + Google), Resend for email
- Vercel AI SDK + OpenAI to top up the sentence pool from daily Wikipedia items

## Develop

```bash
bun install
cp .env.example .env   # fill in the values
bunx drizzle-kit migrate
bun run dev
```

## Layout

- `src/app/` routes only (pages, layouts, API routes, metadata files)
- `src/server/` server-only code: db, auth, email, actions
- `src/components/` UI, `src/schemas/` shared Zod schemas, `src/config/` constants

See `AGENTS.md` for conventions (Bun everywhere, standard API response envelope,
absolute imports).

## Deploy

Push to `main`. The GitHub Action SSHes to the host and runs `scripts/deploy.sh`, which
rebuilds the Docker image and restarts it behind the Cloudflare tunnel.
