import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';

export class Kraken extends Card {
  constructor() {
    super({
      id: CARD_ID.KRAKEN,
      name: 'クラーケン',
      color: 'blue',
      gainMana: { green: 0, red: 0, blue: 1 } as Mana,
      text: '赤プレイヤーに青プレイヤーの🔵の合計ダメージ',
      isFixed: false,
    });
  }
}

