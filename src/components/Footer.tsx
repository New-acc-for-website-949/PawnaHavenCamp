import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer id="contact" className="bg-secondary/50 border-t border-border/30">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-110 shadow-lg"
                style={{
                  background: 'linear-gradient(145deg, #1a1a1a, #0d0d0d)',
                  border: '2px solid rgba(212, 175, 55, 0.8)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.1)',
                }}
              >
                <img 
                  src="/assets/logo.png" 
                  alt="Pawna Haven Camp" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="font-display text-2xl font-bold text-foreground">PawnaHavenCamp</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Curating extraordinary stays for discerning travelers. Experience luxury in nature's embrace.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">Quick Links</h4>
            <nav className="flex flex-col gap-3">
              <button
                onClick={() => scrollToSection("#properties")}
                className="text-muted-foreground hover:text-primary text-left text-sm transition-colors"
              >
                Properties
              </button>
              <button
                onClick={() => scrollToSection("#destinations")}
                className="text-muted-foreground hover:text-primary text-left text-sm transition-colors"
              >
                Destinations
              </button>
              <Link
                to="/about"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/info/services"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Our Services
              </Link>
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-primary text-sm transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-muted-foreground text-sm">
                  Pawna Lake, Lonavala,<br />Maharashtra, India
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+918806092609" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  +91 88060 92609
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:hrushikeshmore2609@gmail.com" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  hrushikeshmore2609@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">Newsletter</h4>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe for exclusive offers and travel inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 rounded-lg bg-card border border-border/50 text-foreground text-sm focus:outline-none focus:border-primary transition-colors min-w-0"
              />
              <Button className="bg-gradient-to-r from-primary to-gold-light text-primary-foreground hover:opacity-90 px-4 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/30">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 PawnaHavenCamp. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/privacy-policy" className="text-muted-foreground text-sm hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-muted-foreground text-sm hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
            <Link to="/refund-policy" className="text-muted-foreground text-sm hover:text-primary transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
