import React from 'react';
import type { GameManager } from '../model/GameManager';
import { PlayerFieldElement } from './PlayerFieldElement';
import { CpuFieldElement } from './CpuFieldElement';

type Props = {
  gm: GameManager;
  width: number;
  height: number;
};

export const FieldElement: React.FC<Props> = ({ gm, width, height }) => {
  // Layout constants
  const PADDING = 16;
  const SEAT_FOOTPRINT_RATIO = 0.9; // general seat box width ratio
  const CPU_SEAT_VISIBLE_W_RATIO = 0.6; // CPUの見かけの横幅を統一（やや広め）
  const CARD_WIDTH_RATIO = 0.18;
  // CPUの手札を盤面外に押し出すオフセット量（席ごとに独立指定）
  const CPU_HIDE_OFFSET_TOP_PX = 100;
  const CPU_HIDE_OFFSET_LEFT_PX = 200;
  const CPU_HIDE_OFFSET_RIGHT_PX = 200;
  const CPU_SIDE_Y_SHIFT_PX = 50; // 左右CPUを上方向へ寄せる量（px）

  const padding = PADDING;
  const w = width - padding * 2;
  const h = height - padding * 2;

  const sectionH = h / 3; // used to size seats

  // seat footprints
  const seatW = w * SEAT_FOOTPRINT_RATIO;
  const seatH = sectionH * SEAT_FOOTPRINT_RATIO;
  const sideSeatW = seatH; // for left/right, vertical depth before rotation
  const cpuSeatW = w * CPU_SEAT_VISIBLE_W_RATIO; // unified visible width for all CPU seats

  // Unified card size across field and hands
  const cardW = Math.min(w, h) * CARD_WIDTH_RATIO;
  // hide offsets per seat
  const cpuHideTop = CPU_HIDE_OFFSET_TOP_PX;
  const cpuHideLeft = CPU_HIDE_OFFSET_LEFT_PX;
  const cpuHideRight = CPU_HIDE_OFFSET_RIGHT_PX;

  // removed dataURL image wrapper; render seats inline to support foreignObject

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
      <rect x={0} y={0} width={w} height={h} rx={12} fill="#e0f2fe" stroke="#93c5fd" />

      {/* Open cards moved into each seat component */}

      {/* User fields placed and rotated */}
      {/* Top (CPU 1) */}
      <g transform={seatTransform('top', (w - cpuSeatW) / 2, 8 - cpuHideTop, cpuSeatW, seatH)}>
        <CpuFieldElement gm={gm} seat="top" playerIndex={1} width={cpuSeatW} height={seatH} cardWidth={cardW} />
      </g>

      {/* Left (CPU 2) */}
      <g transform={seatTransform('left', 8 - cpuHideLeft, (h - sideSeatW) / 2 - CPU_SIDE_Y_SHIFT_PX, cpuSeatW, sideSeatW)}>
        <CpuFieldElement gm={gm} seat="left" playerIndex={2} width={cpuSeatW} height={sideSeatW} cardWidth={cardW} />
      </g>

      {/* Right (CPU 3) */}
      <g transform={seatTransform('right', w - cpuSeatW - 8 + cpuHideRight, (h - sideSeatW) / 2 - CPU_SIDE_Y_SHIFT_PX, cpuSeatW, sideSeatW)}>
        <CpuFieldElement gm={gm} seat="right" playerIndex={3} width={cpuSeatW} height={sideSeatW} cardWidth={cardW} />
      </g>

      {/* Bottom (YOU) */}
      <g transform={seatTransform('bottom', (w - seatW) / 2, h - seatH - 8, seatW, seatH)}>
        <PlayerFieldElement gm={gm} seat="bottom" playerIndex={0} width={seatW} height={seatH} cardWidth={cardW} />
      </g>

      {/* Open cards are rendered inside each seat component */}
    </g>
  );
};
