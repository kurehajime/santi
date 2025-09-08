import React from 'react';
import type { Player } from '../model/Player';

type Props = { player: Player; width: number; height: number; isActive?: boolean; rank?: number };

export const StatusElement: React.FC<Props> = ({ player, width, height, isActive = false, rank }) => {
  const r = Math.round(Math.min(width, height) * 0.08);
  const pad = Math.max(6, Math.round(height * 0.08));
  // Horizontal row metrics
  const fsMana = Math.max(14, Math.round(height * 0.6)); // bigger font for mana
  const fsHp = Math.max(14, Math.round(height * 0.6));
  // Reserve right-side area for stars, and keep HP/mana within left content area
  const starCell = Math.max(8, Math.round(height * 0.22));
  const starGapX = Math.max(2, Math.round(starCell * 0.2));
  const starGapY = Math.max(2, Math.round(starCell * 0.2));
  const starBlockW = starCell * 4 + starGapX * 3; // 4 columns
  const rightPadding = pad; // spacing between content and star block
  const contentW = Math.max(40, width - pad * 2 - rightPadding - starBlockW);
  const contentStartX = pad;
  const colW = Math.max(1, contentW / 4);
  const colCenter = (i: number) => contentStartX + colW * (i + 0.5);
  const manaShiftX = Math.max(4, Math.round(colW * 0.1)); // small nudge to the right within content

  const bgFill = isActive ? '#fffbeb' : '#fafafa';
  const bgStroke = isActive ? '#f59e0b' : '#d1d5db';
  const starColor = '#fbbf24'; // amber-400
  const emptyStarColor = '#e5e7eb';
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
      {/* Stars (two rows, up to 8) */}
      {(() => {
        const maxStars = 8;
        const owned = Math.max(0, Math.min(maxStars, player.stars ?? 0));
        const cell = starCell;
        const gapX = starGapX;
        const gapY = starGapY;
        const totalW = starBlockW;
        const startX = width - pad - totalW; // pinned to right
        const startY = pad * 0.6;
        const items: React.ReactElement[] = [];
        for (let i = 0; i < maxStars; i++) {
          const row = Math.floor(i / 4);
          const col = i % 4;
          const x = startX + col * (cell + gapX);
          const y = startY + row * (cell + gapY);
          const filled = i < owned;
          items.push(
            <text key={`star-${i}`} x={x + cell / 2} y={y + cell / 2} textAnchor="middle" dominantBaseline="middle" fontSize={cell * 0.9} fill={filled ? starColor : emptyStarColor}>
              {'\u2605'}
            </text>
          );
        }
        return <g aria-label="stars">{items}</g>;
      })()}
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
