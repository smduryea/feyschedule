"use client";

import { useState } from "react";
import { Signup, CustomDailyShift, Shift } from "@/lib/types";
import { SHIFTS } from "@/lib/shifts";
import { isToday, isPastDay } from "@/lib/dateUtils";
import { ShiftSlot } from "./ShiftSlot";
import { readDragPayload } from "@/lib/dnd";

interface DayColumnProps {
  date: Date;
  signups: Signup[];
  customShifts: CustomDailyShift[];
  colorMap: Record<string, import("@/lib/colors").BookingPalette>;
  onSignUp: (shiftId: string, date: Date) => void;
  onRemove: (signupId: string) => void;
  onMoveSignup?: (signupId: string, targetShiftId: string, targetDate: string) => void;
  onDeleteCustomShift?: (id: string) => void;
  isMobile?: boolean;
  hideHeader?: boolean;
}

export function DayColumn({ date, signups, customShifts, colorMap, onSignUp, onRemove, onMoveSignup, onDeleteCustomShift, isMobile, hideHeader }: DayColumnProps) {
  const [dragOverShiftId, setDragOverShiftId] = useState<string | null>(null);
  const today = isToday(date);
  const past = isPastDay(date);
  const weekday = date.toLocaleDateString([], { weekday: "short" }).toUpperCase();
  const dayNum = date.getDate();

  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const daySignups = signups.filter((s) => s.date === dateStr);
  const dayCustomShifts = customShifts.filter((cs) => cs.dates.includes(dateStr));

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

      <div className={`flex flex-col flex-1 gap-0 divide-y divide-gray-400 ${past ? "stripes" : ""}`}>
        {(() => {
          const rows: { shift: Shift; isCustom: boolean }[] = [
            ...SHIFTS.map((shift) => ({ shift, isCustom: false })),
            ...dayCustomShifts.map((cs) => ({
              shift: {
                id: cs.id,
                name: cs.name,
                startTime: cs.startTime,
                endTime: cs.endTime,
                maxSignups: cs.maxSignups,
              },
              isCustom: true,
            })),
          ].sort((a, b) => a.shift.startTime.localeCompare(b.shift.startTime));

          return rows.map(({ shift, isCustom }) => {
            const isDragOver = dragOverShiftId === shift.id;
            return (
              <div
                key={shift.id}
                className={`flex ${isDragOver ? "ring-2 ring-lime-400 ring-inset" : ""}`}
                onDragOver={(e) => {
                  if (past || !onMoveSignup) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDragEnter={(e) => {
                  if (past || !onMoveSignup) return;
                  e.preventDefault();
                  setDragOverShiftId(shift.id);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverShiftId((id) => (id === shift.id ? null : id));
                  }
                }}
                onDrop={(e) => {
                  setDragOverShiftId(null);
                  if (past || !onMoveSignup) return;
                  const payload = readDragPayload(e);
                  if (!payload || payload.kind !== "daily") return;
                  e.preventDefault();
                  onMoveSignup(payload.signupId, shift.id, dateStr);
                }}
              >
                <ShiftSlot
                  shift={shift}
                  signups={daySignups.filter((s) => s.shift_id === shift.id)}
                  colorMap={colorMap}
                  onSignUp={(shiftId) => onSignUp(shiftId, date)}
                  onRemove={onRemove}
                  onDeleteShift={isCustom && onDeleteCustomShift ? () => onDeleteCustomShift(shift.id) : undefined}
                  disabled={past}
                />
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}
