import pawnaLake from "@/assets/pawna-lake.jpg";
import lonavala from "@/assets/lonavala.jpg";

const destinations = [
  {
    id: 1,
    name: "Pawna Lake",
    location: "Maharashtra, India",
    image: pawnaLake,
    properties: 25,
    description: "Serene lakeside camping with mountain views",
  },
  {
    id: 2,
    name: "Lonavala",
    location: "Maharashtra, India",
    image: lonavala,
    properties: 30,
    description: "Hillside villas and premium cottages",
  },
];

const Destinations = () => {
  return (
    <section id="destinations" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-4 block">
            Destinations
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Popular
            <span className="text-gradient-gold italic"> Locations</span>
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Explore our curated destinations, each offering unique experiences and breathtaking landscapes.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="group relative overflow-hidden rounded-3xl"
            >
              {/* Image */}
              <div className="relative h-80 lg:h-[450px] overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="transform transition-transform duration-500 group-hover:translate-y-[-10px]">
                    <span className="text-xs uppercase tracking-widest text-primary font-semibold mb-2 block">
                      {destination.location}
                    </span>
                    <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                      {destination.name}
                    </h3>
                    <p className="text-muted-foreground mb-4 max-w-sm">
                      {destination.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-foreground">
                        <span className="text-gradient-gold font-bold">{destination.properties}</span> Properties
                      </span>
                      <button 
                        onClick={() => {
                          const targetCategory = destination.name === "Lonavala" ? "villa" : "camping";
                          const element = document.getElementById(`category-${targetCategory}`);
                          if (element) {
                            element.click();
                            document.getElementById('properties')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="text-sm font-medium text-primary elegant-underline"
                      >
                        Explore →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-6 right-6 w-16 h-16 border border-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
