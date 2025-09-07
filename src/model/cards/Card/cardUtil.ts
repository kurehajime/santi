import { CARDS } from "../../cards";
import { GameManager } from "../../GameManager";
import { CardId } from "../../types";

export const getColor = (cardId: CardId | null): "green" | "red" | "blue" | undefined => {
    return CARDS.find(c => c.id === cardId)?.color;
}

// XプレイヤーにY×１ダメージ
export const damageByColor = (_gm: GameManager, myColor: "green" | "red" | "blue", targetColor: "green" | "red" | "blue"): [number, number, number, number] => {
    const damages: [number, number, number, number] = [0, 0, 0, 0];
    const mana = _gm.players[_gm.turn].mana[myColor];
    for (let i = 0; i < 4; i++) {
        const color = getColor(_gm.players[i].openCard);
        if (color === targetColor) {
            damages[i] = 1 * mana;
        }
    }
    return damages;
}

// Xプレイヤーに2の[Xプレイヤーの数]乗ダメージ	
export const damagePowByColor = (_gm: GameManager, targetColor: "green" | "red" | "blue"): [number, number, number, number] => {
    const damages: [number, number, number, number] = [0, 0, 0, 0];
    const colorCount = _gm.players.filter(p => getColor(p.openCard) === targetColor).length;
    const damage = Math.pow(2, colorCount);
    for (let i = 0; i < 4; i++) {
        if (getColor(_gm.players[i].openCard) === targetColor) {
            damages[i] = damage;
        }
    }
    return damages;
}