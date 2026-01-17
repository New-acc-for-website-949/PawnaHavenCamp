import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { WhatsAppService } from "../_shared/whatsappService.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface OwnerActionPayload {
  bookingId: string;
  action: "CONFIRM" | "CANCEL";
}

const processedMessages = new Set<string>();

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const whatsappService = new WhatsAppService();

  try {
    if (req.method === "GET") {
      const url = new URL(req.url);
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      if (!mode || !token || !challenge) {
        return new Response("Missing verification parameters", { status: 400 });
      }

      const verifiedChallenge = whatsappService.verifyWebhook(mode, token, challenge);
      if (verifiedChallenge) {
        return new Response(verifiedChallenge, { status: 200 });
      }

      return new Response("Verification failed", { status: 403 });
    }

    if (req.method === "POST") {
      const payload = await req.json();
      console.log("WhatsApp webhook received:", JSON.stringify(payload, null, 2));

      const buttonResponse = whatsappService.extractButtonResponse(payload);
      if (!buttonResponse) {
        return new Response(JSON.stringify({ status: "ignored", reason: "not_button_response" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const messageId = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.id;
      if (messageId && processedMessages.has(messageId)) {
        console.log("Duplicate message ignored:", messageId);
        return new Response(JSON.stringify({ status: "ignored", reason: "duplicate" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (messageId) {
        processedMessages.add(messageId);
        setTimeout(() => processedMessages.delete(messageId), 600000);
      }

      let actionPayload: OwnerActionPayload;
      try {
        actionPayload = JSON.parse(buttonResponse.buttonId);
      } catch {
        console.error("Invalid button payload:", buttonResponse.buttonId);
        return new Response(JSON.stringify({ status: "error", reason: "invalid_payload" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { bookingId, action } = actionPayload;

      const { data: booking, error: fetchError } = await supabase
        .from("bookings")
        .select("*")
        .eq("booking_id", bookingId)
        .maybeSingle();

      if (fetchError || !booking) {
        console.error("Booking not found:", bookingId);
        return new Response(JSON.stringify({ status: "error", reason: "booking_not_found" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (booking.booking_status !== "BOOKING_REQUEST_SENT_TO_OWNER") {
        console.log("Booking already processed:", booking.booking_status);
        return new Response(JSON.stringify({ status: "ignored", reason: "already_processed" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const newStatus = action === "CONFIRM" ? "OWNER_CONFIRMED" : "OWNER_CANCELLED";
      const { error: updateError } = await supabase
        .from("bookings")
        .update({ booking_status: newStatus })
        .eq("booking_id", bookingId);

      if (updateError) {
        console.error("Failed to update booking:", updateError);
        return new Response(JSON.stringify({ status: "error", reason: "update_failed" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "CONFIRM") {
        await whatsappService.sendTextMessage(
          booking.owner_phone,
          `✅ Booking confirmed!\n\nBooking ID: ${bookingId}\nGuest: ${booking.guest_name}\nProperty: ${booking.property_name}`
        );

        try {
          const processUrl = `${supabaseUrl}/functions/v1/booking-process-confirmed`;
          const processResponse = await fetch(processUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({ booking_id: bookingId }),
          });

          if (!processResponse.ok) {
            console.error("Failed to process confirmed booking:", await processResponse.text());
          } else {
            console.log("Confirmed booking processed successfully");
          }
        } catch (error) {
          console.error("Error triggering booking-process-confirmed:", error);
        }
      } else {
        await whatsappService.sendTextMessage(
          booking.owner_phone,
          `❌ Booking cancelled.\n\nBooking ID: ${bookingId}\nGuest: ${booking.guest_name}\nProperty: ${booking.property_name}`
        );

        try {
          const processUrl = `${supabaseUrl}/functions/v1/booking-process-cancelled`;
          const processResponse = await fetch(processUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({ booking_id: bookingId }),
          });

          if (!processResponse.ok) {
            console.error("Failed to process cancelled booking:", await processResponse.text());
          } else {
            console.log("Cancelled booking processed successfully");
          }
        } catch (error) {
          console.error("Error triggering booking-process-cancelled:", error);
        }
      }

      console.log(`Booking ${bookingId} updated to ${newStatus}`);

      return new Response(JSON.stringify({ status: "success", action: newStatus }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response("Method not allowed", { status: 405 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
