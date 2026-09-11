FROM oven/bun:1-alpine AS base
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# `next build` evaluates route modules, which validate env at import.
# Placeholders satisfy the schema; real values come from .env at runtime.
ENV OPENAI_API_KEY=build \
    BETTER_AUTH_SECRET=build \
    ADMIN_SECRET=build \
    GOOGLE_CLIENT_ID=build \
    GOOGLE_CLIENT_SECRET=build \
    RESEND_API_KEY=build \
    NEXT_TELEMETRY_DISABLED=1
RUN bun run build

FROM base AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=4000 \
    HOSTNAME=0.0.0.0 \
    MIGRATE_ON_START=1 \
    DATABASE_PATH=/app/data/flash-fingers.db

RUN addgroup --system --gid 1001 app && adduser --system --uid 1001 app
RUN mkdir -p data && chown app:app data

COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static
COPY --from=builder --chown=app:app /app/public ./public
COPY --from=builder --chown=app:app /app/drizzle ./drizzle

USER app
EXPOSE 4000
CMD ["bun", "server.js"]
