import { useRef, useState } from "react";
import styled from "styled-components";

import { Lines } from "./Lines";
import { Column } from "./Column";
import { StorageControls } from "./StorageControls";

import { useConnections } from "../hooks/useConnections";
import { useTempLine } from "../hooks/useTempLine";
import { useSelection } from "../hooks/useSelection";

export default function MatchGame() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const { connections, setConnections, linePositions, isConnected } =
    useConnections(containerRef, itemRefs);

  const { tempLine, setTempLine } = useTempLine(
    selected,
    setSelected,
    connections,
    setConnections,
    containerRef
  );

  const { handleClick, handleTouchStart, handleRemove } = useSelection({
    selected,
    setSelected,
    setTempLine,
    setConnections,
    isConnected,
    containerRef,
    itemRefs,
  });

  return (
    <Main>
      <StorageControls
        connections={connections}
        setConnections={setConnections}
      />

      <Container ref={containerRef}>
        <Column
          type="properties"
          connections={connections}
          selected={selected}
          isConnected={isConnected}
          itemRefs={itemRefs}
          onClickItem={handleClick}
          onTouchItem={handleTouchStart}
        />
        <Column
          type="options"
          connections={connections}
          selected={selected}
          isConnected={isConnected}
          itemRefs={itemRefs}
          onClickItem={handleClick}
          onTouchItem={handleTouchStart}
        />
        <Lines
          linePositions={linePositions}
          tempLine={tempLine}
          onRemove={handleRemove}
        />
      </Container>
    </Main>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  gap: 2rem;
  justify-content: space-around;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  touch-action: none;

  @media (min-width: 768px) {
    gap: 3rem;
  }
`;

const Main = styled.div`
  margin: 0 auto;
  max-width: 40rem;
  font-family: sans-serif;
  position: relative;
`;
