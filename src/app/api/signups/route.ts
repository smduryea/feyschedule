import { NextRequest, NextResponse } from "next/server";
import { getSignups, createSignup } from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const weekStart = searchParams.get("weekStart");
  const weekEnd = searchParams.get("weekEnd");

  if (!weekStart || !weekEnd) {
    return NextResponse.json({ error: "weekStart and weekEnd required" }, { status: 400 });
  }

  const signups = await getSignups(weekStart, weekEnd);
  return NextResponse.json(signups);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, shift_id, date } = body;

  if (!name || !shift_id || !date) {
    return NextResponse.json({ error: "name, shift_id, and date required" }, { status: 400 });
  }

  try {
    const signup = await createSignup(uuid(), name, shift_id, date);
    return NextResponse.json(signup, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "DUPLICATE") {
      return NextResponse.json({ error: "You're already signed up for this shift" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create signup" }, { status: 500 });
  }
}
