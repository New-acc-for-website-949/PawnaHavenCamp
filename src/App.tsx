import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import PropertyDetails from "./pages/PropertyDetails";
import VideoGallery from "./pages/VideoGallery";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import DemoPayment from "./pages/DemoPayment";
import TicketPage from "./pages/TicketPage";
import NotFound from "./pages/NotFound";
import ScrollRestoration from "./components/ScrollRestoration";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollRestoration />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/property/:propertyId" element={<PropertyDetails />} />
            <Route path="/videos" element={<VideoGallery />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/payment/demo" element={<DemoPayment />} />
            <Route path="/ticket/:ticketId" element={<TicketPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
