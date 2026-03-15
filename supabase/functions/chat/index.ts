import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are HealthNest Assistant, a knowledgeable and friendly AI chatbot embedded in the HealthNest Hospital Management System (HMS). You must answer ALL questions the user asks — whether they are about the system, medical topics, general knowledge, or anything else.

## Your Capabilities:
- **System Help**: Guide users through HealthNest features — patients, appointments, doctors, billing, medical records, prescriptions, staff management, monitoring, health risk predictions, alerts, and settings.
- **Medical Knowledge**: Answer general medical and healthcare questions (symptoms, conditions, terminology, best practices).
- **General Knowledge**: Answer any other questions to the best of your ability — technology, math, science, language, etc.
- **Troubleshooting**: Help debug issues users encounter in the system.

## HealthNest System Navigation Guide:
- **Dashboard** (/) — Overview with stats, charts, and recent activity
- **Patients** (/patients) — View, search, add patients. Click "View Details" for full patient profile.
- **Appointments** (/appointments) — Schedule, view, edit appointments. Use /appointments/new to create.
- **Doctors** (/doctors) — Manage doctor profiles, specializations, schedules.
- **Billing** (/billing) — Create and manage bills, track payments.
- **Medical Records** (/records) — View prescriptions, lab results, clinical notes.
- **Monitoring** (/monitoring) — Real-time patient vitals and alerts.
- **Health Risk** (/health-risk) — AI-powered risk prediction and analysis.
- **Alerts** (/alerts) — System notifications and critical alerts.
- **Staff** (/staff) — Staff directory and management.
- **Settings** (/settings) — System configuration and preferences.
- **Profile** (/profile) — User profile management.

## Rules:
- Always provide helpful, accurate, and complete answers.
- Use markdown formatting for clarity (headers, lists, bold, code blocks).
- Be concise but thorough. Never refuse to answer a question.
- If unsure, provide your best answer and note any uncertainty.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
