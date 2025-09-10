import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameState } from '../../GameState';

export class ForestSpirit extends Card {
  constructor() {
    super({
      id: CARD_ID.FOREST_SPIRIT,
      name: '森の精霊',
      color: 'green',
      gainMana: { green: 0, red: 0, blue: 0 } as Mana,
      text: '[12 - 現在Life]の🟢を得る',
      isSpecial: true,
    });
  }
  extendGainMana(_gs: GameState): { green: number, red: number, blue: number } {
    const currentLife = _gs.players[_gs.turn].life;
    const gain = 12 - currentLife;
    return { green: gain, red: 0, blue: 0 } as Mana;
  }
}
