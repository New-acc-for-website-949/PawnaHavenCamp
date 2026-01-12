import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Calendar, 
  User, 
  Hash, 
  CreditCard,
  Download,
  Share2,
  ExternalLink
} from "lucide-react";

interface ETicketProps {
  bookingData: {
    propertyTitle: string;
    name: string;
    mobile: string;
    persons: number;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    advanceAmount: number;
  };
  paymentInfo: {
    orderId: string;
    transactionId: string;
    status: string;
    date: string;
  };
}

export function ETicket({ bookingData, paymentInfo }: ETicketProps) {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleShare = () => {
    const text = `*🏡 PAWNAHAVENCAMP E-TICKET*\n\n` +
      `📍 *Property:* ${bookingData.propertyTitle}\n` +
      `🔖 *Booking ID:* PHC-${paymentInfo.orderId.split('-')[1]}\n\n` +
      `👤 *Guest:* ${bookingData.name}\n` +
      `📅 *Check-in:* ${bookingData.checkIn} (11:00 AM)\n` +
      `📅 *Check-out:* ${bookingData.checkOut} (10:00 AM)\n\n` +
      `💰 *Total:* ₹${bookingData.totalPrice}\n` +
      `✅ *Paid Advance:* ₹${bookingData.advanceAmount}\n` +
      `🔴 *DUE AMOUNT: ₹${bookingData.totalPrice - bookingData.advanceAmount}*\n\n` +
      `🔗 *Location:* https://maps.app.goo.gl/PawnaLake\n\n` +
      `*Paytm Transaction Details:*\n` +
      `• Order ID: ${paymentInfo.orderId}\n` +
      `• Status: ${paymentInfo.status}\n\n` +
      `Host: PawnaHavenCamp.com | +918806092609`;

    window.open(`https://api.whatsapp.com/send?phone=918806092609&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto p-4">
      <div id="e-ticket" ref={ticketRef} className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-border/40 relative">
        {/* Top Header */}
        <div className="bg-primary p-8 text-primary-foreground text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle2 className="w-32 h-32 -mr-16 -mt-16" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-1 tracking-tight">{bookingData.propertyTitle}</h1>
          <p className="text-sm opacity-80 uppercase tracking-[0.3em] font-medium">PawnaHavenCamp Luxury Stays</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold border border-white/20">
            <Hash className="w-3 h-3" />
            Booking ID: PHC-{paymentInfo.orderId.split('-')[1]}
          </div>
        </div>

        <CardContent className="p-8 space-y-8">
          {/* Guest Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center gap-1.5">
                <User className="w-3 h-3" /> Guest Name
              </span>
              <p className="font-bold text-lg">{bookingData.name}</p>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold flex items-center justify-end gap-1.5">
                <Phone className="w-3 h-3" /> Guest Contact
              </span>
              <p className="font-bold text-lg">{bookingData.mobile}</p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Dates Section */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-black">Check-In</span>
              </div>
              <p className="font-bold text-base leading-tight">{bookingData.checkIn}</p>
              <p className="text-xs text-muted-foreground font-medium">11:00 AM onwards</p>
            </div>
            <div className="space-y-2 text-right">
              <div className="flex items-center gap-2 text-primary justify-end">
                <span className="text-[10px] uppercase tracking-widest font-black">Check-Out</span>
                <Calendar className="w-4 h-4" />
              </div>
              <p className="font-bold text-base leading-tight">{bookingData.checkOut}</p>
              <p className="text-xs text-muted-foreground font-medium">By 10:00 AM</p>
            </div>
          </div>

          {/* Financials */}
          <div className="bg-secondary/30 rounded-3xl p-6 border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Advance Paid</span>
                <div className="flex items-center gap-1 text-green-600 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>₹{bookingData.advanceAmount}</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-primary font-black">Due Amount</span>
                <p className="text-3xl font-black text-primary leading-none">₹{bookingData.totalPrice - bookingData.advanceAmount}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40 space-y-2">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                <span>Host</span>
                <span>Support</span>
              </div>
              <div className="flex items-center justify-between font-bold text-sm">
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3 text-primary" /> PawnaHavenCamp.com
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-primary" /> 8806092609
                </span>
              </div>
            </div>
          </div>

          {/* Paytm Details */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[#002970]/5 rounded-xl border border-[#002970]/10">
              <div className="w-12 h-4 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo.split.png")' }} />
              <span className="text-[10px] font-black uppercase text-[#002970] tracking-tighter">All-in-One Gateway</span>
            </div>
            
            <div className="grid grid-cols-2 gap-y-4 text-[10px]">
              <div>
                <span className="block text-muted-foreground uppercase font-bold tracking-widest mb-1">Paytm Order ID</span>
                <span className="font-mono font-bold text-foreground">{paymentInfo.orderId}</span>
              </div>
              <div className="text-right">
                <span className="block text-muted-foreground uppercase font-bold tracking-widest mb-1">Transaction ID</span>
                <span className="font-mono font-bold text-foreground">{paymentInfo.transactionId}</span>
              </div>
              <div>
                <span className="block text-muted-foreground uppercase font-bold tracking-widest mb-1">Status</span>
                <span className="inline-flex items-center gap-1 font-black text-green-600">
                  <CheckCircle2 className="w-2.5 h-2.5" /> {paymentInfo.status}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-muted-foreground uppercase font-bold tracking-widest mb-1">Payment Date</span>
                <span className="font-bold text-foreground">{paymentInfo.date}</span>
              </div>
            </div>
          </div>

          {/* Map Link */}
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-2xl border-dashed border-primary/30 text-primary font-bold gap-2 hover:bg-primary/5"
            onClick={() => window.open('https://maps.app.goo.gl/PawnaLake', '_blank')}
          >
            <MapPin className="w-4 h-4" />
            Get Map Location
          </Button>
        </CardContent>

        {/* Bottom Decorative Edge */}
        <div className="h-4 bg-primary flex gap-2 overflow-hidden px-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-white -mb-2 flex-shrink-0" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={handleShare}
          className="rounded-2xl py-6 font-bold flex items-center gap-2 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
        >
          <Share2 className="w-5 h-5" />
          Share on WhatsApp
        </Button>
        <Button 
          onClick={() => window.print()}
          variant="outline"
          className="rounded-2xl py-6 font-bold flex items-center gap-2 border-primary/20 text-primary"
        >
          <Download className="w-5 h-5" />
          Save Ticket
        </Button>
      </div>
    </div>
  );
}
