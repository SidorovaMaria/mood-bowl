// GET ALL ACCOUNTS from the database
import Account from "@/database/account.model";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { ErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const accounts = await Account.find();
    const responseBody = {
      success: true,
      data: accounts,
      message: "Accounts fetched successfully",
    };
    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    const responseBody: ErrorResponse = {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(responseBody, { status: 500 });
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
        message: "Account already exists",
      };
      return NextResponse.json(responseBody, { status: 409 });
    }
    const newAccount = await Account.create(validatedData);
    const responseBody = {
      success: true,
      data: newAccount,
      message: "Account created successfully",
    };
    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    const responseBody: ErrorResponse = {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(responseBody, { status: 500 });
  }
}
