# ConstructQuote

A lean MVP quoting tool for construction/trades businesses. Create professional quotes in under 2 minutes using reusable line items.

## Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to Project Settings → API
3. Copy your project URL and anon key

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database

1. In Supabase, go to the SQL Editor
2. Open `supabase-schema.sql` from this project
3. Run the SQL script to create tables and RLS policies

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Authentication**: Email/password login/signup via Supabase Auth
- **Line Item Library**: Create, view, and delete reusable line items
- **Quote Management**: Create, view, and duplicate quotes
- **Quote Builder**: Add items from library or custom items with live total calculation
- **PDF Export**: Export quotes as PDF using browser print

## Pages

- `/login` - Login/signup
- `/dashboard` - List of all quotes
- `/quotes/new` - Create a new quote
- `/quotes/[id]` - View quote details, duplicate, or export PDF
- `/items` - Manage line item library
