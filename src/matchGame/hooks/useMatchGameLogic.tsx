import { useState, useRef, useCallback, useEffect } from "react";
import { type Connection } from "../utils/types";

type Item = { id: string; key: string };

interface Props {
  containerRef: React.RefObject<HTMLDivElement | null>;
  itemRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

export function useMatchGameLogic({ containerRef, itemRefs }: Props) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [tempLine, setTempLine] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);
  const [linePositions, setLinePositions] = useState<
    {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      from: string;
      to: string;
    }[]
  >([]);

  const touchActiveRef = useRef(false);

  const isConnected = useCallback(
    (id: string) => connections.some((c) => c.from === id || c.to === id),
    [connections]
  );

  // --- Drag & Drop / Selection Logic ---
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
    [selected, itemRefs, containerRef]
  );

  const handleClick = useCallback(
    (item: Item) => {
      if (touchActiveRef.current || isConnected(item.id)) return;

      const fromEl = itemRefs.current[item.id];
      const box = containerRef.current?.getBoundingClientRect();
      if (fromEl && box) {
        const rect = fromEl.getBoundingClientRect();
        startSelection(item, rect.right, rect.top + rect.height / 2);
      }
    },
    [isConnected, itemRefs, containerRef, startSelection]
  );

  const handleTouchStart = useCallback(
    (item: Item, e: React.TouchEvent) => {
      touchActiveRef.current = true;
      setTimeout(() => (touchActiveRef.current = false), 300);
      if (isConnected(item.id)) return;

      const t = e.touches[0];
      startSelection(item, t.clientX, t.clientY);
    },
    [isConnected, startSelection]
  );

  const handleRemove = useCallback((c: Connection) => {
    setConnections((prev) =>
      prev.filter((x) => !(x.from === c.from && x.to === c.to))
    );
  }, []);

  // --- TempLine Drag Logic ---
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

  // --- ResizeObserver для динамических линий ---
  useEffect(() => {
    if (!containerRef.current) return;

    const containerBox = containerRef.current.getBoundingClientRect();

    const updatePositions = () => {
      const newPositions = connections
        .map((c) => {
          const fromEl = itemRefs.current[c.from];
          const toEl = itemRefs.current[c.to];
          if (!fromEl || !toEl) return null;

          const fromBox = fromEl.getBoundingClientRect();
          const toBox = toEl.getBoundingClientRect();

          return {
            from: c.from,
            to: c.to,
            x1: fromBox.right - containerBox.left,
            y1: fromBox.top + fromBox.height / 2 - containerBox.top,
            x2: toBox.left - containerBox.left,
            y2: toBox.top + toBox.height / 2 - containerBox.top,
          };
        })
        .filter(Boolean);

      setLinePositions(newPositions as any);
    };

    const observer = new ResizeObserver(updatePositions);
    Object.values(itemRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    updatePositions();

    return () => observer.disconnect();
  }, [connections, itemRefs, containerRef]);

  return {
    connections,
    setConnections,
    linePositions,
    selected,
    tempLine,
    handleClick,
    handleTouchStart,
    handleRemove,
    isConnected,
  };
}
