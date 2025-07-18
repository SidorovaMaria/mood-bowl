import React, { ReactNode } from "react";

const OnboardingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      Onboarding
      {children}
    </div>
  );
};

export default OnboardingLayout;
