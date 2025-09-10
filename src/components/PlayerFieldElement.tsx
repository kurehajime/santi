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
  const STATUS_SCALE = 1.2;
  const STATUS_WIDTH_RATIO = 0.70; // widen status to fit stars
  const OPEN_CARD_LIFT_RATIO = 0.8; // how high open card floats (in cardH)
  const statusW = (width - gap * 2) * STATUS_WIDTH_RATIO / STATUS_SCALE; // width adjustable, scale-neutral
  const statusH = localMin * 0.15;

  const handIds = player.hands;
  const showBack = gameState.mode === 'introduction'; // before start, show back side
  // const n = handIds.length; // show all cards, even if more than 5 (unused when grouping)
  // Group same cards and show stacked with counts
  const counts = new Map<string, number>();
  handIds.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
  const groups = Array.from(counts.entries());
  const g = groups.length;
  const isMyPhase = gameState.turn === playerIndex && (gameState.mode === 'playing' || gameState.mode === 'preview');
  const playable = isMyPhase ? new Set(gameState.playableHands()) : new Set<string>();
  const isPreview = gameState.mode === 'preview';
  const isMyPreview = isPreview && gameState.turn === playerIndex;
  const selectedId = isMyPreview ? gameState.previewCard : null;

  // Hand placement below status
  const handX = gap;
  // Hand Y aligned just below the rendered status height
  const statusRenderedH = Math.round(statusH * STATUS_SCALE);
  const handY = statusRenderedH + gap * 2;
  const availableW = width - gap * 2;
  const stepX = g > 1 ? Math.min(cardW + gap, (availableW - cardW) / (g - 1)) : 0;

  // Open card placement: fixed to seat center (do not link to hand layout)
  const ocX = Math.round((width - cardW) / 2);
  const ocY = -Math.round(cardH * OPEN_CARD_LIFT_RATIO);

  return (
    <g>
      {/* Open card (hide when player is down or none) */}
      {player.life > 0 && player.openCard && (
        <g transform={`translate(${ocX}, ${ocY})`} aria-label={`${seat}-open`}>
          <CardElement id={player.openCard} width={cardW} faceUp={true} labelFallback="カード" />
        </g>
      )}
      {/* Status (scaled, centered horizontally) */}
      <g
        transform={`translate(${Math.round((width - statusW * STATUS_SCALE) / 2)}, ${Math.round(gap * 2)}) scale(${STATUS_SCALE})`}
      >
        {(() => {
          // Rank defeated players by elimination order: first out = last place
          const n = gameState.players.length;
          const elim = gameState.eliminatedOrder ?? [];
          const idxInElim = elim.indexOf(playerIndex);
          const myRank = idxInElim >= 0 ? n - idxInElim : undefined;
          return (
            <StatusElement
              player={player}
              width={statusW}
              height={statusH}
              isActive={gameState.turn === playerIndex}
              rank={myRank}
            />
          );
        })()}
      </g>

      {/* Hand */}
      <g transform={`translate(${handX}, ${handY})`} aria-label={`${seat}-hand`}>
        {groups.map(([cid, cnt], i) => {
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
              {cnt > 1 && (() => {
                const fs = Math.round(cardW * 0.32);
                const pad = 6;
                const boxW = fs * 1.6;
                const boxH = fs * 0.9;
                const bx = pad;
                const by = cardH - boxH - pad;
                return (
                  <g style={{ pointerEvents: 'none' }}>
                    <rect x={bx} y={by} width={boxW} height={boxH} rx={Math.round(boxH * 0.3)} fill="#111827" opacity={0.6} />
                    <text x={bx + boxW / 2} y={by + boxH / 2} textAnchor="middle" dominantBaseline="middle" fontSize={fs} fill="#ffffff">×{cnt}</text>
                  </g>
                );
              })()}
            </g>
          );
        })}
      </g>
    </g>
  );
};
