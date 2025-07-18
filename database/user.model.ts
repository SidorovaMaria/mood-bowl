import { Document, model, models, Schema } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  avatarURL?: string;
  sex: "female" | "male" | "unknown";
  birthDate: Date;
  isProfileComplete?: boolean;
  preferences: {
    trackMood: boolean;
    trackMeals: boolean;
  };

  fitnessGoals?: {
    dietType: "vegan" | "vegetarian" | "paleo" | "keto" | "balanced";
    heightCm: number; // in cm
    goal: "maintain" | "lose" | "gain";
    currentWeightKg: number;
    targetWeightKg: number;
    activityLevel:
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
    journalingDayOfTheWeek?: string[]; // Required if journalingFrequency is "weekly", values: "Monday"..."Sunday"
    journalingDayOfTheMonth?: number; // Required if journalingFrequency is "monthly", value: 1-28
    gratitudeEntriesPerDay?: number;
  };
}

export interface IUserDoc extends IUser, Document {}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    avatarURL: { type: String },
    sex: {
      type: String,
      enum: ["female", "male", "unknown"],
      default: "unknown",
    },
    birthDate: { type: Date, required: true },
    isProfileComplete: { type: Boolean, default: false },
    preferences: {
      trackMood: { type: Boolean, default: true },
      trackMeals: { type: Boolean, default: true },
    },
    fitnessGoals: {
      dietType: {
        type: String,
        enum: ["vegan", "vegetarian", "paleo", "keto", "balanced"],
      },
      heightCm: { type: Number }, // in cm
      goal: {
        type: String,
        enum: ["maintain", "lose", "gain"],
      },
      currentWeightKg: { type: Number },
      targetWeightKg: { type: Number },
      activityLevel: {
        type: String,
        enum: ["sedentary", "light", "moderate", "active", "very_active"],
      },
      calorieOverride: { type: Number }, // Optional override for daily calorie intake
    },
    mentalHealthGoals: {
      meditationMinutesPerDay: { type: Number },
      journalingFrequency: {
        type: String,
        enum: ["daily", "weekly", "monthly"],
      },
      journalingDayOfTheWeek: {
        type: [String],
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
      journalingDayOfTheMonth: { type: Number, min: 1, max: 28 }, // Required if journalingFrequency is "monthly"
      gratitudeEntriesPerDay: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

//Pre-validation middleware to enforce conditional required fields
UserSchema.pre("validate", function (next) {
  if (this.preferences?.trackMeals) {
    const fg: IUser["fitnessGoals"] =
      this.fitnessGoals || ({} as IUser["fitnessGoals"]);
    const requiredFields: (keyof NonNullable<IUser["fitnessGoals"]>)[] = [
      "dietType",
      "heightCm",
      "goal",
      "currentWeightKg",
      "targetWeightKg",
      "activityLevel",
    ];
    for (const field of requiredFields) {
      const value = fg ? fg[field] : undefined;
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return next(
          new Error(`Field ${field} is required when trackMeals is true`)
        );
      }
    }
  }
  if (this.preferences?.trackMood) {
    const mhg: IUser["mentalHealthGoals"] =
      this.mentalHealthGoals || ({} as IUser["mentalHealthGoals"]);
    const requiredFields: (keyof NonNullable<IUser["mentalHealthGoals"]>)[] = [
      "meditationMinutesPerDay",
      "journalingFrequency",
      "gratitudeEntriesPerDay",
    ];
    for (const field of requiredFields) {
      const value = mhg ? mhg[field] : undefined;
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return next(
          new Error(`Field ${field} is required when trackMood is true`)
        );
      }
    }
  }
  if (this.preferences.trackMood) {
    if (
      this.mentalHealthGoals?.journalingFrequency === "weekly" &&
      (!this.mentalHealthGoals.journalingDayOfTheWeek ||
        this.mentalHealthGoals.journalingDayOfTheWeek.length === 0)
    ) {
      return next(
        new Error(
          "journalingDayOfTheWeek is required when journalingFrequency is 'weekly'"
        )
      );
    }
    if (
      this.mentalHealthGoals?.journalingFrequency === "monthly" &&
      (this.mentalHealthGoals.journalingDayOfTheMonth === undefined ||
        this.mentalHealthGoals.journalingDayOfTheMonth < 1 ||
        this.mentalHealthGoals.journalingDayOfTheMonth > 28)
    ) {
      return next(
        new Error(
          "journalingDayOfTheMonth must be between 1 and 28 when journalingFrequency is 'monthly'"
        )
      );
    }
  }
  next();
});
const User = models?.User || model<IUser>("User", UserSchema);
export default User;
