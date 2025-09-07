import React from 'react';
import type { Player } from '../model/Player';

type Props = { player: Player; width: number; height: number; isActive?: boolean; rank?: number };

export const StatusElement: React.FC<Props> = ({ player, width, height, isActive = false, rank }) => {
  const r = Math.round(Math.min(width, height) * 0.08);
  const pad = Math.max(6, Math.round(height * 0.08));
  // Horizontal row metrics
  const fsMana = Math.max(14, Math.round(height * 0.6)); // bigger font for mana
  const fsHp = Math.max(14, Math.round(height * 0.6));
  const colW = Math.max(1, (width - pad * 2) / 4);
  const colCenter = (i: number) => pad + colW * (i + 0.5);
  const manaShiftX = Math.max(6, Math.round(width * 0.04)); // shift mana a bit to the right

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

      {/* Column 1: Green mana (rounded rectangle badge) */}
      {(() => {
        const chipH = Math.max(18, Math.round(height * 0.7));
        const chipW = Math.max(28, Math.round(fsMana * 1.7));
        const rx = Math.round(chipH * 0.25);
        const cx = colCenter(1) + manaShiftX;
        const cy = height / 2;
        return (
          <g>
            <rect x={cx - chipW / 2} y={cy - chipH / 2} width={chipW} height={chipH} rx={rx} fill="#16a34a" />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={fsMana} fill="#ffffff">{player.mana.green}</text>
          </g>
        );
      })()}

      {/* Column 2: Red mana */}
      {(() => {
        const chipH = Math.max(18, Math.round(height * 0.7));
        const chipW = Math.max(28, Math.round(fsMana * 1.7));
        const rx = Math.round(chipH * 0.25);
        const cx = colCenter(2) + manaShiftX;
        const cy = height / 2;
        return (
          <g>
            <rect x={cx - chipW / 2} y={cy - chipH / 2} width={chipW} height={chipH} rx={rx} fill="#ef4444" />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={fsMana} fill="#ffffff">{player.mana.red}</text>
          </g>
        );
      })()}

      {/* Column 3: Blue mana */}
      {(() => {
        const chipH = Math.max(18, Math.round(height * 0.7));
        const chipW = Math.max(28, Math.round(fsMana * 1.7));
        const rx = Math.round(chipH * 0.25);
        const cx = colCenter(3) + manaShiftX;
        const cy = height / 2;
        return (
          <g>
            <rect x={cx - chipW / 2} y={cy - chipH / 2} width={chipW} height={chipH} rx={rx} fill="#3b82f6" />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={fsMana} fill="#ffffff">{player.mana.blue}</text>
          </g>
        );
      })()}
    </g>
  );
};
