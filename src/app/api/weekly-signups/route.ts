import { NextRequest, NextResponse } from "next/server";
import { getWeeklySignups, createWeeklySignup } from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const weekStart = searchParams.get("weekStart");

  if (!weekStart) {
    return NextResponse.json({ error: "weekStart required" }, { status: 400 });
  }

  const signups = await getWeeklySignups(weekStart);
  return NextResponse.json(signups);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, shift_id, week_start } = body;

  if (!name || !shift_id || !week_start) {
    return NextResponse.json({ error: "name, shift_id, and week_start required" }, { status: 400 });
  }

  try {
    const signup = await createWeeklySignup(uuid(), name, shift_id, week_start);
    return NextResponse.json(signup, { status: 201 });
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "DUPLICATE") {
      return NextResponse.json({ error: "You're already signed up for this shift" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create signup" }, { status: 500 });
  }
}
