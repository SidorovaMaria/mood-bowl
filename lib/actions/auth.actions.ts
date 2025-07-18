"use server";

import action from "../action";
import mongoose from "mongoose";
import User from "@/database/user.model";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

import Account from "@/database/account.model";
import { SignUpSchema } from "../validation";

export async function SignUpWithCredentials(
  params: AuthCredentials
): Promise<SuccessResponse | ErrorResponse> {
  const validatedData = await action({
    params,
    schema: SignUpSchema,
  });

  const { name, username, email, password } = params;
  const session = await mongoose.startSession();
  session.startTransaction();
  let transactionCommitted = false; // <-- flag
  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      return {
        success: false,
        error: { message: "User with this email already exists" },
        status: 409,
      };
    }

    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) {
      return {
        success: false,
        error: { message: "Username already taken" },
        status: 409,
      };
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const [newUser] = await User.create(
      [
        {
          username,
          email,
          name,
          sex: "unknown",
          birthDate: new Date(),
          preferences: {
            trackMood: false,
            trackMeals: false,
          },
          isProfileComplete: false,
        }, //DEfault values before onboarding
      ],
      { session }
    );
    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    transactionCommitted = true; // <-- set flag to true
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (!result || result.error) {
      return {
        success: false,
        error: {
          message: result?.error || "Failed to sign in after user creation",
        },
        status: 500,
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newUser)),
      status: 201,
    };
  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction();
    }
    console.error("Error during user creation:", error);
    await session.abortTransaction();

    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
      status: 500,
    };
  } finally {
    session.endSession();
  }
}
