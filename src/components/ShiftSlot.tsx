"use client";

import { Signup, Shift } from "@/lib/types";
import { formatShiftTime } from "@/lib/shifts";
import { getBookingColor } from "@/lib/colors";

interface ShiftSlotProps {
  shift: Shift;
  signups: Signup[];
  colorMap: Record<string, import("@/lib/colors").BookingPalette>;
  onSignUp: (shiftId: string) => void;
  onRemove: (signupId: string) => void;
  disabled: boolean;
}

export function ShiftSlot({ shift, signups, colorMap, onSignUp, onRemove, disabled }: ShiftSlotProps) {
  const isFull = signups.length >= shift.maxSignups;

  return (
    <div className="flex-1 bg-white flex flex-col">
      {/* Shift header */}
      <div className="flex flex-col px-3 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-xs text-gray-900 uppercase tracking-wide whitespace-nowrap">{shift.name}</span>
          <span className="font-mono text-[10px] text-gray-400">{signups.length}/{shift.maxSignups}</span>
        </div>
        <span className="font-mono text-[10px] text-gray-500">
          {formatShiftTime(shift.startTime)} – {formatShiftTime(shift.endTime)}
        </span>
        {!isFull && (
          <button
            onClick={() => onSignUp(shift.id)}
            disabled={disabled}
            className="mt-1.5 self-start text-[10px] font-bold uppercase tracking-wider border-2 border-gray-900 px-2.5 py-1 hover:bg-lime-300 transition-colors active:translate-y-0.5 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            + Sign Up
          </button>
        )}
      </div>

      {/* Signups list */}
      <div className="px-3 py-2 min-h-[36px]">
        {signups.length === 0 ? (
          <p className="font-mono text-[10px] text-gray-400 italic">no one signed up yet</p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {signups.map((signup) => {
              const color = getBookingColor(signup.name, colorMap);
              return (
                <div
                  key={signup.id}
                  className={`group inline-flex items-center gap-1.5 border-l-4 px-2 py-1 text-xs font-bold ${color.bg} ${color.border} ${color.text}`}
                >
                  <span className="truncate max-w-[120px]">{signup.name}</span>
                  {!disabled && (
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
}
