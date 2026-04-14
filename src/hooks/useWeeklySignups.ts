"use client";

import { useState, useEffect, useCallback } from "react";
import { WeeklySignup } from "@/lib/types";
import toast from "react-hot-toast";

export function useWeeklySignups(weekStart: Date) {
  const [signups, setSignups] = useState<WeeklySignup[]>([]);
  const [loading, setLoading] = useState(true);

  const toDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const weekStartStr = toDateStr(weekStart);

  const fetchSignups = useCallback(
    async (showLoading = false) => {
      if (showLoading) setLoading(true);
      try {
        const res = await fetch(`/api/weekly-signups?weekStart=${weekStartStr}`);
        if (!res.ok) throw new Error("fetch failed");
        const data: WeeklySignup[] = await res.json();
        setSignups(data);
      } catch {
        toast.error("Failed to load weekly signups");
      }
      setLoading(false);
    },
    [weekStartStr]
  );

  useEffect(() => {
    fetchSignups(true);
  }, [fetchSignups]);

  const createSignup = async (signup: {
    name: string;
    shift_id: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch("/api/weekly-signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...signup, week_start: weekStartStr }),
      });

      if (res.status === 409) {
        toast.error("You're already signed up for this weekly shift");
        return false;
      }
      if (!res.ok) throw new Error("create failed");

      const data: WeeklySignup = await res.json();
      setSignups((prev) => [...prev, data]);
      toast.success("Signed up for weekly shift!");
      return true;
    } catch {
      toast.error("Failed to sign up");
      fetchSignups();
      return false;
    }
  };

  const deleteSignup = async (id: string) => {
    const prev = signups;
    setSignups((s) => s.filter((x) => x.id !== id));

    try {
      const res = await fetch(`/api/weekly-signups/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Removed from weekly shift");
    } catch {
      toast.error("Failed to remove signup");
      setSignups(prev);
    }
  };

  return { signups, loading, createSignup, deleteSignup };
}
