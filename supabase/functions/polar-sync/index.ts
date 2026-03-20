import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Polar } from "npm:@polar-sh/sdk";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const POLAR_API_KEY = Deno.env.get("POLAR_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const polar = new Polar({ accessToken: POLAR_API_KEY });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } });
  }

  try {
    // 1. Fetch all subscriptions that need syncing
    const { data: subs, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .not("polar_subscription_id", "is", null);

    if (fetchError) throw fetchError;

    const results = { synced: 0, updated: 0, errors: 0 };

    for (const sub of subs) {
      try {
        // 2. Fetch latest from Polar
        const polarSub = await polar.subscriptions.get({ id: sub.polar_subscription_id });

        if (polarSub.status !== sub.status || polarSub.currentPeriodEnd !== sub.current_period_end) {
          // 3. Update Supabase if discrepancy found
          const { error: updateError } = await supabase
            .from("subscriptions")
            .update({
              status: polarSub.status,
              current_period_end: polarSub.currentPeriodEnd,
              updated_at: new Date().toISOString()
            })
            .eq("id", sub.id);

          if (updateError) throw updateError;
          results.updated++;
        }
        results.synced++;
      } catch (err) {
        console.error(`Sync error for sub ${sub.id}:`, err.message);
        results.errors++;
      }
    }

    return new Response(JSON.stringify(results), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
