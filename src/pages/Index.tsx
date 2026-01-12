import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Destinations from "@/components/Destinations";
import Properties from "@/components/Properties";
import FloatingContact from "@/components/FloatingContact";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const savedPosition = sessionStorage.getItem("homeScrollPosition");
    
    // Set a 0.5s timer for the loader
    const loaderTimer = setTimeout(() => {
      setIsInitialLoading(false);
      
      // Use requestAnimationFrame to ensure the DOM is painted before scrolling
      if (savedPosition) {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: parseInt(savedPosition),
            behavior: "instant"
          });
          sessionStorage.removeItem("homeScrollPosition");
        });
      }
    }, 500);

    return () => clearTimeout(loaderTimer);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground animate-pulse">
            PawnaHavenCamp
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>PawnaHavenCamp - #1 Luxury Pawna Lake Camping & Lonavala Villa Booking</title>
        <meta
          name="description"
          content="PawnaHavenCamp offers the best luxury glamping domes at Pawna Lake and premium villas in Lonavala. Book lakeside camping with pool, AC, and meals. Top-rated stays near Mumbai & Pune."
        />
        <meta
          name="keywords"
          content="Pawna camping, Pawna Lake resorts, Lonavala villa booking, glamping near Mumbai, luxury dome resort, lakeside stay Lonavala"
        />
        <link rel="canonical" href="https://looncamp.com" />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main>
          <Hero />
          <Destinations />
          <Properties />
        </main>
        <Footer />
        <FloatingContact />
      </div>
    </>
  );
};

export default Index;
