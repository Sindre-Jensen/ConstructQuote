-- Run this in your Supabase SQL editor

-- Line items table
create table line_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  default_price numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table line_items enable row level security;

create policy "Users can view their own line items" on line_items
  for select using (auth.uid() = user_id);

create policy "Users can insert their own line items" on line_items
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own line items" on line_items
  for delete using (auth.uid() = user_id);

-- Quotes table
create table quotes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  client_name text not null,
  job text not null default 'Untitled Quote',
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'declined')),
  total numeric default 0,
  expires timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table quotes enable row level security;

create policy "Users can view their own quotes" on quotes
  for select using (auth.uid() = user_id);

create policy "Users can insert their own quotes" on quotes
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own quotes" on quotes
  for update using (auth.uid() = user_id);

create policy "Users can delete their own quotes" on quotes
  for delete using (auth.uid() = user_id);

-- Quote items table
create table quote_items (
  id uuid default gen_random_uuid() primary key,
  quote_id uuid references quotes(id) on delete cascade,
  name text not null,
  quantity numeric not null default 1,
  price numeric not null
);

alter table quote_items enable row level security;

create policy "Users can view quote items from their quotes" on quote_items
  for select using (
    exists (
      select 1 from quotes where quotes.id = quote_items.quote_id and quotes.user_id = auth.uid()
    )
  );

create policy "Users can insert quote items for their quotes" on quote_items
  for insert with check (
    exists (
      select 1 from quotes where quotes.id = quote_items.quote_id and quotes.user_id = auth.uid()
    )
  );
