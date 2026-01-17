import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { WhatsAppService } from "../_shared/whatsappService.ts";
import { PaytmChecksum } from "../_shared/paytmChecksum.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function initiatePaytmRefund(
  orderId: string,
  transactionId: string,
  refundAmount: string
): Promise<{ success: boolean; refundId?: string; error?: string }> {
  const merchantId = Deno.env.get("PAYTM_MERCHANT_ID");
  const merchantKey = Deno.env.get("PAYTM_MERCHANT_KEY");
  const environment = Deno.env.get("PAYTM_ENVIRONMENT") || "staging";

  if (!merchantId || !merchantKey) {
    console.warn("Paytm credentials not configured. Refund will be logged only.");
    return { success: true, refundId: `MOCK_REFUND_${Date.now()}` };
  }

  const refundId = `REFUND_${orderId}_${Date.now()}`;
  const paytmUrl =
    environment === "production"
      ? "https://securegw.paytm.in/refund/apply"
      : "https://securegw-stage.paytm.in/refund/apply";

  const requestBody = {
    body: {
      mid: merchantId,
      txnType: "REFUND",
      orderId: orderId,
      txnId: transactionId,
      refId: refundId,
      refundAmount: refundAmount,
    },
  };

  try {
    const checksum = await PaytmChecksum.generateChecksumByObject(
      requestBody.body,
      merchantKey
    );

    const response = await fetch(paytmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...requestBody,
        head: {
          signature: checksum,
        },
      }),
    });

    const result = await response.json();
    console.log("Paytm refund response:", result);

    if (result.body?.resultInfo?.resultStatus === "TXN_SUCCESS" ||
        result.body?.resultInfo?.resultStatus === "PENDING") {
      return { success: true, refundId };
    } else {
      return {
        success: false,
        error: result.body?.resultInfo?.resultMsg || "Refund failed",
      };
    }
  } catch (error) {
    console.error("Paytm refund error:", error);
    return { success: false, error: error.message };
  }
}

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

    if (booking.booking_status !== "OWNER_CANCELLED") {
      return new Response(
        JSON.stringify({
          error: "Invalid status",
          current_status: booking.booking_status,
          message: "Booking must be in OWNER_CANCELLED status"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (booking.refund_id) {
      console.log("Refund already processed for booking:", booking_id);
      return new Response(
        JSON.stringify({
          success: true,
          message: "Refund already processed",
          refund_id: booking.refund_id,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let refundResult = { success: false, refundId: "", error: "" };

    if (booking.payment_status === "SUCCESS") {
      refundResult = await initiatePaytmRefund(
        booking.order_id,
        booking.transaction_id,
        booking.advance_amount.toString()
      );

      if (refundResult.success) {
        const { error: updateError } = await supabase
          .from("bookings")
          .update({
            booking_status: "REFUND_INITIATED",
            refund_id: refundResult.refundId,
          })
          .eq("booking_id", booking_id);

        if (updateError) {
          console.error("Failed to update booking with refund ID:", updateError);
        }

        const customerMessage = `❌ Booking Cancelled\n\nYour booking has been cancelled by the property owner.\n\nBooking ID: ${booking_id}\nRefund Amount: ₹${booking.advance_amount}\n\nYour refund has been initiated and will be credited to your payment account within 5-7 business days.`;

        await whatsapp.sendTextMessage(booking.guest_phone, customerMessage);

        const adminMessage = `❌ Booking Cancelled - Refund Initiated\n\nBooking ID: ${booking_id}\nProperty: ${booking.property_name}\nGuest: ${booking.guest_name} (${booking.guest_phone})\nRefund Amount: ₹${booking.advance_amount}\nRefund ID: ${refundResult.refundId}\n\nStatus: Refund initiated successfully`;

        await whatsapp.sendTextMessage(booking.admin_phone, adminMessage);

        console.log("Refund initiated for booking:", booking_id);

        return new Response(
          JSON.stringify({
            success: true,
            booking_id,
            status: "REFUND_INITIATED",
            refund_id: refundResult.refundId,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } else {
        await supabase
          .from("bookings")
          .update({ booking_status: "REFUND_FAILED" })
          .eq("booking_id", booking_id);

        const adminMessage = `⚠️ Refund Failed\n\nBooking ID: ${booking_id}\nProperty: ${booking.property_name}\nGuest: ${booking.guest_name} (${booking.guest_phone})\nAmount: ₹${booking.advance_amount}\n\nError: ${refundResult.error}\n\nManual refund required!`;

        await whatsapp.sendTextMessage(booking.admin_phone, adminMessage);

        return new Response(
          JSON.stringify({
            success: false,
            error: "Refund failed",
            details: refundResult.error,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    } else {
      await supabase
        .from("bookings")
        .update({ booking_status: "CANCELLED_NO_REFUND" })
        .eq("booking_id", booking_id);

      const customerMessage = `❌ Booking Cancelled\n\nYour booking has been cancelled.\n\nBooking ID: ${booking_id}\n\nNo payment was processed, so no refund is needed.`;

      await whatsapp.sendTextMessage(booking.guest_phone, customerMessage);

      const adminMessage = `❌ Booking Cancelled - No Refund Required\n\nBooking ID: ${booking_id}\nProperty: ${booking.property_name}\nGuest: ${booking.guest_name}\n\nPayment Status: ${booking.payment_status}\nNo refund required.`;

      await whatsapp.sendTextMessage(booking.admin_phone, adminMessage);

      return new Response(
        JSON.stringify({
          success: true,
          booking_id,
          status: "CANCELLED_NO_REFUND",
          message: "No refund required - payment was not successful",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error processing cancelled booking:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
