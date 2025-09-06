import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';

export class Hermit extends Card {
  constructor() {
    super({
      id: CARD_ID.HERMIT,
      name: '仙人',
      color: 'blue',
      gainMana: { green: 0, red: 0, blue: 1 } as Mana,
      text: '受けるダメージをすべての赤プレイヤーに転嫁',
      isFixed: false,
    });
  }
}

