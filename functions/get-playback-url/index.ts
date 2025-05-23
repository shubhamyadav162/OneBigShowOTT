// @ts-nocheck

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@^2.0.0";

serve(async (req) => {
  try {
    const { videoId } = await req.json();

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Extract user JWT from Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: user, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
    }

    // Check user entitlement in database
    const { data: ent, error: entError } = await supabase
      .from("content_entitlements")
      .select("*")
      .eq("user_id", user.id)
      .eq("series_id", videoId)
      .single();
    if (entError || !ent) {
      return new Response(JSON.stringify({ error: "Access denied" }), { status: 403 });
    }

    // TODO: Call Bunny.net Stream API to get signed playback URL
    // Placeholder until Bunny credentials are configured
    return new Response(JSON.stringify({ url: "PLAYBACK_URL_PLACEHOLDER" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}); 