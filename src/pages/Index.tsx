import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturedCaregiversSection from "@/components/home/FeaturedCaregiversSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>PetPals - Find Trusted Pet Caregivers Near You | Dog Walking, Pet Sitting & More</title>
        <meta 
          name="description" 
          content="Connect with verified pet caregivers in your neighborhood. Book dog walking, pet sitting, grooming, and overnight care services. Trusted by 50,000+ pet parents across India." 
        />
        <meta name="keywords" content="pet care, dog walking, pet sitting, pet grooming, pet caregivers, dog walker near me, pet sitter India" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <ServicesSection />
          <HowItWorksSection />
          <FeaturedCaregiversSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
