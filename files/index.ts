// supabase/functions/validate-key/index.ts
// Deploy with: supabase functions deploy validate-key

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { key, fingerprint, ua } = await req.json();

    if (!key || typeof key !== "string") {
      return json({ valid: false, reason: "No key provided." }, corsHeaders);
    }

    const cleanKey = key.trim().toUpperCase();

    // 1. Look up the key
    const { data: keyRow, error } = await supabase
      .from("license_keys")
      .select("*")
      .eq("key", cleanKey)
      .single();

    if (error || !keyRow) {
      return json({ valid: false, reason: "Key not found. Check for typos or contact hello@ebygautomation.com" }, corsHeaders);
    }

    if (keyRow.revoked) {
      return json({ valid: false, reason: "This key has been revoked. Contact hello@ebygautomation.com" }, corsHeaders);
    }

    // 2. Log this usage session
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const country = req.headers.get("cf-ipcountry") || null;

    await supabase.from("key_sessions").insert({
      key,
      fingerprint: fingerprint || null,
      ip_hash: await hashIP(ip),   // store hashed IP only — no raw PII
      country,
      ua: ua ? ua.slice(0, 200) : null,
      accessed_at: new Date().toISOString(),
    });

    // 3. Check usage in last 30 days against alert threshold
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("key_sessions")
      .select("*", { count: "exact", head: true })
      .eq("key", cleanKey)
      .gte("accessed_at", thirtyDaysAgo);

    const ALERT_THRESHOLD = 20;
    if (count && count >= ALERT_THRESHOLD && !keyRow.alert_sent) {
      // Flag for review — update the key row
      await supabase
        .from("license_keys")
        .update({ flagged: true, flag_reason: `${count} sessions in 30 days` })
        .eq("key", cleanKey);

      // Optionally send yourself an email here via Resend/SendGrid
      // (wire this up when you have email sending configured)
    }

    return json({ valid: true, product: keyRow.product || "ai-starter-kit" }, corsHeaders);

  } catch (err) {
    console.error(err);
    return json({ valid: false, reason: "Server error. Please try again." }, corsHeaders);
  }
});

function json(data: unknown, headers = {}) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json", ...headers },
  });
}

async function hashIP(ip: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip + "ebyg-salt-2024"));
  return Array.from(new Uint8Array(buf)).slice(0, 8).map(b => b.toString(16).padStart(2, "0")).join("");
}
