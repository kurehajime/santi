import React from 'react';
import type { GameManager } from '../model/GameManager';
import { CardElement } from './CardElement';
import { StatusElement } from './StatusElement';

type Seat = 'top' | 'left' | 'right';

type Props = {
  gm: GameManager;
  seat: Seat;
  playerIndex: number; // cpu player index
  x: number;
  y: number;
  width: number; // footprint width before rotation
  height: number; // footprint height before rotation
  cardWidth?: number; // unified card width
};

export const CpuFieldElement: React.FC<Props> = ({ gm, seat, playerIndex, x, y, width, height, cardWidth }) => {
  const player = gm.players[playerIndex];
  if (!player) return null;

  const rotation = seat === 'top' ? 180 : seat === 'left' ? 90 : -90;

  const localMin = Math.min(width, height);
  const cardW = cardWidth ?? localMin * 0.22;
  const cardH = Math.round(cardW * Math.SQRT2);
  const gap = localMin * 0.04;
  const statusW = localMin * 0.36;
  const statusH = localMin * 0.22;

  const handIds = player.hands;
  const showBack = true; // CPU hand is face-down
  const n = Math.min(5, handIds.length);

  const isSide = seat === 'left' || seat === 'right';

  // Compute hand placement
  let handX = gap;
  let handY = statusH + gap * 2;
  let availableW = width - gap * 2;
  let stepX = n > 1 ? Math.min(cardW + gap, (availableW - cardW) / (n - 1)) : 0;

  if (isSide) {
    handX = statusW + gap * 2; // status left, hand right
    handY = Math.max(gap, (height - cardH) / 2);
    availableW = width - statusW - gap * 3;
    stepX = n > 1 ? Math.min(cardW + gap, (availableW - cardW) / (n - 1)) : 0;
  }

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation} ${width / 2} ${height / 2})`}>
      {/* Status */}
      <g transform={`translate(${gap}, ${gap})`}>
        <StatusElement player={player} width={statusW} height={statusH} />
      </g>

      {/* Hand */}
      <g transform={`translate(${handX}, ${handY})`} aria-label={`${seat}-hand`}>
        {handIds.slice(0, n).map((cid, i) => (
          <g key={i} transform={`translate(${i * stepX}, 0)`}>
            <CardElement id={cid} width={cardW} faceUp={!showBack} labelFallback="手札" />
          </g>
        ))}
      </g>
    </g>
  );
};

