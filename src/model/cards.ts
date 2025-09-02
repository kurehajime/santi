// Card catalog used to build initial decks and hands
// Manage by stable, lowercase snake_case IDs instead of Japanese names.

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

export const FIXED_CARDS = [
  CARD_ID.AXE_SOLDIER,
  CARD_ID.SWORDSMAN,
  CARD_ID.SPEARMAN,
] as const;

export const SPECIAL_CARDS = [
  CARD_ID.PEASANT_UPRISING,
  CARD_ID.ARMY_CHARGE,
  CARD_ID.PIRATE_RAID,
  CARD_ID.GIANT,
  CARD_ID.DRAGON,
  CARD_ID.KRAKEN,
  CARD_ID.FOREST_SPIRIT,
  CARD_ID.FIRE_DEMON,
  CARD_ID.HERMIT,
  CARD_ID.GOLEM,
  CARD_ID.BOMB_ROCK,
  CARD_ID.SUCCUBUS,
] as const;

// Optional: mapping to display names (Japanese) for UI
export const CARD_NAME_JA: Record<string, string> = {
  [CARD_ID.AXE_SOLDIER]: '斧兵',
  [CARD_ID.SWORDSMAN]: '剣士',
  [CARD_ID.SPEARMAN]: '槍兵',
  [CARD_ID.PEASANT_UPRISING]: '民衆の蜂起',
  [CARD_ID.ARMY_CHARGE]: '軍勢の突撃',
  [CARD_ID.PIRATE_RAID]: '海賊の強襲',
  [CARD_ID.GIANT]: '巨人',
  [CARD_ID.DRAGON]: 'ドラゴン',
  [CARD_ID.KRAKEN]: 'クラーケン',
  [CARD_ID.FOREST_SPIRIT]: '森の精霊',
  [CARD_ID.FIRE_DEMON]: '炎の魔神',
  [CARD_ID.HERMIT]: '仙人',
  [CARD_ID.GOLEM]: 'ゴーレム',
  [CARD_ID.BOMB_ROCK]: '爆弾岩',
  [CARD_ID.SUCCUBUS]: 'サキュバス',
};

export type FixedCardId = typeof FIXED_CARDS[number];
export type SpecialCardId = typeof SPECIAL_CARDS[number];
