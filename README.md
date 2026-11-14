# SmartBudget GH

SmartBudget GH is a responsive personal finance application for tracking income, expenses, monthly budgets, savings goals and financial reports. It is designed for Android, tablet and desktop use, with a premium fintech dashboard aesthetic.

## Features

- Dashboard with key financial KPIs
- Income and expense tracking with categories
- Monthly budget planning with warnings at 80% and 100%
- Savings goals, progress bars and contribution calculations
- Reports with CSV and PDF export
- Currency and theme controls
- Local demo authentication with persistent browser storage
- Mobile-first responsive interface

## Stack

- Next.js
- Tailwind CSS
- Recharts
- Supabase-ready client configuration

## Local run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Demo login

- Email: demo@smartbudget.gh
- Password: Demo1234!

## Supabase setup

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```
