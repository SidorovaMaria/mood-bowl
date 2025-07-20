interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignInWithOAuthParams {
  provider: "google";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    avatarURL: string;
  };
}

interface updateUserParams {
  name?: string;
  username?: string;
  sex?: string;
  birthDate?: Date;
  isProfileComplete?: boolean;
  preferences?: {
    trackMood?: boolean;
    trackMeals?: boolean;
  };
  fitnessGoals?: {
    dietType?: "vegan" | "vegetarian" | "paleo" | "keto" | "balanced";
    heightCm?: number; // in cm
    goal?: "maintain" | "lose" | "gain";
    currentWeightKg?: number;
    targetWeightKg?: number;
    activityLevel?:
      | "sedentary"
      | "light"
      | "moderate"
      | "active"
      | "very_active";
    calorieOverride?: number; // Optional override for daily calorie intake
  };
  mentalHealthGoals?: {
    meditationMinutesPerDay?: number;
    journalingFrequency?: "daily" | "weekly" | "monthly";
    journalingDayOfTheWeek?: string;
    journalingDayOfTheMonth?: number; // Required if journalingFrequency is "monthly", value: 1-28
    gratitudeEntriesPerDay?: number;
  };
}
