"use client";

import { useState, useEffect } from "react";
import { isPastDay, toDateString } from "@/lib/dateUtils";

interface CustomShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDaily: (input: {
    name: string;
    startTime: string;
    endTime: string;
    maxSignups: number;
    dates: string[];
  }) => Promise<boolean>;
  onSubmitWeekly: (input: { name: string; maxSignups: number }) => Promise<boolean>;
  weekDays: Date[];
  isMobile: boolean;
}

export function CustomShiftModal({
  isOpen,
  onClose,
  onSubmitDaily,
  onSubmitWeekly,
  weekDays,
  isMobile,
}: CustomShiftModalProps) {
  const [type, setType] = useState<"daily" | "weekly">("daily");
  const [name, setName] = useState("");
  const [maxSignups, setMaxSignups] = useState(2);
  const [startTime, setStartTime] = useState("12:00");
  const [endTime, setEndTime] = useState("13:00");
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set());
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setType("daily");
    setName("");
    setMaxSignups(2);
    setStartTime("12:00");
    setEndTime("13:00");
    setSelectedDays(new Set());
    setError("");
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleDay = (i: number) => {
    setSelectedDays((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("enter a shift name"); return; }
    if (maxSignups < 1) { setError("max signups must be at least 1"); return; }

    setSubmitting(true);
    let ok: boolean;
    if (type === "daily") {
      if (selectedDays.size === 0) { setError("pick at least one day"); setSubmitting(false); return; }
      if (!startTime || !endTime) { setError("pick start and end times"); setSubmitting(false); return; }
      const dates = Array.from(selectedDays).sort().map((i) => toDateString(weekDays[i]));
      ok = await onSubmitDaily({ name: name.trim(), startTime, endTime, maxSignups, dates });
    } else {
      ok = await onSubmitWeekly({ name: name.trim(), maxSignups });
    }
    setSubmitting(false);
    if (ok) onClose();
  };

  const inputClass =
    "border-2 border-gray-900 bg-white px-4 py-3 text-base font-mono focus:bg-lime-50 focus:outline-none transition-colors placeholder:text-gray-300";

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500">Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("daily")}
            className={`flex-1 border-2 border-gray-900 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-colors ${
              type === "daily" ? "bg-gray-900 text-amber-50" : "bg-white hover:bg-gray-100"
            }`}
          >
            Daily
          </button>
          <button
            type="button"
            onClick={() => setType("weekly")}
            className={`flex-1 border-2 border-gray-900 px-4 py-3 font-mono text-sm font-bold uppercase tracking-wider transition-colors ${
              type === "weekly" ? "bg-gray-900 text-amber-50" : "bg-white hover:bg-gray-100"
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={type === "daily" ? "e.g. Extra Dishes" : "e.g. Welcome Crew"}
          className={inputClass}
          autoFocus={!isMobile}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500">Max Signups</label>
        <input
          type="number"
          min={1}
          value={maxSignups}
          onChange={(e) => setMaxSignups(Number(e.target.value))}
          className={inputClass}
        />
      </div>

      {type === "daily" && (
        <>
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500">Days</label>
            <div className="flex flex-wrap gap-1.5">
              {weekDays.map((d, i) => {
                const past = isPastDay(d);
                const active = selectedDays.has(i);
                return (
                  <button
                    type="button"
                    key={i}
                    disabled={past}
                    onClick={() => toggleDay(i)}
                    className={`flex flex-col items-center px-3 py-2 border-2 min-w-[52px] font-mono transition-colors ${
                      past
                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : active
                          ? "border-gray-900 bg-gray-900 text-amber-50"
                          : "border-gray-900 bg-white hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold">
                      {d.toLocaleDateString([], { weekday: "short" })}
                    </span>
                    <span className="text-lg font-black leading-none">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500">Start</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="font-mono text-[10px] uppercase tracking-[0.15em] font-bold text-gray-500">End</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </>
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
          {submitting ? "adding..." : "Add Shift"}
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
          <h3 className="text-2xl font-black tracking-tight text-gray-900 mb-5">Add Custom Shift</h3>
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
          <h3 className="text-2xl font-black tracking-tight text-gray-900">Add Custom Shift</h3>
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
