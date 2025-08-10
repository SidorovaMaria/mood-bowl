import { auth } from "@/auth";
import NavBar from "@/components/main-application/NavBar";
import MobileNavBar from "@/components/main-application/NavBar/MobileNavBar";
import ButtonSlide from "@/components/myUi/ButtonSlide";
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import React, { ReactNode } from "react";

const UserLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen text-center px-4">
        <div className="space-y-6 max-w-md">
          <div className="text-5xl animate-bounce text-yellow-500 mx-auto w-fit">
            <Frown size={48} />
          </div>
          <h1 className="text-2xl font-bold">
            Oops! You need to be signed in!!!
          </h1>
          <p className="text-sm text-muted-foreground">
            This part of Mood Bowl is for members only. Let’s get you signed in
            so you can continue your journey!
          </p>
          <div className="flex justify-center">
            <ButtonSlide text="Go to Sign In" link="/sign-in" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <main>
      <NavBar />
      <div className="lg:py-20 py-8 pb-26 ">{children}</div>
      <MobileNavBar />
    </main>
  );
};

export default UserLayout;
