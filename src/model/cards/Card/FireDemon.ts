import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameState } from '../../GameState';

export class FireDemon extends Card {
  constructor() {
    super({
      id: CARD_ID.FIRE_DEMON,
      name: '炎の魔神',
      color: 'red',
      gainMana: { green: 0, red: 0, blue: 0 } as Mana,
      text: '自分以外の全員に🔴×1ダメージ',
      isFixed: false,
    });
  }
  damage(_gs: GameState): [number, number, number, number] {
    const mana = _gs.players[_gs.turn].mana;
    const damage: [number, number, number, number] = [0, 0, 0, 0];
    for (let i = 0; i < _gs.players.length; i++) {
      if (i !== _gs.turn) {
        damage[i] = 1 + mana.red;
      }
    }
    return damage;
  }
}

