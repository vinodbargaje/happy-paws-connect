import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Heart } from "lucide-react";

const CTASection = () => {
  const benefits = [
    { icon: Shield, text: "Background-verified caregivers" },
    { icon: Clock, text: "24/7 customer support" },
    { icon: Heart, text: "Satisfaction guaranteed" },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <div className="absolute inset-0 paw-pattern opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Ready to Find Your Pet's Perfect Companion?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join over 50,000 happy pet parents. Sign up today and get your first booking at 20% off!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/register">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/register/caregiver">
                Become a Caregiver
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/90">
            {benefits.map((benefit) => (
              <div key={benefit.text} className="flex items-center gap-2">
                <benefit.icon className="w-5 h-5" />
                <span className="text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
