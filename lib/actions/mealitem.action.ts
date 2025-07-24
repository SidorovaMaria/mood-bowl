"use server";

import MealItem, { IMealItemDoc } from "@/database/mealitem.model";
import {
  AddMealItemsSchema,
  getMealItemsSchema,
  getNutritionByDateSchema,
} from "../validation";
import { UnauthorizedError } from "../http-errors";
import handleError from "../errors";
import mongoose from "mongoose";
import action from "../action";
import { revalidatePath } from "next/cache";

export interface MealItemWithFoodDetails
  extends Omit<IMealItemDoc, "foodItemId"> {
  foodItemId: {
    name: string;
    brand?: string;
    category?: string;
  };
}
export async function getMealItems(
  params: getMealItemParams
): Promise<ActionResponse<{ foodLogged: MealItemWithFoodDetails[] }>> {
  const validationResult = await action({
    params,
    schema: getMealItemsSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { user } = validationResult.session!;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const startOfDay = new Date(params.date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(params.date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const mealItems = await MealItem.find({
      userId: user.id,
      date: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate({
        path: "foodItemId",
        select: "name brand",
      })
      .session(session);
    await session.commitTransaction();
    return {
      success: true,
      data: {
        foodLogged: JSON.parse(JSON.stringify(mealItems)),
      },
      status: 200,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function addMealItem(
  params: AddMealItemsParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: AddMealItemsSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { user } = validationResult.session!;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  const startOfDay = new Date(params.date);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(params.date);
  endOfDay.setUTCHours(23, 59, 59, 999);
  try {
    const mealItemExists = await MealItem.findOne({
      userId: user.id,
      date: { $gte: startOfDay, $lte: endOfDay },
      foodItemId: params.foodItemId,
      mealType: params.mealType,
    }).session(session);

    if (mealItemExists) {
      mealItemExists.quantity += params.quantity;
      await mealItemExists.save({ session });
    } else {
      const mealItem = new MealItem({
        ...params,
        userId: user.id,
      });
      await mealItem.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    revalidatePath(`${user.id}/meals/${params.date}`);

    return {
      success: true,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(error) as ErrorResponse;
  }
}

export async function getNutritionByDate(params: { date: Date }): Promise<
  ActionResponse<
    { nutrition: Record<string, number> } & {
      kcalbyMealType: Record<string, number>;
    }
  >
> {
  const validationResult = await action({
    params,
    schema: getNutritionByDateSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { user } = validationResult.session!;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const startOfDay = new Date(params.date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(params.date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const nutrition = await MealItem.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(user.id),
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: "$calories" },
          totalProtein: { $sum: "$protein" },
          totalCarbs: { $sum: "$carbs" },
          totalFats: { $sum: "$fats" },
          totalFiber: { $sum: "$fiber" },
          totalSugar: { $sum: "$sugar" },
          totalSodium: { $sum: "$sodium" },
        },
      },
    ]).session(session);
    const kcalbyMealType = await MealItem.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(user.id),
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: "$mealType",
          totalCalories: { $sum: "$calories" },
        },
      },
    ]).session(session);
    await session.commitTransaction();
    return {
      success: true,
      data: {
        nutrition: JSON.parse(JSON.stringify(nutrition[0] || {})),
        kcalbyMealType: JSON.parse(JSON.stringify(kcalbyMealType)),
      },
      status: 200,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
