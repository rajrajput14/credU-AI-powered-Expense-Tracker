import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Polar } from "npm:@polar-sh/sdk";

const POLAR_API_KEY = Deno.env.get("POLAR_API_KEY");
const polar = new Polar({ accessToken: POLAR_API_KEY });

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, email, priceId } = await req.json();

    const result = await polar.checkouts.custom.create({
      productPriceId: priceId,
      customerEmail: email,
      metadata: { userId },
      successUrl: `${req.headers.get("origin")}/app-dashboard?checkout=success`,
    });

    return new Response(JSON.stringify({ url: result.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
