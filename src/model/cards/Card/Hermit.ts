import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameState } from '../../GameState';
import { getColor } from './cardUtil';

export class Hermit extends Card {
  constructor() {
    super({
      id: CARD_ID.HERMIT,
      name: '仙人',
      color: 'blue',
      gainMana: { green: 0, red: 0, blue: 1 } as Mana,
      text: '受けるダメージをすべての赤プレイヤーに転嫁',
      isFixed: false,
    });
  }
  hookDamageCounter(_gs: GameState, _damage: number): [number, number, number, number] {
    const damages: [number, number, number, number] = [0, 0, 0, 0];
    for (let i = 0; i < _gs.players.length; i++) {
      const color = getColor(_gs.players[i].openCard);
      if (color === 'red') {
        damages[i] = _damage;
      }
    }
    return damages;
  }
  hookDamageCancel(_gs: GameState, _damage: number): boolean {
    return true;
  }
}

