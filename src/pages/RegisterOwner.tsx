import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  PawPrint,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Plus,
  X,
  Dog,
  Cat,
  Bird
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import ProfilePhotoUpload from "@/components/ProfilePhotoUpload";

// --- Zod Schema ---
const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  type: z.enum(["dog", "cat", "bird", "rabbit", "other"]),
  breed: z.string().min(1, "Breed is required"),
  age: z.string().optional(),
  weight: z.string().optional(),
  gender: z.enum(["male", "female"]),
  specialNeeds: z.string().optional(),
});

const registerOwnerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  city: z.string().min(2, "City is required"),
  pincode: z.string().length(6, "Pincode must be 6 digits"),
  accountType: z.enum(["free", "paid"]),
  avatarUrl: z.string().optional(),
  pets: z.array(petSchema).min(1, "Please add at least one pet"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterOwnerFormValues = z.infer<typeof registerOwnerSchema>;

const RegisterOwner = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPetForm, setShowPetForm] = useState(false);

  // --- Form Setup ---
  const form = useForm<RegisterOwnerFormValues>({
    resolver: zodResolver(registerOwnerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      city: "",
      pincode: "",
      accountType: "free",
      avatarUrl: "",
      pets: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "pets",
  });

  // Temporary state for the "Add Pet" modal/form section before appending to react-hook-form array
  const [tempPet, setTempPet] = useState<z.infer<typeof petSchema>>({
    name: "",
    type: "dog",
    breed: "",
    age: "",
    weight: "",
    gender: "male",
    specialNeeds: "",
  });

  const petTypes = [
    { id: "dog", label: "Dog", icon: Dog },
    { id: "cat", label: "Cat", icon: Cat },
    { id: "bird", label: "Bird", icon: Bird },
    { id: "rabbit", label: "Rabbit", icon: PawPrint },
    { id: "other", label: "Other", icon: PawPrint },
  ] as const;

  // --- Handlers ---
  const handleAddPet = () => {
    if (!tempPet.name || !tempPet.breed) {
      toast.error("Please fill in pet name and breed");
      return;
    }
    append(tempPet);
    setTempPet({
      name: "",
      type: "dog",
      breed: "",
      age: "",
      weight: "",
      gender: "male",
      specialNeeds: "",
    });
    setShowPetForm(false);
    toast.success("Pet added!");
  };

  const handleNextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await form.trigger(["firstName", "lastName", "email", "phone", "password", "confirmPassword"]);
    } else if (step === 2) {
      isValid = await form.trigger(["city", "pincode", "accountType"]);
    }

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const onSubmit = async (data: RegisterOwnerFormValues) => {
    setLoading(true);

    try {
      const { error } = await signUp(data.email, data.password, {
        full_name: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        role: 'owner',
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Update profile location
        await supabase
          .from('profiles')
          .update({
            city: data.city,
            pincode: data.pincode,
            avatar_url: data.avatarUrl,
          })
          .eq('id', user.id);

        // Add pets
        for (const pet of data.pets) {
          await supabase.from('pets').insert({
            owner_id: user.id,
            name: pet.name,
            pet_type: pet.type,
            breed: pet.breed,
            age: pet.age ? parseInt(pet.age) : null,
            weight: pet.weight ? parseFloat(pet.weight) : null,
            sex: pet.gender,
            special_needs: pet.specialNeeds || null,
          });
        }
      }

      toast.success("Account created successfully!");
      navigate("/dashboard/owner");
    } catch (err: any) {
      console.error(err);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // --- Animation Variants ---
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
        <title>Sign Up as Pet Owner - Create Your Account | PetPals</title>
      </Helmet>

      {/* We assume Navbar is in MainLayout, or we keep it here if not using MainLayout fully yet. 
            For this file, I'll remove Navbar since we added MainLayout in App.tsx 
        */}

      <div className="pt-24 pb-16 min-h-[calc(100vh-4rem)]">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`flex items-center ${s < 3 ? "flex-1" : ""}`}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors duration-300 ${s <= step
                        ? "gradient-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded transition-colors duration-300 ${s < step ? "bg-primary" : "bg-muted"
                          }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Account</span>
                <span>Location</span>
                <span>Pets</span>
              </div>
            </div>

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
                          <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
                          <p className="text-muted-foreground">Let's get you set up as a pet owner</p>
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
                                  <Input {...field} className="pl-10" placeholder="you@example.com" type="email" />
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
                                  <Input {...field} className="pl-10" placeholder="+91 98765 43210" type="tel" />
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
                                  <Input {...field} className="pl-10" placeholder="••••••••" type="password" />
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
                                  <Input {...field} className="pl-10" placeholder="••••••••" type="password" />
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
                          <h1 className="text-2xl font-bold mb-2">Where Are You Located?</h1>
                          <p className="text-muted-foreground">Help us find caregivers near you</p>
                        </div>

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

                        <FormField
                          control={form.control}
                          name="avatarUrl"
                          render={({ field }) => (
                            <FormItem className="pt-2">
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
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/30"
                                    }`}
                                >
                                  <p className="font-semibold mb-1">Free</p>
                                  <p className="text-sm text-muted-foreground">Up to 2 connections</p>
                                </div>
                                <div
                                  onClick={() => field.onChange("paid")}
                                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${field.value === "paid"
                                    ? "border-primary bg-primary/5"
                                    : "border-border hover:border-primary/30"
                                    }`}
                                >
                                  <p className="font-semibold mb-1">Premium <span className="text-primary">₹299/mo</span></p>
                                  <p className="text-sm text-muted-foreground">Unlimited contacts</p>
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
                          <h1 className="text-2xl font-bold mb-2">Add Your Pets</h1>
                          <p className="text-muted-foreground">Tell us about your furry friends</p>
                        </div>

                        {/* List of added pets */}
                        {fields.length > 0 && (
                          <div className="space-y-3 mb-4">
                            {fields.map((field, index) => (
                              <div key={field.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <PawPrint className="w-6 h-6 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-semibold">{field.name}</p>
                                    <p className="text-sm text-muted-foreground">{field.breed} • {field.gender}</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {form.formState.errors.pets && (
                          <p className="text-sm text-destructive font-medium text-center">
                            {form.formState.errors.pets.message}
                          </p>
                        )}

                        {/* Add Pet Form */}
                        {showPetForm ? (
                          <div className="p-4 bg-muted/30 rounded-xl space-y-4">
                            <div className="grid grid-cols-5 gap-2">
                              {petTypes.map((type) => (
                                <button
                                  key={type.id}
                                  type="button"
                                  onClick={() => setTempPet(prev => ({ ...prev, type: type.id as any }))}
                                  className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${tempPet.type === type.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card border border-border hover:border-primary/30"
                                    }`}
                                >
                                  <type.icon className="w-5 h-5" />
                                  <span className="text-xs">{type.label}</span>
                                </button>
                              ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-1 block">Pet Name</label>
                                <Input
                                  value={tempPet.name}
                                  onChange={e => setTempPet({ ...tempPet, name: e.target.value })}
                                  placeholder="Buddy"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1 block">Breed</label>
                                <Input
                                  value={tempPet.breed}
                                  onChange={e => setTempPet({ ...tempPet, breed: e.target.value })}
                                  placeholder="Golden Retriever"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium mb-1 block">Age</label>
                                <Input
                                  value={tempPet.age}
                                  onChange={e => setTempPet({ ...tempPet, age: e.target.value })}
                                  placeholder="3"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1 block">Weight</label>
                                <Input
                                  value={tempPet.weight}
                                  onChange={e => setTempPet({ ...tempPet, weight: e.target.value })}
                                  placeholder="kg"
                                />
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1 block">Gender</label>
                                <select
                                  value={tempPet.gender}
                                  onChange={e => setTempPet({ ...tempPet, gender: e.target.value as any })}
                                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                                >
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                </select>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button type="button" variant="outline" onClick={() => setShowPetForm(false)} className="flex-1">Cancel</Button>
                              <Button type="button" onClick={handleAddPet} className="flex-1">Add Pet</Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowPetForm(true)}
                            className="w-full gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add a Pet
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation */}
                  <div className="flex gap-3 mt-8">
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
                        {loading ? "Creating Account..." : "Create Account"}
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
      </div>
    </>
  );
};

export default RegisterOwner;
