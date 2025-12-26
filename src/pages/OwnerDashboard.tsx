import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { 
  PawPrint, 
  Calendar, 
  MessageCircle, 
  Star,
  Plus,
  Dog,
  Cat,
  Clock,
  MapPin,
  ChevronRight,
  Bell,
  Settings,
  Heart,
  Search
} from "lucide-react";

const OwnerDashboard = () => {
  const user = {
    name: "Neha",
    email: "neha@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    plan: "free",
    connectionsUsed: 1,
    connectionsLimit: 2,
  };

  const pets = [
    {
      id: 1,
      name: "Bruno",
      type: "dog",
      breed: "Golden Retriever",
      age: "3 years",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop",
    },
    {
      id: 2,
      name: "Whiskers",
      type: "cat",
      breed: "Persian",
      age: "2 years",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop",
    },
  ];

  const upcomingBookings = [
    {
      id: 1,
      service: "Dog Walking",
      caregiver: "Priya Sharma",
      caregiverImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      date: "Today, 4:00 PM",
      pet: "Bruno",
      status: "confirmed",
    },
    {
      id: 2,
      service: "Pet Sitting",
      caregiver: "Rahul Verma",
      caregiverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      date: "Tomorrow, 10:00 AM",
      pet: "Whiskers",
      status: "pending",
    },
  ];

  const recentActivity = [
    { id: 1, text: "Booking confirmed with Priya Sharma", time: "2 hours ago", type: "booking" },
    { id: 2, text: "New message from Rahul Verma", time: "5 hours ago", type: "message" },
    { id: 3, text: "You rated Ananya Patel ★★★★★", time: "1 day ago", type: "review" },
  ];

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
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover shadow-soft"
                />
                <div>
                  <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
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
                <Button asChild>
                  <Link to="/search">
                    <Search className="w-4 h-4 mr-2" />
                    Find Caregivers
                  </Link>
                </Button>
              </div>
            </div>

            {/* Account Status Banner */}
            {user.plan === "free" && (
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4 md:p-6 mb-8 border border-primary/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold mb-1">Free Plan • {user.connectionsUsed}/{user.connectionsLimit} connections used</p>
                    <p className="text-sm text-muted-foreground">Upgrade to Premium for unlimited connections and priority support</p>
                  </div>
                  <Button variant="hero" size="sm">
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* My Pets */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">My Pets</h2>
                    <Button variant="soft" size="sm" className="gap-1">
                      <Plus className="w-4 h-4" />
                      Add Pet
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {pets.map((pet) => (
                      <div key={pet.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                        <img
                          src={pet.image}
                          alt={pet.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {pet.type === "dog" ? (
                              <Dog className="w-4 h-4 text-primary" />
                            ) : (
                              <Cat className="w-4 h-4 text-primary" />
                            )}
                            <p className="font-semibold">{pet.name}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">{pet.breed}</p>
                          <p className="text-xs text-muted-foreground">{pet.age}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upcoming Bookings */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Upcoming Bookings</h2>
                    <Link to="/bookings" className="text-sm text-primary hover:underline">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                        <img
                          src={booking.caregiverImage}
                          alt={booking.caregiver}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{booking.service}</p>
                          <p className="text-sm text-muted-foreground">{booking.caregiver}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{booking.date}</span>
                            <span>•</span>
                            <PawPrint className="w-3 h-3" />
                            <span>{booking.pet}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === "confirmed" 
                              ? "bg-secondary/10 text-secondary" 
                              : "bg-accent/20 text-accent-foreground"
                          }`}>
                            {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/search" className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all text-center group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Search className="w-6 h-6 text-primary" />
                    </div>
                    <p className="font-medium text-sm">Find Caregivers</p>
                  </Link>
                  <Link to="/bookings" className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all text-center group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <Calendar className="w-6 h-6 text-secondary" />
                    </div>
                    <p className="font-medium text-sm">My Bookings</p>
                  </Link>
                  <Link to="/messages" className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all text-center group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                      <MessageCircle className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <p className="font-medium text-sm">Messages</p>
                  </Link>
                  <Link to="/favorites" className="p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all text-center group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                      <Heart className="w-6 h-6 text-destructive" />
                    </div>
                    <p className="font-medium text-sm">Favorites</p>
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Recent Activity */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === "booking" ? "bg-secondary/10" :
                          activity.type === "message" ? "bg-primary/10" : "bg-accent/20"
                        }`}>
                          {activity.type === "booking" && <Calendar className="w-4 h-4 text-secondary" />}
                          {activity.type === "message" && <MessageCircle className="w-4 h-4 text-primary" />}
                          {activity.type === "review" && <Star className="w-4 h-4 text-accent" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">{activity.text}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
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
