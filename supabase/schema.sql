-- Brevan Client Portal — service bookings + comments
-- Run in Supabase SQL editor on same project (hhplmvpwlikifflwczgx)

create table if not exists service_bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  service text not null,
  description text,
  status text not null default 'pending' check (status in ('pending','in_progress','review','completed','cancelled')),
  amount numeric default 0,
  created_at timestamptz default now()
);

create table if not exists service_comments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references service_bookings(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  body text not null check (char_length(body) between 1 and 5000),
  is_admin boolean default false not null,
  created_at timestamptz default now()
);

alter table service_bookings enable row level security;
alter table service_comments enable row level security;

create policy "users read own bookings" on service_bookings for select using (auth.uid() = user_id);
create policy "users create own bookings" on service_bookings for insert with check (auth.uid() = user_id);
create policy "service role all" on service_bookings for all using (true) with check (true);
create policy "users read own comments" on service_comments for select using (auth.uid() = user_id or exists (select 1 from service_bookings where service_bookings.id = booking_id and service_bookings.user_id = auth.uid()));
create policy "users create comments on own bookings" on service_comments for insert with check (auth.uid() = user_id and exists (select 1 from service_bookings where service_bookings.id = booking_id and service_bookings.user_id = auth.uid()));
create policy "service role all comments" on service_comments for all using (true) with check (true);
