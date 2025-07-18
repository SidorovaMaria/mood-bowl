import { auth } from "@/auth";
import Navigation from "@/components/onboarding/Navigation";
import { OnboardingProvider } from "@/context/OnboardingContext";

import React, { ReactNode } from "react";

const OnboardingLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  const user = session?.user;
  return (
    <OnboardingProvider>
      <div className="min-h-screen min-w-screen flex flex-col lg:flex-row">
        <Navigation />
        <div className="flex flex-col justify-center items-center w-full  max-lg:mt-10 md:max-w-xl lg:max-w-2xl mx-auto">
          {children}
        </div>
      </div>
    </OnboardingProvider>
  );
};

export default OnboardingLayout;
