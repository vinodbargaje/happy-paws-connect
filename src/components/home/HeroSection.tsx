import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Star, Shield, Heart } from "lucide-react";
import { useState } from "react";

const HeroSection = () => {
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");

  const stats = [
    { value: "50K+", label: "Happy Pets" },
    { value: "10K+", label: "Caregivers" },
    { value: "4.9", label: "Avg Rating", icon: Star },
    { value: "100%", label: "Verified", icon: Shield },
  ];

  return (
    <section className="relative min-h-screen gradient-hero paw-pattern overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-soft" />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm">
              <Heart className="w-4 h-4" />
              <span>Trusted by 50,000+ pet parents</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Find the Perfect
              <span className="block gradient-primary bg-clip-text text-transparent">
                Care for Your Pet
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Connect with verified pet caregivers in your neighborhood. 
              Walking, sitting, grooming, and more – your pet deserves the best care.
            </p>

            {/* Search Box */}
            <div className="bg-card rounded-2xl shadow-medium p-4 border border-border">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div className="flex-1">
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select a service</option>
                    <option value="walking">Dog Walking</option>
                    <option value="sitting">Pet Sitting</option>
                    <option value="grooming">Grooming</option>
                    <option value="boarding">Boarding</option>
                    <option value="training">Training</option>
                  </select>
                </div>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/search">
                    <Search className="w-5 h-5" />
                    Search
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {stat.icon && <stat.icon className="w-4 h-4 text-accent fill-accent" />}
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative z-10 animate-float">
              <img
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=700&fit=crop"
                alt="Happy dog with owner"
                className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl object-cover"
              />
              
              {/* Floating Cards */}
              <div className="absolute -left-8 top-20 bg-card rounded-2xl p-4 shadow-medium border border-border animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Background Checked</p>
                    <p className="text-xs text-muted-foreground">100% Verified</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -right-4 bottom-32 bg-card rounded-2xl p-4 shadow-medium border border-border">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <img
                        key={i}
                        src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?w=40&h=40&fit=crop&face`}
                        alt=""
                        className="w-8 h-8 rounded-full border-2 border-card"
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="font-semibold text-sm">4.9</span>
                    </div>
                    <p className="text-xs text-muted-foreground">5000+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-10 right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-20 left-10 w-60 h-60 bg-accent/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
