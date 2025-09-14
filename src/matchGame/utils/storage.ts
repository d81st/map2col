import { type Connection } from "./types";
import { ITEMS } from "./constants";

const KEY = "connections";

export function saveConnections(connections: Connection[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(connections));
  } catch (err) {
    console.error("Не удалось сохранить соединения", err);
  }
}

export function restoreConnections(): Connection[] {
  try {
    const data = localStorage.getItem(KEY);
    if (!data) return [];

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((c: any): c is Connection => {
      if (!c || typeof c.from !== "string" || typeof c.to !== "string")
        return false;
      const validFrom = ITEMS.some(
        (i) => i.id === c.from && i.key === "properties"
      );
      const validTo = ITEMS.some((i) => i.id === c.to && i.key === "options");
      return validFrom && validTo;
    });
  } catch (err) {
    console.error("Не удалось восстановить соединения", err);
    return [];
  }
}

export function clearConnections() {
  localStorage.removeItem(KEY);
}
