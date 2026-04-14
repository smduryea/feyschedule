export interface Shift {
  id: string;
  name: string;
  startTime: string; // "HH:MM" format
  endTime: string;   // "HH:MM" format
  maxSignups: number;
}

export interface WeeklyShift {
  id: string;
  name: string;
  maxSignups: number;
}

export interface Signup {
  id: string;
  name: string;
  shift_id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  created_at: string;
}

export interface WeeklySignup {
  id: string;
  name: string;
  shift_id: string;
  week_start: string; // ISO date string (YYYY-MM-DD) — the Monday
  created_at: string;
}
