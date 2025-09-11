import React from 'react';
import type { GameState } from '../../model/GameState';

type Props = {
  gameState: GameState;
  onRestart: () => void;
};

const seatLabel = (idx: number) => (idx === 0 ? '南' : idx === 1 ? '西' : idx === 2 ? '北' : '東');

export const GameOverOverlay: React.FC<Props> = ({ gameState, onRestart }) => {
  const ranks = gameState.lastRanks ?? [];
  const order = ranks.map((_, i) => i).sort((a, b) => (ranks[a] - ranks[b]) || (a - b));
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', top: 300, left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none', textAlign: 'center' }}>
        {order.map((idx) => (
          <div key={idx} style={{ color: '#111827', fontSize: 16 }}>
            {ranks[idx]}位: {seatLabel(idx)} （★{gameState.players[idx]?.stars ?? 0}）
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <button onClick={onRestart} style={{ padding: '10px 20px', borderRadius: 8, fontSize: 16 }}>再戦</button>
      </div>
    </div>
  );
};

