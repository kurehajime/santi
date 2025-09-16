import React from 'react';
import type { CardId } from '../model/types';
import { CardElement } from './CardElement';

type Props = {
  cardId: CardId | null | undefined;
  containerWidth: number;
  cardWidth: number;
  liftRatio?: number;
  ariaLabel: string;
};

export const SeatOpenCard: React.FC<Props> = ({ cardId, containerWidth, cardWidth, liftRatio = 0.8, ariaLabel }) => {
  if (!cardId) return null;
  const cardHeight = Math.round(cardWidth * Math.SQRT2);
  const offsetX = Math.round((containerWidth - cardWidth) / 2);
  const offsetY = -Math.round(cardHeight * liftRatio);
  return (
    <g transform={`translate(${offsetX}, ${offsetY})`} aria-label={ariaLabel}>
      <CardElement id={cardId} width={cardWidth} faceUp labelFallback="カード" />
    </g>
  );
};

