TopProctor — Monorepo Starter (MVP → V1)

What’s included
- Monorepo: `apps/web` (Next.js 14 App Router) and `apps/api` (Express + TypeScript)
- Shared types: `packages/types`
- Mongoose schemas and REST endpoints (auth/exams/bookings/payments/webhooks)
- Redis + BullMQ stubs for jobs, Socket.IO for chat
- Env templates and Docker Compose for MongoDB + Redis + services

Quick start
1) Prereqs: Node 20+, npm 9+, Docker (optional for local Mongo/Redis).
2) Copy envs:
   - `cp apps/api/.env.example apps/api/.env`
   - `cp apps/web/.env.example apps/web/.env`
3) Set required secrets (see Env). If you want to run DBs locally:
   - Run `docker compose -f infra/docker-compose.yml up -d` (MongoDB + Redis)
4) Install deps: run from repo root: `npm install`
5) Dev servers (in two terminals):
   - API: `npm run dev -w apps/api`
   - Web: `npm run dev -w apps/web`

Env (API)
- `MONGODB_URI` (e.g., mongodb://localhost:27017/topproctor)
- `JWT_SECRET`
- `REDIS_URL` (e.g., redis://localhost:6379)
- `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET` (optional initially)
- `APP_URL` (e.g., http://localhost:4000), `FRONTEND_URL` (e.g., http://localhost:3000)

Env (Web)
- `NEXT_PUBLIC_API_URL` (e.g., http://localhost:4000)

Scripts
- API: `dev`, `build`, `start`, `typecheck`
- Web: `dev`, `build`, `start`, `typecheck`

Notes
- This starter avoids heavy extras; you can add shadcn/ui later with its CLI.
- Payments endpoints are wired for Stripe with safe stubs; enable by adding secrets.
- All messaging/notifications are stubbed with queues for future providers.

