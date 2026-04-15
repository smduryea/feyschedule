export type BookingPalette = typeof PALETTES[number];

// 51 visually distinct palettes organized in three tiers of 17 hues each.
// First tier (vibrant 300 backgrounds) is assigned first, so the first 17
// distinct names get the most perceptually distinct colors. Subsequent names
// cycle through darker (tier 400) and pastel (tier 100) variants of the same
// hues. Every class string is a literal so Tailwind's JIT can detect them.
const PALETTES = [
  // --- Tier 1: bg-300 (vibrant) ---
  { bg: "bg-rose-300", text: "text-rose-900", border: "border-rose-600", sub: "text-rose-700", hover: "hover:bg-rose-400", active: "active:bg-rose-400", ring: "ring-rose-400" },
  { bg: "bg-amber-300", text: "text-amber-900", border: "border-amber-600", sub: "text-amber-700", hover: "hover:bg-amber-400", active: "active:bg-amber-400", ring: "ring-amber-400" },
  { bg: "bg-lime-300", text: "text-lime-900", border: "border-lime-600", sub: "text-lime-700", hover: "hover:bg-lime-400", active: "active:bg-lime-400", ring: "ring-lime-400" },
  { bg: "bg-emerald-300", text: "text-emerald-900", border: "border-emerald-600", sub: "text-emerald-700", hover: "hover:bg-emerald-400", active: "active:bg-emerald-400", ring: "ring-emerald-400" },
  { bg: "bg-cyan-300", text: "text-cyan-900", border: "border-cyan-600", sub: "text-cyan-700", hover: "hover:bg-cyan-400", active: "active:bg-cyan-400", ring: "ring-cyan-400" },
  { bg: "bg-blue-300", text: "text-blue-900", border: "border-blue-600", sub: "text-blue-700", hover: "hover:bg-blue-400", active: "active:bg-blue-400", ring: "ring-blue-400" },
  { bg: "bg-violet-300", text: "text-violet-900", border: "border-violet-600", sub: "text-violet-700", hover: "hover:bg-violet-400", active: "active:bg-violet-400", ring: "ring-violet-400" },
  { bg: "bg-fuchsia-300", text: "text-fuchsia-900", border: "border-fuchsia-600", sub: "text-fuchsia-700", hover: "hover:bg-fuchsia-400", active: "active:bg-fuchsia-400", ring: "ring-fuchsia-400" },
  { bg: "bg-red-300", text: "text-red-900", border: "border-red-600", sub: "text-red-700", hover: "hover:bg-red-400", active: "active:bg-red-400", ring: "ring-red-400" },
  { bg: "bg-orange-300", text: "text-orange-900", border: "border-orange-600", sub: "text-orange-700", hover: "hover:bg-orange-400", active: "active:bg-orange-400", ring: "ring-orange-400" },
  { bg: "bg-yellow-300", text: "text-yellow-900", border: "border-yellow-600", sub: "text-yellow-700", hover: "hover:bg-yellow-400", active: "active:bg-yellow-400", ring: "ring-yellow-400" },
  { bg: "bg-green-300", text: "text-green-900", border: "border-green-600", sub: "text-green-700", hover: "hover:bg-green-400", active: "active:bg-green-400", ring: "ring-green-400" },
  { bg: "bg-teal-300", text: "text-teal-900", border: "border-teal-600", sub: "text-teal-700", hover: "hover:bg-teal-400", active: "active:bg-teal-400", ring: "ring-teal-400" },
  { bg: "bg-sky-300", text: "text-sky-900", border: "border-sky-600", sub: "text-sky-700", hover: "hover:bg-sky-400", active: "active:bg-sky-400", ring: "ring-sky-400" },
  { bg: "bg-indigo-300", text: "text-indigo-900", border: "border-indigo-600", sub: "text-indigo-700", hover: "hover:bg-indigo-400", active: "active:bg-indigo-400", ring: "ring-indigo-400" },
  { bg: "bg-purple-300", text: "text-purple-900", border: "border-purple-600", sub: "text-purple-700", hover: "hover:bg-purple-400", active: "active:bg-purple-400", ring: "ring-purple-400" },
  { bg: "bg-pink-300", text: "text-pink-900", border: "border-pink-600", sub: "text-pink-700", hover: "hover:bg-pink-400", active: "active:bg-pink-400", ring: "ring-pink-400" },

  // --- Tier 2: bg-400 (deeper) ---
  { bg: "bg-rose-400", text: "text-rose-950", border: "border-rose-700", sub: "text-rose-800", hover: "hover:bg-rose-500", active: "active:bg-rose-500", ring: "ring-rose-500" },
  { bg: "bg-amber-400", text: "text-amber-950", border: "border-amber-700", sub: "text-amber-800", hover: "hover:bg-amber-500", active: "active:bg-amber-500", ring: "ring-amber-500" },
  { bg: "bg-lime-400", text: "text-lime-950", border: "border-lime-700", sub: "text-lime-800", hover: "hover:bg-lime-500", active: "active:bg-lime-500", ring: "ring-lime-500" },
  { bg: "bg-emerald-400", text: "text-emerald-950", border: "border-emerald-700", sub: "text-emerald-800", hover: "hover:bg-emerald-500", active: "active:bg-emerald-500", ring: "ring-emerald-500" },
  { bg: "bg-cyan-400", text: "text-cyan-950", border: "border-cyan-700", sub: "text-cyan-800", hover: "hover:bg-cyan-500", active: "active:bg-cyan-500", ring: "ring-cyan-500" },
  { bg: "bg-blue-400", text: "text-blue-950", border: "border-blue-700", sub: "text-blue-800", hover: "hover:bg-blue-500", active: "active:bg-blue-500", ring: "ring-blue-500" },
  { bg: "bg-violet-400", text: "text-violet-950", border: "border-violet-700", sub: "text-violet-800", hover: "hover:bg-violet-500", active: "active:bg-violet-500", ring: "ring-violet-500" },
  { bg: "bg-fuchsia-400", text: "text-fuchsia-950", border: "border-fuchsia-700", sub: "text-fuchsia-800", hover: "hover:bg-fuchsia-500", active: "active:bg-fuchsia-500", ring: "ring-fuchsia-500" },
  { bg: "bg-red-400", text: "text-red-950", border: "border-red-700", sub: "text-red-800", hover: "hover:bg-red-500", active: "active:bg-red-500", ring: "ring-red-500" },
  { bg: "bg-orange-400", text: "text-orange-950", border: "border-orange-700", sub: "text-orange-800", hover: "hover:bg-orange-500", active: "active:bg-orange-500", ring: "ring-orange-500" },
  { bg: "bg-yellow-400", text: "text-yellow-950", border: "border-yellow-700", sub: "text-yellow-800", hover: "hover:bg-yellow-500", active: "active:bg-yellow-500", ring: "ring-yellow-500" },
  { bg: "bg-green-400", text: "text-green-950", border: "border-green-700", sub: "text-green-800", hover: "hover:bg-green-500", active: "active:bg-green-500", ring: "ring-green-500" },
  { bg: "bg-teal-400", text: "text-teal-950", border: "border-teal-700", sub: "text-teal-800", hover: "hover:bg-teal-500", active: "active:bg-teal-500", ring: "ring-teal-500" },
  { bg: "bg-sky-400", text: "text-sky-950", border: "border-sky-700", sub: "text-sky-800", hover: "hover:bg-sky-500", active: "active:bg-sky-500", ring: "ring-sky-500" },
  { bg: "bg-indigo-400", text: "text-indigo-950", border: "border-indigo-700", sub: "text-indigo-800", hover: "hover:bg-indigo-500", active: "active:bg-indigo-500", ring: "ring-indigo-500" },
  { bg: "bg-purple-400", text: "text-purple-950", border: "border-purple-700", sub: "text-purple-800", hover: "hover:bg-purple-500", active: "active:bg-purple-500", ring: "ring-purple-500" },
  { bg: "bg-pink-400", text: "text-pink-950", border: "border-pink-700", sub: "text-pink-800", hover: "hover:bg-pink-500", active: "active:bg-pink-500", ring: "ring-pink-500" },

  // --- Tier 3: bg-100 (pastel) ---
  { bg: "bg-rose-100", text: "text-rose-900", border: "border-rose-500", sub: "text-rose-700", hover: "hover:bg-rose-200", active: "active:bg-rose-200", ring: "ring-rose-300" },
  { bg: "bg-amber-100", text: "text-amber-900", border: "border-amber-500", sub: "text-amber-700", hover: "hover:bg-amber-200", active: "active:bg-amber-200", ring: "ring-amber-300" },
  { bg: "bg-lime-100", text: "text-lime-900", border: "border-lime-500", sub: "text-lime-700", hover: "hover:bg-lime-200", active: "active:bg-lime-200", ring: "ring-lime-300" },
  { bg: "bg-emerald-100", text: "text-emerald-900", border: "border-emerald-500", sub: "text-emerald-700", hover: "hover:bg-emerald-200", active: "active:bg-emerald-200", ring: "ring-emerald-300" },
  { bg: "bg-cyan-100", text: "text-cyan-900", border: "border-cyan-500", sub: "text-cyan-700", hover: "hover:bg-cyan-200", active: "active:bg-cyan-200", ring: "ring-cyan-300" },
  { bg: "bg-blue-100", text: "text-blue-900", border: "border-blue-500", sub: "text-blue-700", hover: "hover:bg-blue-200", active: "active:bg-blue-200", ring: "ring-blue-300" },
  { bg: "bg-violet-100", text: "text-violet-900", border: "border-violet-500", sub: "text-violet-700", hover: "hover:bg-violet-200", active: "active:bg-violet-200", ring: "ring-violet-300" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-900", border: "border-fuchsia-500", sub: "text-fuchsia-700", hover: "hover:bg-fuchsia-200", active: "active:bg-fuchsia-200", ring: "ring-fuchsia-300" },
  { bg: "bg-red-100", text: "text-red-900", border: "border-red-500", sub: "text-red-700", hover: "hover:bg-red-200", active: "active:bg-red-200", ring: "ring-red-300" },
  { bg: "bg-orange-100", text: "text-orange-900", border: "border-orange-500", sub: "text-orange-700", hover: "hover:bg-orange-200", active: "active:bg-orange-200", ring: "ring-orange-300" },
  { bg: "bg-yellow-100", text: "text-yellow-900", border: "border-yellow-500", sub: "text-yellow-700", hover: "hover:bg-yellow-200", active: "active:bg-yellow-200", ring: "ring-yellow-300" },
  { bg: "bg-green-100", text: "text-green-900", border: "border-green-500", sub: "text-green-700", hover: "hover:bg-green-200", active: "active:bg-green-200", ring: "ring-green-300" },
  { bg: "bg-teal-100", text: "text-teal-900", border: "border-teal-500", sub: "text-teal-700", hover: "hover:bg-teal-200", active: "active:bg-teal-200", ring: "ring-teal-300" },
  { bg: "bg-sky-100", text: "text-sky-900", border: "border-sky-500", sub: "text-sky-700", hover: "hover:bg-sky-200", active: "active:bg-sky-200", ring: "ring-sky-300" },
  { bg: "bg-indigo-100", text: "text-indigo-900", border: "border-indigo-500", sub: "text-indigo-700", hover: "hover:bg-indigo-200", active: "active:bg-indigo-200", ring: "ring-indigo-300" },
  { bg: "bg-purple-100", text: "text-purple-900", border: "border-purple-500", sub: "text-purple-700", hover: "hover:bg-purple-200", active: "active:bg-purple-200", ring: "ring-purple-300" },
  { bg: "bg-pink-100", text: "text-pink-900", border: "border-pink-500", sub: "text-pink-700", hover: "hover:bg-pink-200", active: "active:bg-pink-200", ring: "ring-pink-300" },
] as const;

const FALLBACK = PALETTES[0];

// Build a map of unique names → colors. With 51 palettes, up to 51 unique
// names get guaranteed-distinct colors before any repeat.
export function buildColorMap(names: string[]): Record<string, BookingPalette> {
  const unique = [...new Set(names.map((n) => n.toLowerCase()))];
  const map: Record<string, BookingPalette> = {};
  unique.forEach((name, i) => {
    map[name] = PALETTES[i % PALETTES.length];
  });
  return map;
}

export function getBookingColor(name: string, colorMap?: Record<string, BookingPalette>): BookingPalette {
  return colorMap?.[name.toLowerCase()] ?? FALLBACK;
}
