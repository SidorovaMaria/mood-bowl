import Account from "@/database/account.model";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

// Get Account By ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id)
    return NextResponse.json(
      { success: false, message: "Account ID is required" },
      { status: 400 }
    );

  try {
    await dbConnect();

    const account = await Account.findById(id);
    if (!account)
      return NextResponse.json(
        { success: false, message: "Account not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    const responseBody = {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(responseBody, { status: 500 });
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id)
    return NextResponse.json(
      { success: false, message: "Account ID is required" },
      { status: 400 }
    );

  try {
    await dbConnect();

    const account = await Account.findByIdAndDelete(id);
    if (!account)
      return NextResponse.json(
        { success: false, message: "Account not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    const responseBody = {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(responseBody, { status: 500 });
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id)
    return NextResponse.json(
      { success: false, message: "Account ID is required" },
      { status: 400 }
    );

  try {
    await dbConnect();

    const body = await request.json();
    const validatedData = AccountSchema.partial().safeParse(body);

    if (!validatedData.success)
      return NextResponse.json(
        { success: false, message: validatedData.error.message },
        { status: 400 }
      );

    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedAccount)
      return NextResponse.json(
        { success: false, message: "Account not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 }
    );
  } catch (error) {
    const responseBody = {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
    return NextResponse.json(responseBody, { status: 500 });
  }
}
