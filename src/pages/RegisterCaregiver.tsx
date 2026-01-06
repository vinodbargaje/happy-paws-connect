import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";

const servicesList = [
  { id: "walking", label: "Dog Walking", price: "300" },
  { id: "sitting", label: "Pet Sitting", price: "500" },
  { id: "overnight", label: "Overnight Care", price: "800" },
  { id: "grooming", label: "Grooming", price: "600" },
  { id: "training", label: "Training", price: "700" },
  { id: "medical", label: "Medical Care", price: "400" },
  { id: "transport", label: "Pet Taxi", price: "350" },
  { id: "dropin", label: "Drop-in Visits", price: "250" },
];

const registerCaregiverSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  city: z.string().min(2, "City is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  serviceRadius: z.string(),
  experience: z.string().min(1, "Please select your experience"),
  bio: z.string().optional(),
  accountType: z.enum(["free", "paid"]),
  avatarUrl: z.string().optional(),
  // We handle services manually in the form for better UI control, but we validate at submit
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterCaregiverFormValues = z.infer<typeof registerCaregiverSchema>;

const RegisterCaregiver = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<Record<string, string>>({});

  const form = useForm<RegisterCaregiverFormValues>({
    resolver: zodResolver(registerCaregiverSchema),
    defaultValues: {
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
      accountType: "free",
      avatarUrl: "",
    },
    mode: "onChange",
  });

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

  const handleNextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(["firstName", "lastName", "email", "phone", "password", "confirmPassword"]);
    } else if (step === 2) {
      isValid = await form.trigger(["city", "pincode", "serviceRadius", "experience", "bio", "accountType"]);
    } else if (step === 3) {
      // Validate services
      if (Object.keys(selectedServices).length === 0) {
        toast.error("Please select at least one service");
        return;
      }
      isValid = true;
    }

    if (isValid) {
      if (step < 3) setStep((prev) => prev + 1);
    }
  };

  const onSubmit = async (data: RegisterCaregiverFormValues) => {
    if (Object.keys(selectedServices).length === 0) {
      toast.error("Please select at least one service");
      return;
    }

    setLoading(true);

    try {
      // Parse experience to years
      let yearsExp = 0;
      if (data.experience === "< 1 year") yearsExp = 0;
      else if (data.experience === "1-2 years") yearsExp = 1;
      else if (data.experience === "3-5 years") yearsExp = 3;
      else if (data.experience === "5+ years") yearsExp = 5;

      // Sign up
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: `${data.firstName} ${data.lastName}`,
            phone: data.phone,
            role: 'caregiver',
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          toast.error("This email is already registered. Please log in instead.");
        } else {
          toast.error(signUpError.message || "Failed to create account");
        }
        setLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error("Failed to create account. Please try again.");
        setLoading(false);
        return;
      }

      const userId = authData.user.id;
      // Wait briefly for trigger
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          city: data.city,
          pincode: data.pincode,
          avatar_url: data.avatarUrl,
        })
        .eq('id', userId);

      if (profileError) console.error("Profile update error:", profileError);

      // Update caregiver profile
      const { data: caregiverProfile, error: caregiverError } = await supabase
        .from('caregiver_profiles')
        .update({
          bio: data.bio || null,
          years_experience: yearsExp,
          service_radius: parseInt(data.serviceRadius),
          services_offered: Object.keys(selectedServices).map(id =>
            servicesList.find(s => s.id === id)?.label || id
          ),
          hourly_rate: Math.min(...Object.values(selectedServices).map(p => parseFloat(p) || 300)),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (caregiverError) console.error("Caregiver profile update error:", caregiverError);

      // Save individual services
      if (caregiverProfile) {
        const serviceEntries = Object.entries(selectedServices).map(([serviceId, price]) => ({
          caregiver_id: caregiverProfile.id,
          service_name: servicesList.find(s => s.id === serviceId)?.label || serviceId,
          hourly_rate: parseFloat(price) || 0,
        }));

        if (serviceEntries.length > 0) {
          const { error: servicesError } = await supabase
            .from('caregiver_services')
            .insert(serviceEntries);

          if (servicesError) console.error("Services error:", servicesError);
        }
      }

      toast.success("Account created! Welcome to PetPals.");
      navigate("/dashboard/caregiver");

    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <>
      <Helmet>
        <title>Become a Pet Caregiver - Join PetPals | Earn Caring for Pets</title>
        <meta name="description" content="Join PetPals as a pet caregiver. Set your own schedule, choose your services, and start earning by doing what you love - caring for pets." />
      </Helmet>

      <div className="bg-background">
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className={`flex items-center ${s < 3 ? "flex-1" : ""}`}>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors duration-300 ${s <= step
                          ? "gradient-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground"
                          }`}
                      >
                        {s}
                      </div>
                      {s < 3 && (
                        <div className={`flex-1 h-1 mx-2 rounded transition-colors duration-300 ${s < step ? "bg-secondary" : "bg-muted"}`} />
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
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft overflow-hidden">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <AnimatePresence mode="wait" initial={false} custom={step}>
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          custom={step}
                          variants={variants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="text-center mb-6">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-xl gradient-secondary flex items-center justify-center">
                              <Briefcase className="w-7 h-7 text-secondary-foreground" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Become a Caregiver</h1>
                            <p className="text-muted-foreground">Start your pet care journey</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                      <Input {...field} className="pl-10" placeholder="John" />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Doe" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input {...field} className="pl-10" type="email" placeholder="you@example.com" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input {...field} className="pl-10" type="tel" placeholder="+91 98765 43210" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input {...field} className="pl-10" type="password" placeholder="••••••••" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input {...field} className="pl-10" type="password" placeholder="••••••••" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div
                          key="step2"
                          custom={step}
                          variants={variants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold mb-2">Build Your Profile</h1>
                            <p className="text-muted-foreground">Help pet owners find you</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="city"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>City</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                      <Input {...field} className="pl-10" placeholder="Mumbai" />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="pincode"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Pincode</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="400001" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="serviceRadius"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Service Radius</FormLabel>
                                  <div className="relative">
                                    <select
                                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                      {...field}
                                    >
                                      <option value="2">2 km</option>
                                      <option value="5">5 km</option>
                                      <option value="10">10 km</option>
                                      <option value="15">15 km</option>
                                      <option value="20">20+ km</option>
                                    </select>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="experience"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Experience</FormLabel>
                                  <div className="relative">
                                    <select
                                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                                      {...field}
                                    >
                                      <option value="">Select</option>
                                      <option value="< 1 year">&lt; 1 year</option>
                                      <option value="1-2 years">1-2 years</option>
                                      <option value="3-5 years">3-5 years</option>
                                      <option value="5+ years">5+ years</option>
                                    </select>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>About You</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder="Tell pet owners why they should trust you..."
                                    className="resize-none"
                                    rows={4}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Profile Photo Upload */}
                          <FormField
                            control={form.control}
                            name="avatarUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Profile Photo</FormLabel>
                                <FormControl>
                                  <ProfilePhotoUpload
                                    currentUrl={field.value}
                                    onUpload={(url) => field.onChange(url)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="pt-4">
                            <FormLabel className="mb-3 block">Account Type</FormLabel>
                            <FormField
                              control={form.control}
                              name="accountType"
                              render={({ field }) => (
                                <div className="grid grid-cols-2 gap-4">
                                  <div
                                    onClick={() => field.onChange("free")}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${field.value === "free"
                                      ? "border-secondary bg-secondary/5"
                                      : "border-border hover:border-secondary/30"
                                      }`}
                                  >
                                    <p className="font-semibold mb-1">Free</p>
                                    <p className="text-sm text-muted-foreground">Up to 2 leads/month</p>
                                  </div>
                                  <div
                                    onClick={() => field.onChange("paid")}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${field.value === "paid"
                                      ? "border-secondary bg-secondary/5"
                                      : "border-border hover:border-secondary/30"
                                      }`}
                                  >
                                    <p className="font-semibold mb-1">Pro <span className="text-secondary">₹499/mo</span></p>
                                    <p className="text-sm text-muted-foreground">Unlimited leads</p>
                                  </div>
                                </div>
                              )}
                            />
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div
                          key="step3"
                          custom={step}
                          variants={variants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold mb-2">Your Services</h1>
                            <p className="text-muted-foreground">Select what you offer and set your prices</p>
                          </div>

                          <div className="space-y-3">
                            {servicesList.map((service) => (
                              <div
                                key={service.id}
                                className={`p-4 rounded-xl border-2 transition-all ${selectedServices[service.id]
                                  ? "border-secondary bg-secondary/5"
                                  : "border-border"
                                  }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={() => toggleService(service.id, service.price)}
                                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${selectedServices[service.id]
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
                                      <Input
                                        type="number"
                                        value={selectedServices[service.id]}
                                        onChange={(e) => updateServicePrice(service.id, e.target.value)}
                                        className="w-20 h-8 px-2 text-right"
                                      />
                                      <span className="text-sm text-muted-foreground">/hr</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

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
                      {step < 3 ? (
                        <Button
                          type="button"
                          variant="hero"
                          className="flex-1 gap-2"
                          onClick={handleNextStep}
                        >
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="hero"
                          className="flex-1 gap-2"
                          disabled={loading}
                        >
                          {loading ? "Creating account..." : "Start Earning"}
                          {!loading && <ArrowRight className="w-4 h-4" />}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>

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
