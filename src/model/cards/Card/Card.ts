import type { CardId } from '../../types';
import type { Mana } from '../../Mana';

export abstract class Card {
  readonly id: CardId;
  readonly name: string;
  readonly color: 'green' | 'red' | 'blue';
  readonly gainMana: Mana;
  readonly text: string;
  readonly isFixed: boolean;

  protected constructor(args: {
    id: CardId;
    name: string;
    color: 'green' | 'red' | 'blue';
    gainMana: Mana;
    text: string;
    isFixed: boolean;
  }) {
    this.id = args.id;
    this.name = args.name;
    this.color = args.color;
    this.gainMana = args.gainMana;
    this.text = args.text;
    this.isFixed = args.isFixed;
  }
}

