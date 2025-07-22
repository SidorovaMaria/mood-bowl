import CTASection from "@/components/landingPage/CTASection";
import FeaturesSection from "@/components/landingPage/FeaturesSection";
import Footer from "@/components/landingPage/Footer";
import HeroSection from "@/components/landingPage/HeroSection";

export default async function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </>
  );
}
