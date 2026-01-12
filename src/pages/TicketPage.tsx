import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Clock, User, Phone, CheckCircle2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const TicketPage = () => {
  const { ticketId } = useParams();

  const { data: ticket, isLoading, error } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async () => {
      const response = await axios.get(`/api/etickets/${ticketId}`);
      return response.data;
    },
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading your ticket...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">Error loading ticket</div>;
  if (!ticket) return <div className="flex justify-center items-center h-screen">Ticket not found</div>;

  const isExpired = new Date() > new Date(ticket.check_out_date);

  if (isExpired) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <h1 className="text-4xl font-bold text-red-600">Ticket Expired</h1>
        <p className="text-gray-500 text-lg">This ticket is no longer valid as the checkout date has passed.</p>
      </div>
    );
  }

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
              <p className="font-mono font-medium">{ticket.ticket_id}</p>
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
                <p className="font-semibold">{new Date(ticket.check_in_date).toLocaleDateString()}</p>
                <p className="text-sm flex items-center gap-1 text-muted-foreground">
                   <Clock className="w-3 h-3" /> 2:00 PM
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs text-muted-foreground uppercase font-semibold flex items-center justify-end gap-1">
                  <Calendar className="w-3 h-3" /> Check-out
                </p>
                <p className="font-semibold">{new Date(ticket.check_out_date).toLocaleDateString()}</p>
                <p className="text-sm flex items-center justify-end gap-1 text-muted-foreground">
                   <Clock className="w-3 h-3" /> 11:00 AM
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">Total Paid</p>
              <p className="text-lg font-bold text-green-600">{ticket.paid_amount}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase font-semibold">Due Amount</p>
              <p className="text-3xl font-black text-red-600 tracking-tighter">{ticket.due_amount}</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
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
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold">Host Details</p>
                <p className="font-medium text-sm">PawnaHavenCamp.com</p>
                <p className="text-sm text-muted-foreground">+91 8806092609</p>
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
