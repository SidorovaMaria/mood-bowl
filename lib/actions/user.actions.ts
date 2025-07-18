"use server";
import User, { IUser, IUserDoc } from "@/database/user.model";
import action from "../action";
import { getUserSchema } from "../validation";
import handleError from "../errors";
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
