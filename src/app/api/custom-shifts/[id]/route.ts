import { NextRequest, NextResponse } from "next/server";
import { deleteCustomDailyShift, deleteCustomWeeklyShift } from "@/lib/db";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const type = request.nextUrl.searchParams.get("type");

  if (type === "daily") {
    await deleteCustomDailyShift(id);
  } else if (type === "weekly") {
    await deleteCustomWeeklyShift(id);
  } else {
    return NextResponse.json({ error: "type query param required (daily|weekly)" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
