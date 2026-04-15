"use client";

import { useState } from "react";
import { WeeklySignup, CustomWeeklyShift } from "@/lib/types";
import { WEEKLY_SHIFTS } from "@/lib/shifts";
import { getBookingColor } from "@/lib/colors";
import { setDragPayload, readDragPayload } from "@/lib/dnd";

interface WeeklyShiftsPanelProps {
  signups: WeeklySignup[];
  customShifts: CustomWeeklyShift[];
  colorMap: Record<string, import("@/lib/colors").BookingPalette>;
  onSignUp: (shiftId: string) => void;
  onRemove: (signupId: string) => void;
  onMoveSignup: (signupId: string, targetShiftId: string) => void;
  onDeleteCustomShift: (id: string) => void;
  isPastWeek: boolean;
}

interface Cell {
  id: string;
  name: string;
  maxSignups: number;
  isCustom: boolean;
}

export function WeeklyShiftsPanel({
  signups,
  customShifts,
  colorMap,
  onSignUp,
  onRemove,
  onMoveSignup,
  onDeleteCustomShift,
  isPastWeek,
}: WeeklyShiftsPanelProps) {
  const [dragOverShiftId, setDragOverShiftId] = useState<string | null>(null);

  const cells: Cell[] = [
    ...WEEKLY_SHIFTS.map((s) => ({ id: s.id, name: s.name, maxSignups: s.maxSignups, isCustom: false })),
    ...customShifts.map((s) => ({ id: s.id, name: s.name, maxSignups: s.maxSignups, isCustom: true })),
  ];

  return (
    <div className="w-full border-2 border-gray-900 bg-white">
      <div className="border-b-2 border-gray-900 bg-gray-900 px-4 py-2.5">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-amber-50">
          Weekly Shifts
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y divide-gray-400 sm:divide-y-0 sm:divide-x-2 sm:divide-gray-900">
        {cells.map((cell) => {
          const shiftSignups = signups.filter((s) => s.shift_id === cell.id);
          const openSlots = Math.max(0, cell.maxSignups - shiftSignups.length);

          const isDragOver = dragOverShiftId === cell.id;
          return (
            <div
              key={cell.id}
              className={`flex flex-col ${isDragOver ? "ring-2 ring-lime-400 ring-inset" : ""}`}
              onDragOver={(e) => {
                if (isPastWeek) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDragEnter={(e) => {
                if (isPastWeek) return;
                e.preventDefault();
                setDragOverShiftId(cell.id);
              }}
              onDragLeave={(e) => {
                // Only clear when we leave the whole cell (not into a child)
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setDragOverShiftId((id) => (id === cell.id ? null : id));
                }
              }}
              onDrop={(e) => {
                setDragOverShiftId(null);
                if (isPastWeek) return;
                const payload = readDragPayload(e);
                if (!payload || payload.kind !== "weekly") return;
                e.preventDefault();
                onMoveSignup(payload.signupId, cell.id);
              }}
            >
              {/* Shift header — matches ShiftSlot */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50 relative">
                <span className="font-bold text-xs text-gray-900 uppercase tracking-wide whitespace-nowrap">
                  {cell.name}
                </span>
                {cell.isCustom && !isPastWeek && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete custom shift "${cell.name}"? Existing signups will also be removed.`)) {
                        onDeleteCustomShift(cell.id);
                      }
                    }}
                    className="ml-auto h-5 w-5 flex items-center justify-center border border-gray-400 hover:border-gray-900 hover:bg-black/10 transition-colors"
                    aria-label={`Delete shift ${cell.name}`}
                    title="Delete custom shift"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Slots: signed-up badges + open-slot sign-up buttons */}
              <div className="px-3 py-2 min-h-[36px]">
                <div className="flex flex-col items-stretch gap-1.5">
                  {shiftSignups.map((signup) => {
                    const color = getBookingColor(signup.name, colorMap);
                    return (
                      <div
                        key={signup.id}
                        draggable={!isPastWeek}
                        onDragStart={(e) => setDragPayload(e, { kind: "weekly", signupId: signup.id })}
                        className={`group flex w-full items-center gap-1.5 border-l-4 px-2 py-1 text-xs font-bold ${!isPastWeek ? "cursor-grab active:cursor-grabbing" : ""} ${color.bg} ${color.border} ${color.text}`}
                        title={!isPastWeek ? "Drag to move to another shift" : undefined}
                      >
                        <span className="flex-1 min-w-0 truncate">{signup.name}</span>
                        {!isPastWeek && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Remove ${signup.name} from ${cell.name}?`)) {
                                onRemove(signup.id);
                              }
                            }}
                            className="opacity-0 group-hover:opacity-100 shrink-0 h-4 w-4 flex items-center justify-center hover:bg-black/10 transition-all"
                            aria-label={`Remove ${signup.name}`}
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {Array.from({ length: openSlots }).map((_, i) => (
                    <button
                      key={`open-${i}`}
                      onClick={() => onSignUp(cell.id)}
                      disabled={isPastWeek}
                      aria-label={`Sign up for ${cell.name}`}
                      title="Sign up"
                      className="h-6 w-full flex items-center justify-center text-sm font-bold border-2 border-gray-900 hover:bg-lime-300 transition-colors active:translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent leading-none"
                    >
                      +
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        {/* Filler cells: pad to the nearest multiple of 4 (lg column count) so
            rows never look half-filled when custom shifts are added. Hidden
            below sm — mobile stacks cells vertically so trailing greys look
            awkward there. */}
        {Array.from({ length: (4 - (cells.length % 4)) % 4 }).map((_, i) => (
          <div
            key={`filler-${i}`}
            aria-hidden
            className="hidden sm:block bg-gray-50 stripes min-h-[56px]"
          />
        ))}
      </div>
    </div>
  );
}
