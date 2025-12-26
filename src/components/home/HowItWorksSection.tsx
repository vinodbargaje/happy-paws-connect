import { Search, Calendar, Heart, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search & Discover",
    description: "Browse verified caregivers in your area. Filter by service, ratings, availability, and price.",
  },
  {
    icon: Calendar,
    step: "02",
    title: "Book & Schedule",
    description: "Send a booking request with your preferred dates. Get instant confirmation from caregivers.",
  },
  {
    icon: Heart,
    step: "03",
    title: "Enjoy Peace of Mind",
    description: "Track your pet's adventure with real-time updates, photos, and GPS location tracking.",
  },
  {
    icon: Star,
    step: "04",
    title: "Rate & Review",
    description: "Share your experience and help other pet parents find the perfect caregiver.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How PetPals Works
          </h2>
          <p className="text-muted-foreground">
            Finding trusted pet care has never been easier
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="relative text-center group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Step number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-6xl font-extrabold text-primary/5 select-none">
                  {step.step}
                </div>
                
                {/* Icon */}
                <div className="relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <step.icon className="w-9 h-9 text-primary-foreground" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
