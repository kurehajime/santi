import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameState } from '../../GameState';
import { damageByColor } from './cardUtil';

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
  damage(_gs: GameState): [number, number, number, number] {
    return damageByColor(_gs, 'blue', 'red');
  }
}

