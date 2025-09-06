import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameManager } from '../../GameManager';
import { damagePowByColor } from './cardUtil';

export class PeasantUprising extends Card {
  constructor() {
    super({
      id: CARD_ID.PEASANT_UPRISING,
      name: '民衆の蜂起',
      color: 'green',
      gainMana: { green: 1, red: 0, blue: 0 } as Mana,
      text: '青プレイヤーに2の[青プレイヤーの数]乗ダメージ',
      isFixed: false,
    });
  }
  damage(_gameState: GameManager): [number, number, number, number] {
    return damagePowByColor(_gameState, "blue");
  }
}

