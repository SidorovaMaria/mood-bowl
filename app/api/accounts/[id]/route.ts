import Account from "@/database/account.model";
import handleError from "@/lib/errors";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

// Get Account By ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return new NotFoundError("Account ID is required");

  try {
    await dbConnect();

    const account = await Account.findById(id);
    if (!account) return new NotFoundError("Account not found");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return new NotFoundError("Account ID is required");

  try {
    await dbConnect();

    const account = await Account.findByIdAndDelete(id);
    if (!account) return new NotFoundError("Account not found");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) return new NotFoundError("Account ID is required");
  try {
    await dbConnect();

    const body = await request.json();
    const validatedData = AccountSchema.partial().safeParse(body);

    if (!validatedData.success)
      return new ValidationError(
        validatedData.error.flatten().fieldErrors as Record<string, string[]>
      );

    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedAccount) return new NotFoundError("Account not found");

    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
