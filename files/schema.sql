-- ─────────────────────────────────────────────────────────────
-- EBYG Automation — AI Starter Kit
-- Supabase SQL Schema
-- Run this in your Supabase SQL editor to set up the database
-- ─────────────────────────────────────────────────────────────

-- License keys table
-- One row per key sold. Lemon Squeezy webhook creates these.
CREATE TABLE IF NOT EXISTS license_keys (
  id              BIGSERIAL PRIMARY KEY,
  key             TEXT NOT NULL UNIQUE,         -- e.g. EBYG-A1B2-C3D4-E5F6
  product         TEXT DEFAULT 'ai-starter-kit',
  order_id        TEXT,                          -- Lemon Squeezy order ID
  customer_email  TEXT,                          -- buyer's email (from LS webhook)
  customer_name   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  revoked         BOOLEAN DEFAULT FALSE,
  flagged         BOOLEAN DEFAULT FALSE,
  flag_reason     TEXT,
  alert_sent      BOOLEAN DEFAULT FALSE,
  notes           TEXT
);

-- Usage sessions table
-- One row per kit open. Tracks usage for monitoring.
CREATE TABLE IF NOT EXISTS key_sessions (
  id            BIGSERIAL PRIMARY KEY,
  key           TEXT NOT NULL REFERENCES license_keys(key),
  fingerprint   TEXT,                            -- browser fingerprint hash
  ip_hash       TEXT,                            -- hashed IP (no raw PII stored)
  country       TEXT,
  ua            TEXT,                            -- user agent (truncated)
  accessed_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_sessions_key ON key_sessions(key);
CREATE INDEX IF NOT EXISTS idx_sessions_accessed ON key_sessions(accessed_at);
CREATE INDEX IF NOT EXISTS idx_keys_flagged ON license_keys(flagged) WHERE flagged = TRUE;

-- ─────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- The edge function uses service role key (bypasses RLS).
-- The anon key (used in the browser) can NOT read these tables.
-- ─────────────────────────────────────────────────────────────
ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_sessions ENABLE ROW LEVEL SECURITY;

-- No public access. Only service role (edge function) can read/write.
CREATE POLICY "No public access - keys" ON license_keys FOR ALL USING (FALSE);
CREATE POLICY "No public access - sessions" ON key_sessions FOR ALL USING (FALSE);

-- ─────────────────────────────────────────────────────────────
-- HELPER VIEW — Usage summary per key (used by admin dashboard)
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW key_usage_summary AS
SELECT
  k.key,
  k.customer_email,
  k.customer_name,
  k.product,
  k.created_at AS key_created,
  k.revoked,
  k.flagged,
  k.flag_reason,
  COUNT(s.id) AS total_sessions,
  COUNT(s.id) FILTER (WHERE s.accessed_at > NOW() - INTERVAL '30 days') AS sessions_30d,
  COUNT(s.id) FILTER (WHERE s.accessed_at > NOW() - INTERVAL '7 days') AS sessions_7d,
  COUNT(DISTINCT s.fingerprint) AS unique_devices,
  COUNT(DISTINCT s.country) AS unique_countries,
  MAX(s.accessed_at) AS last_seen
FROM license_keys k
LEFT JOIN key_sessions s ON s.key = k.key
GROUP BY k.key, k.customer_email, k.customer_name, k.product,
         k.created_at, k.revoked, k.flagged, k.flag_reason
ORDER BY sessions_30d DESC NULLS LAST;

-- ─────────────────────────────────────────────────────────────
-- LEMON SQUEEZY WEBHOOK HANDLER (separate edge function)
-- Automatically creates a key when a purchase completes.
-- See: supabase/functions/ls-webhook/index.ts
-- ─────────────────────────────────────────────────────────────

-- ─────────────────────────────────────────────────────────────
-- SAMPLE DATA — Test with this before going live
-- ─────────────────────────────────────────────────────────────
INSERT INTO license_keys (key, customer_email, customer_name, notes)
VALUES ('EBYG-TEST-0000-0001', 'test@ebygautomation.com', 'EBYG Test', 'Internal test key')
ON CONFLICT (key) DO NOTHING;
