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

    const handleMouseMove = (e: MouseEvent) => {
      const box = containerRef.current?.getBoundingClientRect();
      if (!box) return;
      setTempLine((line) =>
        line
          ? { ...line, x2: e.clientX - box.left, y2: e.clientY - box.top }
          : null
      );
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.touches[0];
      const box = containerRef.current?.getBoundingClientRect();
      if (!box) return;
      setTempLine((line) =>
        line
          ? { ...line, x2: t.clientX - box.left, y2: t.clientY - box.top }
          : null
      );
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const t = e.changedTouches[0];
      const el = document.elementFromPoint(
        t.clientX,
        t.clientY
      ) as HTMLElement | null;
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

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [tempLine, selected, connections]);

  return { tempLine, setTempLine };
}
