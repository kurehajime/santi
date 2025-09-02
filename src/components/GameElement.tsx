import React from 'react';
import { GameManager } from '../model/GameManager';
import { InitialGameManager } from '../model/InitialGameManager';
import { FieldElement } from './FieldElement';

// フェーズ1: SVGでHello, worldを描画する最小実装
export const GameElement: React.FC = () => {
  const [gm] = React.useState<GameManager>(() => InitialGameManager());
  const width = 600;
  const height = Math.round(width * Math.SQRT2);

  return (
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
  );
};
