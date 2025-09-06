// Card catalog using class-based cards
import type { CardId } from './types';
import { CARD_ID } from './cards/ids';
import { Card } from './cards/Card/Card';
import { AxeSoldier } from './cards/Card/AxeSoldier';
import { Swordsman } from './cards/Card/Swordsman';
import { Spearman } from './cards/Card/Spearman';
import { PeasantUprising } from './cards/Card/PeasantUprising';
import { ArmyCharge } from './cards/Card/ArmyCharge';
import { PirateRaid } from './cards/Card/PirateRaid';
import { Giant } from './cards/Card/Giant';
import { Dragon } from './cards/Card/Dragon';
import { Kraken } from './cards/Card/Kraken';
import { ForestSpirit } from './cards/Card/ForestSpirit';
import { FireDemon } from './cards/Card/FireDemon';
import { Hermit } from './cards/Card/Hermit';
import { Golem } from './cards/Card/Golem';
import { BombRock } from './cards/Card/BombRock';
import { Succubus } from './cards/Card/Succubus';

export { CARD_ID };
export { Card };

export const CARDS: readonly Card[] = [
  new AxeSoldier(),
  new Swordsman(),
  new Spearman(),
  new PeasantUprising(),
  new ArmyCharge(),
  new PirateRaid(),
  new Giant(),
  new Dragon(),
  new Kraken(),
  new ForestSpirit(),
  new FireDemon(),
  new Hermit(),
  new Golem(),
  new BombRock(),
  new Succubus(),
] as const;

export const ALL_CARD_IDS: readonly CardId[] = CARDS.map((c) => c.id);
export const SPECIAL_CARD_IDS: readonly CardId[] = CARDS.filter((c) => !c.isFixed).map((c) => c.id);

export const CARD_NAME_JA: Record<string, string> = Object.fromEntries(
  CARDS.map((c) => [c.id, c.name] as const)
);

export const CARDS_MAP: Record<CardId, Card> = Object.fromEntries(CARDS.map((c) => [c.id, c] as const));

export type SpecialCardId = (typeof SPECIAL_CARD_IDS)[number];

export const isFixedCardId = (id: CardId): boolean => CARDS_MAP[id]?.isFixed === true;
export const isFixedCard = (card: Card): boolean => card.isFixed === true;
