"use client";

import { useState, useMemo } from "react";
import { useWeekNavigation } from "@/hooks/useWeekNavigation";
import { useSignups } from "@/hooks/useSignups";
import { useWeeklySignups } from "@/hooks/useWeeklySignups";
import { useIsMobile } from "@/hooks/useIsMobile";
import { getDaysOfWeek, isPastDay } from "@/lib/dateUtils";
import { buildColorMap } from "@/lib/colors";
import { WeekNavigator } from "@/components/WeekNavigator";
import { WeekGrid } from "@/components/WeekGrid";
import { WeeklyShiftsPanel } from "@/components/WeeklyShiftsPanel";
import { SignupModal } from "@/components/SignupModal";
import { WeeklySignupModal } from "@/components/WeeklySignupModal";

export default function Home() {
  const isMobile = useIsMobile();
  const { weekStart, weekEnd, weekLabel, goNextWeek, goPrevWeek, goToday, isCurrentWeek } =
    useWeekNavigation();
  const { signups, loading, createSignup, deleteSignup } = useSignups(weekStart, weekEnd);
  const { signups: weeklySignups, loading: weeklyLoading, createSignup: createWeeklySignup, deleteSignup: deleteWeeklySignup } = useWeeklySignups(weekStart);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);

  const [weeklyModalOpen, setWeeklyModalOpen] = useState(false);
  const [selectedWeeklyShiftId, setSelectedWeeklyShiftId] = useState<string | null>(null);

  const weekDays = getDaysOfWeek(weekStart);
  const allNames = [...signups.map((s) => s.name), ...weeklySignups.map((s) => s.name)];
  const colorMap = useMemo(() => buildColorMap(allNames), [allNames]);

  const isPastWeek = isPastDay(weekDays[weekDays.length - 1]);

  const handleSignUp = (shiftId: string, date: Date) => {
    setSelectedDate(date);
    setSelectedShiftId(shiftId);
    setModalOpen(true);
  };

  const handleNewSignup = () => {
    setSelectedDate(null);
    setSelectedShiftId(null);
    setModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-600 mb-1 sm:text-xs">community resource</p>
            <h1 className="text-3xl font-black tracking-tighter text-gray-900 sm:text-5xl leading-none">
              Shift<br className="sm:hidden" /> Schedule
            </h1>
          </div>
          <button
            onClick={handleNewSignup}
            className="shrink-0 border-2 border-gray-900 bg-lime-300 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-gray-900 hover:bg-lime-400 active:translate-y-0.5 transition-all sm:px-6 sm:py-3"
          >
            + Sign Up
          </button>
        </div>
        <div className="h-1 bg-gray-900 w-full" />
      </div>

      {/* Navigation */}
      <div className="mb-5 sm:mb-6">
        <WeekNavigator
          weekLabel={weekLabel}
          isCurrentWeek={isCurrentWeek}
          onPrev={goPrevWeek}
          onNext={goNextWeek}
          onToday={goToday}
        />
      </div>

      {/* Schedule */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="font-mono text-sm text-gray-600 animate-pulse">loading schedule...</div>
        </div>
      ) : (
        <WeekGrid
          weekStart={weekStart}
          signups={signups}
          colorMap={colorMap}
          onSignUp={handleSignUp}
          onRemove={deleteSignup}
          isMobile={isMobile}
        />
      )}

      {/* Weekly Shifts */}
      <div className="mt-5 sm:mt-6">
        {weeklyLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="font-mono text-sm text-gray-600 animate-pulse">loading weekly shifts...</div>
          </div>
        ) : (
          <WeeklyShiftsPanel
            signups={weeklySignups}
            colorMap={colorMap}
            onSignUp={(shiftId) => {
              setSelectedWeeklyShiftId(shiftId);
              setWeeklyModalOpen(true);
            }}
            onRemove={deleteWeeklySignup}
            isPastWeek={isPastWeek}
          />
        )}
      </div>

      {/* Bottom hint */}
      <p className="mt-4 font-mono text-[10px] text-gray-500 text-center sm:text-xs">
        click &quot;+ sign up&quot; on any shift to join
      </p>

      <SignupModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={createSignup}
        onSubmitWeekly={createWeeklySignup}
        selectedDate={selectedDate}
        selectedShiftId={selectedShiftId}
        weekDays={weekDays}
        isMobile={isMobile}
      />

      <WeeklySignupModal
        isOpen={weeklyModalOpen}
        onClose={() => setWeeklyModalOpen(false)}
        onSubmit={createWeeklySignup}
        selectedShiftId={selectedWeeklyShiftId}
        isMobile={isMobile}
      />
    </div>
  );
}
