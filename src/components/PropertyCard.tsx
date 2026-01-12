import { useNavigate } from "react-router-dom";
import { Star, MapPin, Share2, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { useState, useRef } from "react";

interface PropertyCardProps {
  id?: string;
  slug?: string;
  image: string;
  images?: string[];
  title: string;
  location?: string;
  price: string;
  priceNote?: string;
  rating?: number;
  amenities: string[];
  category?: string;
  isTopSelling?: boolean;
  isAvailable?: boolean;
}

const PropertyCard = ({
  id = "1",
  slug,
  image,
  images = [],
  title,
  location = "Pawna Lake",
  price,
  priceNote = "person",
  rating = 4.9,
  amenities,
  category,
  isTopSelling,
  isAvailable = true,
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  
  const displayImages = images.length > 0 ? images : [image];
  const navigationId = slug || id;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = currentX - touchStartX.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    
    if (dragOffset < -50) {
      setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    } else if (dragOffset > 50) {
      setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    }
    
    setDragOffset(0);
    touchStartX.current = null;
  };

  const handleNavigate = () => {
    // Save current scroll position before navigating
    sessionStorage.setItem("homeScrollPosition", window.scrollY.toString());
    navigate(`/property/${navigationId}`);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.origin + `/property/${navigationId}`,
      });
    } else {
      navigator.clipboard.writeText(window.location.origin + `/property/${navigationId}`);
    }
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = "+918806092609";
    const message = encodeURIComponent(`Hi, I'm interested in booking ${title}`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  return (
    <div className="group cursor-pointer px-3 mb-6" onClick={handleNavigate}>
      <div className="bg-card rounded-[32px] overflow-hidden border border-border/10 hover:border-primary/30 transition-all duration-300 shadow-sm">
        {/* Image Container */}
        <div 
          ref={containerRef}
          className="relative h-64 overflow-hidden bg-black"
          style={{ touchAction: 'pan-y' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex h-full w-full transition-transform duration-300 ease-out"
            style={{ 
              transform: `translateX(calc(-${currentImageIndex * 100}% + ${dragOffset}px))`,
              transition: touchStartX.current !== null ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            {displayImages.map((img, index) => (
              <div key={index} className="flex-shrink-0 w-full h-full relative">
                <img
                  src={getOptimizedImageUrl(img, 400)}
                  alt={title}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover transition-opacity duration-300 opacity-0"
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.classList.remove('opacity-0');
                    target.classList.add('opacity-100');
                  }}
                />
              </div>
            ))}
          </div>
          
          {/* Availability Badge */}
          <div 
            className={`absolute top-3 left-3 z-20 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter uppercase shadow-lg bg-black border border-white/5 backdrop-blur-sm transform-gpu transition-transform duration-300 ${
              isAvailable 
                ? "text-green-500" 
                : "text-orange-500"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAvailable ? "bg-green-500" : "bg-orange-500"}`} />
              <span>
                {isAvailable ? "Available" : "Booked"}
              </span>
            </div>
          </div>

          {/* Top Rated Badge */}
          {isTopSelling && (
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground border-none text-[10px] px-2 py-1 z-20 shadow-lg">
              <Star className="w-2.5 h-2.5 mr-1 fill-current" />
              TOP RATED
            </Badge>
          )}

          {/* Image Navigation Arrows */}
          {displayImages.length > 1 && (
            <div className="flex justify-between items-center absolute inset-x-0 top-1/2 -translate-y-1/2 px-3 z-30 pointer-events-none">
              <button 
                onClick={prevImage}
                className="pointer-events-auto p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={nextImage}
                className="pointer-events-auto p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Contact Buttons Overlay */}
          <div className="absolute bottom-3 right-3 flex gap-2 z-20">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full w-8 h-8 bg-card/90 hover:bg-card text-foreground"
              onClick={handleShare}
            >
              <Share2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              className="rounded-full w-8 h-8 bg-primary hover:bg-gold-light text-primary-foreground"
              onClick={handleBookNow}
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Content - More compact padding */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-muted-foreground text-[11px] uppercase tracking-wider">
              <MapPin className="w-3 h-3 text-primary" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-bold">{rating}</span>
            </div>
          </div>

          <h3 className="text-base font-semibold text-foreground mb-3 line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Amenities Row */}
          <div className="flex items-center gap-3 mb-4 overflow-x-auto no-scrollbar pb-1">
            {amenities.slice(0, 3).map((amenity, i) => (
              <span key={i} className="text-[10px] text-muted-foreground whitespace-nowrap bg-secondary/30 px-2 py-0.5 rounded-full">
                {amenity}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/20">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gradient-gold">₹{price}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">/ {priceNote}</span>
            </div>
            <Badge variant="outline" className="text-[9px] border-primary/30 text-primary capitalize font-normal">
              {category}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
