import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';

export class BombRock extends Card {
  constructor() {
    super({
      id: CARD_ID.BOMB_ROCK,
      name: '爆弾岩',
      color: 'red',
      gainMana: { green: 0, red: 1, blue: 0 } as Mana,
      text: '緑プレイヤーに🔴×緑プレイヤーの数ダメージ',
      isFixed: false,
    });
  }
}

