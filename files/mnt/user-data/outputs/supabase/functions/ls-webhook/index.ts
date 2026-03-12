// supabase/functions/ls-webhook/index.ts
// Lemon Squeezy webhook — fires on order_created
// Deploy: supabase functions deploy ls-webhook
// Set webhook URL in LS dashboard: https://YOUR_PROJECT.supabase.co/functions/v1/ls-webhook

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const LS_WEBHOOK_SECRET = Deno.env.get("LS_WEBHOOK_SECRET")!;

serve(async (req) => {
  // Verify Lemon Squeezy signature
  const signature = req.headers.get("x-signature");
  const body = await req.text();

  if (!await verifySignature(body, signature, LS_WEBHOOK_SECRET)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const event = JSON.parse(body);
  const eventName = event.meta?.event_name;

  // Only handle completed orders
  if (eventName !== "order_created") {
    return new Response("Ignored", { status: 200 });
  }

  const order = event.data?.attributes;
  if (!order || order.status !== "paid") {
    return new Response("Not paid", { status: 200 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Generate a unique EBYG-XXXX-XXXX-XXXX key
  const key = generateKey();

  const { error } = await supabase.from("license_keys").insert({
    key,
    order_id: String(event.data?.id || ""),
    customer_email: order.user_email || null,
    customer_name: order.user_name || null,
    product: "ai-starter-kit",
  });

  if (error) {
    console.error("DB insert failed:", error);
    return new Response("DB error", { status: 500 });
  }

  // Lemon Squeezy will show the key on the confirmation page
  // if you set up a custom confirmation message in the LS dashboard.
  // The key is also available in the order metadata for your email.
  // To include in the confirmation email, use LS's "Custom data" field
  // or trigger a Zapier/Make automation from this webhook that emails the key.

  console.log(`Key created: ${key} for ${order.user_email}`);
  return new Response(JSON.stringify({ key }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});

function generateKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars (0/O, 1/I)
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `EBYG-${seg()}-${seg()}-${seg()}`;
}

async function verifySignature(body: string, signature: string | null, secret: string): Promise<boolean> {
  if (!signature) return false;
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = hexToBytes(signature);
    const bodyBytes = new TextEncoder().encode(body);
    return await crypto.subtle.verify("HMAC", key, sigBytes, bodyBytes);
  } catch {
    return false;
  }
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}
