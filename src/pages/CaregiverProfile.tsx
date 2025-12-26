import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  MapPin, 
  Shield, 
  Heart,
  Clock,
  Calendar,
  MessageCircle,
  Check,
  Dog,
  Cat,
  ChevronLeft,
  Share2
} from "lucide-react";

// Mock data - in production this would come from API
const caregiverData = {
  id: 1,
  name: "Priya Sharma",
  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=400&fit=crop",
  rating: 4.9,
  reviews: 127,
  location: "Andheri West, Mumbai",
  services: [
    { name: "Dog Walking", price: 300, duration: "30 mins" },
    { name: "Pet Sitting", price: 500, duration: "per visit" },
    { name: "Overnight Care", price: 1200, duration: "per night" },
  ],
  verified: true,
  experience: "5 years",
  responseTime: "< 1 hour",
  repeatClients: "85%",
  bio: "Hi! I'm Priya, a certified pet care specialist with over 5 years of experience caring for dogs and cats. I grew up surrounded by pets and understand the unique needs of each furry friend. Your pet's safety, comfort, and happiness are my top priorities. I provide regular photo updates and treat every pet like my own family member.",
  highlights: [
    "Background Verified",
    "Pet First Aid Certified", 
    "5+ Years Experience",
    "Insurance Covered",
  ],
  pets: ["Dogs", "Cats", "Birds", "Small Animals"],
  languages: ["English", "Hindi", "Marathi"],
  gallery: [
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400&h=400&fit=crop",
  ],
  reviewsList: [
    {
      id: 1,
      author: "Neha K.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      rating: 5,
      date: "2 weeks ago",
      pet: "Bruno (Golden Retriever)",
      content: "Priya is absolutely wonderful with Bruno! She sends me photos and updates throughout every walk, and I can tell Bruno loves her. Highly recommend!",
    },
    {
      id: 2,
      author: "Arjun M.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      rating: 5,
      date: "1 month ago",
      pet: "Whiskers (Persian Cat)",
      content: "Left my cat with Priya for a week while traveling. She treated Whiskers like royalty! Came home to a happy, well-cared-for kitty.",
    },
    {
      id: 3,
      author: "Simran K.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      rating: 5,
      date: "1 month ago",
      pet: "Max & Bella (Labs)",
      content: "Managing two energetic labs is no joke, but Priya handles them like a pro. Both dogs absolutely adore her!",
    },
  ],
};

const CaregiverProfile = () => {
  const { id } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedService, setSelectedService] = useState(caregiverData.services[0]);

  return (
    <>
      <Helmet>
        <title>{caregiverData.name} - Pet Caregiver in {caregiverData.location} | PetPals</title>
        <meta 
          name="description" 
          content={`Book ${caregiverData.name}, a verified pet caregiver in ${caregiverData.location}. ${caregiverData.rating} stars from ${caregiverData.reviews} reviews. ${caregiverData.services.map(s => s.name).join(", ")}.`} 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-16">
          {/* Cover Image */}
          <div className="relative h-64 md:h-80">
            <img 
              src={caregiverData.coverImage} 
              alt="" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            
            {/* Back button */}
            <Link 
              to="/search" 
              className="absolute top-4 left-4 w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            
            {/* Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-10 h-10 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-colors"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
              </button>
            </div>
          </div>

          <div className="container mx-auto px-4 -mt-20 relative z-10 pb-20">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Header */}
                <div className="bg-card rounded-2xl border border-border p-6 shadow-soft">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={caregiverData.image}
                      alt={caregiverData.name}
                      className="w-32 h-32 rounded-2xl object-cover shadow-medium"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold">{caregiverData.name}</h1>
                            {caregiverData.verified && (
                              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                                <Shield className="w-3 h-3 text-secondary-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{caregiverData.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-accent fill-accent" />
                            <span className="text-xl font-bold">{caregiverData.rating}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{caregiverData.reviews} reviews</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center p-3 bg-muted/50 rounded-xl">
                          <p className="font-bold">{caregiverData.experience}</p>
                          <p className="text-xs text-muted-foreground">Experience</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-xl">
                          <p className="font-bold">{caregiverData.responseTime}</p>
                          <p className="text-xs text-muted-foreground">Response</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-xl">
                          <p className="font-bold">{caregiverData.repeatClients}</p>
                          <p className="text-xs text-muted-foreground">Repeat</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-bold mb-4">Highlights</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {caregiverData.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                        <Check className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* About */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-bold mb-4">About {caregiverData.name.split(" ")[0]}</h2>
                  <p className="text-muted-foreground leading-relaxed">{caregiverData.bio}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <h3 className="font-medium mb-2">Pets I Care For</h3>
                      <div className="flex flex-wrap gap-2">
                        {caregiverData.pets.map((pet) => (
                          <span key={pet} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            {pet}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {caregiverData.languages.map((lang) => (
                          <span key={lang} className="px-3 py-1 bg-muted rounded-full text-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-bold mb-4">Photo Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {caregiverData.gallery.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        className="w-full aspect-square object-cover rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    ))}
                  </div>
                </div>

                {/* Reviews */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">Reviews</h2>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-accent fill-accent" />
                      <span className="font-bold">{caregiverData.rating}</span>
                      <span className="text-muted-foreground">({caregiverData.reviews})</span>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {caregiverData.reviewsList.map((review) => (
                      <div key={review.id} className="pb-6 border-b border-border last:border-0 last:pb-0">
                        <div className="flex items-start gap-3 mb-3">
                          <img
                            src={review.avatar}
                            alt={review.author}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold">{review.author}</p>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-0.5">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 text-accent fill-accent" />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">• {review.pet}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">{review.content}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    View All Reviews
                  </Button>
                </div>
              </div>

              {/* Sidebar - Booking */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-soft">
                  <h2 className="text-lg font-bold mb-4">Book {caregiverData.name.split(" ")[0]}</h2>
                  
                  {/* Services */}
                  <div className="space-y-2 mb-6">
                    {caregiverData.services.map((service) => (
                      <div
                        key={service.name}
                        onClick={() => setSelectedService(service)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedService.name === service.name
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{service.name}</p>
                            <p className="text-sm text-muted-foreground">{service.duration}</p>
                          </div>
                          <p className="font-bold text-primary">₹{service.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Date picker placeholder */}
                  <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block">Select Date</label>
                    <button className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border flex items-center gap-2 text-muted-foreground hover:border-primary/50 transition-colors">
                      <Calendar className="w-5 h-5" />
                      Choose a date
                    </button>
                  </div>

                  <Button variant="hero" size="lg" className="w-full mb-3">
                    Request Booking
                  </Button>
                  
                  <Button variant="outline" size="lg" className="w-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Send Message
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Free cancellation up to 24 hours before booking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default CaregiverProfile;
