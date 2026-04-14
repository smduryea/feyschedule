"use client";

import { useState, useEffect } from "react";
import { SHIFTS, WEEKLY_SHIFTS } from "@/lib/shifts";
import { formatShiftTime } from "@/lib/shifts";
import { isPastDay, toDateString } from "@/lib/dateUtils";

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (signup: { name: string; shift_id: string; date: string }) => Promise<boolean>;
  onSubmitWeekly: (signup: { name: string; shift_id: string }) => Promise<boolean>;
  selectedDate: Date | null;
  selectedShiftId: string | null;
  weekDays: Date[];
  isMobile: boolean;
}

export function SignupModal({
  isOpen, onClose, onSubmit, onSubmitWeekly, selectedDate, selectedShiftId, weekDays, isMobile,
}: SignupModalProps) {
  const [name, setName] = useState("");
  const [dateIndex, setDateIndex] = useState(0);
  const [shiftId, setShiftId] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isWeeklyShift = WEEKLY_SHIFTS.some((s) => s.id === shiftId);

  useEffect(() => {
    if (!isOpen) return;

    if (selectedDate) {
      const idx = weekDays.findIndex((d) => d.toDateString() === selectedDate.toDateString());
      if (idx >= 0) setDateIndex(idx);
    } else {
      const first = weekDays.findIndex((d) => !isPastDay(d));
      setDateIndex(first >= 0 ? first : 0);
    }
    setName("");
    setShiftId(selectedShiftId ?? SHIFTS[0]?.id ?? "");
    setError("");
  }, [isOpen, selectedDate, selectedShiftId, weekDays]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("enter your name"); return; }
    if (!shiftId) { setError("pick a shift"); return; }

    setSubmitting(true);
    let ok: boolean;
    if (isWeeklyShift) {
      ok = await onSubmitWeekly({ name: name.trim(), shift_id: shiftId });
    } else {
      const d = weekDays[dateIndex];
      ok = await onSubmit({ name: name.trim(), shift_id: shiftId, date: toDateString(d) });
    }
    setSubmitting(false);
    if (ok) onClose();
  };

  const inputClass =
    "border-2 border-gray-900 bg-white px-4 py-3 text-base font-mono focus:bg-lime-50 focus:outline-none transition-colors placeholder:text-gray-300";

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="your name"
          className={inputClass}
          autoFocus={!isMobile}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500">Shift</label>
        <select value={shiftId} onChange={(e) => setShiftId(e.target.value)} className={inputClass}>
          <optgroup label="Daily">
            {SHIFTS.map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.name} ({formatShiftTime(shift.startTime)} – {formatShiftTime(shift.endTime)})
              </option>
            ))}
          </optgroup>
          <optgroup label="Weekly">
            {WEEKLY_SHIFTS.map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.name} (weekly)
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {!isWeeklyShift && (
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500">Date</label>
          <select value={dateIndex} onChange={(e) => setDateIndex(Number(e.target.value))} className={inputClass}>
            {weekDays.map((d, i) => (
              <option key={i} value={i} disabled={isPastDay(d)}>
                {d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
                {isPastDay(d) ? " (past)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <div className="border-2 border-red-500 bg-red-50 px-4 py-2 font-mono text-sm text-red-700 font-bold">
          {error}
        </div>
      )}

      <div className={`flex gap-2 mt-2 ${isMobile ? "flex-col-reverse" : "justify-end"}`}>
        <button
          type="button"
          onClick={onClose}
          className={`border-2 border-gray-900 px-5 py-3 font-mono text-sm font-bold uppercase tracking-wider hover:bg-gray-100 transition-colors active:translate-y-0.5 ${isMobile ? "w-full" : ""}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className={`border-2 border-gray-900 bg-fuchsia-400 px-5 py-3 font-mono text-sm font-bold uppercase tracking-wider text-fuchsia-950 hover:bg-fuchsia-500 disabled:opacity-50 transition-colors active:translate-y-0.5 ${isMobile ? "w-full" : ""}`}
        >
          {submitting ? "signing up..." : "Sign Up"}
        </button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-end animate-fade-in" onClick={onClose}>
        <div className="absolute inset-0 bg-black/40" />
        <div
          className="relative w-full border-t-4 border-gray-900 bg-amber-50 px-4 pb-8 pt-5 animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto mb-4 h-1 w-12 bg-gray-300" />
          <h3 className="text-2xl font-black tracking-tight text-gray-900 mb-5">Sign Up for Shift</h3>
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative w-full max-w-md border-4 border-gray-900 bg-amber-50 p-7 animate-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-lime-300 border-2 border-gray-900" />
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-fuchsia-400 border-2 border-gray-900 rotate-45" />

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black tracking-tight text-gray-900">Sign Up for Shift</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center border-2 border-gray-900 hover:bg-gray-900 hover:text-amber-50 transition-colors text-xl font-bold leading-none"
          >
            &times;
          </button>
        </div>
        {formContent}
      </div>
    </div>
  );
}
