import type { CardId } from './types';
import type { Mana } from './Mana';
import { MAX_NON_SPECIAL_COPIES } from '../config/constants';
import { createMana } from './Mana';

export interface Player {
  openCard: CardId | null;
  hands: CardId[];
  mana: Mana;
  life: number;
  stars: number;
  maxHands: number; // maximum initial copies for non-special cards (per card id)
}

export const createPlayer = (partial?: Partial<Player>): Player => ({
  openCard: partial?.openCard ?? null,
  hands: partial?.hands ?? [],
  mana: partial?.mana ?? createMana(),
  life: partial?.life ?? 12,
  // 初期★は6（最大12）
  stars: partial?.stars ?? 6,
  maxHands: partial?.maxHands ?? MAX_NON_SPECIAL_COPIES,
});
