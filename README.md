# Codes Locker

A SvelteKit + Tailwind CSS coupon locker with Supabase Auth, Supabase Postgres, and Row Level Security.

## Features

- Landing page with light/dark mode
- Signup, login, logout
- Protected dashboard
- Coupon create, read, update, delete
- Single coupon entry and bulk textarea import
- Coupon brands and coupon types
- Used coupon state with line-through styling
- Filters by brand, type, status, expiry, and search
- User settings page
- AI-check page with local brand/type/value suggestions before saving
- Vercel-compatible SvelteKit adapter

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create a Supabase project.

3. In Supabase SQL Editor, run:

```sql
-- paste the contents of supabase/schema.sql
```

4. Copy environment variables:

```bash
cp .env.example .env
```

5. Fill in `.env`:

```bash
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

6. Start the app:

```bash
npm run dev
```

## Supabase Auth

In Supabase, enable Email Auth. For the local instant-login flow, turn **Confirm email** off in Authentication → Providers → Email. Signup will create the Supabase user and profile, sign out, then send the user to login with the same email and password.

Add these redirect URLs:

- `http://localhost:5173/dashboard`
- `https://your-vercel-domain.vercel.app/dashboard`

## Database Security

Run the full [`supabase/schema.sql`](supabase/schema.sql) file in the Supabase SQL Editor before testing auth. It creates `public.profiles`, the `on_auth_user_created` trigger, coupon tables, and all RLS policies.

All app tables enable Row Level Security. Policies enforce `auth.uid() = user_id` or `auth.uid() = id`, so each signed-in user can only read and mutate their own profile, brands, types, and coupons.

The schema lives in [`supabase/schema.sql`](supabase/schema.sql).

## Deploy to Vercel

1. Push this project to GitHub.
2. Import it in Vercel.
3. Add the same `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` environment variables.
4. Deploy.

The project uses `@sveltejs/adapter-vercel`, so no extra adapter changes are needed.
# codes_locker
# codes_locker
