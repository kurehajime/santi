import React from 'react';
import type { GameState } from '../model/GameState';
import type { CardId } from '../model/types';
import { CardElement } from './CardElement';
import { StatusElement } from './StatusElement';

type Seat = 'bottom';

type Props = {
  gameState: GameState;
  seat: Seat;
  playerIndex: number; // human player index (usually 0)
  width: number;
  height: number;
  cardWidth?: number; // unified card width
  onSelectHand?: (cardId: CardId) => void;
};

export const PlayerFieldElement: React.FC<Props> = ({ gameState, seat, playerIndex, width, height, cardWidth, onSelectHand }) => {
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
  const showBack = false; // player hand is face-up
  const n = Math.min(5, handIds.length);
  const isMyPhase = gameState.turn === playerIndex && (gameState.mode === 'playing' || gameState.mode === 'preview');
  const playable = isMyPhase ? new Set(gameState.playableHands()) : new Set<string>();
  const isPreview = gameState.mode === 'preview';
  const isMyPreview = isPreview && gameState.turn === playerIndex;
  const selectedId = isMyPreview ? gameState.previewCard : null;

  // Hand placement below status
  const handX = gap;
  const handY = statusH * STATUS_SCALE + gap * 2;
  const availableW = width - gap * 2;
  const stepX = n > 1 ? Math.min(cardW + gap, (availableW - cardW) / (n - 1)) : 0;

  // Open card placement: centered above the hand row (unified rule)
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
        {handIds.slice(0, n).map((cid, i) => {
          const canPlay = isMyPhase ? playable.has(cid) : false;
          const handleClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (isMyPhase && canPlay) onSelectHand?.(cid);
          };
          const liftY = selectedId === cid ? -Math.round(cardH / 3) : 0;
          return (
            <g key={i} transform={`translate(${i * stepX}, ${liftY})`} onClick={handleClick} style={{ cursor: canPlay ? 'pointer' as const : 'default' }}>
              <g opacity={isMyPhase && !canPlay ? 0.4 : 1}>
                <CardElement id={cid} width={cardW} faceUp={!showBack} labelFallback="手札" />
              </g>
            </g>
          );
        })}
      </g>
    </g>
  );
};
