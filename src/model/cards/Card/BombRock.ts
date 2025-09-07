import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameState } from '../../GameState';
import { getColor } from './cardUtil';

export class BombRock extends Card {
  constructor() {
    super({
      id: CARD_ID.BOMB_ROCK,
      name: '爆弾岩',
      color: 'red',
      gainMana: { green: 0, red: 1, blue: 0 } as Mana,
      text: '緑プレイヤーに🔴×緑プレイヤーの数ダメージ',
      isFixed: false,
    });
  }
  damage(_gs: GameState): [number, number, number, number] {
    const damages: [number, number, number, number] = [0, 0, 0, 0];
    const colorCount = _gs.players.filter(p => getColor(p.openCard) === "green").length;
    const mana = _gs.players[_gs.turn].mana;
    const damage = colorCount * (mana.red);
    for (let i = 0; i < 4; i++) {
      if (getColor(_gs.players[i].openCard) === "green") {
        damages[i] = damage;
      }
    }
    return damages;
  }
}

