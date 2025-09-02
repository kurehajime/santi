import React from 'react';
import type { Player } from '../model/Player';

type Props = { player: Player; width: number; height: number };

export const StatusElement: React.FC<Props> = ({ player, width, height }) => {
  const r = 6;
  const pad = 6;
  return (
    <g>
      <rect x={0} y={0} width={width} height={height} rx={r} fill="#fafafa" stroke="#d1d5db" />
      <text x={pad} y={height / 2} fontSize={10} fill="#111827" dominantBaseline="middle">
        HP {player.life}
      </text>
      <g transform={`translate(${width - pad - 48}, ${pad})`}>
        <circle cx={6} cy={6} r={4} fill="#16a34a" />
        <text x={16} y={8} fontSize={10} fill="#111827">{player.mana.green}</text>
        <g transform="translate(0, 12)">
          <circle cx={6} cy={6} r={4} fill="#ef4444" />
          <text x={16} y={8} fontSize={10} fill="#111827">{player.mana.red}</text>
        </g>
        <g transform="translate(0, 24)">
          <circle cx={6} cy={6} r={4} fill="#3b82f6" />
          <text x={16} y={8} fontSize={10} fill="#111827">{player.mana.blue}</text>
        </g>
      </g>
    </g>
  );
};

