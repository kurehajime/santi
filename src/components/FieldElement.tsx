import React from 'react';
import type { GameState } from '../model/GameState';
import type { CardId } from '../model/types';
import { PlayerFieldElement } from './PlayerFieldElement';
import { CpuFieldElement } from './CpuFieldElement';
import { DamageOverlay } from './overlays/DamageOverlay';
import { buildFieldLayout, type SeatLayout } from './fieldLayout';

type Props = {
  gameState: GameState;
  width: number;
  height: number;
  onSelectHand?: (cardId: CardId) => void;
};

export const FieldElement: React.FC<Props> = ({ gameState, width, height, onSelectHand }) => {
  const layout = buildFieldLayout(width, height);
  const getSeat = (name: 'top' | 'left' | 'right' | 'bottom'): SeatLayout => {
    const seat = layout.seats.find((entry) => entry.seat === name);
    if (!seat) throw new Error(`Seat layout not found for ${name}`);
    return seat;
  };

  const topSeat = getSeat('top');
  const leftSeat = getSeat('left');
  const rightSeat = getSeat('right');
  const bottomSeat = getSeat('bottom');

  return (
    <g transform={`translate(${layout.padding}, ${layout.padding})`}>
      <rect x={0} y={0} width={layout.innerWidth} height={layout.innerHeight} rx={12} fill="#e0f2fe" stroke="#93c5fd" />

      <g transform={topSeat.transform}>
        <CpuFieldElement
          gameState={gameState}
          seat="top"
          playerIndex={topSeat.playerIndex}
          width={topSeat.width}
          height={topSeat.height}
          cardWidth={layout.cardWidth}
        />
      </g>

      <g transform={leftSeat.transform}>
        <CpuFieldElement
          gameState={gameState}
          seat="left"
          playerIndex={leftSeat.playerIndex}
          width={leftSeat.width}
          height={leftSeat.height}
          cardWidth={layout.cardWidth}
        />
      </g>

      <g transform={rightSeat.transform}>
        <CpuFieldElement
          gameState={gameState}
          seat="right"
          playerIndex={rightSeat.playerIndex}
          width={rightSeat.width}
          height={rightSeat.height}
          cardWidth={layout.cardWidth}
        />
      </g>

      <g transform={bottomSeat.transform}>
        <PlayerFieldElement
          gameState={gameState}
          seat="bottom"
          playerIndex={bottomSeat.playerIndex}
          width={bottomSeat.width}
          height={bottomSeat.height}
          cardWidth={layout.cardWidth}
          onSelectHand={onSelectHand}
        />
      </g>

      <DamageOverlay anchors={layout.anchors} from={gameState.lastAttacker ?? null} damage={gameState.lastDamage ?? null} />
    </g>
  );
};
