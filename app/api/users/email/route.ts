import { NextResponse } from "next/server";

import User from "@/database/user.model";

import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { NotFoundError } from "@/lib/http-errors";
import handleError from "@/lib/errors";

export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    await dbConnect();

    const validatedData = UserSchema.partial().safeParse({ email });

    if (!validatedData.success)
      throw new Error("Validation failed: " + validatedData.error.message);

    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User");

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
