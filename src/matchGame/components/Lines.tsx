import React from "react";
import styled from "styled-components";
import { type Connection } from "../utils/types";

type LinesProps = {
  linePositions: any[];
  tempLine: { x1: number; y1: number; x2: number; y2: number } | null;
  onRemove: (c: Connection) => void;
};

export const Lines: React.FC<LinesProps> = React.memo(
  ({ linePositions, tempLine, onRemove }) => (
    <Svg>
      {linePositions.map((pos) => (
        <LineItem key={`${pos.from}-${pos.to}`} pos={pos} onRemove={onRemove} />
      ))}

      {tempLine && (
        <>
          <path
            d={`M ${tempLine.x1},${tempLine.y1} C ${tempLine.x1 + 50},${
              tempLine.y1
            } ${tempLine.x2 - 50},${tempLine.y2} ${tempLine.x2},${tempLine.y2}`}
            stroke="green"
            strokeWidth={2}
            fill="none"
            strokeDasharray="6 4"
          />
          <circle cx={tempLine.x1} cy={tempLine.y1} r={4} fill="green" />
          <circle cx={tempLine.x2} cy={tempLine.y2} r={4} fill="green" />
        </>
      )}
    </Svg>
  )
);

type LineItemProps = {
  pos: any;
  onRemove: (c: Connection) => void;
};

const LineItem: React.FC<LineItemProps> = React.memo(({ pos, onRemove }) => {
  const path = `M ${pos.x1},${pos.y1} C ${pos.x1 + 50},${pos.y1} ${
    pos.x2 - 50
  },${pos.y2} ${pos.x2},${pos.y2}`;
  return (
    <g>
      <path d={path} stroke="green" strokeWidth={2} fill="none" />
      <circle cx={pos.x1} cy={pos.y1} r={4} fill="green" />
      <circle cx={pos.x2} cy={pos.y2} r={4} fill="green" />
      <foreignObject
        x={(pos.x1 + pos.x2) / 2 - 8}
        y={(pos.y1 + pos.y2) / 2 - 8}
        dy={-5}
        width={16}
        height={16}
      >
        <SvgClose onClick={() => onRemove({ from: pos.from, to: pos.to })}>
          ✕
        </SvgClose>
      </foreignObject>
    </g>
  );
});

const Svg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const SvgClose = styled.div`
  cursor: pointer;
  pointer-events: all;
  background: green;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;
  border-radius: 50%;
  font-size: 10px;
  color: white;
`;
