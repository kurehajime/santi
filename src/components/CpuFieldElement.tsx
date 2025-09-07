import React from 'react';
import type { GameState } from '../model/GameState';
import { CardElement } from './CardElement';
import { StatusElement } from './StatusElement';

type Seat = 'top' | 'left' | 'right';

type Props = {
  gameState: GameState;
  seat: Seat;
  playerIndex: number; // cpu player index
  width: number; // footprint width before rotation
  height: number; // footprint height before rotation
  cardWidth?: number; // unified card width
};

export const CpuFieldElement: React.FC<Props> = ({ gameState, seat, playerIndex, width, height, cardWidth }) => {
  const player = gameState.players[playerIndex];
  if (!player) return null;

  const localMin = Math.min(width, height);
  const cardW = cardWidth ?? localMin * 0.22;
  const cardH = Math.round(cardW * Math.SQRT2);
  const gap = localMin * 0.04;
  const statusW = localMin * 0.36;
  const statusH = localMin * 0.22;
  const STATUS_SCALE = 1.2;

  const handIds = player.hands;
  const showBack = true; // CPU hand is face-down
  const n = Math.min(5, handIds.length);

  // Unified layout with Player: status on top-left, hand below, horizontal spread
  const handX = gap;
  const handY = statusH * STATUS_SCALE + gap * 2;
  const availableW = width - gap * 2;
  const stepX = n > 1 ? Math.min(cardW + gap, (availableW - cardW) / (n - 1)) : 0;

  // Open card placement: centered above the hand row (unified rule for all seats)
  const handSpanCenterLeft = handX + (n > 0 ? ((n - 1) * stepX) / 2 : (availableW - cardW) / 2);
  const ocX = Math.round(handSpanCenterLeft);
  const ocY = cardH * -0.8;

  return (
    <g>
      {/* Open card (hide when player is down or none) */}
      {player.life > 0 && player.openCard && (
        <g transform={`translate(${ocX}, ${ocY})`} aria-label={`${seat}-open`}>
          <CardElement id={player.openCard} width={cardW} faceUp={true} labelFallback="カード" />
        </g>
      )}
      {/* Status (scaled) */}
      <g transform={`translate(${gap}, ${gap}) scale(${STATUS_SCALE})`}>
        <StatusElement player={player} width={statusW} height={statusH} isActive={gameState.turn === playerIndex} />
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
