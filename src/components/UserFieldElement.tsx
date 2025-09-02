import React from 'react';
import type { GameManager } from '../model/GameManager';
import { CardElement } from './CardElement';
import { StatusElement } from './StatusElement';

type Seat = 'bottom' | 'top' | 'left' | 'right';

type Props = {
  gm: GameManager;
  seat: Seat;
  playerIndex: number;
  x: number;
  y: number;
  width: number; // footprint width of the seat area (before rotation)
  height: number; // footprint height of the seat area (before rotation)
};

export const UserFieldElement: React.FC<Props> = ({ gm, seat, playerIndex, x, y, width, height }) => {
  const player = gm.players[playerIndex];
  if (!player) return null;

  // Rotate the entire seat so text orientation matches the diagram.
  // Left should be clockwise (90), Right should be counter-clockwise (-90).
  const rotation = seat === 'bottom' ? 0 : seat === 'top' ? 180 : seat === 'left' ? 90 : -90;

  // Basic sizes relative to seat box
  const cardW = Math.min(width, height) * 0.22; // scalable
  const gap = Math.min(width, height) * 0.04;
  const statusW = Math.min(width, height) * 0.36;
  const statusH = Math.min(width, height) * 0.22;

  // Layout inside the seat local coords (not rotated)
  // Status on one side, hand on the opposite, simple for placeholder
  const isHuman = playerIndex === 0;
  const handIds = player.hands;
  const showBack = !isHuman;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation} ${width / 2} ${height / 2})`}>
      {/* seat backdrop (debug) */}
      {/* <rect x={0} y={0} width={width} height={height} fill="none" stroke="#334155" /> */}

      {/* Status */}
      <g transform={`translate(${gap}, ${gap})`}>
        <StatusElement player={player} width={statusW} height={statusH} />
      </g>

      {/* Hand */}
      <g transform={`translate(${gap}, ${statusH + gap * 2})`} aria-label={`${seat}-hand`}>
        {handIds.slice(0, 5).map((cid, i) => (
          <g key={i} transform={`translate(${i * (cardW + gap)}, 0)`}>
            <CardElement id={cid} width={cardW} faceUp={!showBack} labelFallback="手札" />
          </g>
        ))}
      </g>
    </g>
  );
};
