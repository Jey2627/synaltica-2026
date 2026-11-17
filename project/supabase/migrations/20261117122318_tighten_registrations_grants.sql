/*
# Tighten grants on registrations (least privilege)

1. Changes
- Revoke UPDATE and DELETE from `anon` on `registrations`. These operations are
  admin-only (gated by Supabase Auth + authenticated-scoped policies), so anon
  should not hold the table-level grant at all. RLS already blocked anon, but
  least-privilege says don't grant verbs the role can't legitimately use.
- Keep anon SELECT + INSERT (public registration form + success verification).
- authenticated keeps full CRUD (admin dashboard).
2. Security
- No policy changes. No data changes.
*/

REVOKE UPDATE ON registrations FROM anon;
REVOKE DELETE ON registrations FROM anon;
