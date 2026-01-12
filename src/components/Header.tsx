import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoImage from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Properties", href: "#properties" },
    { name: "Destinations", href: "#destinations" },
    { name: "About", href: "#about" },
  ];

  const scrollToSection = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/90 backdrop-blur-lg border-b border-amber-500/20 shadow-lg shadow-amber-500/5"
          : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Premium Logo */}
          <Link to="/" className="flex items-center gap-4 group">
            {/* 3D Circle Logo */}
            <div className="relative">
              <div 
                className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #1a1a1a, #0d0d0d)',
                  boxShadow: `
                    0 0 0 2px rgba(212, 175, 55, 0.8),
                    0 0 0 4px rgba(0, 0, 0, 0.5),
                    0 4px 15px rgba(0, 0, 0, 0.6),
                    0 0 30px rgba(212, 175, 55, 0.15),
                    inset 0 2px 4px rgba(255, 255, 255, 0.1)
                  `,
                }}
              >
                <img 
                  src={logoImage} 
                  alt="Pawna Haven Camp" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/10 to-amber-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
            
            {/* 3D Premium Text */}
            <div className="flex flex-col">
              <span 
                className="font-display text-2xl md:text-3xl font-bold tracking-wider"
                style={{
                  background: 'linear-gradient(180deg, #f4d03f 0%, #d4af37 25%, #b8860b 50%, #d4af37 75%, #f4d03f 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 30px rgba(212, 175, 55, 0.3)',
                  filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.8))',
                }}
              >
                PAWNA
              </span>
              <span 
                className="text-xs md:text-sm uppercase tracking-[0.35em] -mt-1 font-medium"
                style={{
                  background: 'linear-gradient(180deg, #c9b896 0%, #a89068 50%, #c9b896 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 20px rgba(201, 184, 150, 0.2)',
                }}
              >
                Haven Camp
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-sm font-medium text-foreground/70 hover:text-primary elegant-underline transition-colors duration-300"
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:+918806092609">
              <Button
                variant="ghost"
                size="sm"
                className="text-foreground/70 hover:text-primary gap-2"
              >
                <Phone className="w-4 h-4" />
                <span className="font-medium">+91 88060 92609</span>
              </Button>
            </a>
            <Button
              onClick={() => scrollToSection("#properties")}
              className="bg-gradient-to-r from-primary to-gold-light text-primary-foreground hover:opacity-90 font-semibold px-6 shadow-gold"
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-x-0 top-20 glass-dark border-b border-border/30 transition-all duration-500 ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-6 py-8">
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-lg font-medium text-foreground/80 hover:text-primary text-left transition-colors"
              >
                {link.name}
              </button>
            ))}
            <div className="section-divider my-2" />
            <a href="tel:+918806092609" className="flex items-center gap-3 text-foreground/70">
              <Phone className="w-5 h-5 text-primary" />
              <span className="font-medium">+91 88060 92609</span>
            </a>
            <Button
              onClick={() => scrollToSection("#properties")}
              className="bg-gradient-to-r from-primary to-gold-light text-primary-foreground font-semibold w-full mt-2"
            >
              Book Now
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
