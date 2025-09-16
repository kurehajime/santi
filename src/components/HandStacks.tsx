import React from 'react';
import type { CardId } from '../model/types';
import { CardElement } from './CardElement';

type Group = [CardId, number];

type Props = {
  groups: Group[];
  cardWidth: number;
  stepX: number;
  faceUp: boolean;
  ariaLabel: string;
  onSelect?: (cardId: CardId) => void;
  disabledIds?: Set<CardId>;
  liftedId?: CardId | null;
  liftRatio?: number;
};

export const HandStacks: React.FC<Props> = ({
  groups,
  cardWidth,
  stepX,
  faceUp,
  ariaLabel,
  onSelect,
  disabledIds,
  liftedId,
  liftRatio = 0,
}) => {
  const cardHeight = Math.round(cardWidth * Math.SQRT2);
  const liftOffset = Math.round(cardHeight * liftRatio);

  return (
    <g aria-label={ariaLabel}>
      {groups.map(([cid, cnt], i) => {
        const isDisabled = disabledIds ? disabledIds.has(cid) : false;
        const canSelect = Boolean(onSelect) && !isDisabled;
        const liftY = liftedId && liftedId === cid ? -liftOffset : 0;
        const handleClick = (event: React.MouseEvent) => {
          event.stopPropagation();
          if (canSelect && onSelect) onSelect(cid);
        };
        const cursorStyle = canSelect ? 'pointer' : undefined;
        const opacity = onSelect && isDisabled ? 0.4 : 1;
        const countFontSize = Math.round(cardWidth * 0.32);
        const pad = 6;
        const boxW = countFontSize * 1.6;
        const boxH = countFontSize * 0.9;
        const badgeX = pad;
        const badgeY = cardHeight - boxH - pad;

        return (
          <g key={i} transform={`translate(${i * stepX}, ${liftY})`} onClick={handleClick} style={cursorStyle ? { cursor: cursorStyle } : undefined}>
            <g opacity={opacity}>
              <CardElement id={cid} width={cardWidth} faceUp={faceUp} labelFallback="手札" />
            </g>
            {cnt > 1 && (
              <g style={{ pointerEvents: 'none' }}>
                <rect x={badgeX} y={badgeY} width={boxW} height={boxH} rx={Math.round(boxH * 0.3)} fill="#111827" opacity={0.6} />
                <text
                  x={badgeX + boxW / 2}
                  y={badgeY + boxH / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={countFontSize}
                  fill="#ffffff"
                >
                  ×{cnt}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

