import { auth } from "@/auth";
import Image from "next/image";
import React from "react";

const OnboardingPage = async () => {
  const session = await auth();
  console.log("Session:", session);

  return <div>OnBoardingPAge</div>;
};

export default OnboardingPage;
