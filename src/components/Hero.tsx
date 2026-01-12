import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Star, Play } from "lucide-react";
import heroImage from "@/assets/hero-resort.jpg";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Hero = () => {
  const navigate = useNavigate();
  const scrollToProperties = () => {
    document.querySelector("#properties")?.scrollIntoView({ behavior: "smooth" });
  };

  const { data: properties } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const response = await axios.get(`${window.location.origin.replace('5000', '5001')}/api/properties`);
      return response.data;
    }
  });

  const propertyCount = properties?.length || 0;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury camping experience"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 pt-32 sm:pt-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-8 opacity-0 animate-fade-up">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary">Premium Luxury Stays</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] mb-8 opacity-0 animate-fade-up delay-100">
            <span className="text-foreground">Experience</span>
            <br />
            <span className="text-gradient-gold italic">Extraordinary</span>
            <br />
            <span className="text-foreground">Getaways</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 opacity-0 animate-fade-up delay-200 font-light leading-relaxed">
            Discover handpicked luxury glamping domes, hillside villas, and lakeside cottages 
            near Pawna Lake and Lonavala. Your perfect escape awaits.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-16 opacity-0 animate-fade-up delay-300">
            <Button
              onClick={scrollToProperties}
              size="lg"
              className="bg-gradient-to-r from-primary to-gold-light text-primary-foreground hover:opacity-90 font-semibold px-8 h-14 text-lg shadow-gold gap-2 group"
            >
              Explore Properties
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-foreground/20 text-foreground hover:bg-foreground/5 font-medium px-8 h-14 text-lg gap-2"
              onClick={() => navigate('/videos')}
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Play className="w-4 h-4 text-primary fill-primary" />
              </div>
              Watch Video
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 md:gap-12 opacity-0 animate-fade-up delay-400">
            <div className="flex flex-col">
              <span className="font-display text-4xl md:text-5xl font-bold text-gradient-gold">{propertyCount || '50'}+</span>
              <span className="text-sm text-muted-foreground mt-1">Luxury Properties</span>
            </div>
            <div className="w-px bg-border/50 hidden md:block" />
            <div className="flex flex-col">
              <span className="font-display text-4xl md:text-5xl font-bold text-gradient-gold">4.9</span>
              <span className="text-sm text-muted-foreground mt-1">Guest Rating</span>
            </div>
            <div className="w-px bg-border/50 hidden md:block" />
            <div className="flex flex-col">
              <span className="font-display text-4xl md:text-5xl font-bold text-gradient-gold">10K+</span>
              <span className="text-sm text-muted-foreground mt-1">Happy Guests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Location Tag - Bottom Right */}
      <div className="absolute bottom-8 right-8 hidden lg:flex items-center gap-3 px-5 py-3 rounded-full glass border border-border/30">
        <MapPin className="w-5 h-5 text-primary" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Featured Location</span>
          <span className="text-sm font-medium text-foreground">Pawna Lake, Maharashtra</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
