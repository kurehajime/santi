import type { CardId, Mode } from './types';
import type { Player } from './Player';
import { deepClone } from './util';

export class GameState {
  readonly players: Player[];
  readonly turn: number;
  readonly deck: CardId[];
  readonly previewCard: CardId | null;
  readonly mode: Mode;

  constructor(gameState?: GameState) {
    if (gameState) {
      this.players = deepClone(gameState.players);
      this.turn = gameState.turn;
      this.deck = deepClone(gameState.deck);
      this.previewCard = gameState.previewCard;
      this.mode = gameState.mode;
    } else {
      this.players = [];
      this.turn = 0;
      this.deck = [];
      this.previewCard = null;
      this.mode = 'introduction';
    }
  }

  static create(init?: {
    players?: Player[];
    turn?: number;
    deck?: CardId[];
    previewCard?: CardId | null;
    state?: Mode;
  }): GameState {
    if (!init) return new GameState();
    const src = {
      players: init.players ?? [],
      turn: init.turn ?? 0,
      deck: init.deck ?? [],
      previewCard: init.previewCard ?? null,
      mode: (init.state ?? 'introduction') as Mode,
    } as GameState;
    return new GameState(src);
  }

  // Immutable updaters: return new instances without mutating existing state
  withState(state: Mode): GameState {
    return new GameState({ ...this, mode: state });
  }

  withPreviewCard(preview: CardId | null): GameState {
    return new GameState({ ...this, previewCard: preview });
  }

  nextTurn(): GameState {
    const next = (this.turn + 1) % Math.max(1, this.players.length);
    return new GameState({ ...this, turn: next });
  }

  clone(): GameState {
    const src = {
      players: deepClone(this.players),
      turn: this.turn,
      deck: deepClone(this.deck),
      previewCard: this.previewCard,
      mode: this.mode,
    } as GameState;
    return new GameState(src);
  }
}

// Immutable helpers to encourage non-mutating updates
// (helpers removed after class migration)

// Backward-compatible factory function
export const createGameState = (partial?: {
  players?: Player[];
  turn?: number;
  deck?: CardId[];
  previewCard?: CardId | null;
  state?: Mode;
}): GameState => GameState.create(partial);
