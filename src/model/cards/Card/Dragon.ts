import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';

export class Dragon extends Card {
  constructor() {
    super({
      id: CARD_ID.DRAGON,
      name: 'ドラゴン',
      color: 'red',
      gainMana: { green: 0, red: 0, blue: 0 } as Mana,
      text: '緑プレイヤーに🔴×2ダメージ',
      isFixed: false,
    });
  }
}

