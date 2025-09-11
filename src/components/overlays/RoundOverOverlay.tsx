import React from 'react';
import type { GameState } from '../../model/GameState';

type Props = {
  gameState: GameState;
  onNext: () => void;
};

const seatLabel = (idx: number) => (idx === 0 ? '南' : idx === 1 ? '西' : idx === 2 ? '北' : '東');

export const RoundOverOverlay: React.FC<Props> = ({ gameState, onNext }) => {
  const deltas = gameState.lastStarDelta ?? [];
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', textAlign: 'center' }}>
        {deltas.map((d, idx) => (
          <div key={idx} style={{ color: '#111827', fontSize: 16 }}>
            {seatLabel(idx)}: {d > 0 ? `+${d}` : `${d}`}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <button onClick={onNext} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 16 }}>次局</button>
      </div>
    </div>
  );
};
