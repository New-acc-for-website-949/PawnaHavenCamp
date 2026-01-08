import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageSliderProps {
  images: string[];
  title: string;
}

const ImageSlider = ({ images, title }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className="relative w-full h-96 md:h-[500px] lg:h-[600px] bg-secondary rounded-2xl overflow-hidden group"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Main Image */}
      <div className="relative w-full h-full overflow-hidden">
        {images.map((img, index) => (
          <img
            key={index}
            src={getOptimizedImageUrl(img, 1200)}
            alt={`${title} - Image ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out transform ${
              index === currentIndex 
                ? "opacity-100 translate-x-0 scale-100" 
                : index < currentIndex
                  ? "opacity-0 -translate-x-full scale-110"
                  : "opacity-0 translate-x-full scale-110"
            }`}
            data-testid={`img-slider-${index}`}
            loading="lazy"
          />
        ))}

        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />
      </div>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl z-20 flex items-center justify-center"
          onClick={goToPrevious}
          data-testid="button-slider-prev"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl z-20 flex items-center justify-center"
          onClick={goToNext}
          data-testid="button-slider-next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium" data-testid="text-image-counter">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-4 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to image ${index + 1}`}
              data-testid={`button-thumbnail-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
