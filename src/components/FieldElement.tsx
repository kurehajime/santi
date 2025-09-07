import React from 'react';
import type { GameState } from '../model/GameState';
import type { CardId } from '../model/types';
import { PlayerFieldElement } from './PlayerFieldElement';
import { CpuFieldElement } from './CpuFieldElement';

type Props = {
  gameState: GameState;
  width: number;
  height: number;
  onSelectHand?: (cardId: CardId) => void;
};

export const FieldElement: React.FC<Props> = ({ gameState, width, height, onSelectHand }) => {
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
      {/* Top (CPU index 2) */}
      <g transform={seatTransform('top', (w - cpuSeatW) / 2, 8 - cpuHideTop, cpuSeatW, seatH)}>
        <CpuFieldElement gameState={gameState} seat="top" playerIndex={2} width={cpuSeatW} height={seatH} cardWidth={cardW} />
      </g>

      {/* Left (CPU index 1) */}
      <g transform={seatTransform('left', 8 - cpuHideLeft, (h - sideSeatW) / 2 - CPU_SIDE_Y_SHIFT_PX, cpuSeatW, sideSeatW)}>
        <CpuFieldElement gameState={gameState} seat="left" playerIndex={1} width={cpuSeatW} height={sideSeatW} cardWidth={cardW} />
      </g>

      {/* Right (CPU index 3) */}
      <g transform={seatTransform('right', w - cpuSeatW - 8 + cpuHideRight, (h - sideSeatW) / 2 - CPU_SIDE_Y_SHIFT_PX, cpuSeatW, sideSeatW)}>
        <CpuFieldElement gameState={gameState} seat="right" playerIndex={3} width={cpuSeatW} height={sideSeatW} cardWidth={cardW} />
      </g>

      {/* Bottom (YOU) */}
      <g transform={seatTransform('bottom', (w - seatW) / 2, h - seatH - 8, seatW, seatH)}>
        <PlayerFieldElement
          gameState={gameState}
          seat="bottom"
          playerIndex={0}
          width={seatW}
          height={seatH}
          cardWidth={cardW}
          onSelectHand={onSelectHand}
        />
      </g>

      {/* Open cards are rendered inside each seat component */}

      {/* Damage overlay arrows: from last attacker to damaged targets */}
      {(() => {
        const dmg = gameState.lastDamage;
        const from = gameState.lastAttacker;
        if (!dmg || from == null) return null;

        // Seat centers in this field coordinate (padding has been applied)
        const centerOf = (_seat: 'bottom' | 'top' | 'left' | 'right', x: number, y: number, boxW: number, boxH: number) => {
          return { x: x + boxW / 2, y: y + boxH / 2 };
        };
        const anchors = [
          centerOf('bottom', (w - seatW) / 2, h - seatH - 8, seatW, seatH), // 0 bottom
          centerOf('left', 8 - cpuHideLeft, (h - sideSeatW) / 2 - CPU_SIDE_Y_SHIFT_PX, cpuSeatW, sideSeatW), // 1 left
          centerOf('top', (w - cpuSeatW) / 2, 8 - cpuHideTop, cpuSeatW, seatH), // 2 top
          centerOf('right', w - cpuSeatW - 8 + cpuHideRight, (h - sideSeatW) / 2 - CPU_SIDE_Y_SHIFT_PX, cpuSeatW, sideSeatW), // 3 right
        ];

        const arrows = [] as React.ReactElement[];
        for (let i = 0; i < dmg.length; i++) {
          const amount = dmg[i] ?? 0;
          if (i === from || amount <= 0) continue;
          const a = anchors[from];
          const b = anchors[i];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.max(1, Math.hypot(dx, dy));
          const ux = dx / len;
          const uy = dy / len;
          const head = 24; // arrow head length (bigger for clearer direction)
          const headW = head * 0.9; // arrow head half-width
          const shrink = 16; // padding from centers
          const x1 = a.x + ux * shrink;
          const y1 = a.y + uy * shrink;
          const x2 = b.x - ux * shrink;
          const y2 = b.y - uy * shrink;
          const hx = x2 - ux * head;
          const hy = y2 - uy * head;
          const perpX = -uy;
          const perpY = ux;
          const h1x = hx + perpX * headW;
          const h1y = hy + perpY * headW;
          const h2x = hx - perpX * headW;
          const h2y = hy - perpY * headW;
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          const labelFs = 36; // larger damage number
          const boxW = labelFs * 1.6;
          const boxH = labelFs * 1.2;
          arrows.push(
            <g key={`arrow-${from}-${i}`} style={{ pointerEvents: 'none' }}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111827" strokeWidth={3} opacity={0.85} />
              <polygon points={`${x2},${y2} ${h1x},${h1y} ${h2x},${h2y}`} fill="#111827" opacity={0.8} />
              <g transform={`translate(${mx}, ${my})`}>
                <rect x={-boxW / 2} y={-boxH / 2} width={boxW} height={boxH} rx={6} fill="#111827" opacity={0.9} />
                <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" fontSize={labelFs} fill="#ffffff">{amount}</text>
              </g>
            </g>
          );
        }
        return <g aria-label="damage-overlay" className="damage-overlay">{arrows}</g>;
      })()}
    </g>
  );
};
