"use client";

import { Signup, Shift } from "@/lib/types";
import { formatShiftTime } from "@/lib/shifts";
import { getBookingColor } from "@/lib/colors";
import { setDragPayload } from "@/lib/dnd";

interface ShiftSlotProps {
  shift: Shift;
  signups: Signup[];
  colorMap: Record<string, import("@/lib/colors").BookingPalette>;
  onSignUp: (shiftId: string) => void;
  onRemove: (signupId: string) => void;
  onDeleteShift?: () => void;
  disabled: boolean;
}

export function ShiftSlot({ shift, signups, colorMap, onSignUp, onRemove, onDeleteShift, disabled }: ShiftSlotProps) {
  const openSlots = Math.max(0, shift.maxSignups - signups.length);

  return (
    <div className="flex-1 bg-white flex flex-col">
      {/* Shift header */}
      <div className="flex flex-col px-3 py-2 border-b border-gray-200 bg-gray-50 relative">
        <span className="font-bold text-xs text-gray-900 uppercase tracking-wide whitespace-nowrap">{shift.name}</span>
        <span className="font-mono text-[10px] text-gray-500">
          {formatShiftTime(shift.startTime)} – {formatShiftTime(shift.endTime)}
        </span>
        {onDeleteShift && !disabled && (
          <button
            onClick={() => {
              if (window.confirm(`Delete custom shift "${shift.name}"? Existing signups will also be removed.`)) {
                onDeleteShift();
              }
            }}
            className="absolute top-1.5 right-1.5 h-5 w-5 flex items-center justify-center border border-gray-400 hover:border-gray-900 hover:bg-black/10 transition-colors"
            aria-label={`Delete shift ${shift.name}`}
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
        <div className="flex flex-col items-start gap-1.5">
          {signups.map((signup) => {
            const color = getBookingColor(signup.name, colorMap);
            return (
              <div
                key={signup.id}
                draggable={!disabled}
                onDragStart={(e) => setDragPayload(e, { kind: "daily", signupId: signup.id })}
                className={`group flex w-full items-center gap-1.5 border-l-4 px-2 py-1 text-xs font-bold ${!disabled ? "cursor-grab active:cursor-grabbing" : ""} ${color.bg} ${color.border} ${color.text}`}
                title={!disabled ? "Drag to move to another shift" : undefined}
              >
                <span className="flex-1 min-w-0 truncate">{signup.name}</span>
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
          {Array.from({ length: openSlots }).map((_, i) => (
            <button
              key={`open-${i}`}
              onClick={() => onSignUp(shift.id)}
              disabled={disabled}
              aria-label={`Sign up for ${shift.name}`}
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
}
