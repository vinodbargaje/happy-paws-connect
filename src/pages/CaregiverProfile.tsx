import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { BookingForm } from "@/components/booking/BookingForm";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Star, 
  MapPin, 
  Shield, 
  Heart,
  Clock,
  Calendar,
  MessageCircle,
  Check,
  ChevronLeft,
  Share2,
  Loader2
} from "lucide-react";

interface CaregiverData {
  id: string;
  user_id: string;
  name: string;
  image: string | null;
  location: string | null;
  bio: string | null;
  rating: number;
  reviews: number;
  verified: boolean;
  experience: string;
  hourly_rate: number | null;
  daily_rate: number | null;
  services: { name: string; price: number; duration: string }[];
  languages: string[];
}

// Default services if not set
const defaultServices = [
  { name: "Dog Walking", price: 300, duration: "30 mins" },
  { name: "Pet Sitting", price: 500, duration: "per visit" },
  { name: "Overnight Care", price: 1200, duration: "per night" },
];

// Mock gallery images
const galleryImages = [
  "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=400&h=400&fit=crop",
];

const CaregiverProfile = () => {
  const { id } = useParams();
  const { user, userRole } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [caregiver, setCaregiver] = useState<CaregiverData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaregiver = async () => {
      if (!id) return;
      
      try {
        // Fetch caregiver profile with user profile data
        const { data: caregiverData, error: caregiverError } = await supabase
          .from("caregiver_profiles")
          .select(`
            *,
            profile:profiles(
              id, full_name, avatar_url, city, pincode
            )
          `)
          .eq("id", id)
          .maybeSingle();

        if (caregiverError) throw caregiverError;
        
        if (!caregiverData) {
          // Try to find by user_id as fallback
          const { data: fallbackData, error: fallbackError } = await supabase
            .from("caregiver_profiles")
            .select(`
              *,
              profile:profiles(
                id, full_name, avatar_url, city, pincode
              )
            `)
            .eq("user_id", id)
            .maybeSingle();
            
          if (fallbackError) throw fallbackError;
          if (!fallbackData) {
            setCaregiver(null);
            return;
          }
          
          processCaregiver(fallbackData);
        } else {
          processCaregiver(caregiverData);
        }
      } catch (err) {
        console.error("Error fetching caregiver:", err);
        toast.error("Failed to load caregiver profile");
      } finally {
        setLoading(false);
      }
    };

    const processCaregiver = (data: any) => {
      const profile = data.profile;
      
      // Build services from services_offered or use defaults
      let services = defaultServices;
      if (data.services_offered && data.services_offered.length > 0) {
        services = data.services_offered.map((service: string) => ({
          name: service,
          price: data.hourly_rate || 300,
          duration: "per session",
        }));
      }

      setCaregiver({
        id: data.id,
        user_id: data.user_id,
        name: profile?.full_name || "Caregiver",
        image: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || "C")}&background=random&size=600`,
        location: profile?.city ? `${profile.city}${profile.pincode ? `, ${profile.pincode}` : ""}` : "Location not set",
        bio: data.bio || "Experienced pet caregiver ready to help with your furry friends!",
        rating: data.rating || 0,
        reviews: data.total_reviews || 0,
        verified: data.is_verified || false,
        experience: data.years_experience ? `${data.years_experience} years` : "New",
        hourly_rate: data.hourly_rate,
        daily_rate: data.daily_rate,
        services,
        languages: data.languages || ["English", "Hindi"],
      });
    };

    fetchCaregiver();
  }, [id]);

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please log in to book a caregiver");
      return;
    }
    if (userRole !== "owner") {
      toast.error("Only pet owners can book caregivers");
      return;
    }
    setBookingOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold mb-4">Caregiver not found</h1>
          <Button asChild>
            <Link to="/search">Browse Caregivers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const coverImage = "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&h=400&fit=crop";

  return (
    <>
      <Helmet>
        <title>{caregiver.name} - Pet Caregiver | PetPals</title>
        <meta 
          name="description" 
          content={`Book ${caregiver.name}, a ${caregiver.verified ? "verified " : ""}pet caregiver${caregiver.location ? ` in ${caregiver.location}` : ""}. ${caregiver.rating} stars from ${caregiver.reviews} reviews.`} 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-16">
          {/* Cover Image */}
          <div className="relative h-64 md:h-80">
            <img 
              src={coverImage} 
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
                      src={caregiver.image || ""}
                      alt={caregiver.name}
                      className="w-32 h-32 rounded-2xl object-cover shadow-medium"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-bold">{caregiver.name}</h1>
                            {caregiver.verified && (
                              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                                <Shield className="w-3 h-3 text-secondary-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{caregiver.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-accent fill-accent" />
                            <span className="text-xl font-bold">{caregiver.rating || "New"}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{caregiver.reviews} reviews</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="text-center p-3 bg-muted/50 rounded-xl">
                          <p className="font-bold">{caregiver.experience}</p>
                          <p className="text-xs text-muted-foreground">Experience</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-xl">
                          <p className="font-bold">{"< 1 hour"}</p>
                          <p className="text-xs text-muted-foreground">Response</p>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-xl">
                          <p className="font-bold">{"85%"}</p>
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
                    {caregiver.verified && (
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                        <Check className="w-4 h-4 text-secondary" />
                        <span className="text-sm font-medium">Background Verified</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                      <Check className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium">{caregiver.experience} Experience</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                      <Check className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium">Pet First Aid</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
                      <Check className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium">Insurance Covered</span>
                    </div>
                  </div>
                </div>

                {/* About */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-bold mb-4">About {caregiver.name.split(" ")[0]}</h2>
                  <p className="text-muted-foreground leading-relaxed">{caregiver.bio}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div>
                      <h3 className="font-medium mb-2">Pets I Care For</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Dogs", "Cats", "Birds", "Small Animals"].map((pet) => (
                          <span key={pet} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                            {pet}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Languages</h3>
                      <div className="flex flex-wrap gap-2">
                        {caregiver.languages.map((lang) => (
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
                    {galleryImages.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Gallery ${i + 1}`}
                        className="w-full aspect-square object-cover rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    ))}
                  </div>
                </div>

                {/* Reviews Placeholder */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">Reviews</h2>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-accent fill-accent" />
                      <span className="font-bold">{caregiver.rating || "New"}</span>
                      <span className="text-muted-foreground">({caregiver.reviews})</span>
                    </div>
                  </div>
                  
                  {caregiver.reviews === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No reviews yet. Be the first to book!
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Reviews will appear here after bookings are completed.
                    </p>
                  )}
                </div>
              </div>

              {/* Sidebar - Booking */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 shadow-soft">
                  <h2 className="text-lg font-bold mb-4">Book {caregiver.name.split(" ")[0]}</h2>
                  
                  {/* Services */}
                  <div className="space-y-2 mb-6">
                    {caregiver.services.map((service) => (
                      <div
                        key={service.name}
                        className="p-4 rounded-xl border-2 border-border hover:border-primary/30 transition-all"
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

                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="w-full mb-3"
                    onClick={handleBookNow}
                  >
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

      {/* Booking Form Modal */}
      <BookingForm
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        caregiverId={caregiver.user_id}
        caregiverName={caregiver.name}
        services={caregiver.services}
      />
    </>
  );
};

export default CaregiverProfile;
