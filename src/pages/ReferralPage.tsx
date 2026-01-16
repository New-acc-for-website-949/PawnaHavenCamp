import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  Trophy, 
  Users, 
  QrCode, 
  ChevronLeft, 
  TrendingUp, 
  Award,
  CircleCheck,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ReferralPage = () => {
  const [viewMode, setViewMode] = useState<"options" | "leaderboard">("options");

  const referralData = [
    { name: "Rahul Sharma", amount: "₹12,450", referrals: 24, rank: 1 },
    { name: "Priya Patel", amount: "₹9,800", referrals: 18, rank: 2 },
    { name: "Amit Kumar", amount: "₹7,200", referrals: 14, rank: 3 },
    { name: "Sneha Reddy", amount: "₹5,100", referrals: 11, rank: 4 },
    { name: "Vikram Singh", amount: "₹3,900", referrals: 9, rank: 5 },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      <Helmet>
        <title>Referral Earnings - PawnaHavenCamp</title>
      </Helmet>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-black border-b border-border/50">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/" className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground/70 hover:bg-primary hover:text-primary-foreground transition-all">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="font-display text-xl font-bold">Referral Earning</h1>
        </div>
        
        {/* Fixed Row Options */}
        <div className="px-6 pb-4 bg-black border-b border-border/30">
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-3 bg-card border-border/50 hover:border-primary/50 transition-all cursor-pointer group rounded-2xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <CircleCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs truncate">Already code?</h3>
                <p className="text-[10px] text-muted-foreground truncate">Check earning</p>
              </div>
            </Card>

            <Card className="p-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer group rounded-2xl shadow-gold flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-white truncate">New Code</h3>
                <p className="text-[10px] text-primary-foreground/80 truncate">Generate</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pt-6 space-y-8">
        {/* Leaderboard Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" />
              <h2 className="font-display text-2xl font-bold">Top Earners</h2>
            </div>
            <Tabs defaultValue="all-time" className="w-[200px]">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/50 rounded-xl">
                <TabsTrigger value="month" className="text-[10px] uppercase font-bold rounded-lg">Month</TabsTrigger>
                <TabsTrigger value="all-time" className="text-[10px] uppercase font-bold rounded-lg">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-3">
            {referralData.map((user) => (
              <Card key={user.rank} className="p-4 bg-card border-border/30 rounded-2xl flex items-center justify-between hover:bg-secondary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    user.rank === 1 ? "bg-yellow-500/20 text-yellow-600 shadow-sm" : 
                    user.rank === 2 ? "bg-slate-400/20 text-slate-500" :
                    user.rank === 3 ? "bg-orange-400/20 text-orange-600" : "bg-secondary text-muted-foreground"
                  }`}>
                    #{user.rank}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.referrals} Successfull Referrals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-bold text-lg">{user.amount}</p>
                  <Badge variant="outline" className="text-[8px] uppercase tracking-widest h-5">Earned</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Reward Card */}
        <Card className="p-8 bg-gradient-to-br from-primary to-gold-dark text-primary-foreground rounded-[2.5rem] relative overflow-hidden shadow-gold">
           <div className="relative z-10">
             <h3 className="text-2xl font-display font-bold mb-2">Invite & Earn</h3>
             <p className="text-primary-foreground/80 mb-6 max-w-[200px]">Get ₹500 for every booking made using your referral code.</p>
             <Button className="bg-white text-primary hover:bg-white/90 rounded-2xl font-bold">Start Inviting</Button>
           </div>
           <Users className="absolute -right-8 -bottom-8 w-40 h-40 text-white/10" />
        </Card>
      </div>
    </div>
  );
};

export default ReferralPage;
