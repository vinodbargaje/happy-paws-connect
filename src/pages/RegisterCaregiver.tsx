import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  ArrowLeft,
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin,
  Briefcase,
  Upload,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const services = [
  { id: "walking", label: "Dog Walking", price: "300" },
  { id: "sitting", label: "Pet Sitting", price: "500" },
  { id: "overnight", label: "Overnight Care", price: "800" },
  { id: "grooming", label: "Grooming", price: "600" },
  { id: "training", label: "Training", price: "700" },
  { id: "medical", label: "Medical Care", price: "400" },
  { id: "transport", label: "Pet Taxi", price: "350" },
  { id: "dropin", label: "Drop-in Visits", price: "250" },
];

const RegisterCaregiver = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: "",
    pincode: "",
    serviceRadius: "5",
    experience: "",
    bio: "",
    languages: [] as string[],
    accountType: "free" as "free" | "paid",
  });
  const [selectedServices, setSelectedServices] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleService = (serviceId: string, defaultPrice: string) => {
    if (selectedServices[serviceId]) {
      const newServices = { ...selectedServices };
      delete newServices[serviceId];
      setSelectedServices(newServices);
    } else {
      setSelectedServices({ ...selectedServices, [serviceId]: defaultPrice });
    }
  };

  const updateServicePrice = (serviceId: string, price: string) => {
    setSelectedServices({ ...selectedServices, [serviceId]: price });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (Object.keys(selectedServices).length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    setLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      full_name: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      role: 'caregiver',
    });

    if (error) {
      toast.error(error.message || "Failed to create account");
      setLoading(false);
      return;
    }

    // Update profile and caregiver profile
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ city: formData.city, pincode: formData.pincode })
        .eq('id', user.id);

      // Parse experience to years
      let yearsExp = 0;
      if (formData.experience === "< 1 year") yearsExp = 0;
      else if (formData.experience === "1-2 years") yearsExp = 1;
      else if (formData.experience === "3-5 years") yearsExp = 3;
      else if (formData.experience === "5+ years") yearsExp = 5;

      await supabase
        .from('caregiver_profiles')
        .update({
          bio: formData.bio,
          years_experience: yearsExp,
          service_radius: parseInt(formData.serviceRadius),
          services_offered: Object.keys(selectedServices),
          hourly_rate: Math.min(...Object.values(selectedServices).map(p => parseFloat(p) || 0)),
        })
        .eq('user_id', user.id);
    }

    toast.success("Account created! Welcome to PetPals.");
    navigate("/dashboard/caregiver");
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.firstName && formData.lastName && formData.email && formData.phone && formData.password;
    }
    if (step === 2) {
      return formData.city && formData.pincode && formData.experience;
    }
    if (step === 3) {
      return Object.keys(selectedServices).length > 0;
    }
    return true;
  };

  return (
    <>
      <Helmet>
        <title>Become a Pet Caregiver - Join PetPals | Earn Caring for Pets</title>
        <meta name="description" content="Join PetPals as a pet caregiver. Set your own schedule, choose your services, and start earning by doing what you love - caring for pets." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`flex items-center ${s < 3 ? "flex-1" : ""}`}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          s <= step
                            ? "gradient-secondary text-secondary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s}
                      </div>
                      {s < 3 && (
                        <div className={`flex-1 h-1 mx-2 rounded ${s < step ? "bg-secondary" : "bg-muted"}`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Account</span>
                  <span>Profile</span>
                  <span>Services</span>
                </div>
              </div>

              {/* Form */}
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft">
                <form onSubmit={handleSubmit}>
                  {/* Step 1 */}
                  {step === 1 && (
                    <div className="space-y-4 animate-slide-up">
                      <div className="text-center mb-6">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-xl gradient-secondary flex items-center justify-center">
                          <Briefcase className="w-7 h-7 text-secondary-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Become a Caregiver</h1>
                        <p className="text-muted-foreground">Start your pet care journey</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">First Name</label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="John"
                              className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Doe"
                            className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                            required
                          />
                        </div>
                      </div>

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
                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+91 98765 43210"
                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
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
                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Profile */}
                  {step === 2 && (
                    <div className="space-y-4 animate-slide-up">
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">Build Your Profile</h1>
                        <p className="text-muted-foreground">Help pet owners find you</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">City</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="Mumbai"
                              className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-secondary outline-none"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Pincode</label>
                          <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            placeholder="400001"
                            className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-secondary outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-1 block">Service Radius (km)</label>
                          <select
                            name="serviceRadius"
                            value={formData.serviceRadius}
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-secondary outline-none"
                          >
                            <option value="2">2 km</option>
                            <option value="5">5 km</option>
                            <option value="10">10 km</option>
                            <option value="15">15 km</option>
                            <option value="20">20+ km</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">Experience</label>
                          <select
                            name="experience"
                            value={formData.experience}
                            onChange={handleInputChange}
                            className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-secondary outline-none"
                            required
                          >
                            <option value="">Select</option>
                            <option value="< 1 year">&lt; 1 year</option>
                            <option value="1-2 years">1-2 years</option>
                            <option value="3-5 years">3-5 years</option>
                            <option value="5+ years">5+ years</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-1 block">About You</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell pet owners why they should trust you with their pets..."
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-secondary outline-none resize-none"
                        />
                      </div>

                      {/* Profile Photo */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Profile Photo</label>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl bg-muted flex items-center justify-center">
                            <User className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <Button type="button" variant="outline" className="gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Photo
                          </Button>
                        </div>
                      </div>

                      {/* Account Type */}
                      <div className="pt-4">
                        <label className="text-sm font-medium mb-3 block">Account Type</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div
                            onClick={() => setFormData({ ...formData, accountType: "free" })}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.accountType === "free"
                                ? "border-secondary bg-secondary/5"
                                : "border-border hover:border-secondary/30"
                            }`}
                          >
                            <p className="font-semibold mb-1">Free</p>
                            <p className="text-sm text-muted-foreground">Up to 2 leads/month</p>
                          </div>
                          <div
                            onClick={() => setFormData({ ...formData, accountType: "paid" })}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.accountType === "paid"
                                ? "border-secondary bg-secondary/5"
                                : "border-border hover:border-secondary/30"
                            }`}
                          >
                            <p className="font-semibold mb-1">Pro <span className="text-secondary">₹499/mo</span></p>
                            <p className="text-sm text-muted-foreground">Unlimited leads</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Services */}
                  {step === 3 && (
                    <div className="space-y-4 animate-slide-up">
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">Your Services</h1>
                        <p className="text-muted-foreground">Select what you offer and set your prices</p>
                      </div>

                      <div className="space-y-3">
                        {services.map((service) => (
                          <div
                            key={service.id}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              selectedServices[service.id]
                                ? "border-secondary bg-secondary/5"
                                : "border-border"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => toggleService(service.id, service.price)}
                                  className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                                    selectedServices[service.id]
                                      ? "bg-secondary text-secondary-foreground"
                                      : "border border-border"
                                  }`}
                                >
                                  {selectedServices[service.id] && <Check className="w-4 h-4" />}
                                </button>
                                <span className="font-medium">{service.label}</span>
                              </div>
                              {selectedServices[service.id] && (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">₹</span>
                                  <input
                                    type="number"
                                    value={selectedServices[service.id]}
                                    onChange={(e) => updateServicePrice(service.id, e.target.value)}
                                    className="w-20 h-8 px-2 text-right rounded-lg bg-card border border-border focus:border-secondary outline-none"
                                  />
                                  <span className="text-sm text-muted-foreground">/hr</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex gap-3 mt-6">
                    {step > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(step - 1)}
                        className="gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="hero"
                      className="flex-1 gap-2"
                      disabled={!validateStep() || loading}
                    >
                      {loading ? "Creating account..." : step < 3 ? "Continue" : "Start Earning"}
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </Button>
                  </div>
                </form>

                {/* Login link */}
                <p className="text-center text-muted-foreground mt-6">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Log in
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

export default RegisterCaregiver;
