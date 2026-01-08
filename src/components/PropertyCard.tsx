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
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  
  const displayImages = images.length > 0 ? images : [image];
  const navigationId = slug || id;

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/property/${navigationId}`;
    const text = `🏡 *${title}*\n📍 ${location}\n💰 *${price}* /${priceNote}\n\nCheck out this property:\n${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://api.whatsapp.com/send?phone=918669505727&text=I'm interested in booking ${encodeURIComponent(title)}`, '_blank');
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    } else if (diff < -50) {
      setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleNavigate = () => {
    navigate(`/property/${navigationId}`);
  };

  return (
    <div className="group cursor-pointer" onClick={handleNavigate}>
      <div className="bg-card rounded-2xl overflow-hidden border border-border/30 hover:border-primary/30 transition-all duration-300">
        {/* Image Container - Reduced Height for more compact look */}
        <div 
          className="relative h-56 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={getOptimizedImageUrl(displayImages[currentImageIndex], 500)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Availability Badge */}
          <Badge 
            className={`absolute top-3 right-3 font-semibold text-[10px] px-2 py-1 rounded-lg border-none z-20 ${
              isAvailable 
                ? "bg-emerald-500/90 text-white" 
                : "bg-red-500/90 text-white"
            }`}
          >
            {isAvailable ? "Available" : "Booked"}
          </Badge>

          {/* Top Rated Badge */}
          {isTopSelling && (
            <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground border-none text-[10px] px-2 py-1 z-20 shadow-lg">
              <Star className="w-2.5 h-2.5 mr-1 fill-current" />
              TOP RATED
            </Badge>
          )}

          {/* Image Navigation Arrows */}
          {displayImages.length > 1 && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm z-10"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm z-10"
              >
                <ChevronRight className="w-3.5 h-3.5" />
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
