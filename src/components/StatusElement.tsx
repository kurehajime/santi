import React from 'react';
import type { Player } from '../model/Player';

type Props = { player: Player; width: number; height: number; isActive?: boolean; rank?: number };

export const StatusElement: React.FC<Props> = ({ player, width, height, isActive = false, rank }) => {
  const r = Math.round(Math.min(width, height) * 0.08);
  const pad = Math.max(6, Math.round(height * 0.08));
  // Horizontal row metrics
  const pipR = Math.max(6, Math.round(height * 0.16));
  const fsMana = Math.max(12, Math.round(height * 0.34)); // larger font for mana
  const fsHp = Math.max(12, Math.round(height * 0.34));
  const colW = Math.max(1, (width - pad * 2) / 4);
  const colCenter = (i: number) => pad + colW * (i + 0.5);

  const bgFill = isActive ? '#fffbeb' : '#fafafa';
  const bgStroke = isActive ? '#f59e0b' : '#d1d5db';
  // If defeated, show placement only
  if (player.life <= 0 && rank) {
    const r = Math.round(Math.min(width, height) * 0.08);
    const bgFill = '#f3f4f6';
    const bgStroke = '#d1d5db';
    const fs = Math.max(16, Math.round(height * 0.5));
    return (
      <g>
        <rect x={0} y={0} width={width} height={height} rx={r} fill={bgFill} stroke={bgStroke} />
        <text x={width / 2} y={height / 2} textAnchor="middle" dominantBaseline="middle" fontSize={fs} fill="#111827">
          {rank}位
        </text>
      </g>
    );
  }

  return (
    <g>
      <rect x={0} y={0} width={width} height={height} rx={r} fill={bgFill} stroke={bgStroke} />
      {/* Column 0: HP */}
      <text x={colCenter(0)} y={height / 2} textAnchor="middle" dominantBaseline="middle" fontSize={fsHp} fill="#111827">
        {'\u2665'}{player.life}
      </text>

      {/* Column 1: Green mana */}
      <g>
        <circle cx={colCenter(1) - (pipR + 6)} cy={height / 2} r={pipR} fill="#16a34a" />
        <text x={colCenter(1) - pipR + 6} y={height / 2} dominantBaseline="middle" fontSize={fsMana} fill="#111827">{player.mana.green}</text>
      </g>

      {/* Column 2: Red mana */}
      <g>
        <circle cx={colCenter(2) - (pipR + 6)} cy={height / 2} r={pipR} fill="#ef4444" />
        <text x={colCenter(2) - pipR + 6} y={height / 2} dominantBaseline="middle" fontSize={fsMana} fill="#111827">{player.mana.red}</text>
      </g>

      {/* Column 3: Blue mana */}
      <g>
        <circle cx={colCenter(3) - (pipR + 6)} cy={height / 2} r={pipR} fill="#3b82f6" />
        <text x={colCenter(3) - pipR + 6} y={height / 2} dominantBaseline="middle" fontSize={fsMana} fill="#111827">{player.mana.blue}</text>
      </g>
    </g>
  );
};
