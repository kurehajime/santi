import React from 'react';
import type { Player } from '../model/Player';

type Props = { player: Player; width: number; height: number; isActive?: boolean };

export const StatusElement: React.FC<Props> = ({ player, width, height, isActive = false }) => {
  const r = Math.round(Math.min(width, height) * 0.08);
  const pad = Math.max(6, Math.round(height * 0.08));
  const pipR = Math.max(6, Math.round(height * 0.12));
  const fs = Math.max(11, Math.round(height * 0.24));
  const stepY = pipR * 2 + Math.max(2, Math.round(height * 0.04));
  const textX = pipR * 2 + 8;
  const groupW = textX + fs * 2; // rough width for numbers
  const rightOffset = Math.round(width * 0.1); // shift a bit to the right
  const groupX = width - groupW + rightOffset

  const bgFill = isActive ? '#fffbeb' : '#fafafa';
  const bgStroke = isActive ? '#f59e0b' : '#d1d5db';
  return (
    <g>
      <rect x={0} y={0} width={width} height={height} rx={r} fill={bgFill} stroke={bgStroke} />
      {/* HP (bigger, heart notation) */}
      <text
        x={pad}
        y={height / 2}
        fontSize={Math.max(12, Math.round(height * 0.34))}
        fill="#111827"
        dominantBaseline="middle"
      >
        {'\u2665'}{player.life}
      </text>
      {/* Mana (larger) */}
      <g transform={`translate(${groupX}, ${pad})`}>
        {/* Green */}
        <circle cx={pipR} cy={pipR} r={pipR} fill="#16a34a" />
        <text x={textX} y={pipR} dominantBaseline="middle" fontSize={fs} fill="#111827">{player.mana.green}</text>
        {/* Red */}
        <g transform={`translate(0, ${stepY})`}>
          <circle cx={pipR} cy={pipR} r={pipR} fill="#ef4444" />
          <text x={textX} y={pipR} dominantBaseline="middle" fontSize={fs} fill="#111827">{player.mana.red}</text>
        </g>
        {/* Blue */}
        <g transform={`translate(0, ${stepY * 2})`}>
          <circle cx={pipR} cy={pipR} r={pipR} fill="#3b82f6" />
          <text x={textX} y={pipR} dominantBaseline="middle" fontSize={fs} fill="#111827">{player.mana.blue}</text>
        </g>
      </g>
    </g>
  );
};
