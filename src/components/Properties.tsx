import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { propertyAPI } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const categoryLabels: Record<string, string> = {
  all: "All Stays",
  camping: "Camping",
  villa: "Villa",
  cottage: "Cottage",
};

const priceFilterLabels: Record<string, string> = {
  all: "All Price Range",
  affordable: "Affordable",
  premium: "Premium",
  luxury: "Luxury",
};

const Properties = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceFilter, setSelectedPriceFilter] = useState("all");
  const [isSticky, setIsSticky] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const stickyPoint = document.getElementById("sticky-marker");
      if (stickyPoint) {
        const rect = stickyPoint.getBoundingClientRect();
        setIsSticky(rect.top <= 80); // Adjusted for sticky top
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await propertyAPI.getPublicList();
        if (response.success) {
          setProperties(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((p) => {
    const categoryMatch = selectedCategory === "all" || p.category === selectedCategory;
    const priceMatch = selectedPriceFilter === "all" || p.propertyCategory === selectedPriceFilter;
    return categoryMatch && priceMatch;
  });

  const categories = ["all", "camping", "cottage", "villa"];
  const priceFilters = ["all", "affordable", "premium", "luxury"];

  return (
    <section id="properties" className="py-12 md:py-20">
      <div className="container mx-auto px-2">
        {/* Simplified Section Header with Original Toggle Style */}
        <div className="flex flex-col items-center mb-12">
          <div className="mb-8 text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-2 block">
              Discover
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Explore Our <span className="text-gradient-gold italic">Collections</span>
            </h2>
          </div>
        </div>

        <div id="sticky-marker" className="h-1 w-full" />
        
        <div className="sticky top-[80px] z-40 w-full mb-8 pointer-events-none">
          {/* Subtle separator line for mobile */}
          <div className="h-[0.5px] w-full bg-border/10 mb-0.5 block md:hidden" />
          
          <div className="flex flex-col items-center w-full px-2 gap-1">
            <div className="flex w-full p-1 bg-secondary/90 rounded-2xl backdrop-blur-md border border-border/30 shadow-xl pointer-events-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  id={`category-${category}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(category);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-[10px] xs:text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {categoryLabels[category]}
                </button>
              ))}
            </div>

            {/* Price Filter - Redesigned as horizontal buttons */}
            <div className={`w-full transition-all duration-300 pointer-events-auto mt-0 ${isSticky ? "opacity-100 translate-y-0 h-auto" : "opacity-0 -translate-y-2 h-0 overflow-hidden md:opacity-100 md:translate-y-0 md:h-auto"}`}>
              <div className="flex w-full p-0.5 bg-background/40 backdrop-blur-md rounded-xl border border-border/20 gap-0.5 shadow-inner">
                {priceFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedPriceFilter(filter)}
                    className={`flex-1 py-1 rounded-lg text-[9px] xs:text-[10px] font-bold transition-all duration-300 uppercase tracking-wider ${
                      selectedPriceFilter === filter
                        ? "bg-gold text-white shadow-sm scale-[1.01]"
                        : "text-muted-foreground/70 hover:text-primary hover:bg-secondary/50"
                    }`}
                  >
                    {priceFilterLabels[filter].replace("All Price Range", "All")}
                  </button>
                ))}
              </div>
              
              {/* Association Indicator */}
              <div className="flex justify-center mt-0">
                <div className="w-1 h-1 rounded-full bg-primary/20 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid - Responsive columns */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {filteredProperties.map((property, index) => (
              <div
                key={property.id}
                className="opacity-0 animate-fade-up"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: "forwards" }}
              >
                <PropertyCard
                  id={property.id}
                  slug={property.slug}
                  image={property.image}
                  images={property.images}
                  title={property.title}
                  location={property.location}
                  price={property.price}
                  priceNote={property.priceNote}
                  rating={property.rating}
                  amenities={property.amenities || []}
                  category={property.category}
                  isTopSelling={property.is_top_selling}
                  isAvailable={property.isAvailable}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No properties found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Properties;
