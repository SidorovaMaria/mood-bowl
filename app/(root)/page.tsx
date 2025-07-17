import { auth, signOut } from "@/auth";
import CTASection from "@/components/landingPage/CTASection";
import FeaturesSection from "@/components/landingPage/FeaturesSection";
import Footer from "@/components/landingPage/Footer";
import HeroSection from "@/components/landingPage/HeroSection";
import Image from "next/image";

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
