"use client";

import { useState, useEffect, useCallback } from "react";
import { Signup } from "@/lib/types";
import toast from "react-hot-toast";

export function useSignups(weekStart: Date, weekEnd: Date) {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);

  const toDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const fetchSignups = useCallback(
    async (showLoading = false) => {
      if (showLoading) setLoading(true);
      try {
        const res = await fetch(
          `/api/signups?weekStart=${toDateStr(weekStart)}&weekEnd=${toDateStr(weekEnd)}`
        );
        if (!res.ok) throw new Error("fetch failed");
        const data: Signup[] = await res.json();
        setSignups(data);
      } catch {
        toast.error("Failed to load signups");
      }
      setLoading(false);
    },
    [weekStart, weekEnd]
  );

  useEffect(() => {
    fetchSignups(true);
  }, [fetchSignups]);

  const createSignup = async (signup: {
    name: string;
    shift_id: string;
    date: string;
  }): Promise<boolean> => {
    try {
      const res = await fetch("/api/signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signup),
      });

      if (res.status === 409) {
        toast.error("You're already signed up for this shift");
        return false;
      }
      if (!res.ok) throw new Error("create failed");

      const data: Signup = await res.json();
      setSignups((prev) => [...prev, data]);
      toast.success("Signed up!");
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
      const res = await fetch(`/api/signups/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Removed from shift");
    } catch {
      toast.error("Failed to remove signup");
      setSignups(prev);
    }
  };

  return { signups, loading, createSignup, deleteSignup, refetch: fetchSignups };
}
