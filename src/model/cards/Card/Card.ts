import type { CardId } from '../../types';
import type { Mana } from '../../Mana';
import { GameState } from '../../GameState';

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

  // 追加で得るマナを計算する
  extendGainMana(_gs: GameState): { green: number, red: number, blue: number } {
    return { green: 0, red: 0, blue: 0 };
  }
  // 与えるダメージを計算する
  damage(_gs: GameState): [number, number, number, number] {
    return [0, 0, 0, 0];
  }
  // プレイ可能なカードを制限する
  hookEnabledPlay(_gs: GameState, hands: CardId[]): CardId[] {
    return hands;
  }
  // ダメージを受けたときに他者にダメージを与える
  hookDamageCounter(_gs: GameState, _damage: number): [number, number, number, number] {
    return [0, 0, 0, 0];
  }
  // ダメージをキャンセルする
  hookDamageCancel(_gs: GameState, _damage: number): boolean {
    return false;
  }

}
