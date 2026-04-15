// Shared payload format for dragging a signup badge to a new shift.

export const DND_MIME = "application/x-shift-signup";

export type DragPayload =
  | { kind: "daily"; signupId: string }
  | { kind: "weekly"; signupId: string };

export function setDragPayload(e: React.DragEvent, payload: DragPayload) {
  e.dataTransfer.setData(DND_MIME, JSON.stringify(payload));
  e.dataTransfer.effectAllowed = "move";
}

export function readDragPayload(e: React.DragEvent): DragPayload | null {
  const raw = e.dataTransfer.getData(DND_MIME);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DragPayload;
  } catch {
    return null;
  }
}
