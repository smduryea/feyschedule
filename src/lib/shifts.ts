import { Shift, WeeklyShift } from "./types";

export const WEEKLY_SHIFTS: WeeklyShift[] = [
  { id: "week-leads", name: "Week Leads", maxSignups: 2 },
  { id: "emotional-ecologists", name: "Emotional Ecologists", maxSignups: 2 },
  { id: "drivers", name: "Drivers", maxSignups: 2 },
  { id: "fire", name: "Fire", maxSignups: 2 },
  { id: "cosmic-spa", name: "Cosmic Spa", maxSignups: 3 },
  { id: "space-fairies", name: "Space Fairies", maxSignups: 3 },
  { id: "gggg", name: "GGGG", maxSignups: 2 },
  { id: "maintenance", name: "Maintenance", maxSignups: 1 },
];

export const SHIFTS: Shift[] = [
  { id: "pre-lunch-dishes", name: "Pre Lunch Dishes", startTime: "12:00", endTime: "13:00", maxSignups: 2 },
  { id: "post-lunch-dishes", name: "Post Lunch Dishes", startTime: "14:00", endTime: "15:00", maxSignups: 2 },
  { id: "cooking-1", name: "Cooking Shift", startTime: "16:30", endTime: "18:30", maxSignups: 2 },
  { id: "cooking-2", name: "Cooking Shift", startTime: "17:30", endTime: "19:30", maxSignups: 2 },
  { id: "pre-dinner-dishes", name: "Pre Dinner Dishes", startTime: "18:00", endTime: "19:00", maxSignups: 2 },
  { id: "post-dinner-dishes", name: "Post Dinner Dishes", startTime: "20:00", endTime: "21:30", maxSignups: 3 },
];

export function getShiftById(id: string): Shift | undefined {
  return SHIFTS.find((s) => s.id === id);
}

export function getWeeklyShiftById(id: string): WeeklyShift | undefined {
  return WEEKLY_SHIFTS.find((s) => s.id === id);
}

export function formatShiftTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}
