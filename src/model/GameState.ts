import type { CardId, Mode } from './types';
import type { Player } from './Player';
import { deepClone, shuffle } from './util';
import { CARDS, SPECIAL_CARD_IDS } from './cards';

export class GameState {
  readonly players: Player[];
  readonly turn: number;
  readonly deck: CardId[];
  readonly previewCard: CardId | null;
  readonly mode: Mode;
  readonly lastAttacker: number | null;
  readonly lastDamage: number[] | null;
  readonly eliminatedOrder: number[]; // indices of players in the order they were eliminated

  constructor(gameState?: GameState) {
    if (gameState) {
      this.players = deepClone(gameState.players);
      this.turn = gameState.turn;
      this.deck = deepClone(gameState.deck);
      this.previewCard = gameState.previewCard;
      this.mode = gameState.mode;
      this.lastAttacker = (gameState as any).lastAttacker ?? null;
      this.lastDamage = (gameState as any).lastDamage ?? null;
      this.eliminatedOrder = deepClone((gameState as any).eliminatedOrder ?? []);
    } else {
      this.players = [];
      this.turn = 0;
      this.deck = [];
      this.previewCard = null;
      this.mode = 'introduction';
      this.lastAttacker = null;
      this.lastDamage = null;
      this.eliminatedOrder = [];
    }
  }

  static create(init?: {
    players?: Player[];
    turn?: number;
    deck?: CardId[];
    previewCard?: CardId | null;
    state?: Mode;
    lastAttacker?: number | null;
    lastDamage?: number[] | null;
    eliminatedOrder?: number[];
  }): GameState {
    if (!init) return new GameState();
    const src = {
      players: init.players ?? [],
      turn: init.turn ?? 0,
      deck: init.deck ?? [],
      previewCard: init.previewCard ?? null,
      mode: (init.state ?? 'introduction') as Mode,
      lastAttacker: init.lastAttacker ?? null,
      lastDamage: init.lastDamage ?? null,
      eliminatedOrder: init.eliminatedOrder ?? [],
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
    // Pick a random starting player among alive players
    const aliveIdx: number[] = this.players.map((p, i) => (p.life > 0 ? i : -1)).filter((i) => i >= 0);
    const n = aliveIdx.length > 0 ? aliveIdx.length : this.players.length;
    const pick = aliveIdx.length > 0 ? aliveIdx[Math.floor(Math.random() * aliveIdx.length)] : Math.floor(Math.random() * n);
    const src = { ...this, mode: 'playing' as Mode, turn: pick } as GameState;
    return new GameState(src);
  }

  // Set preview when selecting a hand; validates playability
  preview(cardId: CardId): GameState {
    const playable = this.playableHands();
    if (!playable.includes(cardId)) return this; // ignore invalid
    const src = { ...this, previewCard: cardId, mode: 'preview' as Mode, lastAttacker: null, lastDamage: null } as GameState;
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
    const aliveIdx = this.players.map((p, i) => (p.life > 0 ? i : -1)).filter((i) => i >= 0);
    if (aliveIdx.length <= 1) {
      // Determine round ranking from elimination order
      const n = this.players.length;
      const elim = this.eliminatedOrder.slice();
      // survivors (if any) appended as highest ranks (1位)
      const survivors = aliveIdx.filter((i) => !elim.includes(i));
      const order = elim.concat(survivors); // first eliminated first
      // Compute per-player rank: first eliminated -> last place
      const rankByIdx: number[] = Array(n).fill(n);
      for (let pos = 0; pos < order.length; pos++) {
        const idx = order[pos];
        // rank = n - pos (pos=0 -> rank n, last -> rank 1)
        rankByIdx[idx] = n - pos;
      }
      // Apply star deltas
      const deltaForRank = (rank: number) => (rank === 1 ? 2 : rank === 2 ? 1 : rank === 3 ? -1 : -2);
      let updated = this.clone();
      for (let i = 0; i < n; i++) {
        const d = deltaForRank(rankByIdx[i]);
        const cur = updated.players[i].stars ?? 4;
        updated.players[i].stars = Math.max(0, Math.min(8, cur + d));
      }
      // Check match end conditions: any 0 or 8 stars
      const endsMatch = updated.players.some((p) => p.stars <= 0 || p.stars >= 8);
      if (endsMatch) return new GameState({ ...updated, mode: 'gameover' } as GameState);
      // Otherwise, round over and wait for next round
      return new GameState({ ...updated, mode: 'roundover' } as GameState);
    }
    return this;
  }

  // Start next round: reset hands/deck/mana/life/openCard; keep stars
  nextRound(): GameState {
    const n = this.players.length;
    const fixedIds = CARDS.filter((c) => c.isFixed).map((c) => c.id);
    const shuffled: string[] = shuffle(SPECIAL_CARD_IDS as any);
    const handsExtras: string[][] = Array.from({ length: n }, () => []);
    let deckIndex = 0;
    for (let i = 0; i < n; i++) {
      handsExtras[i] = [shuffled[deckIndex++], shuffled[deckIndex++]];
    }
    const remainingDeck = shuffled.slice(deckIndex);
    const players = this.players.map((p, i) => ({
      openCard: null,
      hands: [...fixedIds, ...handsExtras[i]],
      mana: { green: 0, red: 0, blue: 0 },
      life: 12,
      stars: p.stars,
    }));
    const next = GameState.create({
      players,
      turn: 0,
      deck: remainingDeck,
      previewCard: null,
      state: 'playing',
      lastAttacker: null,
      lastDamage: null,
      eliminatedOrder: [],
    }).start();
    return next;
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
    const prevLives = newState.players.map((p) => p.life);
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
    // 倒れたプレイヤーの場札をクリア
    for (let i = 0; i < newState.players.length; i++) {
      if (newState.players[i].life === 0) {
        newState.players[i].openCard = null;
      }
    }
    // 脱落順を更新（今ターンで0になったプレイヤーを順に追加）
    const eliminatedNow: number[] = [];
    for (let i = 0; i < newState.players.length; i++) {
      const wasAlive = prevLives[i] > 0;
      const nowDead = newState.players[i].life === 0;
      if (wasAlive && nowDead && !newState.eliminatedOrder.includes(i)) {
        eliminatedNow.push(i);
      }
    }
    if (eliminatedNow.length > 0) {
      newState = new GameState({
        ...newState,
        eliminatedOrder: [...newState.eliminatedOrder, ...eliminatedNow],
      } as GameState);
    }
    // 撃破ボーナス: このターンのプレイヤーは、倒した敵1人につき2枚ドロー
    const defeatedCount = newState.players.reduce((acc, p, i) => {
      if (i === this.turn) return acc; // 自分はカウントしない
      const wasAlive = prevLives[i] > 0;
      const nowDead = p.life === 0;
      return acc + (wasAlive && nowDead ? 1 : 0);
    }, 0);
    const drawN = Math.min(newState.deck.length, defeatedCount * 2);
    if (drawN > 0) {
      const drawn = newState.deck.slice(0, drawN);
      const newDeck = newState.deck.slice(drawN);
      newState.players[this.turn].hands = [...newState.players[this.turn].hands, ...drawn];
      newState = new GameState({ ...newState, deck: newDeck } as GameState);
    }
    // ターンを進める（Life>0のプレイヤーまでスキップ）
    // 記録: 最終ダメージとアタッカー
    newState = new GameState({ ...newState, lastAttacker: this.turn, lastDamage: damage.slice() } as GameState);

    const nextAlive = (() => {
      const n = Math.max(1, newState.players.length);
      let idx = newState.turn;
      for (let i = 0; i < n; i++) {
        idx = (idx + 1) % n;
        if (newState.players[idx]?.life > 0) return idx;
      }
      return newState.turn; // 全員死亡などの異常時は据え置き
    })();
    return new GameState({ ...newState, turn: nextAlive } as GameState);
  }

  clone(): GameState {
    const src = {
      players: deepClone(this.players),
      turn: this.turn,
      deck: deepClone(this.deck),
      previewCard: this.previewCard,
      mode: this.mode,
      lastAttacker: this.lastAttacker,
      lastDamage: this.lastDamage ? [...this.lastDamage] : null,
      eliminatedOrder: deepClone(this.eliminatedOrder),
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
