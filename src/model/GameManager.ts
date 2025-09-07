import type { CardId, Mode } from './types';
import type { Player } from './Player';
import { deepClone } from './util';

export class GameManager {
  readonly players: Player[];
  readonly turn: number;
  readonly deck: CardId[];
  readonly previewCard: CardId | null;
  readonly state: Mode;

  constructor(gm?: GameManager) {
    if (gm) {
      this.players = deepClone(gm.players);
      this.turn = gm.turn;
      this.deck = deepClone(gm.deck);
      this.previewCard = gm.previewCard;
      this.state = gm.state;
    } else {
      this.players = [];
      this.turn = 0;
      this.deck = [];
      this.previewCard = null;
      this.state = 'introduction';
    }
  }

  static create(init?: {
    players?: Player[];
    turn?: number;
    deck?: CardId[];
    previewCard?: CardId | null;
    state?: Mode;
  }): GameManager {
    if (!init) return new GameManager();
    const src = {
      players: init.players ?? [],
      turn: init.turn ?? 0,
      deck: init.deck ?? [],
      previewCard: init.previewCard ?? null,
      state: (init.state ?? 'introduction') as Mode,
    } as GameManager;
    return new GameManager(src);
  }

  // Immutable updaters: return new instances without mutating existing state
  withState(state: Mode): GameManager {
    return new GameManager({ ...this, state });
  }

  withPreviewCard(preview: CardId | null): GameManager {
    return new GameManager({ ...this, previewCard: preview });
  }

  nextTurn(): GameManager {
    const next = (this.turn + 1) % Math.max(1, this.players.length);
    return new GameManager({ ...this, turn: next });
  }

  clone(): GameManager {
    const src = {
      players: deepClone(this.players),
      turn: this.turn,
      deck: deepClone(this.deck),
      previewCard: this.previewCard,
      state: this.state,
    } as GameManager;
    return new GameManager(src);
  }
}

// Immutable helpers to encourage non-mutating updates
// (helpers removed after class migration)

// Backward-compatible factory function
export const createGameManager = (partial?: {
  players?: Player[];
  turn?: number;
  deck?: CardId[];
  previewCard?: CardId | null;
  state?: Mode;
}): GameManager => GameManager.create(partial);
