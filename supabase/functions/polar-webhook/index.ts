import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { validateEvent } from "npm:@polar-sh/sdk/webhooks";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const POLAR_WEBHOOK_SECRET = Deno.env.get("POLAR_WEBHOOK_SECRET")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  const body = await req.text();
  let event;

  // 1. WEBHOOK SIGNATURE VERIFICATION
  try {
    event = validateEvent(body, req.headers, POLAR_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Validation Error: ${err.message}`);
    
    // Log invalid signature attempts
    await supabase.from("billing_errors").insert({
      error_message: `Webhook Validation Failed: ${err.message}`,
      details: { body: body.substring(0, 500), headers: Object.fromEntries(req.headers) }
    });

    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const { type, data: sub } = event;
  const eventId = event.id; // Correct way to get the unique event ID for idempotency

  console.log(`Received event: ${type} (ID: ${eventId})`);

  // 2. IDEMPOTENT WEBHOOK HANDLING
  const { data: existingEvent } = await supabase
    .from("webhook_events")
    .select("id")
    .eq("event_id", eventId)
    .single();

  if (existingEvent) {
    console.log(`Event ${eventId} already processed, skipping.`);
    return new Response(JSON.stringify({ received: true, duplicate: true }), { status: 200 });
  }

  // 3. SUBSCRIPTION STATE MACHINE
  try {
    if (type.startsWith("subscription.")) {
      const userId = sub.metadata?.userId;

      if (!userId) {
        throw new Error(`Missing userId in metadata for event ${eventId}`);
      }

      // Map Polar states to our DB status
      // Possible Polar states: 'incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid'
      const { error: upsertError } = await supabase
        .from("subscriptions")
        .upsert({
          user_id: userId,
          polar_subscription_id: sub.id,
          plan: sub.product?.name?.toLowerCase() || 'pro',
          status: sub.status,
          current_period_end: sub.current_period_end,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (upsertError) throw upsertError;

      // Log success in webhook_events
      await supabase.from("webhook_events").insert({
        event_id: eventId,
        type: type,
        payload: event
      });
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });

  } catch (error) {
    console.error(`Processing Error for event ${eventId}:`, error.message);
    
    // 7. ERROR LOGGING
    await supabase.from("billing_errors").insert({
      event_id: eventId,
      error_message: error.message,
      details: { type, sub }
    });

    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
