import { useEffect, useState } from "react";
import { type Connection } from "../utils/types";

type TempLine = { x1: number; y1: number; x2: number; y2: number };

export function useTempLine(
  selected: string | null,
  setSelected: (id: string | null) => void,
  connections: Connection[],
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>,
  containerRef: React.RefObject<HTMLDivElement>
) {
  const [tempLine, setTempLine] = useState<TempLine | null>(null);

  useEffect(() => {
    if (!tempLine) return;

    const updateLine = (x: number, y: number) => {
      const box = containerRef.current?.getBoundingClientRect();
      if (!box) return;
      setTempLine((line) =>
        line ? { ...line, x2: x - box.left, y2: y - box.top } : null
      );
    };

    const endLine = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y) as HTMLElement | null;
      const itemEl = el?.closest("[data-id]") as HTMLElement | null;
      if (itemEl && selected) {
        const targetId = itemEl.dataset.id!;
        const targetKey = itemEl.dataset.key!;
        const already = connections.some(
          (c) => c.from === selected || c.to === targetId
        );
        if (targetKey === "options" && !already) {
          setConnections((prev) => [...prev, { from: selected, to: targetId }]);
        }
      }
      setSelected(null);
      setTempLine(null);
    };

    const handlePointerMove = (e: PointerEvent) =>
      updateLine(e.clientX, e.clientY);
    const handlePointerUp = (e: PointerEvent) => endLine(e.clientX, e.clientY);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [tempLine, selected, connections]);

  return { tempLine, setTempLine };
}
