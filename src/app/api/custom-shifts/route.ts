import { NextRequest, NextResponse } from "next/server";
import {
  getCustomDailyShifts,
  getCustomWeeklyShifts,
  createCustomDailyShift,
  createCustomWeeklyShift,
} from "@/lib/db";
import { v4 as uuid } from "uuid";

function toCamelDaily(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    week_start: row.week_start,
    startTime: row.start_time,
    endTime: row.end_time,
    maxSignups: row.max_signups,
    dates: row.dates,
    created_at: row.created_at,
  };
}

function toCamelWeekly(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    week_start: row.week_start,
    maxSignups: row.max_signups,
    created_at: row.created_at,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const weekStart = searchParams.get("weekStart");

  if (!weekStart) {
    return NextResponse.json({ error: "weekStart required" }, { status: 400 });
  }

  const daily = (await getCustomDailyShifts(weekStart)).map(toCamelDaily);
  const weekly = (await getCustomWeeklyShifts(weekStart)).map(toCamelWeekly);
  return NextResponse.json({ daily, weekly });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type } = body;

  try {
    if (type === "daily") {
      const { name, week_start, startTime, endTime, maxSignups, dates } = body;
      if (!name || !week_start || !startTime || !endTime || !maxSignups || !Array.isArray(dates) || dates.length === 0) {
        return NextResponse.json({ error: "missing required fields" }, { status: 400 });
      }
      const row = await createCustomDailyShift({
        id: `cd-${uuid()}`,
        name,
        week_start,
        start_time: startTime,
        end_time: endTime,
        max_signups: Number(maxSignups),
        dates,
      });
      return NextResponse.json(toCamelDaily(row), { status: 201 });
    }

    if (type === "weekly") {
      const { name, week_start, maxSignups } = body;
      if (!name || !week_start || !maxSignups) {
        return NextResponse.json({ error: "missing required fields" }, { status: 400 });
      }
      const row = await createCustomWeeklyShift({
        id: `cw-${uuid()}`,
        name,
        week_start,
        max_signups: Number(maxSignups),
      });
      return NextResponse.json(toCamelWeekly(row), { status: 201 });
    }

    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to create custom shift" }, { status: 500 });
  }
}
