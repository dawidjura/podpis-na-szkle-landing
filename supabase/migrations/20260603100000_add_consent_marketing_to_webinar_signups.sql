-- Uruchom w Supabase SQL Editor (lub przez CLI), jeśli tabela już istnieje bez tej kolumny.
alter table public.webinar_signups
  add column if not exists consent_marketing boolean not null default false;

comment on column public.webinar_signups.consent_marketing is
  'Zgoda na komunikację handlową (checkbox opcjonalny w formularzu rejestracji).';
