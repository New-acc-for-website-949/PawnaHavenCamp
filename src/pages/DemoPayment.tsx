import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ETicket } from "@/components/ETicket";
import axios from "axios";

const DemoPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"options" | "processing" | "success">("options");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
  
  const bookingData = location.state?.bookingData;
  const amount = location.state?.amount || "2,000";

  useEffect(() => {
    if (!bookingData) {
      toast({
        title: "No booking data",
        description: "Redirecting back to home...",
        variant: "destructive"
      });
      const timer = setTimeout(() => navigate("/"), 2000);
      return () => clearTimeout(timer);
    }
  }, [bookingData, navigate, toast]);

  const handlePay = () => {
    setStep("processing");
    
    // Generate mock Paytm transaction details
    const orderId = "ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const transactionId = "TXN" + Math.random().toString(10).substring(2, 14);
    const now = new Date();
    
    setTimeout(async () => {
      setPaymentInfo({
        orderId,
        transactionId,
        status: "SUCCESS",
        date: now.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
      });

      // Automated Triple WhatsApp Notification System (Guest, Property Owner, Host)
      const TEST_NUMBER = "918806092609";
      const ticketId = `PHC-${orderId.split('-')[1]}`;
      const dueAmount = bookingData.totalPrice - bookingData.advanceAmount;
      const mapLink = "https://maps.app.goo.gl/PawnaLake";

      try {
        console.log("Booking Data in DemoPayment:", bookingData);
        // Create e-ticket in database
        const ticketResponse = await axios.post("/api/etickets", {
          ticket_id: ticketId,
          property_id: bookingData?.propertyId || 1,
          guest_name: bookingData?.name,
          check_in_date: bookingData?.checkIn,
          check_out_date: bookingData?.checkOut,
          paid_amount: `₹${bookingData?.advanceAmount}`,
          due_amount: `₹${dueAmount}`
        });

        if (ticketResponse.data.success) {
          const ticketUrl = `${window.location.origin}/ticket/${ticketId}`;
          const propertyName = ticketResponse.data.data.property_name;

          const commonHeader = `*🏡 PAWNAHAVENCAMP E-TICKET*\n📍 *Property:* ${propertyName}\n🔖 *Booking ID:* ${ticketId}\n\n`;
          const commonFooter = `\n🔗 *Ticket Link:* ${ticketUrl}\n📍 *Location:* ${mapLink}\nHost: PawnaHavenCamp.com | +${TEST_NUMBER}`;

          const guestMsg = `${commonHeader}👤 *Guest:* ${bookingData.name}\n📅 *Check-in:* ${bookingData.checkIn}\n💰 *Paid:* ₹${bookingData.advanceAmount}\n🔴 *DUE:* ₹${dueAmount}${commonFooter}`;
          
          // Redirect to ticket page immediately
          navigate(`/ticket/${ticketId}`, { replace: true });
          
          // Use a more reliable way to open WhatsApp
          const whatsappUrl = `https://api.whatsapp.com/send?phone=${TEST_NUMBER}&text=${encodeURIComponent(guestMsg)}`;
          
          // Try to open automatically
          window.open(whatsappUrl, "_blank");
        }
      } catch (err) {
        console.error("Failed to generate ticket:", err);
        toast({
          title: "Ticket Generation Failed",
          description: "Payment successful but failed to generate ticket link.",
          variant: "destructive"
        });
      }

      setStep("success");
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed.",
      });
    }, 3000);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-secondary/30 py-12 px-4">
        <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-display font-bold">Booking Confirmed!</h1>
            <p className="text-muted-foreground">Your e-ticket has been generated below.</p>
          </div>
          
          <ETicket 
            bookingData={bookingData} 
            paymentInfo={paymentInfo}
          />
          
          {whatsappLink && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-sm text-green-800 mb-3 font-medium text-pretty">
                WhatsApp notification not sent? Click below to receive your ticket on WhatsApp.
              </p>
              <Button 
                onClick={() => window.open(whatsappLink, "_blank")}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl"
              >
                Send Ticket to WhatsApp
              </Button>
            </div>
          )}
          
          <div className="text-center">
            <Button variant="link" onClick={() => navigate("/")} className="text-muted-foreground">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-xl overflow-hidden rounded-[32px]">
        <div className="bg-primary p-6 text-primary-foreground">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Demo Payment Gateway</h1>
          </div>
          <p className="text-sm opacity-80">Advance amount to pay</p>
          <div className="text-4xl font-black mt-1">₹{amount}</div>
        </div>

        <CardContent className="p-6 bg-background">
          {step === "processing" ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="font-medium text-lg">Processing UPI Payment...</p>
              <p className="text-sm text-muted-foreground text-center px-4">
                Please do not close or refresh this page while we process your request.
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Select UPI App</h3>
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => setSelectedMethod("googlepay")}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 ${
                    selectedMethod === "googlepay" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#EA4335] flex items-center justify-center text-white font-bold text-xl">G</div>
                    <span className="font-bold">Google Pay</span>
                  </div>
                  {selectedMethod === "googlepay" && <div className="w-3 h-3 rounded-full bg-primary" />}
                </button>

                <button
                  onClick={() => setSelectedMethod("phonepe")}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 ${
                    selectedMethod === "phonepe" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#5f259f] flex items-center justify-center text-white font-bold text-xl">P</div>
                    <span className="font-bold">PhonePe</span>
                  </div>
                  {selectedMethod === "phonepe" && <div className="w-3 h-3 rounded-full bg-primary" />}
                </button>
              </div>

              <Button 
                onClick={handlePay} 
                disabled={!selectedMethod}
                className="w-full rounded-2xl py-8 text-xl font-bold shadow-lg shadow-primary/20"
              >
                Pay ₹{amount}
              </Button>
              
              <p className="mt-4 text-[10px] text-center text-muted-foreground uppercase tracking-widest">
                Safe & Secure Demo Payment
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DemoPayment;
