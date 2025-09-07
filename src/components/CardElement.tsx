import React from 'react';
import type { CardId } from '../model/types';
import { CARDS_MAP } from '../model/cards';
import { useCardHover } from './CardHoverContext';

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
  const isFixed = id ? !!CARDS_MAP[id]?.isFixed : false;

  // layout metrics
  const padX = Math.max(8, Math.round(width * 0.06)); // horizontal padding
  const padY = Math.max(2, Math.round(height * 0.03)); // reduced vertical padding
  const headerH = Math.round(height * 0.10);
  const artH = Math.round(height * 0.42);
  const actionH = Math.round(height * 0.12);
  const rulesH = Math.max(0, height - (headerH + artH + actionH + padY * 4));

  // colors
  const paletteByColor = (c: 'green' | 'red' | 'blue') => {
    switch (c) {
      case 'red':
        return { bg: '#7f1d1d', stroke: '#991b1b' }; // deep red
      case 'blue':
        return { bg: '#1e3a8a', stroke: '#1d4ed8' }; // deep blue
      case 'green':
      default:
        return { bg: '#14532d', stroke: '#166534' }; // deep green
    }
  };
  const theme = paletteByColor(color as any);
  const cardBg = faceUp ? theme.bg : '#e5e7eb';
  const cardStroke = faceUp ? theme.stroke : '#cbd5e1';
  const panelBg = '#ededed';
  const panelStroke = '#a3a3a3';
  const bodyTextColor = '#111827'; // text on panels
  const headerTextColor = '#f8fafc'; // text on dark card background

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
  const { setHover, enabled } = useCardHover();

  return (
    <g className="card"
      onMouseEnter={() => {
        if (!enabled) return;
        if (faceUp && id) setHover({ id, width: width * 2 });
      }}
      onMouseLeave={() => setHover(null)}
    >
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
            <text x={headerH * 0.4 + padX * 0.8} y={headerH * 0.62} fontSize={Math.round(width * 0.09)} fill={headerTextColor}>
              {name}
            </text>
          </g>

          {/* fixed card mark (∞) */}
          {isFixed && (
            <text
              x={width - padX}
              y={padY + headerH * 0.7}
              textAnchor="end"
              fontSize={Math.max(14, Math.round(headerH * 0.9))}
              fill={headerTextColor}
              opacity={0.35}
            >
              {'\u221E'}
            </text>
          )}

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
            <text x={(width - padX * 2) / 2 - actionH * 0.25} y={actionH * 0.62} fontSize={Math.round(actionH * 0.6)} textAnchor="end" fill={bodyTextColor}>+
            </text>
            {/* pip */}
            {primaryGainColor && (
              <circle cx={(width - padX * 2) / 2 + actionH * 0.25} cy={actionH * 0.5} r={actionH * 0.22} fill={pipHex(primaryGainColor)} />
            )}
            {/* amount (optional when >1) */}
            {gainAmount > 1 && (
              <text x={(width - padX * 2) / 2 + actionH * 0.55} y={actionH * 0.64} fontSize={Math.round(actionH * 0.46)} fill={bodyTextColor}>
                ×{gainAmount}
              </text>
            )}
          </g>

          {/* rules text (wrapped via foreignObject) */}
          <g transform={`translate(${padX}, ${padY + headerH + artH + padY + actionH + padY})`}>
            <rect x={0} y={0} width={width - padX * 2} height={rulesH} rx={6} fill={panelBg} stroke={panelStroke} />
            {id && (
              (() => {
                const innerPad = Math.max(4, Math.round(width * 0.02));
                const foW = Math.max(0, (width - padX * 2) - innerPad * 2);
                const foH = Math.max(0, rulesH - innerPad * 2);
                const fontPx = Math.round(width * 0.07);
                return (
                  <foreignObject x={innerPad} y={innerPad} width={foW} height={foH}>
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        color: bodyTextColor,
                        fontSize: fontPx,
                        lineHeight: 1.25,
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                        overflow: 'hidden',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {CARDS_MAP[id]?.text}
                    </div>
                  </foreignObject>
                );
              })()
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
