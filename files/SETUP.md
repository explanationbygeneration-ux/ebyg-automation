# EBYG AI Starter Kit — Technical Setup Guide

## What you're deploying

| File | Purpose |
|---|---|
| `kit.html` | The buyer-facing kit app with unlock screen |
| `admin.html` | Your private monitoring dashboard |
| `supabase/schema.sql` | Database tables — run once in Supabase |
| `supabase/functions/validate-key/index.ts` | Validates keys + logs sessions |
| `supabase/functions/ls-webhook/index.ts` | Creates a key on every Lemon Squeezy purchase |

---

## Step 1 — Supabase setup (15 minutes)

1. Create a free account at **supabase.com**
2. Create a new project (any name, remember the database password)
3. Go to **SQL Editor** → paste and run the contents of `schema.sql`
4. Go to **Settings → API** and copy:
   - Project URL (looks like `https://abcdef.supabase.co`)
   - `anon` public key
   - `service_role` secret key (keep this private)

---

## Step 2 — Deploy Edge Functions (10 minutes)

Install the Supabase CLI:
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

Set environment variables:
```bash
supabase secrets set SUPABASE_URL=https://YOUR_PROJECT.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set LS_WEBHOOK_SECRET=your_lemon_squeezy_webhook_secret
```

Deploy both functions:
```bash
supabase functions deploy validate-key
supabase functions deploy ls-webhook
```

Your function URLs will be:
- `https://YOUR_PROJECT.supabase.co/functions/v1/validate-key`
- `https://YOUR_PROJECT.supabase.co/functions/v1/ls-webhook`

---

## Step 3 — Configure kit.html (5 minutes)

Open `kit.html` and replace these two lines near the top of the `<script>` block:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';  // the anon key, NOT service_role
```

---

## Step 4 — Configure admin.html (2 minutes)

Open `admin.html` and change the admin password:

```javascript
const ADMIN_PASSWORD = 'ebyg-admin-2024'; // Change this to something strong
```

The Supabase URL and service role key are entered at login — no hardcoding needed.

---

## Step 5 — Set up Lemon Squeezy webhook (10 minutes)

1. Log into Lemon Squeezy → Settings → Webhooks
2. Add a new webhook:
   - **URL:** `https://YOUR_PROJECT.supabase.co/functions/v1/ls-webhook`
   - **Events:** `order_created`
   - **Signing secret:** Copy this value → set it as `LS_WEBHOOK_SECRET` above
3. Save

Now every purchase automatically creates a key in your database.

---

## Step 6 — Display key at checkout (Lemon Squeezy)

In Lemon Squeezy, go to your product → **Confirmation page**:

Add a message like:
> "Your license key has been emailed to you. Save it — you'll need it to access your kit at kit.ebygautomation.com"

To include the actual key in the confirmation email, set up a **Zapier automation**:
- Trigger: Lemon Squeezy → New Order
- Action: Look up the key from Supabase (using the order ID)
- Action: Send email via Gmail/Mailchimp with the key

Or use **Make.com** for the same flow.

---

## Step 7 — Deploy the files

**Option A — Host kit.html on your existing site (recommended)**

Upload `kit.html` to your web host as `/kit/index.html`
→ Accessible at `kit.ebygautomation.com` (set up a subdomain in DNS)

Upload `admin.html` somewhere private — a `/admin` path with HTTP basic auth, or just open it locally.

**Option B — Netlify (free)**

Drag both HTML files into a new Netlify site. Set up a custom domain for the kit.

---

## Step 8 — Test end-to-end

1. Insert a test key manually in Supabase:
   ```sql
   INSERT INTO license_keys (key, customer_email, notes)
   VALUES ('EBYG-TEST-0000-0001', 'you@youremail.com', 'Test key');
   ```
2. Open `kit.html` → enter `EBYG-TEST-0000-0001` → should unlock
3. Check `admin.html` → the session should appear in the table

---

## Monitoring thresholds

The system flags any key with **20+ sessions in 30 days** as unusual. You can adjust this:

In `supabase/functions/validate-key/index.ts`:
```typescript
const ALERT_THRESHOLD = 20; // Change this number
```

A "device" is tracked by browser fingerprint (non-reversible hash of user agent + screen + timezone). One person using the kit on their laptop + phone = 2 devices. Anything over 4–5 unique devices on a single key is worth a look.

---

## Questions

hello@ebygautomation.com
