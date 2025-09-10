import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameState } from '../../GameState';
import { damagePowByColor } from './cardUtil';

export class PirateRaid extends Card {
  constructor() {
    super({
      id: CARD_ID.PIRATE_RAID,
      name: '海賊の強襲',
      color: 'blue',
      gainMana: { green: 0, red: 0, blue: 1 } as Mana,
      text: '赤プレイヤーに2の[赤プレイヤーの数]乗ダメージ',
      isSpecial: true,
    });
  }
  damage(_gs: GameState): [number, number, number, number] {
    return damagePowByColor(_gs, "red");
  }
}
