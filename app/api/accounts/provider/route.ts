import Account from "@/database/account.model";
import handleError from "@/lib/errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();
  try {
    await dbConnect();
    const validatedDate = AccountSchema.partial().safeParse({
      providerAccountId,
    });
    if (!validatedDate.success) {
      throw new Error(`Validation failed: ${validatedDate.error.message}`);
    }
    const account = await Account.findOne({
      providerAccountId: providerAccountId,
    });

    if (!account) throw new Error("Account not found");
    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
