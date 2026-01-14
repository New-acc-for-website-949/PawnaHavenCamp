import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const policyContent = {
  "terms": {
    title: "Terms & Conditions",
    sections: [
      {
        heading: "1. Introduction",
        content: "Welcome to PawnaHavenCamp. By booking with us, you agree to comply with and be bound by the following terms and conditions."
      },
      {
        heading: "2. Booking and Payments",
        content: "To confirm a booking, an advance payment of 30% of the total booking value is required. The remaining 70% must be paid at the time of check-in at the property."
      },
      {
        heading: "3. Check-in and Check-out",
        content: "Standard Check-in time is 11:00 AM and Check-out time is 10:00 AM. Early check-in or late check-out is subject to availability and may incur additional charges."
      },
      {
        heading: "4. Guest Responsibility",
        content: "Guests are responsible for any damage caused to the property during their stay. We reserve the right to charge for any repairs or replacements required."
      },
      {
        heading: "5. Governing Law",
        content: "These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Pune, Maharashtra."
      }
    ]
  },
  "services": {
    title: "Our Services",
    intro: "PawnaHavenCamp provides premium accommodation and hospitality services near Pawna Lake and Lonavala.",
    grid: [
      {
        heading: "Luxury Accommodations",
        content: "We offer high-end glamping domes, cozy cottages, and private villas designed for comfort and luxury."
      },
      {
        heading: "Dining Services",
        content: "Authentic local meals (Veg and Non-Veg options) are included in most packages, prepared fresh by our local chefs."
      },
      {
        heading: "Event Hosting",
        content: "Our properties are perfect for small gatherings, birthdays, and corporate retreats."
      },
      {
        heading: "Activities",
        content: "Boating, trekking, and campfire arrangements are available to make your stay memorable."
      }
    ]
  },
  "refund-policy": {
    title: "Refund & Cancellation Policy",
    sections: [
      {
        heading: "1. Cancellation by Guest",
        content: "Cancellations made 7 days or more before the check-in date are eligible for a 50% refund of the advance amount paid. Cancellations made within 7 days of the check-in date are non-refundable."
      },
      {
        heading: "2. No-Show",
        content: "Failure to arrive at the property on the scheduled date will be treated as a no-show, and the advance payment will be forfeited."
      },
      {
        heading: "3. Cancellation by Property",
        content: "In the rare event that we must cancel your booking due to unforeseen circumstances, a 100% refund of the advance amount will be issued."
      },
      {
        heading: "4. Refund Processing",
        content: "Approved refunds will be processed within 5-7 business days through the original payment method (Paytm/Bank Transfer)."
      }
    ]
  },
  "privacy-policy": {
    title: "Privacy Policy",
    intro: "At PawnaHavenCamp, we respect your privacy and are committed to protecting the personal information you share with us.",
    sections: [
      {
        heading: "1. Information Collection",
        content: "We collect basic information such as your name, mobile number, and email address when you make a booking or inquiry."
      },
      {
        heading: "2. Use of Information",
        content: "Your information is used solely for processing your booking, communicating stay details, and improving our services."
      },
      {
        heading: "3. Data Security",
        content: "We implement secure protocols to ensure your data is protected against unauthorized access. We do not store credit card/debit card details; all payments are processed through secure gateways (Paytm)."
      },
      {
        heading: "4. Third-Party Sharing",
        content: "We do not sell or share your personal information with third parties for marketing purposes."
      }
    ]
  }
};

const InformationPage = () => {
  const { type } = useParams<{ type: string }>();
  const content = policyContent[type as keyof typeof policyContent];

  if (!content) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-display font-bold mb-8 text-primary">{content.title}</h1>
          <div className="prose prose-gold max-w-none space-y-8 text-muted-foreground">
            {content.intro && <p>{content.intro}</p>}
            
            {content.sections && (
              <div className="space-y-6">
                {content.sections.map((section, idx) => (
                  <section key={idx}>
                    <h2 className="text-xl font-bold text-foreground">{section.heading}</h2>
                    <p>{section.content}</p>
                  </section>
                ))}
              </div>
            )}

            {content.grid && (
              <div className="grid md:grid-cols-2 gap-6">
                {content.grid.map((item, idx) => (
                  <div key={idx} className="p-6 bg-secondary/20 rounded-2xl border border-border/40">
                    <h3 className="text-lg font-bold text-foreground mb-2">{item.heading}</h3>
                    <p className="text-sm">{item.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InformationPage;
