import { z } from "zod";
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
