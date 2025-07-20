"use server";
import User, { IUser, IUserDoc } from "@/database/user.model";
import action from "../action";
import { getUserSchema, updateUserSchema } from "../validation";
import handleError from "../errors";
import { Update } from "next/dist/build/swc/types";
export async function getUser(params: { userId: string }): Promise<
  ActionResponse<{
    user: IUserDoc;
  }>
> {
  const validationResult = await action({
    params,
    schema: getUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = params;

  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateUser(
  params: updateUserParams
): Promise<ActionResponse<{ user: IUser }>> {
  const validationResult = await action({
    params,
    schema: updateUserSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  if (!validationResult.session?.user) {
    return {
      success: false,
      error: {
        message: "Unauthorized",
        details: { userId: ["User is not authenticated"] },
      },
      status: 401,
    };
  }
  const { user } = validationResult.session;
  try {
    const updatedUser = await User.findByIdAndUpdate(user?.id, params, {
      new: true,
    });
    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(updatedUser)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
