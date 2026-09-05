create table if not exists user_2fa_codes (
  user_id uuid references auth.users(id) on delete cascade primary key,
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int default 0 not null,
  created_at timestamptz default now()
);
alter table user_2fa_codes enable row level security;
create policy "service role all 2fa" on user_2fa_codes for all using (true) with check (true);

create table if not exists rate_limit_settings (
  key text primary key,
  value int not null,
  updated_at timestamptz default now()
);
insert into rate_limit_settings (key, value) values
  ('login', 10), ('signup', 10), ('bookings', 20), ('comments', 30), ('2fa', 5)
on conflict (key) do nothing;
alter table rate_limit_settings enable row level security;
create policy "service role all rate" on rate_limit_settings for all using (true) with check (true);
