import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';

export class Golem extends Card {
  constructor() {
    super({
      id: CARD_ID.GOLEM,
      name: 'ゴーレム',
      color: 'green',
      gainMana: { green: 2, red: 0, blue: 0 } as Mana,
      text: '偶数のダメージを受けない',
      isFixed: false,
    });
  }
}

