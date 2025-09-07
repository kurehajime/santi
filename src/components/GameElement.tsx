import React from 'react';
import { GameState } from '../model/GameState';
import { FieldElement } from './FieldElement';
import { CardHoverContext } from './CardHoverContext';
import { CardElement } from './CardElement';
import { InitialGameState } from '../model/InitialGameState';

// フェーズ1: SVGでHello, worldを描画する最小実装
export const GameElement: React.FC = () => {
  const [gameState, setGameState] = React.useState<GameState>(() => InitialGameState());
  const width = 600;
  const height = Math.round(width * Math.SQRT2);
  const [hover, setHover] = React.useState<{ id: any | null; width: number } | null>(null);

  // CPU auto-play: when mode is playing and it's not human's turn
  React.useEffect(() => {
    if (gameState.mode !== 'playing') return;
    if (gameState.turn === 0) return;
    const playable = gameState.playableHands();
    if (playable.length === 0) return; // nothing to do
    const pick = playable[Math.floor(Math.random() * playable.length)];
    // small delay for UX
    const t = setTimeout(() => {
      setGameState((s) => s.preview(pick));
      setTimeout(() => setGameState((s) => s.confirm()), 300);
    }, 400);
    return () => clearTimeout(t);
  }, [gameState.mode, gameState.turn]);

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
          <FieldElement
            gameState={gameState}
            width={width}
            height={height}
            onSelectHand={(cid) => {
              // Human selects a card: go to preview
              setGameState((s) => s.preview(cid));
            }}
          />
        </svg>
        {/* Controls */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pointerEvents: 'none' }}>
          {gameState.mode === 'introduction' && (
            <div style={{ marginBottom: 12, pointerEvents: 'auto' }}>
              <button onClick={() => setGameState((s) => s.start())} style={{ padding: '8px 16px', borderRadius: 8 }}>開始</button>
            </div>
          )}
          {gameState.mode === 'preview' && gameState.turn === 0 && (
            <div style={{ marginBottom: 12, display: 'flex', gap: 8, pointerEvents: 'auto' }}>
              <button onClick={() => setGameState((s) => s.confirm())} style={{ padding: '8px 16px', borderRadius: 8 }}>決定</button>
              <button onClick={() => setGameState((s) => s.cancelPreview())} style={{ padding: '8px 16px', borderRadius: 8 }}>キャンセル</button>
            </div>
          )}
        </div>
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
