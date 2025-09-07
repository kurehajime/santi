import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameManager } from '../../GameManager';

export class Golem extends Card {
  constructor() {
    super({
      id: CARD_ID.GOLEM,
      name: 'ゴーレム',
      color: 'green',
      gainMana: { green: 2, red: 0, blue: 0 } as Mana,
      text: '偶数のダメージを受けない',
      isFixed: false,
    });
  }
  hookDamageCancel(_gm: GameManager, _damage: number): boolean {
    if (_damage % 2 === 0) {
      return true;
    }
    return false;
  }
}

