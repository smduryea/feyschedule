"use client";

import { useState, useEffect, useCallback } from "react";
import { CustomDailyShift, CustomWeeklyShift } from "@/lib/types";
import toast from "react-hot-toast";

export function useCustomShifts(weekStart: Date) {
  const [daily, setDaily] = useState<CustomDailyShift[]>([]);
  const [weekly, setWeekly] = useState<CustomWeeklyShift[]>([]);
  const [loading, setLoading] = useState(true);

  const toDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const weekStartStr = toDateStr(weekStart);

  const fetchShifts = useCallback(
    async (showLoading = false) => {
      if (showLoading) setLoading(true);
      try {
        const res = await fetch(`/api/custom-shifts?weekStart=${weekStartStr}`);
        if (!res.ok) throw new Error("fetch failed");
        const data: { daily: CustomDailyShift[]; weekly: CustomWeeklyShift[] } = await res.json();
        setDaily(data.daily);
        setWeekly(data.weekly);
      } catch {
        toast.error("Failed to load custom shifts");
      }
      setLoading(false);
    },
    [weekStartStr]
  );

  useEffect(() => {
    fetchShifts(true);
  }, [fetchShifts]);

  const createDaily = async (input: {
    name: string;
    startTime: string;
    endTime: string;
    maxSignups: number;
    dates: string[];
  }): Promise<boolean> => {
    try {
      const res = await fetch("/api/custom-shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "daily", week_start: weekStartStr, ...input }),
      });
      if (!res.ok) throw new Error();
      const data: CustomDailyShift = await res.json();
      setDaily((prev) => [...prev, data]);
      toast.success("Custom shift added");
      return true;
    } catch {
      toast.error("Failed to add custom shift");
      return false;
    }
  };

  const createWeekly = async (input: {
    name: string;
    maxSignups: number;
  }): Promise<boolean> => {
    try {
      const res = await fetch("/api/custom-shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "weekly", week_start: weekStartStr, ...input }),
      });
      if (!res.ok) throw new Error();
      const data: CustomWeeklyShift = await res.json();
      setWeekly((prev) => [...prev, data]);
      toast.success("Custom shift added");
      return true;
    } catch {
      toast.error("Failed to add custom shift");
      return false;
    }
  };

  const deleteDaily = async (id: string) => {
    const prev = daily;
    setDaily((s) => s.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/custom-shifts/${id}?type=daily`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Custom shift removed");
    } catch {
      toast.error("Failed to remove shift");
      setDaily(prev);
    }
  };

  const deleteWeekly = async (id: string) => {
    const prev = weekly;
    setWeekly((s) => s.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/custom-shifts/${id}?type=weekly`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Custom shift removed");
    } catch {
      toast.error("Failed to remove shift");
      setWeekly(prev);
    }
  };

  return { daily, weekly, loading, createDaily, createWeekly, deleteDaily, deleteWeekly, refetch: fetchShifts };
}
