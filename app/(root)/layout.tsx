import LandingNavbar from "@/components/landingPage/LandingNavbar";
import React, { ReactNode } from "react";

const LandingLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      {" "}
      <LandingNavbar />
      {children}
    </main>
  );
};

export default LandingLayout;
