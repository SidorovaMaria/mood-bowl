"use server";

import MealItem, { IMealItemDoc } from "@/database/mealitem.model";
import { AddMealItemsSchema } from "../validation";
import { UnauthorizedError } from "../http-errors";
import handleError from "../errors";
import mongoose from "mongoose";
import action from "../action";

export async function addMealItem(
  params: AddMealItemsParams
): Promise<ActionResponse<{ mealItem: IMealItemDoc }>> {
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
  try {
    const mealItem = new MealItem({
      ...params,
      userId: user.id,
    });
    await mealItem.save({ session });
    await session.commitTransaction();
    session.endSession();

    return {
      success: true,
      data: {
        mealItem: JSON.parse(JSON.stringify(mealItem)),
      },
      status: 201,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return handleError(error) as ErrorResponse;
  }
}
