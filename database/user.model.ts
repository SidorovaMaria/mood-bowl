import { Document, model, models, Schema } from "mongoose";

export interface IUser {
   name: string;
	username: string;
	email: string;
	avatarURL?: string;
	sex: "female" | "male";
	birthDate: Date;
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
		activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
		calorieOverride?: number; // Optional override for daily calorie intake
	};
	mentalHealthGoals?: {
		meditationMinutesPerDay?: number;
		journalingFrequency?: "daily" | "weekly" | "monthly";
		gratitudeEntriesPerDay?: number;
	}; 

}

export interface IUserDoc extends IUser , Document{}

const UserSchema = new Schema<IUser>(
	{
		name: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		avatarURL: { type: String },
		sex: { type: String, enum: ["female", "male"], required: true },
		birthDate: { type: Date, required: true },
		preferences: {
			trackMood: { type: Boolean, default: true },
			trackMeals: { type: Boolean, default: true },
		},
		fitnessGoals: {
			dietType: {
				type: String,
				enum: ["vegan", "vegetarian", "paleo", "keto", "balanced"],
				required: true,
			},
			heightCm: { type: Number, required: true }, // in cm
			goal: { type: String, enum: ["maintain", "lose", "gain"], required: true },
			currentWeightKg: { type: Number, required: true },
			targetWeightKg: { type: Number, required: true },
			activityLevel: {
				type: String,
				enum: ["sedentary", "light", "moderate", "active", "very_active"],
				required: true,
			},
			calorieOverride: { type: Number, default: null }, // Optional override for daily calorie intake
		},
		mentalHealthGoals: {
			meditationMinutesPerDay: { type: Number, default: 0 },
			journalingFrequency: {
				type: String,
				enum: ["daily", "weekly", "monthly"],
				default: "daily",
			},
			gratitudeEntriesPerDay: { type: Number, default: 3 },
		},
	},
	{
		timestamps: true,
	}
);

const User = models?.User || model<IUser>("User", UserSchema);
export default User;