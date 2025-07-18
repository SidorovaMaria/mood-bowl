import User from "@/database/user.model";
import handleError from "@/lib/errors";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

//GET USER BY ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return new NotFoundError("User ID is required");
  try {
    await dbConnect();
    const user = await User.findById(id);
    if (!user) return new NotFoundError("User not found");

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

//Delete USER BY ID
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return new NotFoundError("User ID is required");
  try {
    await dbConnect();
    const user = await User.findByIdAndDelete(id);
    if (!user) return new NotFoundError("User not found");

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
