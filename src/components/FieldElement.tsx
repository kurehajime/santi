import React from 'react';
import type { GameManager } from '../model/GameManager';
import { PlayerFieldElement } from './PlayerFieldElement';
import { CpuFieldElement } from './CpuFieldElement';
import { CardElement } from './CardElement';

type Props = {
  gm: GameManager;
  width: number;
  height: number;
};

export const FieldElement: React.FC<Props> = ({ gm, width, height }) => {
  // Layout constants
  const PADDING = 16;
  const SEAT_FOOTPRINT_RATIO = 0.9;
  const SIDE_SEAT_H_RATIO = 0.28;
  const CARD_WIDTH_RATIO = 0.18;
  const OPEN_CARD_GAP = 24;

  const padding = PADDING;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const sectionH = h / 3; // used to size seats

  // seat footprints
  const seatW = w * SEAT_FOOTPRINT_RATIO;
  const seatH = sectionH * SEAT_FOOTPRINT_RATIO;
  const sideSeatW = seatH; // for left/right, use smaller footprint
  const sideSeatH = w * SIDE_SEAT_H_RATIO;

  const centerX = w / 2;
  const centerY = h / 2;
  // Unified card width across field and hands (larger than before)
  const cardW = Math.min(w, h) * CARD_WIDTH_RATIO;

  // helper: compute transform string for seat
  const seatTransform = (
    seat: 'top' | 'left' | 'right' | 'bottom',
    x: number,
    y: number,
    boxW: number,
    boxH: number
  ) => {
    const angle = seat === 'top' ? 180 : seat === 'left' ? 90 : seat === 'right' ? -90 : 0;
    if (angle === 0) return `translate(${x}, ${y})`;
    return `translate(${x}, ${y}) rotate(${angle} ${boxW / 2} ${boxH / 2})`;
  };

  return (
    <g transform={`translate(${padding}, ${padding})`}>
      {/* Background */}
      <rect x={0} y={0} width={w} height={h} rx={12} fill="#fef08a" stroke="#facc15" />

      {/* Open cards around center (no deck) */}
      <g aria-label="open-cards">
        {/* top */}
        <g transform={`translate(${centerX - cardW / 2}, ${centerY - cardW * Math.SQRT2 - OPEN_CARD_GAP})`}>
          <CardElement id={gm.players[1]?.openCard ?? null} width={cardW} faceUp={!!gm.players[1]?.openCard} labelFallback="カード" />
        </g>
        {/* left */}
        <g transform={`translate(${centerX - cardW * 1.5 - OPEN_CARD_GAP}, ${centerY - (cardW * Math.SQRT2) / 2})`}>
          <CardElement id={gm.players[2]?.openCard ?? null} width={cardW} faceUp={!!gm.players[2]?.openCard} labelFallback="カード" />
        </g>
        {/* right */}
        <g transform={`translate(${centerX + cardW * 0.5 + OPEN_CARD_GAP}, ${centerY - (cardW * Math.SQRT2) / 2})`}>
          <CardElement id={gm.players[3]?.openCard ?? null} width={cardW} faceUp={!!gm.players[3]?.openCard} labelFallback="カード" />
        </g>
        {/* bottom */}
        <g transform={`translate(${centerX - cardW / 2}, ${centerY + OPEN_CARD_GAP})`}>
          <CardElement id={gm.players[0]?.openCard ?? null} width={cardW} faceUp={!!gm.players[0]?.openCard} labelFallback="カード" />
        </g>
      </g>

      {/* User fields placed and rotated */}
      {/* Top (CPU 1) */}
      <g transform={seatTransform('top', (w - seatW) / 2, 8, seatW, seatH)}>
        <CpuFieldElement
          gm={gm}
          seat="top"
          playerIndex={1}
          width={seatW}
          height={seatH}
          cardWidth={cardW}
        />
      </g>

      {/* Left (CPU 2) */}
      <g transform={seatTransform('left', 8, (h - sideSeatH) / 2, sideSeatW, sideSeatH)}>
        <CpuFieldElement
          gm={gm}
          seat="left"
          playerIndex={2}
          width={sideSeatW}
          height={sideSeatH}
          cardWidth={cardW}
        />
      </g>

      {/* Right (CPU 3) */}
      <g transform={seatTransform('right', w - sideSeatW - 8, (h - sideSeatH) / 2, sideSeatW, sideSeatH)}>
        <CpuFieldElement
          gm={gm}
          seat="right"
          playerIndex={3}
          width={sideSeatW}
          height={sideSeatH}
          cardWidth={cardW}
        />
      </g>

      {/* Bottom (YOU) */}
      <g transform={seatTransform('bottom', (w - seatW) / 2, h - seatH - 8, seatW, seatH)}>
        <PlayerFieldElement
          gm={gm}
          seat="bottom"
          playerIndex={0}
          width={seatW}
          height={seatH}
          cardWidth={cardW}
        />
      </g>
    </g>
  );
};
