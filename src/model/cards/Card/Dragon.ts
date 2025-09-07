import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameManager } from '../../GameManager';
import { getColor } from './cardUtil';

export class Dragon extends Card {
  constructor() {
    super({
      id: CARD_ID.DRAGON,
      name: 'ドラゴン',
      color: 'red',
      gainMana: { green: 0, red: 0, blue: 0 } as Mana,
      text: '緑プレイヤーに🔴×2ダメージ',
      isFixed: false,
    });
  }
  damage(_gameState: GameManager): [number, number, number, number] {
    const damages: [number, number, number, number] = [0, 0, 0, 0];
    const mana = _gameState.players[_gameState.turn].mana;
    const damage = 2 * (mana.red);
    for (let i = 0; i < 4; i++) {
      if (getColor(_gameState.players[i].openCard) === "green") {
        damages[i] = damage;
      }
    }
    return damages;
  }
}
