import { Document, model, models, Schema, Types } from "mongoose";

export interface IFoodItem {
	name: string;
	brand?: string;
	category?: string;
	servingSize: number;
	servingUnit: string;
	caloriesPerServing: number;
	proteinPerServing?: number;
	carbsPerServing?: number;
	fatsPerServing?: number;
	fiberPerServing?: number;
	sugarPerServing?: number;
	sodiumPerServing?: number;
	userId?: Types.ObjectId; // Optional, if the food item is user-specific
}
export interface IFoodItemDoc extends IFoodItem, Document {}
const FoodItemSchema = new Schema<IFoodItem>(
	{
		name: { type: String, required: true },
		brand: { type: String },
		category: { type: String },
		servingSize: { type: Number, required: true },
		servingUnit: { type: String, required: true },
		caloriesPerServing: { type: Number, required: true },
		proteinPerServing: { type: Number },
		carbsPerServing: { type: Number },
		fatsPerServing: { type: Number },
		fiberPerServing: { type: Number },
		sugarPerServing: { type: Number },
		sodiumPerServing: { type: Number },
		userId: { type: Types.ObjectId, ref: "User" }, // Optional reference to User
	},
	{
		timestamps: true,
	}
);
const FoodItem = models?.FoodItem || model<IFoodItem>("FoodItem", FoodItemSchema);
export default FoodItem;
