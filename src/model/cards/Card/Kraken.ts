import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameState } from '../../GameState';
import { damageByColor, getColor } from './cardUtil';

export class Kraken extends Card {
  constructor() {
    super({
      id: CARD_ID.KRAKEN,
      name: 'クラーケン',
      color: 'blue',
      gainMana: { green: 0, red: 0, blue: 0 } as Mana,
      text: '他の青プレイヤーの🔵の合計のマナを得る。赤プレイヤーに🔵×１ダメージ',
      isFixed: false,
    });
  }
  extendGainMana(_gs: GameState): { green: number; red: number; blue: number; } {
    let blueMana = 0;
    for (let i = 0; i < _gs.players.length; i++) {
      const color = getColor(_gs.players[i].openCard);
      if (color === 'blue' && i !== _gs.turn) {
        blueMana += _gs.players[i].mana.blue;
      }
    }
    return { green: 0, red: 0, blue: blueMana };
  }

  damage(_gs: GameState): [number, number, number, number] {
    return damageByColor(_gs, 'blue', 'red');
  }
}

