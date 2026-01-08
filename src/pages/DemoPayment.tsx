import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DemoPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"options" | "processing" | "success">("options");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
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
    // Play mock sound if available (optional)
    // const audio = new Audio('/success-sound.mp3'); 
    
    setTimeout(() => {
      setStep("success");
      toast({
        title: "Payment Successful",
        description: "Your booking has been confirmed.",
      });
    }, 3000);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md text-center border-none shadow-2xl animate-in zoom-in duration-500">
          <CardContent className="pt-10 pb-10">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="w-16 h-16 text-green-600 animate-bounce" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-8">
              Thank you for your booking at {bookingData?.propertyTitle || "LoonCamp"}.
              Your e-ticket has been generated and sent.
            </p>
            <div className="bg-secondary/30 rounded-xl p-4 mb-8 text-left">
              <p className="text-sm font-semibold mb-1">E-Ticket Summary</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>Booking ID: #LC-{Math.floor(Math.random() * 90000) + 10000}</p>
                <p>Guest: {bookingData?.name}</p>
                <p>Check-in: {bookingData?.checkIn}</p>
                <p>Total Paid: ₹{amount}</p>
              </div>
            </div>
            <Button onClick={() => navigate("/")} className="w-full rounded-xl py-6 text-lg">
              Return to Home
            </Button>
          </CardContent>
        </Card>
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
