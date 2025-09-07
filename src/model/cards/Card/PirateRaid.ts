import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameManager } from '../../GameManager';
import { damagePowByColor } from './cardUtil';

export class PirateRaid extends Card {
  constructor() {
    super({
      id: CARD_ID.PIRATE_RAID,
      name: '海賊の強襲',
      color: 'blue',
      gainMana: { green: 0, red: 0, blue: 1 } as Mana,
      text: '赤プレイヤーに2の[赤プレイヤーの数]乗ダメージ',
      isFixed: false,
    });
  }
  damage(_gm: GameManager): [number, number, number, number] {
    return damagePowByColor(_gm, "red");
  }
}

