import React from 'react';
import { GameManager } from '../model/GameManager';
import { InitialGameManager } from '../model/InitialGameManager';
import { FieldElement } from './FieldElement';
import { CardHoverContext } from './CardHoverContext';
import { CardElement } from './CardElement';

// フェーズ1: SVGでHello, worldを描画する最小実装
export const GameElement: React.FC = () => {
  const [gm] = React.useState<GameManager>(() => InitialGameManager());
  const width = 600;
  const height = Math.round(width * Math.SQRT2);
  const [hover, setHover] = React.useState<{ id: any | null; width: number } | null>(null);

  return (
    <CardHoverContext.Provider value={{ hover, setHover }}>
      <div style={{ position: 'relative' }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Game Field"
          style={{ border: '1px solid #e5e7eb', borderRadius: 12, background: '#0b1020' }}
        >
          <FieldElement gm={gm} width={width} height={height} />
        </svg>
        {hover && hover.id && (
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
              height={Math.round(hover.width * Math.SQRT2)}
              viewBox={`0 0 ${hover.width} ${Math.round(hover.width * Math.SQRT2)}`}
              style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))' }}
            >
              <CardElement id={hover.id} width={hover.width} faceUp labelFallback="カード" />
            </svg>
          </div>
        )}
      </div>
    </CardHoverContext.Provider>
  );
};
