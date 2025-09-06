import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';

export class ArmyCharge extends Card {
  constructor() {
    super({
      id: CARD_ID.ARMY_CHARGE,
      name: '軍勢の突撃',
      color: 'red',
      gainMana: { green: 0, red: 1, blue: 0 } as Mana,
      text: '緑プレイヤーに2の[赤プレイヤーの数]乗ダメージ',
      isFixed: false,
    });
  }
}

