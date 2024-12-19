create table students (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  cohort text not null,
  courses text[] not null,
  date_joined timestamp with time zone default now(),
  last_login timestamp with time zone default now(),
  status text not null default 'active'
);

