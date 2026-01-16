import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  ChevronLeft, 
  Smartphone, 
  Fingerprint,
  ShieldCheck,
  ArrowRight,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GenerateCodePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    referralCode: "",
    mobile: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (!formData.referralCode || !formData.mobile || !formData.username) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
      setLoading(false);
      alert("Verification successful!");
      navigate("/referral");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black">
      <Helmet>
        <title>Generate Referral Code - PawnaHavenCamp</title>
      </Helmet>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-black border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/referral" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-all">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-display text-xl font-bold">Generate Code</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-12 max-w-md">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6">
            <Fingerprint className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-3">Create New Referral code</h2>
          <p className="text-muted-foreground">Enter your details to generate a new unique referral code</p>
        </div>

        <Card className="p-8 bg-card border-border/50 rounded-[2rem] shadow-2xl space-y-6">
          <div className="space-y-2">
            <Label htmlFor="referralCode" className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Enter Referral code
            </Label>
            <Input
              id="referralCode"
              placeholder="Create your referral code"
              className="h-14 bg-secondary/50 rounded-2xl border-border/50 focus:border-primary transition-all text-lg"
              value={formData.referralCode}
              onChange={(e) => setFormData({ ...formData, referralCode: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-sm font-bold flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              Enter Mobile Number
            </Label>
            <Input
              id="mobile"
              type="tel"
              inputMode="tel"
              placeholder="Enter mobile number"
              className="h-14 bg-secondary/50 rounded-2xl border-border/50 focus:border-primary transition-all text-lg"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Create Your User Name
            </Label>
            <Input
              id="username"
              placeholder="Enter username"
              className="h-14 bg-secondary/50 rounded-2xl border-border/50 focus:border-primary transition-all text-lg"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <Button 
            className="w-full h-16 rounded-2xl text-xl font-bold gap-3 shadow-gold group transition-all"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                Verify & Generate
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </Card>

        <p className="mt-8 text-center text-xs text-muted-foreground px-6 leading-relaxed">
          By continuing, you agree to our referral program terms and conditions. 
          Standard verification process applies.
        </p>
      </div>
    </div>
  );
};

export default GenerateCodePage;
