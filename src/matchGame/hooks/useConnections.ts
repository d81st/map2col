import { useState, useLayoutEffect, useRef } from "react";
import { type Connection } from "../utils/types";

export function useConnections(
  containerRef: React.RefObject<HTMLDivElement>,
  itemRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [linePositions, setLinePositions] = useState<any[]>([]);

  const isConnected = (id: string) =>
    connections.some((c) => c.from === id || c.to === id);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const containerBox = containerRef.current.getBoundingClientRect();

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
      .filter(Boolean) as any[];

    setLinePositions(newPositions);
  }, [connections]);

  return { connections, setConnections, linePositions, isConnected };
}
