"use client";

import { useState, useRef, useEffect } from "react";
import { Signup } from "@/lib/types";
import { getDaysOfWeek, isToday, isPastDay, isSameDay } from "@/lib/dateUtils";
import { DayColumn } from "./DayColumn";

interface WeekGridProps {
  weekStart: Date;
  signups: Signup[];
  colorMap: Record<string, import("@/lib/colors").BookingPalette>;
  onSignUp: (shiftId: string, date: Date) => void;
  onRemove: (signupId: string) => void;
  isMobile: boolean;
}

export function WeekGrid({ weekStart, signups, colorMap, onSignUp, onRemove, isMobile }: WeekGridProps) {
  const days = getDaysOfWeek(weekStart);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);

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
            colorMap={colorMap}
            onSignUp={onSignUp}
            onRemove={onRemove}
            isMobile
            hideHeader
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border-2 border-gray-900 bg-white overflow-x-auto scrollbar-none">
      <div className="grid grid-cols-7 divide-x-2 divide-gray-900 w-full min-w-[840px]" style={{ gridAutoColumns: "1fr" }}>
        {days.map((date) => (
          <DayColumn
            key={date.toISOString()}
            date={date}
            signups={signups}
            colorMap={colorMap}
            onSignUp={onSignUp}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}
