import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { BookingCard } from "@/components/booking/BookingCard";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import { supabase } from "@/integrations/supabase/client";
import { 
  Calendar, 
  MessageCircle, 
  Star,
  DollarSign,
  Clock,
  Check,
  X,
  Bell,
  Settings,
  TrendingUp,
  Users,
  Briefcase,
  ChevronRight,
  LogOut,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface CaregiverProfile {
  id: string;
  bio: string | null;
  services_offered: string[] | null;
  hourly_rate: number | null;
  daily_rate: number | null;
  rating: number | null;
  total_reviews: number | null;
  years_experience: number | null;
  is_verified: boolean | null;
}

const CaregiverDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { 
    pendingBookings, 
    confirmedBookings, 
    upcomingBookings,
    pastBookings,
    loading: bookingsLoading, 
    updateBookingStatus 
  } = useBookings();
  
  const [caregiverProfile, setCaregiverProfile] = useState<CaregiverProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchCaregiverProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("caregiver_profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (error) throw error;
        setCaregiverProfile(data);
      } catch (err) {
        console.error("Error fetching caregiver profile:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchCaregiverProfile();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleAcceptBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, "confirmed");
  };

  const handleDeclineBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, "cancelled");
  };

  const handleCompleteBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, "completed");
  };

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const completedCount = pastBookings.filter(b => b.status === "completed").length;
  
  // Calculate earnings from completed bookings
  const totalEarnings = pastBookings
    .filter(b => b.status === "completed")
    .reduce((sum, b) => sum + (b.total_amount || 0), 0);

  const stats = [
    { 
      label: "Total Earnings", 
      value: `₹${totalEarnings.toLocaleString()}`, 
      icon: DollarSign,
      color: "bg-green-500/10 text-green-600"
    },
    { 
      label: "Active Bookings", 
      value: String(confirmedBookings.length), 
      icon: Users,
      color: "bg-blue-500/10 text-blue-600"
    },
    { 
      label: "Pending Requests", 
      value: String(pendingBookings.length), 
      icon: Briefcase,
      color: "bg-amber-500/10 text-amber-600"
    },
    { 
      label: "Completed", 
      value: String(completedCount), 
      icon: Check,
      color: "bg-purple-500/10 text-purple-600"
    },
  ];

  return (
    <>
      <Helmet>
        <title>Caregiver Dashboard | PetPals</title>
        <meta name="description" content="Manage your bookings, earnings, and client communications from your PetPals caregiver dashboard." />
      </Helmet>
      
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center shadow-soft">
                  <Briefcase className="w-8 h-8 text-secondary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
                    {caregiverProfile?.is_verified && (
                      <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {caregiverProfile?.rating ? (
                      <>
                        <Star className="w-4 h-4 text-accent fill-accent" />
                        <span>{caregiverProfile.rating} ({caregiverProfile.total_reviews || 0} reviews)</span>
                        <span>•</span>
                      </>
                    ) : null}
                    <span>{completedCount} jobs completed</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" onClick={handleLogout}>
                  <LogOut className="w-5 h-5" />
                </Button>
                <Button variant="secondary">
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Schedule
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Pending Requests */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Pending Requests</h2>
                    {pendingBookings.length > 0 && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                        {pendingBookings.length} new
                      </span>
                    )}
                  </div>
                  
                  {bookingsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : pendingBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">No pending requests</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingBookings.map((booking) => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          userType="caregiver"
                          onAccept={handleAcceptBooking}
                          onDecline={handleDeclineBooking}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Jobs */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Confirmed Bookings</h2>
                    {confirmedBookings.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {confirmedBookings.length} active
                      </span>
                    )}
                  </div>
                  
                  {bookingsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : confirmedBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">No confirmed bookings</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {confirmedBookings.map((booking) => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          userType="caregiver"
                          onComplete={handleCompleteBooking}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Earnings Chart Placeholder */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Earnings Overview</h2>
                    <select className="text-sm bg-muted px-3 py-1.5 rounded-lg border border-border">
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>This Year</option>
                    </select>
                  </div>
                  <div className="h-48 flex items-center justify-center bg-muted/50 rounded-xl">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 text-secondary" />
                      <p className="text-2xl font-bold text-secondary">₹{totalEarnings.toLocaleString()}</p>
                      <p className="text-muted-foreground">Total earnings</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Completion */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-semibold mb-4">Profile Strength</h3>
                  {profileLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <div className="relative h-2 bg-muted rounded-full mb-3">
                        <div 
                          className="absolute inset-y-0 left-0 bg-secondary rounded-full transition-all" 
                          style={{ 
                            width: `${caregiverProfile?.bio ? 50 : 0}${caregiverProfile?.services_offered?.length ? 35 : 0}${caregiverProfile?.is_verified ? 15 : 0}%` 
                          }}
                        />
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2 text-muted-foreground">
                          {caregiverProfile?.bio ? (
                            <Check className="w-4 h-4 text-secondary" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-current" />
                          )}
                          Bio added
                        </li>
                        <li className="flex items-center gap-2 text-muted-foreground">
                          {caregiverProfile?.services_offered?.length ? (
                            <Check className="w-4 h-4 text-secondary" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-current" />
                          )}
                          Services listed
                        </li>
                        <li className="flex items-center gap-2 text-muted-foreground">
                          {caregiverProfile?.is_verified ? (
                            <Check className="w-4 h-4 text-secondary" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-current" />
                          )}
                          Profile verified
                        </li>
                      </ul>
                    </>
                  )}
                </div>

                {/* Recent Completed */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Recent Completed</h3>
                  </div>
                  {pastBookings.filter(b => b.status === "completed").length === 0 ? (
                    <p className="text-sm text-muted-foreground">No completed jobs yet</p>
                  ) : (
                    <div className="space-y-4">
                      {pastBookings
                        .filter(b => b.status === "completed")
                        .slice(0, 3)
                        .map((booking) => (
                          <div key={booking.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-sm">{booking.owner?.full_name}</p>
                              <span className="text-sm font-bold text-secondary">₹{booking.total_amount}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{booking.service_type}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {booking.pet?.name} ({booking.pet?.pet_type})
                            </p>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Calendar className="w-4 h-4" />
                      Update Availability
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <DollarSign className="w-4 h-4" />
                      Update Pricing
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <MessageCircle className="w-4 h-4" />
                      View Messages
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CaregiverDashboard;
