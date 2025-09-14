import React from "react";
import { type Connection } from "../utils/types";
import styled from "styled-components";

type Props = {
  linePositions: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    from: string;
    to: string;
  }[];
  tempLine: { x1: number; y1: number; x2: number; y2: number } | null;
  onRemove: (c: Connection) => void;
};

export const Lines: React.FC<Props> = ({
  linePositions,
  tempLine,
  onRemove,
}) => (
  <Svg>
    {linePositions.map((pos) => {
      const path = `M ${pos.x1},${pos.y1} C ${pos.x1 + 50},${pos.y1} ${
        pos.x2 - 50
      },${pos.y2} ${pos.x2},${pos.y2}`;
      return (
        <g key={`${pos.from}-${pos.to}`}>
          <path d={path} stroke="green" strokeWidth={2} fill="none" />
          <circle cx={pos.x1} cy={pos.y1} r={4} fill="green" />
          <circle cx={pos.x2} cy={pos.y2} r={4} fill="green" />
          <foreignObject
            x={(pos.x1 + pos.x2) / 2 - 8}
            y={(pos.y1 + pos.y2) / 2 - 8}
            width={16}
            height={16}
          >
            <SvgClose onClick={() => onRemove({ from: pos.from, to: pos.to })}>
              ✕
            </SvgClose>
          </foreignObject>
        </g>
      );
    })}

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
);

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
