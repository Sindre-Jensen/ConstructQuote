-- Migration: Add missing fields to quotes table
-- Run this in your Supabase SQL editor

-- Add new columns to quotes table
alter table quotes
  add column if not exists job text not null default 'Untitled Quote',
  add column if not exists status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined')),
  add column if not exists total numeric default 0,
  add column if not exists expires timestamp with time zone,
  add column if not exists tax_label text,
  add column if not exists tax_percentage numeric default 0;

-- Populate job field from client_name for existing quotes
update quotes
set job = client_name
where job = 'Untitled Quote';

-- Calculate total from quote_items for existing quotes
update quotes
set total = (
  select coalesce(sum(qi.quantity * qi.price), 0)
  from quote_items qi
  where qi.quote_id = quotes.id
);

-- Add update policy for quotes (if it doesn't exist)
drop policy if exists "Users can update their own quotes" on quotes;
create policy "Users can update their own quotes" on quotes
  for update using (auth.uid() = user_id);

-- Add delete policy for quotes (if it doesn't exist)
drop policy if exists "Users can delete their own quotes" on quotes;
create policy "Users can delete their own quotes" on quotes
  for delete using (auth.uid() = user_id);

-- Create quote_taxes table for multiple tax rates
create table if not exists quote_taxes (
  id uuid default gen_random_uuid() primary key,
  quote_id uuid references quotes(id) on delete cascade,
  label text not null,
  percentage numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table quote_taxes enable row level security;

create policy "Users can view taxes from their quotes" on quote_taxes
  for select using (
    exists (
      select 1 from quotes where quotes.id = quote_taxes.quote_id and quotes.user_id = auth.uid()
    )
  );

create policy "Users can insert taxes for their quotes" on quote_taxes
  for insert with check (
    exists (
      select 1 from quotes where quotes.id = quote_taxes.quote_id and quotes.user_id = auth.uid()
    )
  );

create policy "Users can update taxes on their quotes" on quote_taxes
  for update using (
    exists (
      select 1 from quotes where quotes.id = quote_taxes.quote_id and quotes.user_id = auth.uid()
    )
  );

create policy "Users can delete taxes from their quotes" on quote_taxes
  for delete using (
    exists (
      select 1 from quotes where quotes.id = quote_taxes.quote_id and quotes.user_id = auth.uid()
    )
  );

-- Create saved_taxes table for reusable tax rates
create table if not exists saved_taxes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  label text not null,
  percentage numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table saved_taxes enable row level security;

create policy "Users can view their own saved taxes" on saved_taxes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own saved taxes" on saved_taxes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own saved taxes" on saved_taxes
  for update using (auth.uid() = user_id);

create policy "Users can delete their own saved taxes" on saved_taxes
  for delete using (auth.uid() = user_id);
