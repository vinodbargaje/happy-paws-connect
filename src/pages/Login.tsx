import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { PawPrint, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Invalid email or password. Please try again.");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Please confirm your email before logging in.");
        } else {
          toast.error(error.message || "Failed to sign in");
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        // Fetch user role to navigate to correct dashboard
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id)
          .single();

        toast.success("Welcome back!");
        
        if (roleData?.role === 'caregiver') {
          navigate("/dashboard/caregiver");
        } else {
          navigate("/dashboard/owner");
        }
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Log In to PetPals - Access Your Account</title>
        <meta name="description" content="Log in to your PetPals account. Manage your bookings, connect with caregivers, and access pet care services." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center">
                  <PawPrint className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">
                  Log in to access your PetPals account
                </p>
              </div>

              {/* Form */}
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="remember"
                        checked={formData.remember}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-muted-foreground">Remember me</span>
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full gap-2"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Log In"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </Button>
                </form>

                {/* Sign up link */}
                <p className="text-center text-muted-foreground mt-6">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary font-medium hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Login;
