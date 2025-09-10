import { GameState } from './GameState';
import { createMana } from './Mana';
import { createPlayer } from './Player';
import { MAX_NON_SPECIAL_COPIES } from '../config/constants';
import { CARDS, SPECIAL_CARD_IDS } from './cards';
import { shuffle } from './util';

// Creates a random initial game state per rules:
// - 4 players
// - Each player starts with life=12, mana=0, openCard=null
// - Each hand: 3 fixed cards (斧兵/剣士/槍兵) + 2 random special cards
// - Shared deck contains remaining special cards
// - Turn starts at 0, state = 'introduction'
export const InitialGameState = (): GameState => {
  const playersCount = 4;

  // Build and shuffle the special deck
  const shuffled = shuffle(SPECIAL_CARD_IDS);

  // Deal 2 special cards per player
  const handsExtras: string[][] = Array.from({ length: playersCount }, () => []);
  let deckIndex = 0;
  for (let i = 0; i < playersCount; i++) {
    handsExtras[i] = [shuffled[deckIndex++], shuffled[deckIndex++]];
  }

  const remainingDeck = shuffled.slice(deckIndex);

  const fixedIds = CARDS.filter((c) => !c.isSpecial).map((c) => c.id);

  const players = Array.from({ length: playersCount }, (_, i) => {
    const p = createPlayer({
      openCard: null,
      hands: [],
      mana: createMana(0, 0, 0),
      life: 12,
    });
    // add non-special cards up to maxHands copies per id
    const nonSpecialCopies = fixedIds.flatMap((id) => Array.from({ length: p.maxHands ?? MAX_NON_SPECIAL_COPIES }, () => id));
    p.hands = [...nonSpecialCopies, ...handsExtras[i]];
    return p;
  });

  return GameState.create({
    players,
    turn: 0,
    deck: remainingDeck,
    previewCard: null,
    state: 'introduction',
    lastAttacker: null,
    lastDamage: null,
    eliminatedOrder: [],
  });
};
