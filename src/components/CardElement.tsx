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
  const r = Math.round(width * 0.06);
  const name = id ? CARDS_MAP[id]?.name ?? String(id) : labelFallback;
  const color = id ? CARDS_MAP[id]?.color ?? 'green' : 'green';
  const gain = id ? CARDS_MAP[id]?.gainMana ?? { green: 0, red: 0, blue: 0 } : { green: 0, red: 0, blue: 0 };

  // layout metrics
  const padX = Math.max(8, Math.round(width * 0.06)); // horizontal padding
  const padY = Math.max(2, Math.round(height * 0.03)); // reduced vertical padding
  const headerH = Math.round(height * 0.10);
  const artH = Math.round(height * 0.42);
  const actionH = Math.round(height * 0.12);
  const rulesH = Math.max(0, height - (headerH + artH + actionH + padY * 4));

  // colors
  const cardBg = faceUp ? '#dfeee0' : '#e5e7eb'; // light green tint for face-up
  const cardStroke = '#9aa88c';
  const panelBg = '#ededed';
  const panelStroke = '#a3a3a3';
  const textColor = '#111827';

  const pipHex = (c: 'green' | 'red' | 'blue') => (c === 'green' ? '#65a30d' : c === 'red' ? '#dc2626' : '#2563eb');

  // choose primary gain color for action row (first non-zero)
  const primaryGainColor: 'green' | 'red' | 'blue' | null =
    gain.green > 0 ? 'green' : gain.red > 0 ? 'red' : gain.blue > 0 ? 'blue' : null;
  const gainAmount = primaryGainColor === 'green' ? gain.green : primaryGainColor === 'red' ? gain.red : primaryGainColor === 'blue' ? gain.blue : 0;

  // simple face graphic as placeholder art
  const artY = padY + headerH;
  const artW = width - padX * 2;
  const artR = Math.min(artW, artH) * 0.18;
  const artCX = padX + artW / 2;
  const artCY = artY + artH / 2 + artR * 0.1;

  return (
    <g>
      {/* card frame */}
      <rect x={0} y={0} width={width} height={height} rx={r} fill={cardBg} stroke={cardStroke} />

      {faceUp ? (
        <g>
          {/* header */}
          <g transform={`translate(${padX}, ${padY})`}>
            {/* color pip with subtle ring */}
            <circle cx={headerH * 0.4} cy={headerH * 0.5} r={headerH * 0.35} fill="#f1f5f9" stroke="#cbd5e1" />
            <circle cx={headerH * 0.4} cy={headerH * 0.5} r={headerH * 0.24} fill={pipHex(color as any)} />
            {/* name */}
            <text x={headerH * 0.4 + padX * 0.8} y={headerH * 0.62} fontSize={Math.round(width * 0.09)} fill={textColor}>
              {name}
            </text>
          </g>

          {/* art box */}
          <g transform={`translate(${padX}, ${padY + headerH})`}>
            <rect x={0} y={0} width={width - padX * 2} height={artH} rx={6} fill={panelBg} stroke={panelStroke} />
          </g>
          {/* placeholder doodle face */}
          <g>
            <circle cx={artCX} cy={artCY} r={artR} fill="none" stroke="#9ca3af" />
            <circle cx={artCX - artR * 0.35} cy={artCY - artR * 0.2} r={artR * 0.08} fill="#6b7280" />
            <circle cx={artCX + artR * 0.35} cy={artCY - artR * 0.2} r={artR * 0.08} fill="#6b7280" />
            <path d={`M ${artCX - artR * 0.45} ${artCY + artR * 0.12} Q ${artCX} ${artCY + artR * 0.35} ${artCX + artR * 0.45} ${artCY + artR * 0.12}`} stroke="#9ca3af" fill="none" />
          </g>

          {/* action row */}
          <g transform={`translate(${padX}, ${padY + headerH + artH + padY})`}>
            <rect x={0} y={0} width={width - padX * 2} height={actionH} rx={6} fill={panelBg} stroke={panelStroke} />
            {/* plus sign */}
            <text x={(width - padX * 2) / 2 - actionH * 0.25} y={actionH * 0.62} fontSize={Math.round(actionH * 0.6)} textAnchor="end" fill={textColor}>+
            </text>
            {/* pip */}
            {primaryGainColor && (
              <circle cx={(width - padX * 2) / 2 + actionH * 0.25} cy={actionH * 0.5} r={actionH * 0.22} fill={pipHex(primaryGainColor)} />
            )}
            {/* amount (optional when >1) */}
            {gainAmount > 1 && (
              <text x={(width - padX * 2) / 2 + actionH * 0.55} y={actionH * 0.64} fontSize={Math.round(actionH * 0.46)} fill={textColor}>
                ×{gainAmount}
              </text>
            )}
          </g>

          {/* rules text */}
          <g transform={`translate(${padX}, ${padY + headerH + artH + padY + actionH + padY})`}>
            <rect x={0} y={0} width={width - padX * 2} height={rulesH} rx={6} fill={panelBg} stroke={panelStroke} />
            {id && (
              <text x={padX * 0.6} y={Math.min(rulesH - 4, Math.round(rulesH * 0.3))} fontSize={Math.round(width * 0.045)} fill={textColor}>
                {CARDS_MAP[id]?.text}
              </text>
            )}
          </g>
        </g>
      ) : (
        <g>
          {/* simple back design */}
          <rect x={padX} y={padY} width={width - padX * 2} height={height - padY * 2} rx={6} fill="#cbd5e1" />
          <text x={width / 2} y={height / 2} textAnchor="middle" dominantBaseline="middle" fontSize={Math.round(width * 0.1)} fill="#475569">
            {labelFallback}
          </text>
        </g>
      )}
    </g>
  );
};
