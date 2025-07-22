/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import User, { IUser, IUserDoc } from "@/database/user.model";
import action from "../action";
import { getUserSchema, updateUserSchema } from "../validation";
import handleError from "../errors";
import { Update } from "next/dist/build/swc/types";
import { revalidatePath } from "next/cache";
import { ValidationError } from "../http-errors";
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
    revalidatePath("/onboarding/completed");
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

export async function EditUserInfo({
  user,
  label,
  value,
}: {
  user: IUserDoc;
  label: keyof IUserDoc;
  value: IUserDoc[keyof IUserDoc];
}): Promise<ActionResponse<{ user: IUserDoc }>> {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { [label]: value },
      { new: true, runValidators: true }
    );
    revalidatePath(`${user._id}/profile`);
    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(updatedUser)),
      },
    };
  } catch (error: any) {
    if (error.code === 11000) {
      const duplicatedField = Object.keys(error.keyValue)[0];
      const duplicatedValue = error.keyValue[duplicatedField];

      return {
        success: false,
        error: {
          message: `${duplicatedField} '${duplicatedValue}' is already in use.`,
          details: {
            [duplicatedField]: [`${duplicatedValue} is already in use.`],
          },
        },
      };
    }
    if (error.name === "ValidationError" && error.errors) {
      const details: Record<string, string[]> = {};

      for (const [key, err] of Object.entries(error.errors)) {
        const msg = (err as any).message.replace(/^Path `(\w+)` is /, "$1 is ");
        details[key] = [msg];
      }

      return {
        success: false,
        error: {
          message: details[label]?.[0] || "Validation error",
          details,
        },
      };
    }

    return handleError(error) as ErrorResponse;
  }
}
