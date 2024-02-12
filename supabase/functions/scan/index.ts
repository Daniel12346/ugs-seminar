// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
  "Access-Control-Allow-Methods": "POST",
};


//called when a student uses the NFC scanner
Deno.serve(async (req) => {
  const { hall_id, student_id } = await req.json();

  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );
    //find the ongoing lecture
    const { data, error } = await supabaseClient.from("lecture").select("*")
      .eq("hall_id", hall_id).eq(
        "is_ongoing",
        true,
      ).single();
    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("No ongoing lecture found");
    }
    //TODO: check if student is enrolled in the lecture
    const {
      error: studentError,
    } = await supabaseClient.from("lecture_student").update({
      is_student_present: true,
    }).eq("lecture_id", data.id).eq("student_id", student_id);
    if (studentError) {
      throw studentError;
    }
    return new Response(JSON.stringify({ message: "Scan successful" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
