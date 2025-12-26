import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
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
  ChevronRight
} from "lucide-react";

const CaregiverDashboard = () => {
  const user = {
    name: "Priya",
    email: "priya@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    plan: "pro",
    rating: 4.9,
    reviews: 127,
    responseRate: "98%",
    completedJobs: 234,
  };

  const stats = [
    { label: "This Week", value: "₹12,450", change: "+15%", icon: DollarSign },
    { label: "Active Clients", value: "18", change: "+3", icon: Users },
    { label: "Pending Requests", value: "5", change: "new", icon: Briefcase },
    { label: "Avg Rating", value: "4.9", change: "★", icon: Star },
  ];

  const pendingRequests = [
    {
      id: 1,
      owner: "Neha Kapoor",
      ownerImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      pet: "Bruno (Golden Retriever)",
      service: "Dog Walking",
      date: "Tomorrow, 4:00 PM",
      duration: "60 mins",
      price: 400,
    },
    {
      id: 2,
      owner: "Arjun Mehta",
      ownerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      pet: "Whiskers (Persian Cat)",
      service: "Pet Sitting",
      date: "Dec 28, 10:00 AM - 6:00 PM",
      duration: "8 hours",
      price: 1200,
    },
  ];

  const upcomingJobs = [
    {
      id: 1,
      owner: "Simran Kaur",
      ownerImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      pet: "Max & Bella (Labs)",
      service: "Dog Walking",
      date: "Today, 5:00 PM",
      status: "confirmed",
    },
    {
      id: 2,
      owner: "Vikram Singh",
      ownerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      pet: "Rocky (German Shepherd)",
      service: "Training Session",
      date: "Today, 7:00 PM",
      status: "confirmed",
    },
  ];

  const recentReviews = [
    {
      id: 1,
      author: "Neha K.",
      rating: 5,
      text: "Priya is absolutely wonderful with Bruno!",
      date: "2 days ago",
    },
    {
      id: 2,
      author: "Arjun M.",
      rating: 5,
      text: "Excellent cat sitter, very professional.",
      date: "1 week ago",
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
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover shadow-soft"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
                    <span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">PRO</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span>{user.rating} ({user.reviews} reviews)</span>
                    <span>•</span>
                    <span>{user.completedJobs} jobs completed</span>
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
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      stat.change.includes("+") ? "bg-secondary/10 text-secondary" : "bg-accent/20 text-accent-foreground"
                    }`}>
                      {stat.change}
                    </span>
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
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm font-medium rounded-full">
                      {pendingRequests.length} new
                    </span>
                  </div>
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div key={request.id} className="p-4 bg-muted/50 rounded-xl">
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={request.ownerImage}
                            alt={request.owner}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold">{request.owner}</p>
                            <p className="text-sm text-muted-foreground">{request.pet}</p>
                            <div className="flex items-center gap-2 text-sm mt-1">
                              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                                {request.service}
                              </span>
                              <span className="text-muted-foreground">{request.duration}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-secondary">₹{request.price}</p>
                            <p className="text-xs text-muted-foreground">{request.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" className="flex-1 gap-1">
                            <Check className="w-4 h-4" />
                            Accept
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 gap-1">
                            <X className="w-4 h-4" />
                            Decline
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Today's Schedule */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Today's Schedule</h2>
                    <Link to="/schedule" className="text-sm text-secondary hover:underline">
                      View full calendar
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {upcomingJobs.map((job) => (
                      <div key={job.id} className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                        <img
                          src={job.ownerImage}
                          alt={job.owner}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold">{job.service}</p>
                          <p className="text-sm text-muted-foreground">{job.pet}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{job.date}</span>
                          </div>
                        </div>
                        <Button variant="soft" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
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
                      <p className="text-muted-foreground">Earnings chart coming soon</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Completion */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <h3 className="font-semibold mb-4">Profile Strength</h3>
                  <div className="relative h-2 bg-muted rounded-full mb-3">
                    <div className="absolute inset-y-0 left-0 w-[85%] bg-secondary rounded-full" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">85% complete</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-secondary" />
                      Profile photo added
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 text-secondary" />
                      Services listed
                    </li>
                    <li className="flex items-center gap-2 text-primary">
                      <div className="w-4 h-4 rounded-full border-2 border-current" />
                      Add portfolio photos
                    </li>
                  </ul>
                </div>

                {/* Recent Reviews */}
                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Recent Reviews</h3>
                    <Link to="/reviews" className="text-sm text-secondary hover:underline">
                      View all
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recentReviews.map((review) => (
                      <div key={review.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm">{review.author}</p>
                          <div className="flex gap-0.5">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 text-accent fill-accent" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                      </div>
                    ))}
                  </div>
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
