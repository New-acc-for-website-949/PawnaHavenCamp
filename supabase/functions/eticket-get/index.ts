import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    if (req.method !== "GET") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const bookingId = url.searchParams.get("booking_id");

    if (!bookingId) {
      return new Response(JSON.stringify({ error: "booking_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: booking, error: fetchError } = await supabase
      .from("bookings")
      .select("*")
      .eq("booking_id", bookingId)
      .maybeSingle();

    if (fetchError || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    const checkoutDate = new Date(booking.checkout_datetime);
    const isExpired = now > checkoutDate;

    if (isExpired) {
      return new Response(
        JSON.stringify({
          error: "Booking expired",
          message: "This booking has expired",
          booking_id: bookingId,
          checkout_datetime: booking.checkout_datetime,
        }),
        {
          status: 410,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (booking.booking_status !== "TICKET_GENERATED" &&
        booking.booking_status !== "OWNER_CONFIRMED") {
      return new Response(
        JSON.stringify({
          error: "Ticket not available",
          message: "E-ticket is not yet available for this booking",
          current_status: booking.booking_status,
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const dueAmount = (booking.total_amount || 0) - booking.advance_amount;

    const ticketData = {
      booking_id: booking.booking_id,
      property_name: booking.property_name,
      guest_name: booking.guest_name,
      guest_phone: booking.guest_phone,
      checkin_datetime: booking.checkin_datetime,
      checkout_datetime: booking.checkout_datetime,
      advance_amount: booking.advance_amount,
      due_amount: dueAmount,
      total_amount: booking.total_amount,
      owner_name: booking.owner_name,
      owner_phone: booking.owner_phone,
      map_link: booking.map_link,
      property_address: booking.property_address,
      persons: booking.persons,
      booking_status: booking.booking_status,
      created_at: booking.created_at,
    };

    return new Response(JSON.stringify(ticketData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching e-ticket:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
