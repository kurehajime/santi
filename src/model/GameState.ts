import type { CardId, Mode } from './types';
import type { Player } from './Player';
import { deepClone } from './util';
import { CARDS } from './cards';

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

  playableHands(): CardId[] {
    // プレイ可能判定: すべての場札のフックで絞り込み
    const turnPlayer = this.players[this.turn];
    const openCards = this.players
      .map((p) => p.openCard)
      .filter((id): id is CardId => !!id)
      .map((id) => CARDS.find((card) => card.id === id))
      .filter((c): c is NonNullable<typeof c> => !!c);
    let hands = [...turnPlayer.hands];
    for (const oc of openCards) {
      hands = oc.hookEnabledPlay(this, hands);
    }
    return hands;
  }

  // --- Mode transitions ---
  withMode(mode: Mode): GameState {
    const src = { ...this, mode } as GameState;
    return new GameState(src);
  }

  withPreview(card: CardId | null): GameState {
    const src = { ...this, previewCard: card, mode: card ? ('preview' as Mode) : this.mode } as GameState;
    return new GameState(src);
  }

  start(): GameState {
    return this.withMode('playing');
  }

  // Set preview when selecting a hand; validates playability
  preview(cardId: CardId): GameState {
    const playable = this.playableHands();
    if (!playable.includes(cardId)) return this; // ignore invalid
    const src = { ...this, previewCard: cardId, mode: 'preview' as Mode } as GameState;
    return new GameState(src);
  }

  // Confirm preview: apply card effect and advance turn, clear preview
  confirm(): GameState {
    if (!this.previewCard) return this;
    const applied = this.nextTurn(this.previewCard);
    const next = new GameState({ ...applied, previewCard: null, mode: 'playing' } as GameState);
    return next.checkGameOver();
  }

  // Cancel preview selection
  cancelPreview(): GameState {
    if (!this.previewCard) return this;
    return new GameState({ ...this, previewCard: null, mode: 'playing' } as GameState);
  }

  // If 0 or 1 players remain with life>0, go to gameover
  private checkGameOver(): GameState {
    const alive = this.players.filter((p) => p.life > 0).length;
    if (alive <= 1) {
      return this.withMode('gameover');
    }
    return this;
  }

  private withPlayedCard(playerIndex: number, cardId: CardId): GameState {
    let newState = this.clone();
    const turnPlayer = this.players[this.turn];
    // プレイできるカードなのかチェック
    let hands = this.playableHands();
    const hand = hands.find((c) => c === cardId);
    const handCard = CARDS.find((c) => c.id === hand);
    if (!handCard) {
      throw Error(`Player ${turnPlayer} cannot play card ${cardId}`);
    }
    const card = CARDS.find((c) => c.id === cardId);
    if (!card?.isFixed) {
      newState.players[playerIndex].hands = newState.players[playerIndex].hands.filter((c) => c !== cardId);
    }
    newState.players[playerIndex].openCard = cardId;
    return newState;
  }

  private gainMana(playerIndex: number, mana: { green: number, red: number, blue: number }): GameState {
    let newState = this.clone();
    newState.players[playerIndex].mana = {
      green: newState.players[playerIndex].mana.green + mana.green,
      red: newState.players[playerIndex].mana.red + mana.red,
      blue: newState.players[playerIndex].mana.blue + mana.blue,
    }
    return newState;
  }

  // カードを出す
  nextTurn(cardId: CardId): GameState {
    let newState = this.clone();
    // 手札からカードを出す
    newState = newState.withPlayedCard(this.turn, cardId);
    const handCard = CARDS.find((c) => c.id === cardId);
    if (!handCard) {
      throw Error(`Player ${this.players[this.turn]} cannot play card ${cardId}`);
    }
    // マナを生みだす
    newState = newState.gainMana(this.turn, handCard.gainMana);
    // 追加の効果でマナを生みだす
    const extendMana = handCard.extendGainMana(newState);
    newState = newState.gainMana(this.turn, extendMana);
    // ダメージを計算する
    let damage = handCard.damage(newState);
    // 反撃ダメージを計算する
    const counters: [number, number, number, number][] = [];
    for (let i = 0; i < newState.players.length; i++) {
      if (i === this.turn) continue;
      const oc = newState.players[i].openCard;
      if (!oc) continue;
      const ocCard = CARDS.find((c) => c.id === oc);
      if (!ocCard) continue;
      const counter = ocCard.hookDamageCounter(newState, damage[i]);
      counters.push(counter)
    }
    for (let counter of counters) {
      damage = [
        damage[0] + counter[0],
        damage[1] + counter[1],
        damage[2] + counter[2],
        damage[3] + counter[3]
      ]
    }
    // ダメージ無効化判定
    for (let i = 0; i < newState.players.length; i++) {
      if (i === this.turn) continue;
      const oc = newState.players[i].openCard;
      if (!oc) continue;
      const ocCard = CARDS.find((c) => c.id === oc);
      if (!ocCard) continue;
      damage[i] = ocCard.hookDamageCancel(newState, damage[i]) ? 0 : damage[i];
    }
    // ダメージを与える
    for (let i = 0; i < newState.players.length; i++) {
      newState.players[i].life = Math.max(0, newState.players[i].life - damage[i]);
    }
    // ターンを進める
    const next = (newState.turn + 1) % Math.max(1, newState.players.length);
    return new GameState({ ...newState, turn: next } as GameState);
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
