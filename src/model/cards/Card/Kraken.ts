import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameState } from '../../GameState';
import { getColor } from './cardUtil';

export class Kraken extends Card {
  constructor() {
    super({
      id: CARD_ID.KRAKEN,
      name: 'クラーケン',
      color: 'blue',
      gainMana: { green: 0, red: 0, blue: 1 } as Mana,
      text: '赤プレイヤーに青プレイヤーの🔵の合計ダメージ',
      isFixed: false,
    });
  }
  damage(_gs: GameState): [number, number, number, number] {
    const damages: [number, number, number, number] = [0, 0, 0, 0];
    let blueMana = 0;
    for (let i = 0; i < _gs.players.length; i++) {
      const color = getColor(_gs.players[i].openCard);
      if (color === 'blue') {
        blueMana += _gs.players[i].mana.blue;
      }
    }
    for (let i = 0; i < _gs.players.length; i++) {
      const color = getColor(_gs.players[i].openCard);
      if (color === 'red') {
        damages[i] = blueMana;
      }
    }
    return damages;
  }
}

