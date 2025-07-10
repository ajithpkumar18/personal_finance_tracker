This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

# 💰 Personal Finance Tracker+

A full-stack Personal Finance Tracker app built using **Next.js**, **MongoDB**, and **Python (Flask)** for intelligent suggestions.

> 🚀 Easily manage, analyze, and optimize your spending with smart insights.

---

## 📌 Features

### ✅ Expense Management
- Add, edit, delete daily expenses
- Filter by category, date, or payment method
- Search expenses by notes

### ✅ Budget & Alerts
- Set monthly budget for each category
- Real-time alert if you exceed 80% or 100% of your budget

### ✅ Dashboard
- Total spending overview
- Pie & line charts using **Recharts**
- Top spending categories and payment methods

### ✅ Smart Suggestions (via Flask API)
- Analyzes past 30 days of expenses
- Provides actionable tips like:
  - "You're spending a lot on Food. Try to reduce it by 15%."
  - "Travel expenses have increased this month."
