-- Migration: Add missing fields to quotes table
-- Run this in your Supabase SQL editor

-- Add new columns to quotes table
alter table quotes
  add column if not exists job text not null default 'Untitled Quote',
  add column if not exists status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined')),
  add column if not exists total numeric default 0,
  add column if not exists expires timestamp with time zone;

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
