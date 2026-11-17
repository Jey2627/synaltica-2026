/*
# SYNALTICA 2026 — Registration Schema

1. New Tables
- `registrations`
  - id (uuid, primary key)
  - registration_id (text, unique, human-readable like SYN-XXXXXX)
  - event_code (text, not null) — e.g. DATA_HUNT, TECH_QUIZ, IDEOTHON, CONNECTION, DASHBOARD
  - participant_name (text, not null)
  - college (text, not null)
  - department (text, not null)
  - year_of_study (text, not null) — 1 / 2 / 3 / 4 / PG
  - email (text, not null)
  - mobile (text, not null)
  - team_name (text, nullable) — for team events
  - team_leader_name (text, nullable)
  - team_members (jsonb, nullable) — array of {name, email, college, department, year}
  - created_at (timestamptz, default now())
2. Security
- Enable RLS on `registrations`.
- Allow anon + authenticated INSERT (public registration form, no login).
- Allow anon + authenticated SELECT (so success page can verify a registration by id; admin gating done client-side via Supabase Auth).
- Restrict UPDATE/DELETE to authenticated (admin only).
3. Notes
- Unique registration ID generated client-side using format SYN-XXXXXX (6 alphanumeric chars) and verified for uniqueness before insert.
- Duplicate prevention: unique constraints on (email, event_code) — a participant cannot register for the same event twice with the same email.
*/

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id text UNIQUE NOT NULL,
  event_code text NOT NULL,
  participant_name text NOT NULL,
  college text NOT NULL,
  department text NOT NULL,
  year_of_study text NOT NULL,
  email text NOT NULL,
  mobile text NOT NULL,
  team_name text,
  team_leader_name text,
  team_members jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS registrations_email_event_key
  ON registrations (lower(email), event_code);

CREATE INDEX IF NOT EXISTS registrations_event_code_idx ON registrations (event_code);
CREATE INDEX IF NOT EXISTS registrations_college_idx ON registrations (college);
CREATE INDEX IF NOT EXISTS registrations_created_at_idx ON registrations (created_at DESC);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON registrations TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_registrations" ON registrations;
CREATE POLICY "anon_select_registrations"
  ON registrations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_registrations" ON registrations;
CREATE POLICY "anon_insert_registrations"
  ON registrations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_registrations" ON registrations;
CREATE POLICY "auth_update_registrations"
  ON registrations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_registrations" ON registrations;
CREATE POLICY "auth_delete_registrations"
  ON registrations FOR DELETE
  TO authenticated USING (true);
