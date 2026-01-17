import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { WhatsAppService } from "../_shared/whatsappService.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const whatsapp = new WhatsAppService();

    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { booking_id } = await req.json();

    if (!booking_id) {
      return new Response(JSON.stringify({ error: "booking_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_id", booking_id)
      .maybeSingle();

    if (fetchError || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (booking.booking_status !== "OWNER_CONFIRMED") {
      return new Response(
        JSON.stringify({
          error: "Invalid status",
          current_status: booking.booking_status,
          message: "Booking must be in OWNER_CONFIRMED status"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { error: updateError } = await supabase
      .from("bookings")
      .update({ booking_status: "TICKET_GENERATED" })
      .eq("booking_id", booking_id);

    if (updateError) {
      console.error("Failed to update booking status:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update booking", details: updateError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const frontendUrl = Deno.env.get("FRONTEND_URL") || "http://localhost:5173";
    const ticketUrl = `${frontendUrl}/ticket?booking_id=${booking_id}`;

    const customerMessage = `🎉 Booking Confirmed!\n\nYour booking has been confirmed.\n\nBooking ID: ${booking_id}\nProperty: ${booking.property_name}\n\nView your e-ticket:\n${ticketUrl}`;

    await whatsapp.sendTextMessage(booking.guest_phone, customerMessage);

    const dueAmount = (booking.total_amount || 0) - booking.advance_amount;

    const adminMessage = `✅ Booking Confirmed & Ticket Generated\n\nBooking ID: ${booking_id}\nProperty: ${booking.property_name}\nGuest: ${booking.guest_name} (${booking.guest_phone})\nOwner: ${booking.owner_phone}\nAdvance: ₹${booking.advance_amount}\nDue: ₹${dueAmount}\n\nE-ticket: ${ticketUrl}`;

    await whatsapp.sendTextMessage(booking.admin_phone, adminMessage);

    console.log("E-ticket activated for booking:", booking_id);

    return new Response(
      JSON.stringify({
        success: true,
        booking_id,
        status: "TICKET_GENERATED",
        ticket_url: ticketUrl
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing confirmed booking:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
