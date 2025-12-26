import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Shield, Heart, ChevronRight } from "lucide-react";

const caregivers = [
  {
    id: 1,
    name: "Priya Sharma",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 127,
    location: "Mumbai, Maharashtra",
    services: ["Dog Walking", "Pet Sitting"],
    price: "₹300/walk",
    verified: true,
    experience: "5 years",
  },
  {
    id: 2,
    name: "Rahul Verma",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 89,
    location: "Delhi NCR",
    services: ["Grooming", "Training"],
    price: "₹500/session",
    verified: true,
    experience: "7 years",
  },
  {
    id: 3,
    name: "Ananya Patel",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    rating: 5.0,
    reviews: 64,
    location: "Bangalore, Karnataka",
    services: ["Overnight Care", "Pet Sitting"],
    price: "₹800/night",
    verified: true,
    experience: "3 years",
  },
  {
    id: 4,
    name: "Vikram Singh",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 156,
    location: "Pune, Maharashtra",
    services: ["Dog Walking", "Training"],
    price: "₹350/walk",
    verified: true,
    experience: "8 years",
  },
];

const FeaturedCaregiversSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Top Rated Caregivers
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Meet our community of verified pet care professionals, 
              hand-picked for their experience and love for animals.
            </p>
          </div>
          <Button variant="outline" asChild className="mt-4 md:mt-0">
            <Link to="/search">
              View All
              <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {caregivers.map((caregiver, index) => (
            <Link
              key={caregiver.id}
              to={`/caregiver/${caregiver.id}`}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-medium hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={caregiver.image}
                  alt={caregiver.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute top-3 right-3 w-9 h-9 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors">
                  <Heart className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
                </button>
                {caregiver.verified && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {caregiver.name}
                  </h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="font-semibold text-sm">{caregiver.rating}</span>
                    <span className="text-xs text-muted-foreground">({caregiver.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{caregiver.location}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {caregiver.services.map((service) => (
                    <span
                      key={service}
                      className="px-2 py-0.5 bg-muted rounded-full text-xs text-muted-foreground"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    {caregiver.experience} exp
                  </span>
                  <span className="font-semibold text-primary">
                    {caregiver.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCaregiversSection;
