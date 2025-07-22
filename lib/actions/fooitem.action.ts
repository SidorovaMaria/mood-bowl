"use server";
import FoodItem, { IFoodItem } from "@/database/foodItem.model";
import { createFoodItemSchema } from "../validation";
import handleError from "../errors";
import action from "../action";

export async function addFoodItem(
  params: newFoodItemParams
): Promise<ActionResponse<{ foodItem: IFoodItem }>> {
  const validationResult = await action({
    params,
    schema: createFoodItemSchema,
    authorize: true,
  });
  console.log("Validation Result:", validationResult);

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
