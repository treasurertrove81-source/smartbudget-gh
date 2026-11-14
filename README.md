# SmartBudget GH

SmartBudget GH is a responsive personal finance application for tracking income, expenses, monthly budgets, savings goals and financial reports. It is designed for Android, tablet and desktop use.

## Features

- Dashboard KPIs, charts, and recent transactions
- Income and expense tracking with editable categories
- Monthly budgets and category spending thresholds
- Savings goals and deposits/withdrawals
- CSV export and browser print-to-PDF
- Ghana cedi default and currency selection
- Light and dark themes
- Responsive layout
- Supabase production-backend foundation: Auth helpers, typed data access, PostgreSQL schema, and row-level security policies

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Demo mode

With no Supabase environment variables configured, the current dashboard uses browser local storage and its sample demo account:

- Email: `demo@smartbudget.gh`
- Password: `Demo1234!`

**Important:** local-storage demo authentication is for demonstration only. It is not secure for real financial data or multiple devices. Use the Supabase backend for production and do not enter sensitive personal financial information into demo mode.

## Configure Supabase

1. Create a Supabase project.
2. In the Supabase SQL Editor, run `supabase/migrations/202611140001_initial_schema.sql`.
3. Copy `.env.example` to `.env.local` and set your project URL and publishable/anon key.
4. Configure Supabase Auth email confirmation and allowed redirect URLs for your deployment.
5. Restart the Next.js dev server after changing environment variables.

The migration creates profiles, transactions, budgets, savings goals, and savings movements. Row-level security policies restrict financial records to the authenticated owner. The database trigger provisions each user profile automatically.

Never use a Supabase service-role key in `NEXT_PUBLIC_*` variables or client-side code. Apply migrations to a separate test project first and verify RLS behavior before using real financial data.

## Backend code

- `lib/supabase.ts`: lazily initialized browser client; requires the public Supabase URL/key.
- `lib/supabase-data.ts`: Supabase Auth methods and RLS-protected typed data operations.
- `supabase/migrations/202611140001_initial_schema.sql`: schema, indexes, profile trigger, constraints and RLS.

The current dashboard remains in local demo mode until the app UI is connected to these Supabase helpers and the project credentials/schema are configured. Do not treat demo mode as production authentication.
