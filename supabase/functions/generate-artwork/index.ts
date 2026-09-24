import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const REPLICATE_API_TOKEN = Deno.env.get("REPLICATE_API_TOKEN")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? ""
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? ""

corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // 1. Authenticate the user
    const authHeader = req.headers.get("Authorization")!
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    })

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error("Unauthorized: You must be logged in to use the Studio.")
    }

    // 2. Parse the prompt and parameters
    const { prompt, aspect_ratio = "1:1" } = await req.json()

    if (!prompt) {
      throw new Error("Prompt is required.")
    }

    // 3. Call Replicate API (Flux Schnell)
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "c576612246d38399747a34834057e8f03d0866f99c4061b5470851e1e20b5e0a", // flux-schnell
        input: {
          prompt: prompt,
          aspect_ratio: aspect_ratio,
          go_fast: true,
          output_format: "webp",
          output_quality: 80,
        },
      }),
    })

    const prediction = await response.json()
    if (!response.ok) {
      throw new Error(`Replicate API error: ${prediction.detail || response.statusText}`)
    }

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 201,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    })
  }
})
