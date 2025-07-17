import { auth, signOut } from "@/auth";
import FeaturesSection from "@/components/landingPage/FeaturesSection";
import HeroSection from "@/components/landingPage/HeroSection";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  console.log("Session:", session);
  const userId = session?.user?.id;
  console.log("User ID:", userId);
  return (
    <>
      <HeroSection />
      <FeaturesSection />

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
