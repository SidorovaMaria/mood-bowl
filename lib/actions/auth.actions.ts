"use server";

import action from "../action";
import mongoose from "mongoose";
import User from "@/database/user.model";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

import Account from "@/database/account.model";
import { SignInSchema, SignUpSchema } from "../validation";
import handleError from "../errors";
import { NotFoundError } from "../http-errors";

export async function SignUpWithCredentials(
  params: AuthCredentials
): Promise<SuccessResponse | ErrorResponse> {
  const validatedData = await action({
    params,
    schema: SignUpSchema,
  });

  const { name, username, email, password } = validatedData.params!;
  // const session = await mongoose.startSession();
  // session.startTransaction();
  let transactionCommitted = false; // <-- flag
  try {
    const existingUser = await User.findOne({ email });
    // .session(session);
    if (existingUser) {
      return {
        success: false,
        error: { message: "User with this email already exists" },
        status: 409,
      };
    }

    const existingUsername = await User.findOne({ username });
    // .session(session);
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
          birthDate: new Date("2000-01-01"), // Default date, should be updated later
          preferences: {
            trackMood: false,
            trackMeals: false,
          },
          isProfileComplete: false,
        }, //DEfault values before onboarding
      ]
      // { session }
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
      ]
      // { session }
    );

    // await session.commitTransaction();
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
      // await session.abortTransaction();
    }
    console.error("Error during user creation:", error);
    // await session.abortTransaction();

    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : "Unknown error",
      },
      status: 500,
    };
  } finally {
    // session.endSession();
  }
}

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> {
  const validatedData = await action({
    params,
    schema: SignInSchema,
  });
  if (validatedData instanceof Error) {
    return handleError(validatedData) as ErrorResponse;
  }
  const { email, password } = validatedData.params!;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new NotFoundError("User");
    }
    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    if (!existingAccount) {
      throw new NotFoundError("Account");
    }
    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password
    );
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
