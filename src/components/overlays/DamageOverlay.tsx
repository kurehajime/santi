import React from 'react';

type Point = { x: number; y: number };

type Props = {
  anchors: Point[]; // by player index 0..3
  from: number | null;
  damage: number[] | null;
};

export const DamageOverlay: React.FC<Props> = ({ anchors, from, damage }) => {
  if (from == null || !damage) return null;
  const arrows: React.ReactElement[] = [];
  for (let i = 0; i < damage.length; i++) {
    const amount = damage[i] ?? 0;
    if (i === from || amount <= 0) continue;
    const a = anchors[from];
    const b = anchors[i];
    if (!a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.max(1, Math.hypot(dx, dy));
    const ux = dx / len;
    const uy = dy / len;
    const head = 24;
    const headW = head * 0.9;
    const shrink = 16;
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
    const labelFs = 36;
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
};

