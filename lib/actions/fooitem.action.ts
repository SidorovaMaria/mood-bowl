"use server";
import FoodItem, { IFoodItem, IFoodItemDoc } from "@/database/foodItem.model";
import { createFoodItemSchema, GetFoodItemsSchema } from "../validation";
import handleError from "../errors";
import action from "../action";
import { FilterQuery } from "mongoose";

export async function addFoodItem(
  params: newFoodItemParams
): Promise<ActionResponse<{ foodItem: IFoodItem }>> {
  const validationResult = await action({
    params,
    schema: createFoodItemSchema,
    authorize: true,
  });

  if (!validationResult.session?.user) {
    return handleError(validationResult) as ErrorResponse;
  }
  try {
    const foodItem = await FoodItem.create({
      ...params,
      userId: validationResult.session.user.id,
    });
    return {
      success: true,
      data: {
        foodItem: JSON.parse(JSON.stringify(foodItem)),
      },
      status: 201,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getFoodItems(params: {
  query: string;
}): Promise<ActionResponse<{ foodItems: IFoodItemDoc[] }>> {
  const validationResult = await action({ params, schema: GetFoodItemsSchema });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { query } = validationResult.params!;

  try {
    const filterQuery: FilterQuery<typeof FoodItem> = {};
    if (query) {
      filterQuery.$or = [
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    }
    const foodItems = await FoodItem.find(filterQuery).lean();

    return {
      success: true,
      data: {
        foodItems: JSON.parse(JSON.stringify(foodItems)),
      },
      status: 200,
    };
  } catch (error) {
    console.error("Error fetching food items:", error);
    return handleError(error) as ErrorResponse;
  }
}
