// GET ALL ACCOUNTS from the database
import Account from "@/database/account.model";
import handleError from "@/lib/errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const accounts = await Account.find();

    return NextResponse.json(
      {
        success: true,
        data: accounts,
        message: "Accounts fetched successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// POST a new account to the database
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = AccountSchema.parse(body);
    const existingAccount = await Account.findOne({
      provider: validatedData.provider,
      providerAccountId: validatedData.providerAccountId,
    });
    if (existingAccount) {
      const responseBody: ErrorResponse = {
        success: false,
        error: { message: "Account already exists with this provider" },
        status: 409,
      };
      return NextResponse.json(responseBody, { status: 409 });
    }
    const newAccount = await Account.create(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: newAccount,
        message: "Account created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
