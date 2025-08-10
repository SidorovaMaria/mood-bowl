"use client";
import React from "react";

// import { useParams } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";

const Navigation = () => {
  // const { stepId } = useParams();
  const { data } = useOnboarding();
  console.log(data);
  return (
    <div className="lg:min-h-screen w-full lg:w-1/3 bg-gradient-to-b from-primary to-accent text-background-light max-lg:rounded-b-4xl lg:rounded-r-4xl relative flex flex-col items-center justify-center p-8">
      <header className="">
        <h1 className="text-[min(3vw,32px)] font-bold text-center leading-snug mb-4">
          Hey There!
          <br /> Welcome to MooDBowl!
        </h1>
        <p className="max-w-xl text-sm text-center text-background/80">
          This is your space to reflect, breathe, and grow.
          <br /> Let’s start with a few basics to personalize your wellness
          journey.
        </p>
      </header>
    </div>
  );
};

export default Navigation;
