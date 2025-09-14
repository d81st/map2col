import { type Connection } from "./types";
import { ITEMS } from "./constants";

const KEY = "connections";

export function saveConnections(connections: Connection[]) {
  localStorage.setItem(KEY, JSON.stringify(connections));
}

export function restoreConnections(): Connection[] {
  const data = localStorage.getItem(KEY);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (c: any) =>
          c &&
          typeof c.from === "string" &&
          typeof c.to === "string" &&
          ITEMS.some((i) => i.id === c.from && i.key === "properties") &&
          ITEMS.some((i) => i.id === c.to && i.key === "options")
      );
    }
  } catch {
    return [];
  }
  return [];
}

export function clearConnections() {
  localStorage.removeItem(KEY);
}
