import { z } from "zod";

export const AccountSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "Name is required"),
  avatarURL: z.string().url("Invalid image URL").optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, "Provider is required"),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
});

export const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  avatarURL: z.string().optional(),
  isProfileComplete: z.boolean().default(false),
  sex: z.enum(["female", "male"], {
    message: "Invalid sex identification",
  }),
  birthDate: z.preprocess(
    (val) => {
      if (typeof val === "string") return new Date(val);
      return val;
    },
    z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
  ),
  preferences: z.object({
    trackMood: z.boolean().default(true),
    trackMeals: z.boolean().default(true),
  }),
  fitnessGoals: z
    .object({
      dietType: z
        .enum(["vegan", "vegetarian", "paleo", "keto", "balanced"], {
          message: "Invalid diet type",
        })
        .default("balanced")
        .optional(),
      heightCm: z.number().optional(),
      goal: z
        .enum(["maintain", "lose", "gain"], {
          message: "Invalid fitness goal",
        })
        .optional(),
      currentWeightKg: z
        .number()
        .positive("Current weight must be a positive integer")
        .min(1, "Current weight is required")
        .optional(),
      targetWeightKg: z
        .number()
        .positive("Target weight must be a positive integer")
        .min(1, "Target weight is required")
        .optional(),
      activityLevel: z
        .enum(["sedentary", "light", "moderate", "active", "very_active"], {
          message: "Invalid activity level",
        })
        .optional(),
      calorieOverride: z.number().int().optional(),
    })
    .optional(),
  mentalHealthGoals: z
    .object({
      meditationMinutesPerDay: z.number().optional(),
      journalingFrequency: z.enum(["daily", "weekly", "monthly"]),
      journalingDayOfTheWeek: z
        .enum([
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ])
        .optional(),
      journalingDayOfTheMonth: z
        .number()
        .int()
        .min(1, "Day of the month must be between 1 and 28")
        .max(28, "Day of the month must be between 1 and 28")
        .optional(),
      gratitudeEntriesPerDay: z.number().optional(),
    })
    .optional(),
});

export const SignInWithOAuthSchema = z.object({
  provider: z.enum(["google"]),
  providerAccountId: z.string().min(1, "Provider account ID is required"),
  user: z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    avatarURL: z.string().url("Invalid image URL").optional(),
  }),
});
export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});
export const SignUpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." })
      .max(100, { message: "Password cannot exceed 100 characters." })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter.",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter.",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number." })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character.",
      }),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const getUserSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

export const updateUserSchema = UserSchema.pick({
  sex: true,
  birthDate: true,
  isProfileComplete: true,
  preferences: true,
});

export const createFoodItemSchema = z.object({
  name: z.string().min(1, "Oops! Name can't be empty."),
  brand: z.string().optional(),
  category: z.string().optional(),
  servingSize: z.number().positive("Hmm, serving size must be more than zero."),
  servingUnit: z.string().min(1, "What's the unit? (e.g. g, ml)"),
  caloriesPerServing: z
    .number()
    .min(1, "We need to know the calories, Not burning them!"),
  proteinPerServing: z.number().optional(),
  carbsPerServing: z.number().optional(),
  totalFatsPerServing: z.number().optional(),
  saturatedFatsPerServing: z.number().optional(),
  fiberPerServing: z.number().optional(),
  sugarPerServing: z.number().optional(),
  sodiumPerServing: z.number().optional(),
  userId: z.string().optional(), // Optional, if the food item is user-specific
});
export const GetFoodItemsSchema = z.object({
  query: z.string().optional(),
});

export const AddMealItemsSchema = z.object({
  date: z.preprocess(
    (val) => {
      if (typeof val === "string") return new Date(val);
      return val;
    },
    z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
  ),
  mealType: z.enum([
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "beverage",
    "other",
  ]),
  foodItemId: z.string().min(1, "Food item ID is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export const updateMealItemSchema = z.object({
  mealItemId: z.string().min(1, "Meal item ID is required"),
  date: z.preprocess(
    (val) => {
      if (typeof val === "string") return new Date(val);
      return val;
    },
    z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
  ),
  mealType: z.enum([
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "beverage",
    "other",
  ]),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});
export const getMealItemsSchema = z.object({
  date: z.preprocess(
    (val) => {
      if (typeof val === "string") return new Date(val);
      return val;
    },
    z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
  ),
});

export const getNutritionByDateSchema = z.object({
  date: z.preprocess(
    (val) => {
      if (typeof val === "string") return new Date(val);
      return val;
    },
    z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
  ),
});
export const getDailyDiaryByDateSchema = z.object({
  date: z.preprocess(
    (val) => {
      if (typeof val === "string") return new Date(val);
      return val;
    },
    z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
  ),
  meditationMinutes: z.number().int().optional().default(0),
});

export const deleteMealItemSchema = z.object({
  mealItemId: z.string().min(1, "Meal item ID is required"),
});

export const UpdateMeditationSchema = z.object({
  date: z.date(),

  minutesCompleted: z.number().int().optional(),
});
export const newJournalEntrySchema = z.object({
  date: z.preprocess(
    (val) => {
      if (typeof val === "string") return new Date(val);
      return val;
    },
    z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date format",
    })
  ),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  content: z.string().min(1, "Content is required"),
  tags: z
    .array(z.string().min(1, "Tag cannot be empty").max(20, "Tag is too long"))
    .max(5, "You can add up to 5 tags")
    .optional(),
  moodAtEntry: z.string().min(1, "Mood is required"), // Should be one of the defined moods
});
