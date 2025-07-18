import User from "@/database/user.model";
import handleError from "@/lib/errors";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

//Get All Users
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find();
    const responseBody = {
      success: true,
      data: users,
      message: "Users fetched successfully",
    };
    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

//Create a new User
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserSchema.safeParse(body);
    if (!validatedData.success) {
      return new ValidationError(
        validatedData.error.flatten().fieldErrors as Record<string, string[]>
      );
    }
    const { email, username } = validatedData.data;
    const existingUserViaEmail = await User.findOne({ email });
    const existingUserViaUsername = await User.findOne({ username });
    if (existingUserViaEmail || existingUserViaUsername) {
      return new Error("User with this email or username already exists");
    }
    const newUser = await User.create(validatedData.data);

    return NextResponse.json(
      {
        success: true,
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
