import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  name: string;
  email: string;
}

function generateInvitationCode(): string {
  return `K${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}

async function sendEmail(to: string[], subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Kindly <hello@impactfuel.ch>",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: InvitationRequest = await req.json();
    if (!name?.trim() || !email?.trim()) {
      return new Response(
        JSON.stringify({ error: "name and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    console.log(`Processing invitation request for: ${name} (${email})`);

    // 1) Insert into invitations first so it always appears in Admin → Invitations
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const code = generateInvitationCode();
    const { error: insertError } = await supabase.from("invitations").insert({
      code,
      email: email.trim(),
      name: name.trim(),
      status: "pending",
      created_by: null,
    });
    if (insertError) {
      console.error("Failed to insert invitation:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to save invitation request" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 2) Send emails (non-fatal: if Resend fails, request is still saved and visible in Admin)
    let adminEmailSent = false;
    let confirmationEmailSent = false;
    if (RESEND_API_KEY) {
      try {
        await sendEmail(
          ["info@impactfuel.ch"],
          `New Kindly Invitation Request: ${name}`,
          `
            <h1>New Founding Candidate Request</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Submitted at:</strong> ${new Date().toISOString()}</p>
          `
        );
        adminEmailSent = true;
      } catch (e) {
        console.error("Admin notification email failed:", e);
      }
      try {
        await sendEmail(
          [email.trim()],
          "Your Kindly Invitation Request Received",
          `
            <div style="font-family: 'DM Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">Hi ${name},</h1>
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Thank you for your interest in becoming a Founding Co-Parent Candidate with Kindly.
              </p>
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                We've received your request and our team will carefully review your application.
              </p>
              <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Warm regards,<br><strong>The Kindly Team</strong>
              </p>
            </div>
          `
        );
        confirmationEmailSent = true;
      } catch (e) {
        console.error("Confirmation email failed:", e);
      }
    } else {
      console.warn("RESEND_API_KEY not set; skipping emails");
    }

    return new Response(
      JSON.stringify({
        success: true,
        adminEmailSent,
        confirmationEmailSent,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
