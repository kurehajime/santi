import { GameManager } from "../GameManager";
import { CardId } from "../types";

export class CardEffect {
    // 与えるダメージを計算する
    damage(_gameState: GameManager): number[] {
        return [0, 0, 0, 0];
    }
    // プレイ可能なカードを制限する
    hookEnabledPlay(_gameState: GameManager, hands: CardId[]): CardId[] {
        return hands;
    }
    // ダメージを受けたときに他者にダメージを与える
    hookDamageCounter(_gameState: GameManager, _damage: number): number[] {
        return [0, 0, 0, 0];
    }
    // ダメージをキャンセルする
    hookDamageCancel(_gameState: GameManager, _damage: number): boolean {
        return false;
    }
}