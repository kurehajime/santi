import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameState } from '../../GameState';
import { damageByColor, getColor } from './cardUtil';
import { CardId } from '../../types';
import { CARDS } from '../../cards';

export class Succubus extends Card {
  constructor() {
    super({
      id: CARD_ID.SUCCUBUS,
      name: 'サキュバス',
      color: 'blue',
      gainMana: { green: 0, red: 0, blue: 1 } as Mana,
      text: '赤プレイヤーに🔵×1ダメージ。赤プレイヤーは次も赤しか出せない。',
      isSpecial: true,
    });
  }
  damage(_gs: GameState): [number, number, number, number] {
    return damageByColor(_gs, 'blue', 'red');
  }
  hookEnabledPlay(_gs: GameState, hands: CardId[]): CardId[] {
    const color = getColor(_gs.players[_gs.turn].openCard);
    if (color !== 'red') return hands;
    // 赤以外を除外
    hands = hands.filter((id) => {
      const card = CARDS.find((c) => c.id === id);
      if (!card) return false;
      return card.color === 'red';
    });
    return hands;
  }
}
