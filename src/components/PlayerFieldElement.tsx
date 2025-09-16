import React from 'react';
import type { GameState } from '../model/GameState';
import type { CardId } from '../model/types';
import { SeatOpenCard } from './SeatOpenCard';
import { SeatStatusFrame } from './SeatStatusFrame';
import { HandStacks } from './HandStacks';

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
  const gap = localMin * 0.04;
  const STATUS_SCALE = 1.2;
  const STATUS_WIDTH_RATIO = 0.70; // widen status to fit stars
  const statusW = (width - gap * 2) * STATUS_WIDTH_RATIO / STATUS_SCALE; // width adjustable, scale-neutral
  const statusH = localMin * 0.15;

  const handIds = player.hands;
  const showBack = gameState.mode === 'introduction'; // before start, show back side
  // const n = handIds.length; // show all cards, even if more than 5 (unused when grouping)
  // Group same cards and show stacked with counts
  const counts = new Map<CardId, number>();
  handIds.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
  const groups = Array.from(counts.entries());
  const g = groups.length;
  const isMyPhase = gameState.turn === playerIndex && (gameState.mode === 'playing' || gameState.mode === 'preview');
  const playable = isMyPhase ? new Set<CardId>(gameState.playableHands()) : new Set<CardId>();
  const isPreview = gameState.mode === 'preview';
  const isMyPreview = isPreview && gameState.turn === playerIndex;
  const selectedId = isMyPreview ? gameState.previewCard : null;
  const disabledIds = isMyPhase
    ? new Set<CardId>(groups.filter(([cid]) => !playable.has(cid)).map(([cid]) => cid))
    : undefined;

  // Hand placement below status
  const handX = gap;
  // Hand Y aligned just below the rendered status height
  const statusRenderedH = Math.round(statusH * STATUS_SCALE);
  const handY = statusRenderedH + gap * 2;
  const availableW = width - gap * 2;
  const stepX = g > 1 ? Math.min(cardW + gap, (availableW - cardW) / (g - 1)) : 0;

  return (
    <g>
      {/* Open card (hide when player is down or none) */}
      {player.life > 0 && player.openCard && (
        <SeatOpenCard
          cardId={player.openCard}
          containerWidth={width}
          cardWidth={cardW}
          ariaLabel={`${seat}-open`}
        />
      )}
      {/* Status (scaled, centered horizontally) */}
      <SeatStatusFrame
        player={player}
        gameState={gameState}
        playerIndex={playerIndex}
        containerWidth={width}
        statusWidth={statusW}
        statusHeight={statusH}
        scale={STATUS_SCALE}
        offsetY={gap * 2}
      />

      {/* Hand */}
      <g transform={`translate(${handX}, ${handY})`}>
        <HandStacks
          groups={groups}
          cardWidth={cardW}
          stepX={stepX}
          faceUp={!showBack}
          ariaLabel={`${seat}-hand`}
          onSelect={isMyPhase ? onSelectHand : undefined}
          disabledIds={disabledIds}
          liftedId={selectedId}
          liftRatio={1 / 3}
        />
      </g>
    </g>
  );
};
