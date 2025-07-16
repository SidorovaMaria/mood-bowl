import Account from "@/database/account.model";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { ErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();
  try {
    await dbConnect();
    const validatedDate = AccountSchema.partial().safeParse({
      providerAccountId,
    });
    if (!validatedDate.success) {
      const responseBody: ErrorResponse = {
        success: false,
        message: validatedDate.error.message,
      };
      return NextResponse.json(responseBody, { status: 400 });
    }
    const account = await Account.findOne({
      providerAccountId: validatedDate.data.providerAccountId,
    });
    if (!account) {
      const responseBody: ErrorResponse = {
        success: false,
        message: "Account not found",
      };
      return NextResponse.json(responseBody, { status: 404 });
    }
    return NextResponse.json(
      {
        success: true,
        data: account,
        message: "Account fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    const responseBody: ErrorResponse = {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(responseBody, { status: 500 });
  }
}
