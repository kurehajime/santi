import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';

export class Spearman extends Card {
  constructor() {
    super({
      id: CARD_ID.SPEARMAN,
      name: '槍兵',
      color: 'blue',
      gainMana: { green: 0, red: 0, blue: 1 } as Mana,
      text: '赤プレイヤーに🔵×1ダメージ',
      isFixed: true,
    });
  }
}

