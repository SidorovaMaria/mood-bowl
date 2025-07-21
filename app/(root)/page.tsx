import { auth, signOut } from "@/auth";
import CTASection from "@/components/landingPage/CTASection";
import FeaturesSection from "@/components/landingPage/FeaturesSection";
import Footer from "@/components/landingPage/Footer";
import HeroSection from "@/components/landingPage/HeroSection";
import Image from "next/image";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />

      {userId && (
        <form
          action={async () => {
            "use server";

            await signOut();
          }}
        >
          <button type="submit" className="bg-red-400 text-white">
            <span className="">Logout</span>
          </button>
        </form>
      )}
    </>
  );
}
