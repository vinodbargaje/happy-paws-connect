import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { PawPrint, User, Briefcase, ArrowRight, Check } from "lucide-react";

const Register = () => {
  const [selectedRole, setSelectedRole] = useState<"owner" | "caregiver" | null>(null);

  const roles = [
    {
      id: "owner" as const,
      title: "Pet Owner",
      icon: User,
      description: "Find trusted caregivers for your furry friends",
      features: [
        "Search verified caregivers",
        "Book walks, sitting & more",
        "Real-time pet updates",
        "Secure payments",
      ],
      cta: "Find Care for Your Pet",
      href: "/register/owner",
    },
    {
      id: "caregiver" as const,
      title: "Pet Caregiver",
      icon: Briefcase,
      description: "Turn your love for pets into a rewarding career",
      features: [
        "Set your own schedule",
        "Choose your services",
        "Build your reputation",
        "Earn on your terms",
      ],
      cta: "Start Earning Today",
      href: "/register/caregiver",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Sign Up - Join PetPals as Pet Owner or Caregiver</title>
        <meta 
          name="description" 
          content="Create your free PetPals account. Sign up as a pet owner to find trusted caregivers, or join as a caregiver to start earning." 
        />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center">
                  <PawPrint className="w-8 h-8 text-primary-foreground" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Join the PetPals Family
                </h1>
                <p className="text-muted-foreground text-lg">
                  Choose how you'd like to use PetPals
                </p>
              </div>

              {/* Role Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                {roles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedRole === role.id
                        ? "border-primary bg-primary/5 shadow-medium"
                        : "border-border hover:border-primary/30 hover:shadow-soft"
                    }`}
                  >
                    {/* Selected indicator */}
                    {selectedRole === role.id && (
                      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center ${
                      role.id === "owner" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"
                    }`}>
                      <role.icon className="w-7 h-7" />
                    </div>

                    {/* Content */}
                    <h2 className="text-xl font-bold mb-2">{role.title}</h2>
                    <p className="text-muted-foreground mb-4">{role.description}</p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {role.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Button 
                      variant={selectedRole === role.id ? "default" : "outline"}
                      className="w-full"
                      asChild
                    >
                      <Link to={role.href}>
                        {role.cta}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>

              {/* Already have account */}
              <p className="text-center text-muted-foreground mt-8">
                Already have an account?{" "}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Register;
