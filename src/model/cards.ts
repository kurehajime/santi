// Card catalog used to build initial decks and hands
// Manage by stable, lowercase snake_case IDs instead of Japanese names.
import type { Mana } from './Mana';
import type { CardId } from './types';

export const CARD_ID = {
  // Fixed cards
  AXE_SOLDIER: 'axe_soldier',
  SWORDSMAN: 'swordsman',
  SPEARMAN: 'spearman',
  // Specials
  PEASANT_UPRISING: 'peasant_uprising',
  ARMY_CHARGE: 'army_charge',
  PIRATE_RAID: 'pirate_raid',
  GIANT: 'giant',
  DRAGON: 'dragon',
  KRAKEN: 'kraken',
  FOREST_SPIRIT: 'forest_spirit',
  FIRE_DEMON: 'fire_demon',
  HERMIT: 'hermit',
  GOLEM: 'golem',
  BOMB_ROCK: 'bomb_rock',
  SUCCUBUS: 'succubus',
} as const;

export type Card = {
  id: CardId;
  name: string; // display name (JA)
  color: 'green' | 'red' | 'blue';
  gainMana: Mana; // mana to gain on play
  text: string; // rules text (human readable)
  isFixed: boolean; // whether the card is one of the fixed infinite cards
};

export const CARDS: readonly Card[] = [
  // Fixed cards
  { id: CARD_ID.AXE_SOLDIER, name: '斧兵', color: 'green', gainMana: { green: 1, red: 0, blue: 0 }, text: '青プレイヤーに🟢×1ダメージ', isFixed: true },
  { id: CARD_ID.SWORDSMAN, name: '剣士', color: 'red', gainMana: { green: 0, red: 1, blue: 0 }, text: '緑プレイヤーに🔴×1ダメージ', isFixed: true },
  { id: CARD_ID.SPEARMAN, name: '槍兵', color: 'blue', gainMana: { green: 0, red: 0, blue: 1 }, text: '赤プレイヤーに🔵×1ダメージ', isFixed: true },
  // Specials
  { id: CARD_ID.PEASANT_UPRISING, name: '民衆の蜂起', color: 'green', gainMana: { green: 1, red: 0, blue: 0 }, text: '青プレイヤーに2の[青プレイヤーの数]乗ダメージ', isFixed: false },
  { id: CARD_ID.ARMY_CHARGE, name: '軍勢の突撃', color: 'red', gainMana: { green: 0, red: 1, blue: 0 }, text: '緑プレイヤーに2の[赤プレイヤーの数]乗ダメージ', isFixed: false },
  { id: CARD_ID.PIRATE_RAID, name: '海賊の強襲', color: 'blue', gainMana: { green: 0, red: 0, blue: 1 }, text: '赤プレイヤーに2の[赤プレイヤーの数]乗ダメージ', isFixed: false },
  { id: CARD_ID.GIANT, name: '巨人', color: 'green', gainMana: { green: 0, red: 0, blue: 0 }, text: '自分の🟢を×3する', isFixed: false },
  { id: CARD_ID.DRAGON, name: 'ドラゴン', color: 'red', gainMana: { green: 0, red: 0, blue: 0 }, text: '緑プレイヤーに🔴×2ダメージ', isFixed: false },
  { id: CARD_ID.KRAKEN, name: 'クラーケン', color: 'blue', gainMana: { green: 0, red: 0, blue: 1 }, text: '赤プレイヤーに青プレイヤーの🔵の合計ダメージ', isFixed: false },
  { id: CARD_ID.FOREST_SPIRIT, name: '森の精霊', color: 'green', gainMana: { green: 0, red: 0, blue: 0 }, text: '[12 - 現在Life]の🟢を得る', isFixed: false },
  { id: CARD_ID.FIRE_DEMON, name: '炎の魔神', color: 'red', gainMana: { green: 0, red: 0, blue: 0 }, text: '自分以外の全員に🔴×1ダメージ', isFixed: false },
  { id: CARD_ID.HERMIT, name: '仙人', color: 'blue', gainMana: { green: 0, red: 0, blue: 1 }, text: '受けるダメージをすべての赤プレイヤーに転嫁', isFixed: false },
  { id: CARD_ID.GOLEM, name: 'ゴーレム', color: 'green', gainMana: { green: 2, red: 0, blue: 0 }, text: '偶数のダメージを受けない', isFixed: false },
  { id: CARD_ID.BOMB_ROCK, name: '爆弾岩', color: 'red', gainMana: { green: 0, red: 1, blue: 0 }, text: '緑プレイヤーに🔴×緑プレイヤーの数ダメージ', isFixed: false },
  { id: CARD_ID.SUCCUBUS, name: 'サキュバス', color: 'blue', gainMana: { green: 0, red: 0, blue: 1 }, text: '赤プレイヤーに🔵×1ダメージ。赤プレイヤーは次も赤しか出せない。', isFixed: false },
];

export const ALL_CARD_IDS: readonly CardId[] = CARDS.map((c) => c.id);
export const SPECIAL_CARD_IDS: readonly CardId[] = CARDS.filter((c) => !c.isFixed).map((c) => c.id);

// Optional: mapping to display names (Japanese) for UI
export const CARD_NAME_JA: Record<string, string> = Object.fromEntries(
  CARDS.map((c) => [c.id, c.name] as const)
);

export const CARDS_MAP: Record<CardId, Card> = Object.fromEntries(
  CARDS.map((c) => [c.id, c] as const)
);

export type SpecialCardId = (typeof SPECIAL_CARD_IDS)[number];

export const isFixedCardId = (id: CardId): boolean => CARDS_MAP[id]?.isFixed === true;
export const isFixedCard = (card: Card): boolean => card.isFixed === true;
