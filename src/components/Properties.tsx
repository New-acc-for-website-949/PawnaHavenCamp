import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { propertyAPI } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const categoryLabels: Record<string, string> = {
  all: "All",
  camping: "Camping",
  villa: "Villa",
  cottage: "Cottage",
};

const Properties = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await propertyAPI.getPublicList();
        if (response.success) {
          const mappedProperties = response.data.map((p: any) => ({
            ...p,
            priceNote: p.price_note,
            isAvailable: p.is_available,
            image: p.images && p.images.length > 0 ? p.images[0].image_url : "",
            images: p.images ? p.images.map((img: any) => img.image_url) : []
          }));
          setProperties(mappedProperties);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = selectedCategory === "all"
    ? properties
    : properties.filter((p) => p.category === selectedCategory);

  const categories = ["all", "camping", "cottage", "villa"];

  return (
    <section id="properties" className="py-12 md:py-20">
      <div className="container mx-auto px-4">
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

          {/* Category Tabs - Restored to original simpler style */}
          <div className="sticky top-[80px] z-40 inline-flex p-1 bg-secondary/80 rounded-2xl backdrop-blur-md border border-border/30 shadow-xl">
            {categories.map((category) => (
              <button
                key={category}
                id={`category-${category}`}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {categoryLabels[category]}
              </button>
            ))}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
