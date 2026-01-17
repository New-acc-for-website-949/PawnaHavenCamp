import React from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, Clock, User, Phone, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const TicketPage = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("booking_id");

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ["ticket", bookingId],
    queryFn: async () => {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/eticket-get?booking_id=${bookingId}`,
        {
          headers: {
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch ticket');
      }

      return response.json();
    },
    enabled: !!bookingId,
  });

  if (!bookingId) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <h1 className="text-4xl font-bold text-red-600">Invalid Request</h1>
        <p className="text-gray-500 text-lg">No booking ID provided</p>
      </div>
    );
  }

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading your ticket...</div>;

  if (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error loading ticket';

    if (errorMessage.includes('expired')) {
      return (
        <div className="flex flex-col justify-center items-center h-screen space-y-4">
          <h1 className="text-4xl font-bold text-red-600">Booking Expired</h1>
          <p className="text-gray-500 text-lg">This booking has expired as the checkout date has passed.</p>
        </div>
      );
    }

    if (errorMessage.includes('not available')) {
      return (
        <div className="flex flex-col justify-center items-center h-screen space-y-4">
          <h1 className="text-4xl font-bold text-orange-600">Ticket Not Ready</h1>
          <p className="text-gray-500 text-lg">Your e-ticket is not yet available. Please wait for owner confirmation.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <h1 className="text-4xl font-bold text-red-600">Error</h1>
        <p className="text-gray-500 text-lg">{errorMessage}</p>
      </div>
    );
  }

  if (!ticket) return <div className="flex justify-center items-center h-screen">Ticket not found</div>;

  const isExpired = new Date() > new Date(ticket.checkout_datetime);

  if (isExpired) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <h1 className="text-4xl font-bold text-red-600">Ticket Expired</h1>
        <p className="text-gray-500 text-lg">This ticket is no longer valid as the checkout date has passed.</p>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  };

  const checkin = formatDateTime(ticket.checkin_datetime);
  const checkout = formatDateTime(ticket.checkout_datetime);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <Card className="w-full max-w-md shadow-2xl border-t-8 border-t-primary overflow-hidden">
        <div className="bg-primary/5 p-6 text-center border-b">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary mb-1">
            {ticket.property_name}
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Confirmed Booking
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Booking ID</p>
              <p className="font-mono font-medium text-xs">{ticket.booking_id}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Guest Name</p>
              <p className="font-medium flex items-center justify-end gap-1">
                <User className="w-3 h-3" /> {ticket.guest_name}
              </p>
            </div>
          </div>

          <div className="space-y-4 py-4 border-y border-dashed">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase font-semibold flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Check-in
                </p>
                <p className="font-semibold">{checkin.date}</p>
                <p className="text-sm flex items-center gap-1 text-muted-foreground">
                   <Clock className="w-3 h-3" /> {checkin.time}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs text-muted-foreground uppercase font-semibold flex items-center justify-end gap-1">
                  <Calendar className="w-3 h-3" /> Check-out
                </p>
                <p className="font-semibold">{checkout.date}</p>
                <p className="text-sm flex items-center justify-end gap-1 text-muted-foreground">
                   <Clock className="w-3 h-3" /> {checkout.time}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Advance Paid</p>
              <p className="text-lg font-bold text-green-600">₹{ticket.advance_amount}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Due Amount</p>
              <p className="text-3xl font-black text-red-600 tracking-tighter">₹{ticket.due_amount}</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {ticket.map_link && (
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Location</p>
                  <a
                    href={ticket.map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium text-sm"
                  >
                    View on Google Maps
                  </a>
                  {ticket.property_address && (
                    <p className="text-sm text-muted-foreground mt-1">{ticket.property_address}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Host Details</p>
                <p className="font-medium text-sm">{ticket.owner_name || 'Property Owner'}</p>
                <p className="text-sm text-muted-foreground">{ticket.owner_phone}</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col items-center border-t border-dashed gap-4">
             <QRCodeSVG value={window.location.href} size={128} level="H" />
             <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Scan to verify ticket</p>
          </div>
        </CardContent>
      </Card>

      <p className="mt-8 text-xs text-muted-foreground text-center max-w-xs">
        Please present this e-ticket at the time of check-in. This is a read-only document and cannot be modified.
      </p>
    </div>
  );
};

export default TicketPage;
