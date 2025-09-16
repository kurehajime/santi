import React from 'react';
import type { GameState } from '../model/GameState';
import type { CardId } from '../model/types';
import { SeatOpenCard } from './SeatOpenCard';
import { SeatStatusFrame } from './SeatStatusFrame';
import { HandStacks } from './HandStacks';

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
  const gap = localMin * 0.04;
  const STATUS_SCALE = 1.2;
  const STATUS_WIDTH_RATIO = 0.95; // widen status to fit stars
  const statusW = (width - gap * 2) * STATUS_WIDTH_RATIO / STATUS_SCALE; // width adjustable, scale-neutral
  const statusH = localMin * 0.15;

  const handIds = player.hands;
  const showBack = true; // CPU hand is face-down
  // const n = handIds.length; // show all cards, even if more than 5 (unused when grouping)
  const counts = new Map<CardId, number>();
  handIds.forEach((id) => counts.set(id, (counts.get(id) ?? 0) + 1));
  const groups = Array.from(counts.entries());
  const g = groups.length;

  // Unified layout with Player: status on top-left, hand below, horizontal spread
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
        />
      </g>
    </g>
  );
};
