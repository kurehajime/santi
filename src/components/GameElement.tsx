import React from 'react';
import { GameState } from '../model/GameState';
import { FieldElement } from './FieldElement';
import { StartOverlay } from './overlays/StartOverlay';
import { GameOverOverlay } from './overlays/GameOverOverlay';
import { RoundOverOverlay } from './overlays/RoundOverOverlay';
import { CardHoverContext } from './CardHoverContext';
import { CardElement } from './CardElement';
import { InitialGameState } from '../model/InitialGameState';
import { pickBestPlayable } from '../ai/score';
import { toast } from 'react-toastify';

// フェーズ1: SVGでHello, worldを描画する最小実装
export const GameElement: React.FC = () => {
  const [gameState, setGameState] = React.useState<GameState>(() => InitialGameState());
  const width = 600;
  const height = Math.round(width * Math.SQRT2);
  const [hover, setHover] = React.useState<{ id: any | null; width: number } | null>(null);

  // CPU auto-play: when mode is playing and it's not human's turn
  React.useEffect(() => {
    if (gameState.mode !== 'playing') return;
    // If no playable cards for current player (human or CPU), they immediately lose
    if (gameState.playableHands().length === 0) {
      const seat = gameState.turn === 0 ? '南' : gameState.turn === 1 ? '西' : gameState.turn === 2 ? '北' : '東';
      toast.info(`${seat} は出せるカードがなく敗北`, { autoClose: 2000 });
      setGameState((s) => s.loseIfNoPlayable());
      return;
    }
    if (gameState.turn === 0) return;
    const pick = pickBestPlayable(gameState) ?? null;
    if (!pick) return;
    // small delay for UX
    const t = setTimeout(() => {
      setGameState((s) => s.preview(pick));
      setTimeout(() => setGameState((s) => s.confirm()), 500);
    }, 400);
    return () => clearTimeout(t);
  }, [gameState.mode, gameState.turn]);

  const hoverEnabled = gameState.turn === 0; // disable enlarging on opponent's turn
  return (
    <CardHoverContext.Provider value={{ hover, setHover, enabled: hoverEnabled }}>
      <div style={{ position: 'relative' }}>
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Game Field"
          style={{ border: '1px solid #e5e7eb', borderRadius: 12, background: '#0b1020' }}
          onClick={() => {
            // click outside cards cancels preview (only for human's preview)
            if (gameState.mode === 'preview' && gameState.turn === 0) {
              setHover(null);
              setGameState((s) => s.cancelPreview());
            }
          }}
        >
          <FieldElement
            gameState={gameState}
            width={width}
            height={height}
            onSelectHand={(cid) => {
              // If same card selected again in preview, confirm (and clear hover). Otherwise set preview.
              setGameState((s) => {
                if (s.mode === 'preview' && s.previewCard === cid) {
                  setHover(null);
                  return s.confirm();
                }
                return s.preview(cid);
              });
            }}
          />
        </svg>

        {gameState.mode === 'introduction' && (
          <StartOverlay onStart={() => setGameState((s) => s.start())} />
        )}
        {gameState.mode === 'gameover' && (
          <GameOverOverlay gameState={gameState} onRestart={() => { setHover(null); setGameState(InitialGameState()); }} />
        )}
        {gameState.mode === 'roundover' && (
          <RoundOverOverlay gameState={gameState} onNext={() => { setHover(null); setGameState((s) => s.nextRound()); }} />
        )}

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
