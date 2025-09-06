import React from 'react';
import type { GameManager } from '../model/GameManager';
import { CardElement } from './CardElement';
import { StatusElement } from './StatusElement';

type Seat = 'bottom';

type Props = {
  gm: GameManager;
  seat: Seat;
  playerIndex: number; // human player index (usually 0)
  width: number;
  height: number;
  cardWidth?: number; // unified card width
};

export const PlayerFieldElement: React.FC<Props> = ({ gm, seat, playerIndex, width, height, cardWidth }) => {
  const player = gm.players[playerIndex];
  if (!player) return null;

  const localMin = Math.min(width, height);
  const cardW = cardWidth ?? localMin * 0.22;
  const cardH = Math.round(cardW * Math.SQRT2);
  const gap = localMin * 0.04;
  const statusW = localMin * 0.36;
  const statusH = localMin * 0.22;

  const handIds = player.hands;
  const showBack = false; // player hand is face-up
  const n = Math.min(5, handIds.length);

  // Hand placement below status
  const handX = gap;
  const handY = statusH + gap * 2;
  const availableW = width - gap * 2;
  const stepX = n > 1 ? Math.min(cardW + gap, (availableW - cardW) / (n - 1)) : 0;

  // Open card placement: centered above the hand row (unified rule)
  const handSpanCenterLeft = handX + (n > 0 ? ((n - 1) * stepX) / 2 : (availableW - cardW) / 2);
  const ocX = Math.round(handSpanCenterLeft);
  const ocY = cardH * -0.8;

  return (
    <g>
      {/* Open card */}
      <g transform={`translate(${ocX}, ${ocY})`} aria-label={`${seat}-open`}>
        <CardElement id={player.openCard ?? null} width={cardW} faceUp={!!player.openCard} labelFallback="カード" />
      </g>
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
