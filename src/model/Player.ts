import type { CardId } from './types';
import type { Mana } from './Mana';
import { createMana } from './Mana';

export interface Player {
  openCard: CardId | null;
  hands: CardId[];
  mana: Mana;
  life: number;
}

export const createPlayer = (partial?: Partial<Player>): Player => ({
  openCard: partial?.openCard ?? null,
  hands: partial?.hands ?? [],
  mana: partial?.mana ?? createMana(),
  life: partial?.life ?? 12,
});

