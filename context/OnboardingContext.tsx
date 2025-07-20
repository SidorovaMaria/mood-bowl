"use client";

import { createContext, useContext, useState } from "react";

type OnboardingData = {
  preference?: {
    trackMood?: boolean;
    trackMeals?: boolean;
  };
  sex?: string;
  birthDate?: Date;
  fitnessGoals?: {
    dietType?: "vegan" | "vegetarian" | "paleo" | "keto" | "balanced";
    heightCm?: number;
    goal?: "maintain" | "lose" | "gain";
    currentWeightKg?: number;
    targetWeightKg?: number;
    activityLevel?:
      | "sedentary"
      | "light"
      | "moderate"
      | "active"
      | "very_active";
    calorieOverride?: number;
  };
  mentalHealthGoals?: {
    meditationMinutesPerDay?: number;
    journalingFrequency?: "daily" | "weekly" | "monthly";
    journalingDayOfTheWeek?: string;
    journalingDayOfTheMonth?: number;
    gratitudeEntriesPerDay?: number;
  };
};

const OnboardingContext = createContext<{
  data: OnboardingData;
  setData: React.Dispatch<React.SetStateAction<OnboardingData>>;
}>({
  data: {},
  setData: () => {},
});
export const useOnboarding = () => useContext(OnboardingContext);
export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<OnboardingData>({});

  return (
    <OnboardingContext.Provider value={{ data, setData }}>
      {children}
    </OnboardingContext.Provider>
  );
};
