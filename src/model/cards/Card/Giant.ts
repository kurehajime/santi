import { CARD_ID } from '../ids';
import type { Mana } from '../../Mana';
import { Card } from './Card';

export class Giant extends Card {
  constructor() {
    super({
      id: CARD_ID.GIANT,
      name: '巨人',
      color: 'green',
      gainMana: { green: 0, red: 0, blue: 0 } as Mana,
      text: '自分の🟢を×3する',
      isFixed: false,
    });
  }
  extendGainMana(_gameManager: any): { green: number, red: number, blue: number } {
    const currentMana = _gameManager.players[_gameManager.turn].mana.green;
    const gain = currentMana * 2;
    return { green: gain, red: 0, blue: 0 } as Mana;
  }
}

