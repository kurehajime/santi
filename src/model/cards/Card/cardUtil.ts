import { CARDS } from "../../cards";
import { GameManager } from "../../GameManager";
import { CardId } from "../../types";

export const getColor = (cardId: CardId | null): "green" | "red" | "blue" | undefined => {
    return CARDS.find(c => c.id === cardId)?.color;
}

export const damageByColor = (_gameState: GameManager, myColor: "green" | "red" | "blue", targetColor: "green" | "red" | "blue"): [number, number, number, number] => {
    const damages: [number, number, number, number] = [0, 0, 0, 0];
    const mana = _gameState.players[_gameState.turn].mana[myColor];
    for (let i = 0; i < 4; i++) {
        const color = getColor(_gameState.players[i].openCard);
        if (color === targetColor) {
            damages[i] = 1 * mana;
        } else {
            damages[i] = 0;
        }
    }
    return damages;
}