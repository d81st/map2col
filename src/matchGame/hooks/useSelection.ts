import { useRef, useCallback } from "react";
import { type Connection } from "../utils/types";

type Item = { id: string; key: string };

type ItemProps = {
  selected: string | null;
  setSelected: React.Dispatch<React.SetStateAction<string | null>>;
  setTempLine: React.Dispatch<
    React.SetStateAction<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    } | null>
  >;
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  isConnected: (id: string) => boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  itemRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
};

export function useSelection({
  selected,
  setSelected,
  setTempLine,
  setConnections,
  isConnected,
  containerRef,
  itemRefs,
}: ItemProps) {
  const touchActiveRef = useRef(false);

  const startSelection = useCallback(
    (item: Item, clientX: number, clientY: number) => {
      if (selected === item.id) {
        setSelected(null);
        setTempLine(null);
        return;
      }

      if (!selected && item.key === "properties") {
        setSelected(item.id);
        const fromEl = itemRefs.current[item.id];
        const box = containerRef.current?.getBoundingClientRect();
        if (fromEl && box) {
          const rect = fromEl.getBoundingClientRect();
          setTempLine({
            x1: rect.right - box.left,
            y1: rect.top + rect.height / 2 - box.top,
            x2: clientX - box.left,
            y2: clientY - box.top,
          });
        }
      } else if (selected && item.key === "options") {
        setConnections((prev) => [...prev, { from: selected, to: item.id }]);
        setSelected(null);
        setTempLine(null);
      }
    },
    [selected, setSelected, setTempLine, setConnections, containerRef, itemRefs]
  );

  const handleClick = useCallback(
    (item: Item) => {
      if (touchActiveRef.current) return;
      if (isConnected(item.id)) return;

      const fromEl = itemRefs.current[item.id];
      const box = containerRef.current?.getBoundingClientRect();
      if (fromEl && box) {
        const rect = fromEl.getBoundingClientRect();

        const absoluteCenterX = rect.right;
        const absoluteCenterY = rect.top + rect.height / 2;

        startSelection(item, absoluteCenterX, absoluteCenterY);
      }
    },
    [isConnected, containerRef, itemRefs, startSelection]
  );

  const handleTouchStart = useCallback(
    (item: Item, e: React.TouchEvent) => {
      // e?.preventDefault();
      touchActiveRef.current = true;
      setTimeout(() => (touchActiveRef.current = false), 300);
      if (isConnected(item.id)) return;

      const t = e.touches[0];
      startSelection(item, t.clientX, t.clientY);
    },
    [isConnected, startSelection]
  );

  const handleRemove = useCallback(
    (c: Connection) => {
      setConnections((prev) =>
        prev.filter((x) => !(x.from === c.from && x.to === c.to))
      );
    },
    [setConnections]
  );

  return { handleClick, handleTouchStart, handleRemove };
}
