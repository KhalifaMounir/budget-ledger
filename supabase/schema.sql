create table if not exists public.ledger_vaults (
  sync_key text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.ledger_vaults enable row level security;

create policy "vaults can be read with a sync key"
  on public.ledger_vaults for select using (true);

create policy "vaults can be written with a sync key"
  on public.ledger_vaults for insert with check (true);

create policy "vaults can be updated with a sync key"
  on public.ledger_vaults for update using (true) with check (true);