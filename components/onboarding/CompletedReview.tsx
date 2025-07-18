"use client";
import { useOnboarding } from "@/context/OnboardingContext";
import React from "react";

const CompletedReview = () => {
  const { data, setData } = useOnboarding();
  console.log("Onboarding Data:", data);

  return <div>CompletedReview</div>;
};

export default CompletedReview;
