import User from "@/database/user.model";
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
    const responseBody = {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(responseBody, { status: 500 });
  }
}

//Create a new User
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = UserSchema.safeParse(body);
    if (!validatedData.success) {
      const responseBody = {
        success: false,
        message: "Validation failed",
        errors: validatedData.error.issues,
      };
      return NextResponse.json(responseBody, { status: 400 });
    }
    if (validatedData.success) {
      console.log("User Scema is valid");
    }
    const { email, username } = validatedData.data;
    const existingUserViaEmail = await User.findOne({ email });
    const existingUserViaUsername = await User.findOne({ username });
    if (existingUserViaEmail || existingUserViaUsername) {
      const responseBody = {
        success: false,
        message: "User already exists with this email or username",
      };
      return NextResponse.json(responseBody, { status: 409 });
    }
    const newUser = await User.create(validatedData.data);
    const responseBody = {
      success: true,
      data: newUser,
      message: "User created successfully",
    };
    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    const responseBody = {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(responseBody, { status: 500 });
  }
}
