"use client";

import { WeeklySignup } from "@/lib/types";
import { WEEKLY_SHIFTS } from "@/lib/shifts";
import { getBookingColor } from "@/lib/colors";

interface WeeklyShiftsPanelProps {
  signups: WeeklySignup[];
  colorMap: Record<string, import("@/lib/colors").BookingPalette>;
  onSignUp: (shiftId: string) => void;
  onRemove: (signupId: string) => void;
  isPastWeek: boolean;
}

export function WeeklyShiftsPanel({ signups, colorMap, onSignUp, onRemove, isPastWeek }: WeeklyShiftsPanelProps) {
  return (
    <div className="border-2 border-gray-900 bg-white">
      <div className="border-b-2 border-gray-900 bg-gray-900 px-4 py-2.5">
        <h2 className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-amber-50">
          Weekly Shifts
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
        {WEEKLY_SHIFTS.map((shift) => {
          const shiftSignups = signups.filter((s) => s.shift_id === shift.id);
          const isFull = shiftSignups.length >= shift.maxSignups;

          return (
            <div key={shift.id} className="flex flex-col">
              {/* Shift header — matches ShiftSlot */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                <span className="font-bold text-xs text-gray-900 uppercase tracking-wide whitespace-nowrap">
                  {shift.name}
                </span>
                <span className="font-mono text-[10px] text-gray-400">
                  {shiftSignups.length}/{shift.maxSignups}
                </span>
                {!isFull && (
                  <button
                    onClick={() => onSignUp(shift.id)}
                    disabled={isPastWeek}
                    className="ml-auto shrink-0 text-[10px] font-bold uppercase tracking-wider border-2 border-gray-900 px-2.5 py-1 hover:bg-lime-300 transition-colors active:translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  >
                    + Sign Up
                  </button>
                )}
              </div>

              {/* Signups list — matches ShiftSlot */}
              <div className="px-3 py-2 min-h-[36px]">
                {shiftSignups.length === 0 ? (
                  <p className="font-mono text-[10px] text-gray-400 italic">no one signed up yet</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {shiftSignups.map((signup) => {
                      const color = getBookingColor(signup.name, colorMap);
                      return (
                        <div
                          key={signup.id}
                          className={`group inline-flex items-center gap-1.5 border-l-4 px-2 py-1 text-xs font-bold ${color.bg} ${color.border} ${color.text}`}
                        >
                          <span className="truncate max-w-[120px]">{signup.name}</span>
                          {!isPastWeek && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Remove ${signup.name} from ${shift.name}?`)) {
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
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
