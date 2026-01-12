import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
          ? "bg-background/80 backdrop-blur-lg border-b border-border/30 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center shadow-gold">
                <span className="text-primary-foreground font-display text-xl font-bold">P</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold tracking-wide text-foreground">
                PawnaHavenCamp
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground -mt-1">
                Luxury Escapes
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
