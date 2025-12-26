import { Link } from "react-router-dom";
import { 
  Dog, 
  Home, 
  Scissors, 
  Moon, 
  Stethoscope, 
  Car,
  Camera,
  GraduationCap
} from "lucide-react";

const services = [
  {
    icon: Dog,
    title: "Dog Walking",
    description: "Daily walks to keep your pup healthy and happy",
    href: "/search?service=walking",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Home,
    title: "Pet Sitting",
    description: "In-home care while you're away",
    href: "/search?service=sitting",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: Scissors,
    title: "Grooming",
    description: "Bath, trim, and spa treatments",
    href: "/search?service=grooming",
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    icon: Moon,
    title: "Overnight Care",
    description: "24/7 supervision and love",
    href: "/search?service=overnight",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Stethoscope,
    title: "Medical Care",
    description: "Medication administration & vet visits",
    href: "/search?service=medical",
    color: "bg-destructive/10 text-destructive",
  },
  {
    icon: Car,
    title: "Pet Taxi",
    description: "Safe transport to vet or groomer",
    href: "/search?service=transport",
    color: "bg-secondary/10 text-secondary",
  },
  {
    icon: GraduationCap,
    title: "Training",
    description: "Basic obedience and behavior training",
    href: "/search?service=training",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Camera,
    title: "Photo Updates",
    description: "Real-time photos and videos of your pet",
    href: "/search?service=updates",
    color: "bg-accent/20 text-accent-foreground",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything Your Pet Needs
          </h2>
          <p className="text-muted-foreground">
            From daily walks to overnight care, find the perfect service for your furry friend
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={service.href}
              className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-medium transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`w-14 h-14 rounded-xl ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
