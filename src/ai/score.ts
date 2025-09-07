import type { CardId } from '../model/types';
import { CARDS, CARDS_MAP, isFixedCard } from '../model/cards';
import type { GameState } from '../model/GameState';

// Simulate damage array if the current turn player plays cardId.
export const simulateDamage = (gs: GameState, cardId: CardId): [number, number, number, number] => {
  const turn = gs.turn;
  const card = CARDS_MAP[cardId];
  if (!card) return [0, 0, 0, 0];

  // clone-like shallow copy sufficient for read in card hooks
  const clone: GameState = new (gs as any).constructor(gs);
  // set openCard as in real flow
  (clone.players as any)[turn] = { ...clone.players[turn], openCard: cardId };
  // apply mana gain and extend
  const mana0 = clone.players[turn].mana;
  const mana1 = {
    green: mana0.green + card.gainMana.green,
    red: mana0.red + card.gainMana.red,
    blue: mana0.blue + card.gainMana.blue,
  };
  (clone.players as any)[turn] = { ...clone.players[turn], mana: mana1 };
  const extra = card.extendGainMana(clone as any);
  const mana2 = {
    green: mana1.green + (extra?.green ?? 0),
    red: mana1.red + (extra?.red ?? 0),
    blue: mana1.blue + (extra?.blue ?? 0),
  };
  (clone.players as any)[turn] = { ...clone.players[turn], mana: mana2 };

  // base damage
  let damage = card.damage(clone as any);
  // counters
  for (let i = 0; i < clone.players.length; i++) {
    if (i === turn) continue;
    const oc = clone.players[i].openCard;
    if (!oc) continue;
    const ocCard = CARDS.find((c) => c.id === oc);
    if (!ocCard) continue;
    const counter = ocCard.hookDamageCounter(clone as any, damage[i]);
    damage = [
      damage[0] + counter[0],
      damage[1] + counter[1],
      damage[2] + counter[2],
      damage[3] + counter[3],
    ];
  }
  // cancel
  const result = [...damage] as [number, number, number, number];
  for (let i = 0; i < clone.players.length; i++) {
    if (i === turn) continue;
    const oc = clone.players[i].openCard;
    if (!oc) continue;
    const ocCard = CARDS.find((c) => c.id === oc);
    if (!ocCard) continue;
    result[i] = ocCard.hookDamageCancel(clone as any, result[i]) ? 0 : result[i];
  }
  return result as [number, number, number, number];
};

export const scoreCard = (gs: GameState, cardId: CardId): number => {
  const turn = gs.turn;
  const me = gs.players[turn];
  let score = 0;

  // Simulate damage
  const dmg = simulateDamage(gs, cardId);

  // 一発で倒せる敵
  for (let i = 0; i < gs.players.length; i++) {
    if (i === turn) continue;
    const life = gs.players[i].life;
    if (life > 0 && dmg[i] >= life) score += 100;
  }

  // 与ダメージ合計
  score += dmg.reduce((acc, v, i) => (i === turn ? acc : acc + Math.max(0, v)), 0);

  // 被ダメージ（相手マナが自HPより大きい色ごとに-20）
  for (let i = 0; i < gs.players.length; i++) {
    if (i === turn) continue;
    const p = gs.players[i];
    if (p.mana.green > me.life) score -= 20;
    if (p.mana.red > me.life) score -= 20;
    if (p.mana.blue > me.life) score -= 20;
  }

  // カード評価値
  const card = CARDS_MAP[cardId];
  const hand = me.hands.map((id) => CARDS_MAP[id]);
  const countNonFixed = (color: 'green' | 'red' | 'blue') => hand.filter((c) => !isFixedCard(c) && c.color === color).length;
  const countPlayersByColor = (color: 'green' | 'red' | 'blue') =>
    gs.players.filter((p) => p.openCard && CARDS_MAP[p.openCard!]?.color === color).length;
  const maxOtherMana = (color: 'green' | 'red' | 'blue') =>
    Math.max(...gs.players.filter((_, i) => i !== turn).map((p) => p.mana[color]));

  switch (card.id) {
    case 'axe_soldier':
      score += countNonFixed('green') * 1;
      break;
    case 'swordsman':
      score += countNonFixed('red') * 1.5;
      break;
    case 'spearman':
      score += countNonFixed('blue') * 1;
      break;
    case 'peasant_uprising':
      if (countPlayersByColor('blue') <= 1) score += -10;
      break;
    case 'army_charge':
      if (countPlayersByColor('green') <= 1) score += -10;
      break;
    case 'pirate_raid':
      if (countPlayersByColor('red') <= 1) score += -10;
      break;
    case 'giant':
      if (me.mana.green >= 2) score += me.mana.green * 3;
      break;
    case 'dragon':
      if (me.mana.red <= 2) score += -10;
      break;
    case 'kraken':
      if (me.mana.blue <= 2) score += -10;
      break;
    case 'forest_spirit':
      if (me.life <= 9) score += (12 - me.life) * 2;
      break;
    case 'fire_demon':
      if (me.mana.red <= 2) score += -10;
      break;
    case 'hermit':
      score += maxOtherMana('green') * 2;
      break;
    case 'golem':
      score += maxOtherMana('red') * 2;
      break;
    case 'bomb_rock':
      // 0点
      break;
    case 'succubus':
      score += gs.players.filter((p, i) => i !== turn && p.openCard && CARDS_MAP[p.openCard!]?.color === 'red').length * 3;
      break;
  }

  return score;
};

export const pickBestPlayable = (gs: GameState): CardId | null => {
  const playable = gs.playableHands();
  if (playable.length === 0) return null;
  let best: { id: CardId; score: number } | null = null;
  for (const id of playable) {
    const s = scoreCard(gs, id);
    if (!best || s > best.score) best = { id, score: s };
  }
  return best?.id ?? null;
};
