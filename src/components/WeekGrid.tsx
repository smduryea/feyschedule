"use client";

import { useState, useRef, useEffect } from "react";
import { Signup, CustomDailyShift, Shift } from "@/lib/types";
import { SHIFTS } from "@/lib/shifts";
import { getDaysOfWeek, isToday, isPastDay, isSameDay, toDateString } from "@/lib/dateUtils";
import { DayColumn } from "./DayColumn";
import { ShiftSlot } from "./ShiftSlot";
import { readDragPayload } from "@/lib/dnd";

interface WeekGridProps {
  weekStart: Date;
  signups: Signup[];
  customShifts: CustomDailyShift[];
  colorMap: Record<string, import("@/lib/colors").BookingPalette>;
  onSignUp: (shiftId: string, date: Date) => void;
  onRemove: (signupId: string) => void;
  onMoveSignup: (signupId: string, targetShiftId: string, targetDate: string) => void;
  onDeleteCustomShift: (id: string) => void;
  isMobile: boolean;
}

export function WeekGrid({ weekStart, signups, customShifts, colorMap, onSignUp, onRemove, onMoveSignup, onDeleteCustomShift, isMobile }: WeekGridProps) {
  const days = getDaysOfWeek(weekStart);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [dragOverCellKey, setDragOverCellKey] = useState<string | null>(null);

  useEffect(() => { setSelectedDayIndex(0); }, [weekStart]);

  useEffect(() => {
    if (!isMobile || !tabsRef.current) return;
    const tab = tabsRef.current.children[selectedDayIndex] as HTMLElement;
    if (tab) tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedDayIndex, isMobile]);

  if (isMobile) {
    const selectedDate = days[selectedDayIndex];
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
    const daySignups = signups.filter((s) => s.date === dateStr);

    return (
      <div className="flex flex-col gap-3">
        <div ref={tabsRef} className="flex gap-1 overflow-x-auto scrollbar-none -mx-1 px-1 pb-1">
          {days.map((date, i) => {
            const active = i === selectedDayIndex;
            const todayDate = isToday(date);
            const past = isPastDay(date);
            const dayName = date.toLocaleDateString([], { weekday: "narrow" });
            const dayNum = date.getDate();
            const hasSignups = signups.some((s) => {
              const ds = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
              return s.date === ds;
            });

            return (
              <button
                key={i}
                onClick={() => setSelectedDayIndex(i)}
                className={`relative flex flex-col items-center shrink-0 px-3 py-2 font-mono transition-all min-w-[48px] border-2 ${
                  active
                    ? "border-gray-900 bg-gray-900 text-amber-50"
                    : past
                      ? "border-gray-200 bg-gray-100 text-gray-500"
                      : todayDate
                        ? "border-gray-900 bg-gray-100 text-gray-900"
                        : "border-gray-300 bg-white text-gray-600 active:bg-gray-100"
                }`}
              >
                <span className="text-[10px] uppercase font-bold">{dayName}</span>
                <span className="text-xl leading-tight font-black">{dayNum}</span>
                {hasSignups && !active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-current" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between px-0.5 font-mono">
          <p className="text-xs font-bold text-gray-900">
            {selectedDate.toLocaleDateString([], { weekday: "long" }).toUpperCase()}
          </p>
          <p className="text-[10px] text-gray-500">
            {daySignups.length === 0 ? "no signups yet" : `${daySignups.length} signed up`}
          </p>
        </div>

        <div className="border-2 border-gray-900 bg-white overflow-y-auto overscroll-contain touch-scroll scrollbar-none" style={{ maxHeight: "68vh" }}>
          <DayColumn
            date={selectedDate}
            signups={signups}
            customShifts={customShifts}
            colorMap={colorMap}
            onSignUp={onSignUp}
            onRemove={onRemove}
            onMoveSignup={onMoveSignup}
            onDeleteCustomShift={onDeleteCustomShift}
            isMobile
            hideHeader
          />
        </div>
      </div>
    );
  }

  // Row-major desktop layout.
  // Custom daily shifts that share a startTime collapse into the same row when
  // their applicable days don't overlap. If they do overlap, spill into an
  // additional row so each cell still has at most one shift.
  type CustomGroup = {
    startTime: string;
    cellsByDate: Map<string, CustomDailyShift>;
  };

  const customGroups: CustomGroup[] = [];
  for (const cs of customShifts) {
    const target = customGroups.find(
      (g) =>
        g.startTime === cs.startTime &&
        !cs.dates.some((d) => g.cellsByDate.has(d))
    );
    if (target) {
      for (const d of cs.dates) target.cellsByDate.set(d, cs);
    } else {
      const next: CustomGroup = { startTime: cs.startTime, cellsByDate: new Map() };
      for (const d of cs.dates) next.cellsByDate.set(d, cs);
      customGroups.push(next);
    }
  }

  type Row =
    | { kind: "static"; shift: Shift }
    | { kind: "custom-group"; group: CustomGroup };

  const rows: Row[] = [
    ...SHIFTS.map<Row>((shift) => ({ kind: "static", shift })),
    ...customGroups.map<Row>((group) => ({ kind: "custom-group", group })),
  ].sort((a, b) => {
    const ta = a.kind === "static" ? a.shift.startTime : a.group.startTime;
    const tb = b.kind === "static" ? b.shift.startTime : b.group.startTime;
    return ta.localeCompare(tb);
  });

  return (
    <div className="w-full border-2 border-gray-900 bg-white overflow-x-auto scrollbar-none">
      <div className="grid grid-cols-7 w-full min-w-[840px]">
        {/* Header row */}
        {days.map((date, ci) => {
          const today = isToday(date);
          const past = isPastDay(date);
          const weekday = date.toLocaleDateString([], { weekday: "short" }).toUpperCase();
          const dayNum = date.getDate();
          return (
            <div
              key={`h-${date.toISOString()}`}
              className={`sticky top-0 z-10 border-b-2 border-gray-900 px-2 py-2 text-center font-mono transition-colors ${
                ci > 0 ? "border-l-2 border-gray-900" : ""
              } ${
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
          );
        })}

        {/* Shift rows */}
        {rows.map((row, ri) =>
          days.map((date, ci) => {
            const dateStr = toDateString(date);
            const past = isPastDay(date);
            const cellBorders = `${ci > 0 ? "border-l-2 border-gray-900" : ""} border-t border-gray-400`;

            // Figure out which shift (if any) to render in this cell.
            let cellShift: Shift | undefined;
            let isCustom = false;
            if (row.kind === "static") {
              cellShift = row.shift;
            } else {
              const cs = row.group.cellsByDate.get(dateStr);
              if (cs) {
                cellShift = {
                  id: cs.id,
                  name: cs.name,
                  startTime: cs.startTime,
                  endTime: cs.endTime,
                  maxSignups: cs.maxSignups,
                };
                isCustom = true;
              }
            }

            const cellKey = `r${ri}-c${ci}`;

            if (!cellShift) {
              return (
                <div
                  key={cellKey}
                  aria-hidden
                  className={`${cellBorders} bg-gray-50 stripes ${past ? "opacity-40" : ""}`}
                />
              );
            }

            const shiftSignups = signups.filter(
              (s) => s.date === dateStr && s.shift_id === cellShift!.id
            );

            const isDragOver = dragOverCellKey === cellKey;
            return (
              <div
                key={cellKey}
                className={`${cellBorders} ${past ? "opacity-40 stripes" : ""} ${isDragOver ? "ring-2 ring-lime-400 ring-inset" : ""} flex`}
                onDragOver={(e) => {
                  if (past) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDragEnter={(e) => {
                  if (past) return;
                  e.preventDefault();
                  setDragOverCellKey(cellKey);
                }}
                onDragLeave={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDragOverCellKey((k) => (k === cellKey ? null : k));
                  }
                }}
                onDrop={(e) => {
                  setDragOverCellKey(null);
                  if (past) return;
                  const payload = readDragPayload(e);
                  if (!payload || payload.kind !== "daily") return;
                  e.preventDefault();
                  onMoveSignup(payload.signupId, cellShift!.id, dateStr);
                }}
              >
                <ShiftSlot
                  shift={cellShift}
                  signups={shiftSignups}
                  colorMap={colorMap}
                  onSignUp={(shiftId) => onSignUp(shiftId, date)}
                  onRemove={onRemove}
                  onDeleteShift={
                    isCustom && onDeleteCustomShift
                      ? () => onDeleteCustomShift(cellShift!.id)
                      : undefined
                  }
                  disabled={past}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
