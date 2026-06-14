# Sohanur Cloud

Production-ready starter for a multi-tenant SaaS platform inspired by
MRobotics-style B2B automation businesses: recharge APIs, WhatsApp messaging,
wallet-ledger operations, travel reseller workflows, usage metering, and
white-label tenant portals.

## Stack

- Next.js App Router with TypeScript
- Responsive CSS design system with dark enterprise UI
- Prisma schema for PostgreSQL tenant isolation
- JWT/API-key security primitives using `jose` and Node crypto
- Middleware-based tenant resolution and protected platform/API surfaces
- ESLint, strict TypeScript, and production security headers

## Getting started

```bash
npm install
cp .env.example .env
npm run db:generate
npm run dev
```

Open `http://localhost:3000` for the marketing site.

## Scripts

```bash
npm run dev          # local development
npm run build        # production build
npm run start        # serve production build
npm run lint         # ESLint checks
npm run typecheck    # TypeScript checks
npm run verify       # lint + typecheck + build
npm run db:generate  # Prisma client generation
npm run db:push      # push schema to DATABASE_URL
npm run db:migrate   # create and apply migrations locally
```

## Route map

- `/` - public SaaS landing page
- `/pricing` - plan and usage governance page
- `/login` - tenant sign-in UI
- `/register` - tenant trial creation UI
- `/dashboard` - protected tenant operations dashboard
- `/dashboard/api-keys` - API credential governance
- `/dashboard/usage` - billing-ready metering view
- `/dashboard/settings` - tenant settings and access policy view
- `/api/health` - health endpoint
- `/api/v1/*` - tenant-scoped API gateway placeholder

## Tenant architecture

Tenant context is resolved in this order:

1. `X-Tenant-ID` request header for trusted server-to-server traffic
2. `/t/{tenantSlug}` path segment for explicit tenant URLs
3. `{tenant}.ROOT_DOMAIN` subdomain
4. Custom domain fallback
5. `demo` fallback for local development

`middleware.ts` writes the resolved tenant into request headers and protects
`/dashboard` and `/api/v1`. Backend helpers in `src/lib/tenant.ts`,
`src/lib/rbac.ts`, and `src/lib/api-keys.ts` keep tenant resolution, role
permissions, plan limits, and API key handling separate from UI code.

## Data model

`prisma/schema.prisma` includes:

- `Tenant` with plan, status, custom domain, and Stripe customer fields
- `User` and `Membership` for role-based access control
- `ApiKey` with hashed key storage, scopes, status, and last-used tracking
- `TenantService` for enabled providers such as recharge, WhatsApp, travel, and utilities
- `UsageEvent` for idempotent metering and billing
- `AuditLog` for investigation and compliance workflows

## Production hardening checklist

- Configure a managed PostgreSQL database and run Prisma migrations.
- Set strong `JWT_SECRET` and `API_KEY_PEPPER` values with at least 32 random characters.
- Connect login/register forms to Auth.js, OIDC/SAML, or the chosen identity provider.
- Verify API keys against `ApiKey.keyHash` and enforce scopes in `/api/v1/*`.
- Add Stripe Checkout, Customer Portal, and webhook handling for subscriptions.
- Add rate limiting at the edge/API gateway and per-tenant plan enforcement.
- Add row-level security policies in PostgreSQL if direct SQL access is used by jobs.
- Add observability for provider latency, webhook retries, failed auth, and wallet risk.
- Run accessibility and end-to-end tests for critical tenant workflows before launch.

## Environment

Copy `.env.example` to `.env` and fill in production values:

```bash
DATABASE_URL="postgresql://..."
APP_URL="https://app.example.com"
ROOT_DOMAIN="example.com"
JWT_SECRET="..."
API_KEY_PEPPER="..."
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."
```