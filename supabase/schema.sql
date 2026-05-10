create extension if not exists "pgcrypto";

create type public.user_role as enum ('admin', 'technician', 'sales', 'client');
create type public.ticket_status as enum ('new', 'assigned', 'in_progress', 'waiting_client', 'resolved', 'closed');
create type public.priority as enum ('low', 'medium', 'high', 'urgent');
create type public.opportunity_stage as enum ('prospecting', 'qualified', 'proposal', 'negotiation', 'won', 'lost');
create type public.notification_channel as enum ('email', 'whatsapp', 'in_app');

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tax_id text,
  website text,
  phone text,
  country text not null default 'El Salvador',
  created_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete set null,
  full_name text not null,
  email text not null unique,
  role public.user_role not null default 'client',
  avatar_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  position text,
  portal_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  contact_id uuid references public.contacts(id) on delete set null,
  created_by uuid references public.users(id) on delete set null,
  assigned_to uuid references public.users(id) on delete set null,
  code text not null unique,
  title text not null,
  description text not null,
  status public.ticket_status not null default 'new',
  priority public.priority not null default 'medium',
  category text,
  sla_due_at timestamptz,
  closed_at timestamptz,
  satisfaction_score int check (satisfaction_score between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ticket_comments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  author_id uuid references public.users(id) on delete set null,
  body text not null,
  is_internal boolean not null default false,
  attachment_urls text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.users(id) on delete set null,
  full_name text not null,
  company_name text not null,
  email text,
  phone text,
  source text not null default 'website',
  score int not null default 50 check (score between 0 and 100),
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  owner_id uuid references public.users(id) on delete set null,
  title text not null,
  stage public.opportunity_stage not null default 'prospecting',
  amount numeric(12,2) not null default 0,
  probability int not null default 20 check (probability between 0 and 100),
  expected_close_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quotations (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.opportunities(id) on delete cascade,
  code text not null unique,
  total numeric(12,2) not null default 0,
  currency text not null default 'USD',
  status text not null default 'draft',
  approved_by uuid references public.contacts(id) on delete set null,
  approved_at timestamptz,
  file_url text,
  created_at timestamptz not null default now()
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.users(id) on delete set null,
  company_id uuid references public.companies(id) on delete cascade,
  opportunity_id uuid references public.opportunities(id) on delete cascade,
  ticket_id uuid references public.tickets(id) on delete cascade,
  type text not null,
  subject text not null,
  notes text,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.knowledge_base (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.users(id) on delete set null,
  title text not null,
  slug text not null unique,
  content text not null,
  visibility text not null default 'internal',
  tags text[] not null default '{}',
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  channel public.notification_channel not null,
  subject text not null,
  body text not null,
  payload jsonb not null default '{}',
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index companies_name_idx on public.companies (name);
create index contacts_company_idx on public.contacts (company_id);
create index tickets_company_status_idx on public.tickets (company_id, status);
create index tickets_assigned_status_idx on public.tickets (assigned_to, status);
create index ticket_comments_ticket_idx on public.ticket_comments (ticket_id, created_at);
create index leads_owner_idx on public.leads (owner_id, status);
create index opportunities_stage_idx on public.opportunities (stage, expected_close_date);
create index activities_owner_due_idx on public.activities (owner_id, due_at);
create index notifications_user_idx on public.notifications (user_id, read_at);

create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.users where id = auth.uid()
$$;

create or replace function public.current_company_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select company_id from public.users where id = auth.uid()
$$;

alter table public.companies enable row level security;
alter table public.users enable row level security;
alter table public.contacts enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_comments enable row level security;
alter table public.leads enable row level security;
alter table public.opportunities enable row level security;
alter table public.quotations enable row level security;
alter table public.activities enable row level security;
alter table public.knowledge_base enable row level security;
alter table public.notifications enable row level security;

create policy "staff can manage companies" on public.companies
  for all using (public.current_user_role() in ('admin', 'sales', 'technician'))
  with check (public.current_user_role() in ('admin', 'sales', 'technician'));

create policy "clients see own company" on public.companies
  for select using (id = public.current_company_id());

create policy "users read relevant users" on public.users
  for select using (id = auth.uid() or public.current_user_role() in ('admin', 'sales', 'technician') or company_id = public.current_company_id());

create policy "admins manage users" on public.users
  for all using (public.current_user_role() = 'admin')
  with check (public.current_user_role() = 'admin');

create policy "contacts by company or staff" on public.contacts
  for select using (company_id = public.current_company_id() or public.current_user_role() in ('admin', 'sales', 'technician'));

create policy "staff manage contacts" on public.contacts
  for all using (public.current_user_role() in ('admin', 'sales'))
  with check (public.current_user_role() in ('admin', 'sales'));

create policy "tickets visible to staff and owning company" on public.tickets
  for select using (company_id = public.current_company_id() or public.current_user_role() in ('admin', 'sales', 'technician'));

create policy "clients create tickets for own company" on public.tickets
  for insert with check (company_id = public.current_company_id());

create policy "staff manage tickets" on public.tickets
  for all using (public.current_user_role() in ('admin', 'technician'))
  with check (public.current_user_role() in ('admin', 'technician'));

create policy "ticket comments visible by ticket access" on public.ticket_comments
  for select using (
    exists (
      select 1 from public.tickets t
      where t.id = ticket_id
      and (t.company_id = public.current_company_id() or public.current_user_role() in ('admin', 'sales', 'technician'))
    )
  );

create policy "ticket comments insert by authenticated users" on public.ticket_comments
  for insert with check (auth.uid() is not null);

create policy "sales manage leads" on public.leads
  for all using (public.current_user_role() in ('admin', 'sales'))
  with check (public.current_user_role() in ('admin', 'sales'));

create policy "sales manage opportunities" on public.opportunities
  for all using (public.current_user_role() in ('admin', 'sales'))
  with check (public.current_user_role() in ('admin', 'sales'));

create policy "clients see own quotations" on public.quotations
  for select using (
    exists (
      select 1 from public.opportunities o
      where o.id = opportunity_id
      and (o.company_id = public.current_company_id() or public.current_user_role() in ('admin', 'sales'))
    )
  );

create policy "sales manage quotations" on public.quotations
  for all using (public.current_user_role() in ('admin', 'sales'))
  with check (public.current_user_role() in ('admin', 'sales'));

create policy "activities visible to staff" on public.activities
  for all using (public.current_user_role() in ('admin', 'sales', 'technician'))
  with check (public.current_user_role() in ('admin', 'sales', 'technician'));

create policy "published knowledge visible to authenticated" on public.knowledge_base
  for select using (published_at is not null or public.current_user_role() in ('admin', 'sales', 'technician'));

create policy "staff manage knowledge" on public.knowledge_base
  for all using (public.current_user_role() in ('admin', 'technician'))
  with check (public.current_user_role() in ('admin', 'technician'));

create policy "users see own notifications" on public.notifications
  for select using (user_id = auth.uid());

create policy "staff create notifications" on public.notifications
  for insert with check (public.current_user_role() in ('admin', 'sales', 'technician'));
