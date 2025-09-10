import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameState } from '../../GameState';
import { damageByColor } from './cardUtil';

export class Swordsman extends Card {
  constructor() {
    super({
      id: CARD_ID.SWORDSMAN,
      name: '剣士',
      color: 'red',
      gainMana: { green: 0, red: 1, blue: 0 } as Mana,
      text: '緑プレイヤーに🔴×1ダメージ',
      isSpecial: false,
    });
  }
  damage(_gs: GameState): [number, number, number, number] {
    return damageByColor(_gs, 'red', 'green');
  }
}
