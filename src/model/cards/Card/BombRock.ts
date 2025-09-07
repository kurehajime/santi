import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameManager } from '../../GameManager';
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
  damage(_gameState: GameManager): [number, number, number, number] {
    const damages: [number, number, number, number] = [0, 0, 0, 0];
    const colorCount = _gameState.players.filter(p => getColor(p.openCard) === "green").length;
    const mana = _gameState.players[_gameState.turn].mana;
    const damage = colorCount * (mana.red);
    for (let i = 0; i < 4; i++) {
      if (getColor(_gameState.players[i].openCard) === "green") {
        damages[i] = damage;
      }
    }
    return damages;
  }
}

