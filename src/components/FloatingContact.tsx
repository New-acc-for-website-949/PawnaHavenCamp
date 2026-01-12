import { Phone, MessageCircle } from "lucide-react";

const FloatingContact = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp */}
      <a
        href="https://api.whatsapp.com/send?phone=918806092609&text=Hello! I'm interested in booking a stay."
        target="_blank"
        rel="noopener noreferrer"
        className="group relative"
      >
        <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-card text-foreground text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-border/30">
          Chat on WhatsApp
        </span>
      </a>

      {/* Phone */}
      <a
        href="tel:+918806092609"
        className="group relative"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center shadow-gold hover:shadow-gold-lg transition-all hover:scale-110 animate-pulse-glow">
          <Phone className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-card text-foreground text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border border-border/30">
          Call Us Now
        </span>
      </a>
    </div>
  );
};

export default FloatingContact;
