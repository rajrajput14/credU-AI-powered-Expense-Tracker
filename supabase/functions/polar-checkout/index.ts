import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Polar } from "npm:@polar-sh/sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const POLAR_API_KEY = Deno.env.get("POLAR_API_KEY") || Deno.env.get("POLAR_ACCESS_TOKEN");
    
    if (!POLAR_API_KEY) {
      console.error("Missing POLAR_API_KEY environment variable");
      return new Response(JSON.stringify({ error: "Server configuration error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const polar = new Polar({ accessToken: POLAR_API_KEY });
    const { userId, email, priceId, productId } = await req.json();

    console.log(`Creating checkout for: userId=${userId}, email=${email}`);
    console.log(`Received IDs: productId=${productId}, priceId=${priceId}`);

    // Prioritize productId if available, otherwise use priceId
    const actualProductId = productId && productId !== 'undefined' ? productId : null;
    const actualPriceId = priceId && priceId !== 'undefined' ? priceId : null;

    if (!actualProductId && !actualPriceId) {
      return new Response(JSON.stringify({ error: "Missing valid productId or priceId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const checkoutConfig: any = {
      customerEmail: email,
      metadata: { userId },
      successUrl: `${req.headers.get("origin")}/success?checkout_id={CHECKOUT_ID}`,
    };

    if (actualProductId) {
      checkoutConfig.productId = actualProductId;
    } else {
      checkoutConfig.productPriceId = actualPriceId;
    }

    console.log("Checkout Config:", JSON.stringify(checkoutConfig));

    let result;
    // Attempt multiple Polar SDK structures for compatibility
    try {
      if (polar.checkouts && polar.checkouts.custom && typeof polar.checkouts.custom.create === 'function') {
        console.log("Using polar.checkouts.custom.create");
        result = await polar.checkouts.custom.create(checkoutConfig);
      } else if (polar.checkouts && typeof polar.checkouts.create === 'function') {
        console.log("Using polar.checkouts.create");
        result = await polar.checkouts.create(checkoutConfig);
      } else {
        throw new Error("Polar SDK: Could not find checkout creation method");
      }
    } catch (sdkError) {
      console.error("Polar SDK Call Error:", sdkError);
      throw sdkError;
    }

    return new Response(JSON.stringify({ url: result.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Edge Function Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
