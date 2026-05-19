# ClinicFlow

A production-oriented clinic appointment SaaS starter built with Next.js, PostgreSQL, Prisma, Tailwind CSS, NextAuth, OpenAI, and Stripe.

## Features

- Email/password authentication with clinic workspace provisioning
- Protected dashboard with clinic metrics
- Patient management
- Appointment scheduling
- AI-generated follow-up reminders with a development fallback
- Responsive Tailwind UI
- Prisma schema for users, clinics, patients, appointments, reminders, and billing state
- API routes for patients, appointments, AI reminders, Stripe checkout, portal, and webhooks

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

3. Start local PostgreSQL:

```bash
docker compose up -d
```

4. Push the Prisma schema to the local database:

```bash
npm run db:push
```

For migration-based development, use:

```bash
npm run db:migrate
```

5. Start the app:

```bash
npm run dev
```

## Important Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_SECRET`: NextAuth secret
- `OPENAI_API_KEY`: Enables generated reminders
- `OPENAI_MODEL`: Defaults to `gpt-5.4-mini`
- `STRIPE_SECRET_KEY`: Stripe server key
- `STRIPE_PRICE_ID`: Subscription price used by checkout
- `STRIPE_WEBHOOK_SECRET`: Webhook signing secret
- `NEXT_PUBLIC_APP_URL`: Public app URL for Stripe redirects

## Verification

```bash
npm run typecheck
npm run build
```
