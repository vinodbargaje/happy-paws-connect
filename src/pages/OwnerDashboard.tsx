import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { BookingCard } from "@/components/booking/BookingCard";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import { usePets } from "@/hooks/usePets";
import { 
  PawPrint, 
  Calendar, 
  MessageCircle, 
  Star,
  Plus,
  Dog,
  Cat,
  Clock,
  ChevronRight,
  Bell,
  Settings,
  Heart,
  Search,
  LogOut,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { upcomingBookings, pastBookings, loading: bookingsLoading, updateBookingStatus } = useBookings();
  const { pets, loading: petsLoading } = usePets();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleCancelBooking = async (bookingId: string) => {
    await updateBookingStatus(bookingId, "cancelled");
  };

  const userName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  return (
    <>
      <Helmet>
        <title>Pet Owner Dashboard | PetPals</title>
        <meta name="description" content="Manage your pets, bookings, and messages from your PetPals dashboard." />
      </Helmet>
      
      <div className="min-h-screen bg-muted/30">
        <Navbar />
        
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-soft">
                  <PawPrint className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Welcome back, {userName}!</h1>
                  <p className="text-muted-foreground">Manage your pets and bookings</p>
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
                <Button asChild>
                  <Link to="/search">
                    <Search className="w-4 h-4 mr-2" />
                    Find Caregivers
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <PawPrint className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{pets.length}</p>
                <p className="text-sm text-muted-foreground">My Pets</p>
              </div>
              <div className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-secondary" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
              <div className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent-foreground" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{upcomingBookings.filter(b => b.status === "pending").length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{pastBookings.filter(b => b.status === "completed").length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* My Pets */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">My Pets</h2>
                    <Button variant="soft" size="sm" className="gap-1" asChild>
                      <Link to="/register/owner">
                        <Plus className="w-4 h-4" />
                        Add Pet
                      </Link>
                    </Button>
                  </div>
                  
                  {petsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : pets.length === 0 ? (
                    <div className="text-center py-8">
                      <PawPrint className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No pets added yet</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/register/owner">Add your first pet</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {pets.map((pet) => (
                        <div key={pet.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                          {pet.photo_url ? (
                            <img
                              src={pet.photo_url}
                              alt={pet.name}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                              {pet.pet_type === "dog" ? (
                                <Dog className="w-8 h-8 text-primary" />
                              ) : (
                                <Cat className="w-8 h-8 text-primary" />
                              )}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {pet.pet_type === "dog" ? (
                                <Dog className="w-4 h-4 text-primary" />
                              ) : (
                                <Cat className="w-4 h-4 text-primary" />
                              )}
                              <p className="font-semibold">{pet.name}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{pet.breed || pet.pet_type}</p>
                            {pet.age && (
                              <p className="text-xs text-muted-foreground">{pet.age} years old</p>
                            )}
                          </div>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming Bookings */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Upcoming Bookings</h2>
                    {upcomingBookings.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {upcomingBookings.length} booking{upcomingBookings.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  
                  {bookingsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : upcomingBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No upcoming bookings</p>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/search">Find a caregiver</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {upcomingBookings.slice(0, 5).map((booking) => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          userType="owner"
                          onCancel={handleCancelBooking}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/search" className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all text-center group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Search className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-medium text-sm">Find Caregivers</p>
                  </Link>
                  <div className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all text-center group cursor-pointer">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <Calendar className="w-6 h-6 text-secondary" />
                    </div>
                    <p className="font-medium text-sm">My Bookings</p>
                  </div>
                  <div className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all text-center group cursor-pointer">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                      <MessageCircle className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <p className="font-medium text-sm">Messages</p>
                  </div>
                  <div className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all text-center group cursor-pointer">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                      <Heart className="w-6 h-6 text-destructive" />
                    </div>
                    <p className="font-medium text-sm">Favorites</p>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Past Bookings */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                  {pastBookings.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No past bookings yet</p>
                  ) : (
                    <div className="space-y-4">
                      {pastBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            booking.status === "completed" ? "bg-green-100" : "bg-red-100"
                          }`}>
                            {booking.status === "completed" ? (
                              <Star className="w-4 h-4 text-green-600" />
                            ) : (
                              <Calendar className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {booking.service_type} with {booking.caregiver?.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {booking.status === "completed" ? "Completed" : "Cancelled"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tips */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-border">
                  <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Book regular walks to keep your pet healthy and establish a routine with your favorite caregiver!
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/search">Schedule a Walk</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default OwnerDashboard;
