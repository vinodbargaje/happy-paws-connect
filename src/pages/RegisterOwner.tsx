import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
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

type PetType = "dog" | "cat" | "bird" | "rabbit" | "other";

interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: string;
  weight: string;
  gender: "male" | "female";
  specialNeeds: string;
}

const RegisterOwner = () => {
  const navigate = useNavigate();
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
    accountType: "free" as "free" | "paid",
  });
  const [pets, setPets] = useState<Pet[]>([]);
  const [showPetForm, setShowPetForm] = useState(false);
  const [currentPet, setCurrentPet] = useState<Partial<Pet>>({
    type: "dog",
    gender: "male",
  });

  const petTypes = [
    { id: "dog", label: "Dog", icon: Dog },
    { id: "cat", label: "Cat", icon: Cat },
    { id: "bird", label: "Bird", icon: Bird },
    { id: "rabbit", label: "Rabbit", icon: PawPrint },
    { id: "other", label: "Other", icon: PawPrint },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePetInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setCurrentPet({ ...currentPet, [e.target.name]: e.target.value });
  };

  const addPet = () => {
    if (!currentPet.name || !currentPet.breed) {
      toast.error("Please fill in pet name and breed");
      return;
    }
    const newPet: Pet = {
      id: Date.now().toString(),
      name: currentPet.name || "",
      type: (currentPet.type as PetType) || "dog",
      breed: currentPet.breed || "",
      age: currentPet.age || "",
      weight: currentPet.weight || "",
      gender: (currentPet.gender as "male" | "female") || "male",
      specialNeeds: currentPet.specialNeeds || "",
    };
    setPets([...pets, newPet]);
    setCurrentPet({ type: "dog", gender: "male" });
    setShowPetForm(false);
    toast.success(`${newPet.name} added!`);
  };

  const removePet = (id: string) => {
    setPets(pets.filter((p) => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    // Final submission
    toast.success("Account created successfully!");
    navigate("/dashboard/owner");
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.firstName && formData.lastName && formData.email && formData.phone && formData.password;
    }
    if (step === 2) {
      return formData.city && formData.pincode;
    }
    return true;
  };

  return (
    <>
      <Helmet>
        <title>Sign Up as Pet Owner - Create Your Account | PetPals</title>
        <meta name="description" content="Create your free pet owner account on PetPals. Add your pets and start finding trusted caregivers today." />
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
                    <div
                      key={s}
                      className={`flex items-center ${s < 3 ? "flex-1" : ""}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                          s <= step
                            ? "gradient-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {s}
                      </div>
                      {s < 3 && (
                        <div
                          className={`flex-1 h-1 mx-2 rounded ${
                            s < step ? "bg-primary" : "bg-muted"
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

              {/* Form */}
              <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-soft">
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Account Info */}
                  {step === 1 && (
                    <div className="space-y-4 animate-slide-up">
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
                        <p className="text-muted-foreground">Let's get you set up as a pet owner</p>
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
                              className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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
                            className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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
                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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
                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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
                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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
                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Location */}
                  {step === 2 && (
                    <div className="space-y-4 animate-slide-up">
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">Where Are You Located?</h1>
                        <p className="text-muted-foreground">Help us find caregivers near you</p>
                      </div>

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
                            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
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
                          className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                          required
                        />
                      </div>

                      {/* Account Type */}
                      <div className="pt-4">
                        <label className="text-sm font-medium mb-3 block">Account Type</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div
                            onClick={() => setFormData({ ...formData, accountType: "free" })}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.accountType === "free"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/30"
                            }`}
                          >
                            <p className="font-semibold mb-1">Free</p>
                            <p className="text-sm text-muted-foreground">Up to 2 connections</p>
                          </div>
                          <div
                            onClick={() => setFormData({ ...formData, accountType: "paid" })}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              formData.accountType === "paid"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/30"
                            }`}
                          >
                            <p className="font-semibold mb-1">Premium <span className="text-primary">₹299/mo</span></p>
                            <p className="text-sm text-muted-foreground">Unlimited contacts</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Pets */}
                  {step === 3 && (
                    <div className="space-y-4 animate-slide-up">
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold mb-2">Add Your Pets</h1>
                        <p className="text-muted-foreground">Tell us about your furry friends</p>
                      </div>

                      {/* Added Pets */}
                      {pets.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {pets.map((pet) => (
                            <div
                              key={pet.id}
                              className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                  {pet.type === "dog" && <Dog className="w-6 h-6 text-primary" />}
                                  {pet.type === "cat" && <Cat className="w-6 h-6 text-primary" />}
                                  {pet.type === "bird" && <Bird className="w-6 h-6 text-primary" />}
                                  {(pet.type === "rabbit" || pet.type === "other") && (
                                    <PawPrint className="w-6 h-6 text-primary" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold">{pet.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {pet.breed} • {pet.age}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removePet(pet.id)}
                                className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Pet Form */}
                      {showPetForm ? (
                        <div className="p-4 bg-muted/30 rounded-xl space-y-4">
                          <div className="grid grid-cols-5 gap-2">
                            {petTypes.map((type) => (
                              <button
                                key={type.id}
                                type="button"
                                onClick={() => setCurrentPet({ ...currentPet, type: type.id as PetType })}
                                className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                                  currentPet.type === type.id
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
                              <label className="text-sm font-medium mb-1 block">Name</label>
                              <input
                                type="text"
                                name="name"
                                value={currentPet.name || ""}
                                onChange={handlePetInputChange}
                                placeholder="Buddy"
                                className="w-full h-10 px-3 rounded-lg bg-card border border-border focus:border-primary outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Breed</label>
                              <input
                                type="text"
                                name="breed"
                                value={currentPet.breed || ""}
                                onChange={handlePetInputChange}
                                placeholder="Golden Retriever"
                                className="w-full h-10 px-3 rounded-lg bg-card border border-border focus:border-primary outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Age</label>
                              <input
                                type="text"
                                name="age"
                                value={currentPet.age || ""}
                                onChange={handlePetInputChange}
                                placeholder="2 years"
                                className="w-full h-10 px-3 rounded-lg bg-card border border-border focus:border-primary outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Weight</label>
                              <input
                                type="text"
                                name="weight"
                                value={currentPet.weight || ""}
                                onChange={handlePetInputChange}
                                placeholder="15 kg"
                                className="w-full h-10 px-3 rounded-lg bg-card border border-border focus:border-primary outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1 block">Gender</label>
                              <select
                                name="gender"
                                value={currentPet.gender || "male"}
                                onChange={handlePetInputChange}
                                className="w-full h-10 px-3 rounded-lg bg-card border border-border focus:border-primary outline-none"
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-1 block">Special Needs (optional)</label>
                            <textarea
                              name="specialNeeds"
                              value={currentPet.specialNeeds || ""}
                              onChange={handlePetInputChange}
                              placeholder="Any medical conditions, allergies, or behavioral notes..."
                              rows={2}
                              className="w-full px-3 py-2 rounded-lg bg-card border border-border focus:border-primary outline-none resize-none"
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setShowPetForm(false)} className="flex-1">
                              Cancel
                            </Button>
                            <Button type="button" onClick={addPet} className="flex-1">
                              Add Pet
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowPetForm(true)}
                          className="w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Plus className="w-5 h-5" />
                          Add a Pet
                        </button>
                      )}

                      <p className="text-sm text-muted-foreground text-center">
                        You can add more pets later from your dashboard
                      </p>
                    </div>
                  )}

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
                    <Button
                      type="submit"
                      variant="hero"
                      className="flex-1 gap-2"
                      disabled={!validateStep()}
                    >
                      {step === 3 ? "Create Account" : "Continue"}
                      <ArrowRight className="w-4 h-4" />
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

export default RegisterOwner;
