import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';
import { GameState } from '../../GameState';
import { damageByColor } from './cardUtil';
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
      isFixed: false,
    });
  }
  damage(_gs: GameState): [number, number, number, number] {
    return damageByColor(_gs, 'blue', 'red');
  }
  hookEnabledPlay(_gs: GameState, hands: CardId[]): CardId[] {
    hands = hands.filter((id) => {
      const card = CARDS.find((c) => c.id === id);
      if (!card) return false;
      return card.color === 'red';
    });
    return hands;
  }
}

