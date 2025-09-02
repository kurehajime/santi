import React from 'react';
import type { CardId } from '../model/types';
import { CARDS_MAP } from '../model/cards';

type Props = {
  id?: CardId | null;
  width: number;
  faceUp?: boolean;
  labelFallback?: string;
};

export const CardElement: React.FC<Props> = ({ id, width, faceUp = false, labelFallback = 'カード' }) => {
  const height = Math.round(width * Math.SQRT2);
  const r = 8;
  const name = id ? CARDS_MAP[id]?.name ?? String(id) : labelFallback;

  return (
    <g>
      <rect x={0} y={0} width={width} height={height} rx={r} fill={faceUp ? '#111827' : '#e5e7eb'} stroke="#334155" />
      {faceUp ? (
        <text x={width / 2} y={height / 2} textAnchor="middle" dominantBaseline="middle" fontSize={12} fill="#e5e7eb">
          {name}
        </text>
      ) : (
        <g>
          <rect x={width * 0.15} y={height * 0.15} width={width * 0.7} height={height * 0.7} rx={6} fill="#cbd5e1" />
        </g>
      )}
    </g>
  );
};

