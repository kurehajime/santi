import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameState } from '../../GameState';
import { getColor } from './cardUtil';

export class Dragon extends Card {
  constructor() {
    super({
      id: CARD_ID.DRAGON,
      name: 'ドラゴン',
      color: 'red',
      gainMana: { green: 0, red: 0, blue: 0 } as Mana,
      text: '緑プレイヤーに🔴×2ダメージ',
      isSpecial: true,
    });
  }
  damage(_gs: GameState): [number, number, number, number] {
    const damages: [number, number, number, number] = [0, 0, 0, 0];
    const mana = _gs.players[_gs.turn].mana;
    const damage = 2 * (mana.red);
    for (let i = 0; i < 4; i++) {
      if (getColor(_gs.players[i].openCard) === "green") {
        damages[i] = damage;
      }
    }
    return damages;
  }
}
