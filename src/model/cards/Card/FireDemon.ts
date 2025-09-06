import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';

export class FireDemon extends Card {
  constructor() {
    super({
      id: CARD_ID.FIRE_DEMON,
      name: '炎の魔神',
      color: 'red',
      gainMana: { green: 0, red: 0, blue: 0 } as Mana,
      text: '自分以外の全員に🔴×1ダメージ',
      isFixed: false,
    });
  }
}

