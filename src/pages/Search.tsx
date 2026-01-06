import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search as SearchIcon, 
  MapPin, 
  Star, 
  Shield, 
  Heart,
  SlidersHorizontal,
  X,
  Loader2
} from "lucide-react";

interface Caregiver {
  id: string;
  user_id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  services: string[];
  price: number;
  priceUnit: string;
  verified: boolean;
  experience: string;
  bio: string;
}

const services = [
  "All Services",
  "Dog Walking",
  "Pet Sitting",
  "Grooming",
  "Overnight Care",
  "Training",
  "Medical Care",
  "Pet Taxi",
];

// Fallback mock data for when no real caregivers exist
const mockCaregivers: Caregiver[] = [
  {
    id: "mock-1",
    user_id: "mock-1",
    name: "Priya Sharma",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 127,
    location: "Andheri West, Mumbai",
    services: ["Dog Walking", "Pet Sitting", "Overnight Care"],
    price: 300,
    priceUnit: "per walk",
    verified: true,
    experience: "5 years",
    bio: "Certified pet care specialist with a passion for dogs.",
  },
  {
    id: "mock-2",
    user_id: "mock-2",
    name: "Rahul Verma",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 89,
    location: "Connaught Place, Delhi",
    services: ["Grooming", "Training", "Medical Care"],
    price: 500,
    priceUnit: "per session",
    verified: true,
    experience: "7 years",
    bio: "Professional groomer and trainer with experience in handling all breeds.",
  },
  {
    id: "mock-3",
    user_id: "mock-3",
    name: "Ananya Patel",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    rating: 5.0,
    reviews: 64,
    location: "Koramangala, Bangalore",
    services: ["Overnight Care", "Pet Sitting", "Dog Walking"],
    price: 800,
    priceUnit: "per night",
    verified: true,
    experience: "3 years",
    bio: "Your pet's home away from home. I provide loving care and plenty of cuddles!",
  },
  {
    id: "mock-4",
    user_id: "mock-4",
    name: "Vikram Singh",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 156,
    location: "Kothrud, Pune",
    services: ["Dog Walking", "Training"],
    price: 350,
    priceUnit: "per walk",
    verified: true,
    experience: "8 years",
    bio: "Experienced dog trainer specializing in obedience and behavioral training.",
  },
  {
    id: "mock-5",
    user_id: "mock-5",
    name: "Meera Iyer",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    rating: 4.9,
    reviews: 98,
    location: "Bandra, Mumbai",
    services: ["Cat Sitting", "Pet Sitting", "Medical Care"],
    price: 400,
    priceUnit: "per visit",
    verified: true,
    experience: "4 years",
    bio: "Cat lover and expert in feline care. Also experienced with small pets and birds.",
  },
  {
    id: "mock-6",
    user_id: "mock-6",
    name: "Aditya Kumar",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 72,
    location: "Whitefield, Bangalore",
    services: ["Dog Walking", "Pet Taxi", "Training"],
    price: 250,
    priceUnit: "per walk",
    verified: false,
    experience: "2 years",
    bio: "Energetic and reliable dog walker. I ensure every walk is an adventure!",
  },
];

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("All Services");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCaregivers = async () => {
      setLoading(true);
      try {
        // First fetch caregiver profiles
        const { data: caregiverData, error: caregiverError } = await supabase
          .from("caregiver_profiles")
          .select("*")
          .order("rating", { ascending: false });

        if (caregiverError) throw caregiverError;

        if (caregiverData && caregiverData.length > 0) {
          // Fetch profiles for all caregivers
          const userIds = caregiverData.map(c => c.user_id);
          const { data: profilesData, error: profilesError } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url, city, pincode")
            .in("id", userIds);

          if (profilesError) throw profilesError;

          // Create a map for quick lookup
          const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);

          const mappedCaregivers: Caregiver[] = caregiverData.map((item: any) => {
            const profile = profilesMap.get(item.user_id);
            return {
              id: item.id,
              user_id: item.user_id,
              name: profile?.full_name || "Caregiver",
              image: profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || "C")}&background=random`,
              rating: Number(item.rating) || 0,
              reviews: item.total_reviews || 0,
              location: profile?.city ? `${profile.city}${profile.pincode ? `, ${profile.pincode}` : ""}` : "Location not set",
              services: item.services_offered?.length > 0 ? item.services_offered : ["Pet Care"],
              price: Number(item.hourly_rate) || 300,
              priceUnit: "per session",
              verified: item.is_verified || false,
              experience: item.years_experience ? `${item.years_experience} years` : "New",
              bio: item.bio || "Experienced pet caregiver ready to help!",
            };
          });
          setCaregivers(mappedCaregivers);
        } else {
          // Use mock data if no real caregivers exist
          setCaregivers(mockCaregivers);
        }
      } catch (err) {
        console.error("Error fetching caregivers:", err);
        // Fallback to mock data on error
        setCaregivers(mockCaregivers);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregivers();
  }, []);

  const filteredCaregivers = caregivers.filter((caregiver) => {
    const matchesSearch = caregiver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caregiver.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = selectedService === "All Services" || 
      caregiver.services.some(s => s.toLowerCase().includes(selectedService.toLowerCase()));
    const matchesPrice = caregiver.price >= priceRange[0] && caregiver.price <= priceRange[1];
    const matchesVerified = !verifiedOnly || caregiver.verified;
    
    return matchesSearch && matchesService && matchesPrice && matchesVerified;
  });

  return (
    <>
      <Helmet>
        <title>Find Pet Caregivers - Search Dog Walkers, Pet Sitters | PetPals</title>
        <meta 
          name="description" 
          content="Search verified pet caregivers near you. Filter by service, price, ratings, and availability. Find the perfect dog walker or pet sitter today." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-20">
          {/* Search Header */}
          <section className="bg-muted/30 border-b border-border py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Find Pet Caregivers</h1>
                
                <div className="bg-card rounded-2xl shadow-soft p-4 border border-border">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search by location or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-2"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                      </Button>
                      <Button variant="hero" className="gap-2">
                        <SearchIcon className="w-4 h-4" />
                        Search
                      </Button>
                    </div>
                  </div>

                  {/* Service Pills */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {services.map((service) => (
                      <button
                        key={service}
                        onClick={() => setSelectedService(service)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedService === service
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>

                  {/* Expanded Filters */}
                  {showFilters && (
                    <div className="mt-4 pt-4 border-t border-border grid md:grid-cols-3 gap-4 animate-slide-up">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Price Range</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                            className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm"
                            placeholder="Min"
                          />
                          <span className="text-muted-foreground">-</span>
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 2000])}
                            className="w-full h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm"
                            placeholder="Max"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Verification</label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={verifiedOnly}
                            onChange={(e) => setVerifiedOnly(e.target.checked)}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-sm">Verified caregivers only</span>
                        </label>
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedService("All Services");
                            setPriceRange([0, 2000]);
                            setVerifiedOnly(false);
                          }}
                          className="gap-1"
                        >
                          <X className="w-4 h-4" />
                          Clear all
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Results */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredCaregivers.length}</span> caregivers found
                </p>
                <select className="h-10 px-3 rounded-lg bg-muted/50 border border-border text-sm">
                  <option>Sort by: Relevance</option>
                  <option>Sort by: Rating</option>
                  <option>Sort by: Price (Low to High)</option>
                  <option>Sort by: Price (High to Low)</option>
                </select>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCaregivers.map((caregiver) => (
                    <Link
                      key={caregiver.id}
                      to={`/caregiver/${caregiver.id}`}
                      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-medium hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex gap-4 p-4">
                        <div className="relative">
                          <img
                            src={caregiver.image}
                            alt={caregiver.name}
                            className="w-24 h-24 rounded-xl object-cover"
                          />
                          {caregiver.verified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                              <Shield className="w-3 h-3 text-secondary-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                              {caregiver.name}
                            </h3>
                            <button 
                              className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
                              onClick={(e) => e.preventDefault()}
                            >
                              <Heart className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 text-accent fill-accent" />
                            <span className="font-semibold">{caregiver.rating || "New"}</span>
                            <span className="text-muted-foreground">({caregiver.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{caregiver.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="px-4 pb-4">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {caregiver.bio}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {caregiver.services.slice(0, 3).map((service) => (
                            <span
                              key={service}
                              className="px-2 py-0.5 bg-muted rounded-full text-xs text-muted-foreground"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="text-sm text-muted-foreground">
                            <span className="text-foreground font-medium">{caregiver.experience}</span> exp
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-primary">₹{caregiver.price}</span>
                            <span className="text-sm text-muted-foreground"> {caregiver.priceUnit}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && filteredCaregivers.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <SearchIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No caregivers found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search in a different area
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Search;
