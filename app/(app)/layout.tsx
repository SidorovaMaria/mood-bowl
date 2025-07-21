import NavBar from "@/components/main-application/NavBar";
import MobileNavBar from "@/components/main-application/NavBar/MobileNavBar";
import React, { ReactNode } from "react";

const UserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <NavBar />
      <div className="lg:pt-20 py-8 max-sm:px-4 container lg:max-w-6xl mx-auto">
        {children}
      </div>
      <MobileNavBar />
    </main>
  );
};

export default UserLayout;
