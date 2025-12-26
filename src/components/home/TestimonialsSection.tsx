import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Neha Kapoor",
    role: "Dog Mom to Bruno",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    content: "PetPals saved me! I found an amazing dog walker who treats Bruno like family. The photo updates during walks give me so much peace of mind.",
    rating: 5,
    petImage: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=60&h=60&fit=crop",
  },
  {
    id: 2,
    name: "Arjun Mehta",
    role: "Cat Dad to Whiskers",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    content: "Finally found a trustworthy pet sitter for my cat. The booking process is smooth, and I love that all caregivers are verified.",
    rating: 5,
    petImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=60&h=60&fit=crop",
  },
  {
    id: 3,
    name: "Simran Kaur",
    role: "Pet Parent to Max & Bella",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    content: "Managing two pets is challenging, but PetPals makes it easy. The overnight care service is fantastic – highly recommend!",
    rating: 5,
    petImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=60&h=60&fit=crop",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by Pet Parents
          </h2>
          <p className="text-muted-foreground">
            Join thousands of happy pet owners who trust PetPals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative bg-card rounded-2xl p-6 border border-border hover:shadow-medium transition-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Quote icon */}
              <div className="absolute -top-3 -left-3 w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <Quote className="w-5 h-5 text-primary-foreground" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 pt-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <img
                  src={testimonial.petImage}
                  alt="Pet"
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
