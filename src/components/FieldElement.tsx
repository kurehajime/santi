import React from 'react';
import type { GameManager } from '../model/GameManager';
import { UserFieldElement } from './UserFieldElement';
import { CardElement } from './CardElement';

type Props = {
  gm: GameManager;
  width: number;
  height: number;
};

export const FieldElement: React.FC<Props> = ({ gm, width, height }) => {
  const padding = 16;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const sectionH = h / 3; // used to size seats

  // seat footprints
  const seatW = w * 0.9;
  const seatH = sectionH * 0.9;
  const sideSeatW = seatH; // for left/right, use smaller footprint
  const sideSeatH = w * 0.28;

  const centerX = w / 2;
  const centerY = h / 2;

  const openCardW = Math.min(w, h) * 0.14;

  return (
    <g transform={`translate(${padding}, ${padding})`}>
      {/* Background */}
      <rect x={0} y={0} width={w} height={h} rx={12} fill="#fef08a" stroke="#facc15" />

      {/* Open cards around center (no deck) */}
      <g aria-label="open-cards">
        {/* top */}
        <g transform={`translate(${centerX - openCardW / 2}, ${centerY - openCardW * Math.SQRT2 - 24})`}>
          <CardElement id={gm.players[1]?.openCard ?? null} width={openCardW} faceUp={!!gm.players[1]?.openCard} labelFallback="カード" />
        </g>
        {/* left */}
        <g transform={`translate(${centerX - openCardW * 1.5 - 24}, ${centerY - (openCardW * Math.SQRT2) / 2})`}>
          <CardElement id={gm.players[2]?.openCard ?? null} width={openCardW} faceUp={!!gm.players[2]?.openCard} labelFallback="カード" />
        </g>
        {/* right */}
        <g transform={`translate(${centerX + openCardW * 0.5 + 24}, ${centerY - (openCardW * Math.SQRT2) / 2})`}>
          <CardElement id={gm.players[3]?.openCard ?? null} width={openCardW} faceUp={!!gm.players[3]?.openCard} labelFallback="カード" />
        </g>
        {/* bottom */}
        <g transform={`translate(${centerX - openCardW / 2}, ${centerY + 24})`}>
          <CardElement id={gm.players[0]?.openCard ?? null} width={openCardW} faceUp={!!gm.players[0]?.openCard} labelFallback="カード" />
        </g>
      </g>

      {/* User fields placed and rotated */}
      {/* Top (CPU 1) */}
      <UserFieldElement
        gm={gm}
        seat="top"
        playerIndex={1}
        x={(w - seatW) / 2}
        y={8}
        width={seatW}
        height={seatH}
      />

      {/* Left (CPU 2) */}
      <UserFieldElement
        gm={gm}
        seat="left"
        playerIndex={2}
        x={8}
        y={(h - sideSeatH) / 2}
        width={sideSeatW}
        height={sideSeatH}
      />

      {/* Right (CPU 3) */}
      <UserFieldElement
        gm={gm}
        seat="right"
        playerIndex={3}
        x={w - sideSeatW - 8}
        y={(h - sideSeatH) / 2}
        width={sideSeatW}
        height={sideSeatH}
      />

      {/* Bottom (YOU) */}
      <UserFieldElement
        gm={gm}
        seat="bottom"
        playerIndex={0}
        x={(w - seatW) / 2}
        y={h - seatH - 8}
        width={seatW}
        height={seatH}
      />
    </g>
  );
};
