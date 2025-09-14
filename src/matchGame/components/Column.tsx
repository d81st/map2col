import React from "react";
import { ITEMS } from "../utils/constants";
import { type Connection } from "../utils/types";
import styled, { keyframes } from "styled-components";

type ColumnProps = {
  type: "properties" | "options";
  connections: Connection[];
  selected: string | null;
  isConnected: (id: string) => boolean;
  itemRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  onClickItem: (item: { id: string; key: string }) => void;
  onTouchItem: (item: { id: string; key: string }, e: React.TouchEvent) => void;
};

export function Column({
  type,
  connections,
  selected,
  isConnected,
  itemRefs,
  onClickItem,
  onTouchItem,
}: ColumnProps) {
  const connectedIds = connections.map((c) =>
    type === "properties" ? c.from : c.to
  );

  const connectedItems = connectedIds
    .map((id) => ITEMS.find((i) => i.id === id)!)
    .filter(Boolean);

  const unconnectedItems = ITEMS.filter(
    (i) => i.key === type && !connectedIds.includes(i.id)
  );

  const finalList = [...connectedItems, ...unconnectedItems];

  return (
    <div aria-checked="false">
      {finalList.map((item) => {
        const isSel = selected === item.id;
        const connected = isConnected(item.id);
        return (
          <Button
            key={item.id}
            //@ts-ignore
            ref={(el) => (itemRefs.current[item.id] = el)}
            data-id={item.id}
            data-key={item.key}
            onClick={() => onClickItem(item)}
            onTouchStart={(e) => onTouchItem(item, e)}
            $connected={connected}
            $isSel={isSel}
          >
            {item.title}
          </Button>
        );
      })}
    </div>
  );
}

const Button = styled.div<{ $isSel?: boolean; $connected: boolean }>`
  padding: 15px;
  outline: 2px solid ${(props) => (props.$isSel ? "#80c28fff" : "white")};
  margin-bottom: 8px;
  border-radius: 6px;
  background: ${(props) =>
    props.$isSel ? "#d3e8d8" : props.$connected ? "#d3e8d8" : "#ededed"};
  cursor: ${(props) => (props.$connected ? "not-allowed" : "pointer")};
  user-select: none;
  touch-action: manipulation;
  min-width: 10rem;
  position: relative;
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 150, 255, 0.5);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 10px 10px rgba(0, 150, 255, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 150, 255, 0);
  }
`;
