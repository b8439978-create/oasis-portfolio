-- OASIS Portfolio — Supabase Schema
-- Run this in your Supabase SQL Editor (https://app.supabase.com/project/_/sql/new)

CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  category TEXT DEFAULT '',
  description TEXT DEFAULT '',
  tags TEXT DEFAULT '',
  gradient TEXT DEFAULT 'from-oasis-neon to-blue-500',
  link TEXT DEFAULT '',
  github TEXT DEFAULT '',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE testimonials (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  role TEXT DEFAULT '',
  content TEXT DEFAULT '',
  rating INT DEFAULT 5,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  email TEXT DEFAULT '',
  message TEXT DEFAULT '',
  "isRead" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  "clientName" TEXT DEFAULT '',
  "clientEmail" TEXT DEFAULT '',
  company TEXT DEFAULT '',
  "projectType" TEXT DEFAULT '',
  plan TEXT DEFAULT '',
  description TEXT DEFAULT '',
  budget TEXT DEFAULT '',
  timeline TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE settings (
  id BIGINT PRIMARY KEY DEFAULT 1,
  "siteName" TEXT DEFAULT 'OASIS',
  tagline TEXT DEFAULT 'Crafting futuristic digital experiences.',
  "heroTitle" TEXT DEFAULT 'OASIS',
  "primaryColor" TEXT DEFAULT '#00f0ff',
  theme TEXT DEFAULT 'dark',
  language TEXT DEFAULT 'en'
);

-- Enable Row Level Security (optional, disable for simplicity with anon key)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon key (public access)
CREATE POLICY "Allow all" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON settings FOR ALL USING (true) WITH CHECK (true);

-- Initial settings row
INSERT INTO settings (id, "siteName", tagline, "heroTitle", "primaryColor", theme, language)
VALUES (1, 'OASIS', 'Crafting futuristic digital experiences.', 'OASIS', '#00f0ff', 'dark', 'en')
ON CONFLICT (id) DO NOTHING;
