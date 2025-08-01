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
    journalingFrequency?: "daily" | "weekly" | "monthly" | "never";
    journalingDayOfTheWeek?: string;
    journalingDayOfTheMonth?: number; // Required if journalingFrequency is "monthly", value: 1-28
    gratitudeEntriesPerDay?: number;
  };
}
interface newFoodItemParams {
  name: string;
  brand?: string;
  category?: string;
  servingSize: number; // in grams
  servingUnit: string; // e.g., "g", "oz", "ml"
  caloriesPerServing: number;
  proteinPerServing?: number;
  carbsPerServing?: number;
  totalFatsPerServing?: number;
  saturatedFatsPerServing?: number;
  fiberPerServing?: number;
  sugarPerServing?: number;
  sodiumPerServing?: number;
  userId?: string; // Optional, if the food item is user-specific
}

interface AddMealItemsParams {
  date: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack" | "beverage" | "other";
  foodItemId: string; // ID of the food item
  quantity: number; // Quantity of the food item consumed in serving units
}

interface updateMealItemsParams {
  date: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack" | "beverage" | "other";
  quantity: number; // Quantity of the food item consumed in serving units
  mealItemId: string; // ID of the meal item to update
}
interface getMealItemParams {
  date: Date;
}
interface newJournalEntryParams {
  date: Date;
  title: string;
  content: string;
  tags?: string[];
  moodAtEntry: string;
}
