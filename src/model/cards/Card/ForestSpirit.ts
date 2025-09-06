import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';

export class ForestSpirit extends Card {
  constructor() {
    super({
      id: CARD_ID.FOREST_SPIRIT,
      name: '森の精霊',
      color: 'green',
      gainMana: { green: 0, red: 0, blue: 0 } as Mana,
      text: '[12 - 現在Life]の🟢を得る',
      isFixed: false,
    });
  }
}

