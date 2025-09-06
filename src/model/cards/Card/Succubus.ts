import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';

export class Succubus extends Card {
  constructor() {
    super({
      id: CARD_ID.SUCCUBUS,
      name: 'サキュバス',
      color: 'blue',
      gainMana: { green: 0, red: 0, blue: 1 } as Mana,
      text: '赤プレイヤーに🔵×1ダメージ。赤プレイヤーは次も赤しか出せない。',
      isFixed: false,
    });
  }
}

