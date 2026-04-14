import { NextRequest, NextResponse } from "next/server";
import { deleteSignup, updateSignup } from "@/lib/db";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteSignup(id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  try {
    await updateSignup(id, body);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "DUPLICATE") {
      return NextResponse.json({ error: "Already signed up for this shift" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update signup" }, { status: 500 });
  }
}
