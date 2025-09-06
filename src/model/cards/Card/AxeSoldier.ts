import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';

export class AxeSoldier extends Card {
  constructor() {
    super({
      id: CARD_ID.AXE_SOLDIER,
      name: '斧兵',
      color: 'green',
      gainMana: { green: 1, red: 0, blue: 0 } as Mana,
      text: '青プレイヤーに🟢×1ダメージ',
      isFixed: true,
    });
  }
}

