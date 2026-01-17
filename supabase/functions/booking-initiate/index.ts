import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface BookingRequest {
  property_id: string;
  property_name: string;
  property_type: "VILLA" | "CAMPING" | "COTTAGE";
  guest_name: string;
  guest_phone: string;
  owner_phone: string;
  admin_phone: string;
  checkin_datetime: string;
  checkout_datetime: string;
  advance_amount: number;
  persons?: number;
  max_capacity?: number;
  veg_guest_count?: number;
  nonveg_guest_count?: number;
  owner_name?: string;
  map_link?: string;
  property_address?: string;
  total_amount?: number;
}

function validateBookingRequest(req: BookingRequest): { valid: boolean; error?: string } {
  if (!req.property_id || !req.property_name || !req.property_type) {
    return { valid: false, error: "Missing required property fields" };
  }

  if (!req.guest_name || !req.guest_phone) {
    return { valid: false, error: "Missing required guest information" };
  }

  if (!req.owner_phone || !req.admin_phone) {
    return { valid: false, error: "Missing required contact information" };
  }

  if (!req.checkin_datetime || !req.checkout_datetime) {
    return { valid: false, error: "Missing required booking dates" };
  }

  if (!req.advance_amount || req.advance_amount <= 0) {
    return { valid: false, error: "Advance amount must be greater than 0" };
  }

  const checkin = new Date(req.checkin_datetime);
  const checkout = new Date(req.checkout_datetime);
  if (checkout <= checkin) {
    return { valid: false, error: "Checkout must be after checkin" };
  }

  if (req.property_type === "VILLA") {
    if (!req.persons || !req.max_capacity) {
      return { valid: false, error: "VILLA bookings require persons and max_capacity" };
    }
    if (req.persons <= 0 || req.persons > req.max_capacity) {
      return { valid: false, error: "Persons must be between 1 and max_capacity" };
    }
    if (req.veg_guest_count !== undefined || req.nonveg_guest_count !== undefined) {
      return { valid: false, error: "VILLA bookings should not have guest counts" };
    }
  } else if (req.property_type === "CAMPING" || req.property_type === "COTTAGE") {
    if (req.veg_guest_count === undefined || req.nonveg_guest_count === undefined) {
      return { valid: false, error: "CAMPING/COTTAGE bookings require veg and nonveg guest counts" };
    }
    if ((req.veg_guest_count + req.nonveg_guest_count) <= 0) {
      return { valid: false, error: "Total guest count must be greater than 0" };
    }
    if (req.persons !== undefined || req.max_capacity !== undefined) {
      return { valid: false, error: "CAMPING/COTTAGE bookings should not have persons/max_capacity" };
    }
  } else {
    return { valid: false, error: "Invalid property_type" };
  }

  return { valid: true };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const bookingRequest: BookingRequest = await req.json();

    const validation = validateBookingRequest(bookingRequest);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.error }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const bookingData: any = {
      property_id: bookingRequest.property_id,
      property_name: bookingRequest.property_name,
      property_type: bookingRequest.property_type,
      guest_name: bookingRequest.guest_name,
      guest_phone: bookingRequest.guest_phone,
      owner_phone: bookingRequest.owner_phone,
      admin_phone: bookingRequest.admin_phone,
      checkin_datetime: bookingRequest.checkin_datetime,
      checkout_datetime: bookingRequest.checkout_datetime,
      advance_amount: bookingRequest.advance_amount,
      payment_status: "INITIATED",
      booking_status: "PAYMENT_PENDING",
    };

    if (bookingRequest.owner_name) {
      bookingData.owner_name = bookingRequest.owner_name;
    }
    if (bookingRequest.map_link) {
      bookingData.map_link = bookingRequest.map_link;
    }
    if (bookingRequest.property_address) {
      bookingData.property_address = bookingRequest.property_address;
    }
    if (bookingRequest.total_amount) {
      bookingData.total_amount = bookingRequest.total_amount;
    }

    if (bookingRequest.property_type === "VILLA") {
      bookingData.persons = bookingRequest.persons;
      bookingData.max_capacity = bookingRequest.max_capacity;
    } else {
      bookingData.veg_guest_count = bookingRequest.veg_guest_count;
      bookingData.nonveg_guest_count = bookingRequest.nonveg_guest_count;
    }

    const { data, error } = await supabaseClient
      .from("bookings")
      .insert(bookingData)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to create booking", details: error.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking: data,
        message: "Booking initiated successfully"
      }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
