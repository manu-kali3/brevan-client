# Brevan Client Portal

People who booked services can view bookings and comment to request changes.

**Stack:** Next.js 16 + Supabase (same project `hhplmvpwlikifflwczgx`) + Resend

**Setup:**
1. Run `supabase/schema.sql` in Supabase SQL editor (creates `service_bookings` + `service_comments` with RLS)
2. Copy `.env.example` → `.env.local` and fill `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`
3. `npm install && npm run dev` → http://localhost:3003

**Routes:**
- `/` — overview
- `/bookings` — list bookings, expand to comment thread (client + admin replies)
- `/api/bookings` — GET own, POST create
- `/api/comments?bookingId=` — GET thread, POST comment (admin can reply via manage-brevan or same API with `is_admin`)

**Admin:** extend `manage-brevan` with `service_bookings` view to reply with `is_admin=true`.
