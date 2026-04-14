"use client";

import { Signup } from "@/lib/types";
import { SHIFTS } from "@/lib/shifts";
import { isToday, isPastDay } from "@/lib/dateUtils";
import { ShiftSlot } from "./ShiftSlot";

interface DayColumnProps {
  date: Date;
  signups: Signup[];
  colorMap: Record<string, import("@/lib/colors").BookingPalette>;
  onSignUp: (shiftId: string, date: Date) => void;
  onRemove: (signupId: string) => void;
  isMobile?: boolean;
  hideHeader?: boolean;
}

export function DayColumn({ date, signups, colorMap, onSignUp, onRemove, isMobile, hideHeader }: DayColumnProps) {
  const today = isToday(date);
  const past = isPastDay(date);
  const weekday = date.toLocaleDateString([], { weekday: "short" }).toUpperCase();
  const dayNum = date.getDate();

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const daySignups = signups.filter((s) => s.date === dateStr);

  return (
    <div className={`flex flex-col h-full ${past ? "opacity-40" : ""}`}>
      {!hideHeader && (
        <div
          className={`sticky top-0 z-10 border-b-2 border-gray-900 px-2 py-2 text-center font-mono transition-colors ${
            past
              ? "bg-gray-100 text-gray-500"
              : today
                ? "bg-gray-900 text-amber-50"
                : "bg-white text-gray-900"
          }`}
        >
          <div className="text-[10px] font-bold tracking-[0.15em]">{weekday}</div>
          <div className="text-xl font-black leading-none">{dayNum}</div>
        </div>
      )}

      <div className={`flex flex-col flex-1 gap-0 divide-y divide-gray-200 ${past ? "stripes" : ""}`}>
        {SHIFTS.map((shift) => (
          <ShiftSlot
            key={shift.id}
            shift={shift}
            signups={daySignups.filter((s) => s.shift_id === shift.id)}
            colorMap={colorMap}
            onSignUp={(shiftId) => onSignUp(shiftId, date)}
            onRemove={onRemove}
            disabled={past}
          />
        ))}
      </div>
    </div>
  );
}
