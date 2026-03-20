import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Polar } from "npm:@polar-sh/sdk";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const POLAR_API_KEY = Deno.env.get("POLAR_API_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const polar = new Polar({ accessToken: POLAR_API_KEY });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Get user from JWT
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "No authorization header" }), { status: 401, headers: corsHeaders });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401, headers: corsHeaders });
  }

  try {
    if (req.method === "GET") {
      // 9. USER BILLING API - Fetch from DB (Single Source of Truth)
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      return new Response(JSON.stringify(data || { status: "inactive", plan: "free" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (req.method === "POST" && req.url.endsWith("/cancel")) {
      // 10. CANCEL SUBSCRIPTION
      const { data: sub, error: subError } = await supabase
        .from("subscriptions")
        .select("polar_subscription_id")
        .eq("user_id", user.id)
        .single();

      if (subError || !sub?.polar_subscription_id) {
        return new Response(JSON.stringify({ error: "No active subscription found" }), { status: 404, headers: corsHeaders });
      }

      // Cancel in Polar
      await polar.subscriptions.cancel({ id: sub.polar_subscription_id });

      // Update DB locally immediately for responsiveness
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({ status: "canceled", updated_at: new Date().toISOString() })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ success: true, message: "Subscription canceled" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
