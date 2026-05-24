-- ============================================================
-- ZenZone V2 — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── PROFILES (extends Supabase auth.users) ──────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id                      UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username                TEXT UNIQUE,
  display_name            TEXT,
  avatar_url              TEXT,
  bio                     TEXT,
  timezone                TEXT DEFAULT 'Asia/Kolkata',
  theme                   TEXT DEFAULT 'calm-night'
                            CHECK (theme IN ('calm-night', 'morning-mist', 'forest-deep')),
  notification_prefs      JSONB DEFAULT '{}',
  is_admin                BOOLEAN DEFAULT false,
  onboarded               BOOLEAN DEFAULT false,
  created_at              TIMESTAMPTZ DEFAULT now(),
  updated_at              TIMESTAMPTZ DEFAULT now()
);

-- ── TODOS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS todos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  completed   BOOLEAN DEFAULT false,
  priority    TEXT DEFAULT 'medium'
                CHECK (priority IN ('low', 'medium', 'high')),
  category    TEXT,
  due_date    DATE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS todos_user_id_idx ON todos(user_id);

-- ── HABITS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS habits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name        TEXT NOT NULL,
  emoji       TEXT,
  frequency   TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  target_days INTEGER DEFAULT 1,
  color       TEXT DEFAULT 'var(--accent-teal)',
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS habit_completions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id        UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  user_id         UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  completed_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  notes           TEXT,
  UNIQUE(habit_id, completed_date)
);

-- ── MOOD LOGS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mood_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mood_score    INTEGER NOT NULL CHECK (mood_score BETWEEN 1 AND 5),
  mood_label    TEXT,
  energy_level  INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  notes         TEXT,
  tags          TEXT[] DEFAULT '{}',
  logged_at     TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS mood_logs_user_id_idx ON mood_logs(user_id);
CREATE INDEX IF NOT EXISTS mood_logs_logged_at_idx ON mood_logs(logged_at);

-- ── JOURNAL ENTRIES ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS journal_entries (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title       TEXT,
  content     TEXT NOT NULL,
  mood_score  INTEGER CHECK (mood_score BETWEEN 1 AND 5),
  tags        TEXT[] DEFAULT '{}',
  is_private  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS journal_user_id_idx ON journal_entries(user_id);

-- ── FOCUS SESSIONS (Pomodoro) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS focus_sessions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  duration_minutes    INTEGER NOT NULL DEFAULT 25,
  break_minutes       INTEGER DEFAULT 5,
  task_description    TEXT,
  completed           BOOLEAN DEFAULT false,
  started_at          TIMESTAMPTZ DEFAULT now(),
  ended_at            TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS focus_sessions_user_idx ON focus_sessions(user_id);

-- ── AFFIRMATIONS (admin-managed content) ─────────────────────
CREATE TABLE IF NOT EXISTS affirmations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content     TEXT NOT NULL,
  category    TEXT,
  author      TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_by  UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── SEED: Default affirmations ────────────────────────────────
INSERT INTO affirmations (content, author, category, is_active) VALUES
  ('I am calm, centered, and capable of handling whatever comes my way.', null, 'calm', true),
  ('Each breath I take fills me with peace and clarity.', null, 'breathing', true),
  ('I choose to focus on what I can control and release what I cannot.', null, 'focus', true),
  ('I am worthy of rest, joy, and deep inner peace.', null, 'self-love', true),
  ('My mind is clear. My heart is open. I am present.', null, 'mindfulness', true),
  ('Progress, not perfection, is my goal.', null, 'growth', true),
  ('I am doing the best I can, and that is enough.', null, 'self-compassion', true),
  ('Every day is a fresh start and a new opportunity to grow.', null, 'growth', true),
  ('I trust my journey, even when the path is unclear.', null, 'trust', true),
  ('Small steps every day lead to meaningful change.', null, 'growth', true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- profiles
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos               ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits              ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE affirmations        ENABLE ROW LEVEL SECURITY;

-- profiles policies
DROP POLICY IF EXISTS "profiles: users read own" ON profiles;
CREATE POLICY "profiles: users read own"   ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles: users update own" ON profiles;
CREATE POLICY "profiles: users update own" ON profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles: users insert own" ON profiles;
CREATE POLICY "profiles: users insert own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles: admin read all" ON profiles;
CREATE POLICY "profiles: admin read all"   ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
);

-- todos policies
DROP POLICY IF EXISTS "todos: own" ON todos;
CREATE POLICY "todos: own"       ON todos FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "todos: admin all" ON todos;
CREATE POLICY "todos: admin all" ON todos FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- habits
DROP POLICY IF EXISTS "habits: own" ON habits;
CREATE POLICY "habits: own"      ON habits             FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "completions: own" ON habit_completions;
CREATE POLICY "completions: own" ON habit_completions  FOR ALL USING (auth.uid() = user_id);

-- mood_logs
DROP POLICY IF EXISTS "mood: own" ON mood_logs;
CREATE POLICY "mood: own"        ON mood_logs          FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "mood: admin" ON mood_logs;
CREATE POLICY "mood: admin"      ON mood_logs          FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- journal_entries
DROP POLICY IF EXISTS "journal: own" ON journal_entries;
CREATE POLICY "journal: own"     ON journal_entries    FOR ALL USING (auth.uid() = user_id);

-- focus_sessions
DROP POLICY IF EXISTS "focus: own" ON focus_sessions;
CREATE POLICY "focus: own"       ON focus_sessions     FOR ALL USING (auth.uid() = user_id);

-- affirmations: everyone can read active ones; only admins can write
DROP POLICY IF EXISTS "affirmations: read active" ON affirmations;
CREATE POLICY "affirmations: read active" ON affirmations FOR SELECT USING (is_active = true OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
DROP POLICY IF EXISTS "affirmations: admin write" ON affirmations;
CREATE POLICY "affirmations: admin write" ON affirmations FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
DROP POLICY IF EXISTS "affirmations: admin update" ON affirmations;
CREATE POLICY "affirmations: admin update" ON affirmations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
DROP POLICY IF EXISTS "affirmations: admin delete" ON affirmations;
CREATE POLICY "affirmations: admin delete" ON affirmations FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER todos_updated_at BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER journal_updated_at BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ADMIN SETUP
-- After Anupama and Arijit create their accounts via the app,
-- run this ONE TIME to grant admin access:
-- ============================================================
-- UPDATE profiles SET is_admin = true
-- WHERE id IN (
--   SELECT id FROM profiles
--   WHERE display_name IN ('Anupama Bain', 'Arijit Adhikary')
-- );
