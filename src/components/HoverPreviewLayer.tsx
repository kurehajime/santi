import React from 'react';
import { CardElement } from './CardElement';
import type { HoverCard } from './CardHoverContext';

type Props = {
  hover: HoverCard | null;
};

export const HoverPreviewLayer: React.FC<Props> = ({ hover }) => {
  if (!hover || !hover.id) return null;
  const hoverHeight = Math.round(hover.width * Math.SQRT2);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        pointerEvents: 'none',
        zIndex: 5,
      }}
      aria-hidden
    >
      <svg
        width={hover.width}
        height={hoverHeight}
        viewBox={`0 0 ${hover.width} ${hoverHeight}`}
      style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))' }}
      >
        <CardElement id={hover.id} width={hover.width} faceUp labelFallback="カード" />
      </svg>
    </div>
  );
};
