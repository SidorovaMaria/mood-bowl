import { Document, model, models, Schema, Types } from "mongoose";

export interface IMealItem {
  userId: Types.ObjectId;
  date: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foodItemId: Types.ObjectId;
  quantity: number; // Quantity of the food item consumed in serving Units
  calories?: number;
  protein?: number;
  carbs?: number;
  fats?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}
export interface IMealItemDoc extends IMealItem, Document {}
const MealItemSchema = new Schema<IMealItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: Date, required: true, index: true },
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner", "snack"],
      required: true,
    },
    foodItemId: {
      type: Schema.Types.ObjectId,
      ref: "FoodItem",
      required: true,
    },
    quantity: { type: Number, required: true }, // Quantity of the food item consumed in serving Units
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fats: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
// Pre Save Hook: calcualte nutrition snapshot based on the FoodItem and quanitiy
MealItemSchema.pre("save", async function (next) {
  const mealItem = this as IMealItemDoc;
  if (
    mealItem.isModified("quantity") ||
    mealItem.isModified("foodItemId") ||
    !mealItem.calories
  ) {
    const FoodItem = models.FoodItem;
    if (!FoodItem) return next(new Error("FoodItem model not found"));
    const food = await FoodItem.findById(mealItem.foodItemId);
    if (!food) return next(new Error("FoodItem not found"));
    const ratio = mealItem.quantity / food.servingSize;
    mealItem.calories = Number((food.caloriesPerServing * ratio).toFixed(0));
    mealItem.protein = food.proteinPerServing
      ? Number((food.proteinPerServing * ratio).toFixed(0))
      : undefined;
    mealItem.carbs = food.carbsPerServing
      ? Number((food.carbsPerServing * ratio).toFixed(0))
      : undefined;
    mealItem.fats = food.totalFatsPerServing
      ? Number((food.totalFatsPerServing * ratio).toFixed(0))
      : undefined;
    mealItem.fiber = food.fiberPerServing
      ? Number((food.fiberPerServing * ratio).toFixed(0))
      : undefined;
    mealItem.sugar = food.sugarPerServing
      ? Number((food.sugarPerServing * ratio).toFixed(0))
      : undefined;
    mealItem.sodium = food.sodiumPerServing
      ? Number((food.sodiumPerServing * ratio).toFixed(0))
      : undefined;
  }
  next();
});

const MealItem =
  models?.MealItem || model<IMealItem>("MealItem", MealItemSchema);
export default MealItem;
