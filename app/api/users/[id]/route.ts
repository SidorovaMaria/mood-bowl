import User from "@/database/user.model";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

//GET USER BY ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    const responseBody = {
      success: false,
      message: "User ID is required",
    };
    return NextResponse.json(responseBody, { status: 400 });
  }
  try {
    await dbConnect();
    const user = await User.findById(id);
    if (!user) {
      const responseBody = {
        success: false,
        message: "User not found",
      };
      return NextResponse.json(responseBody, { status: 404 });
    }
    const responseBody = {
      success: true,
      data: user,
      message: "User fetched successfully",
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

//Delete USER BY ID
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    const responseBody = {
      success: false,
      message: "User ID is required",
    };
    return NextResponse.json(responseBody, { status: 400 });
  }
  try {
    await dbConnect();
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      const responseBody = {
        success: false,
        message: "User not found",
      };
      return NextResponse.json(responseBody, { status: 404 });
    }
    const responseBody = {
      success: true,
      message: "User deleted successfully",
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
