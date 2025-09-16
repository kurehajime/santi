import React from 'react';
import type { GameState } from '../model/GameState';
import type { Player } from '../model/Player';
import { StatusElement } from './StatusElement';

type Props = {
  player: Player;
  gameState: GameState;
  playerIndex: number;
  containerWidth: number;
  statusWidth: number;
  statusHeight: number;
  scale: number;
  offsetY: number;
};

export const SeatStatusFrame: React.FC<Props> = ({
  player,
  gameState,
  playerIndex,
  containerWidth,
  statusWidth,
  statusHeight,
  scale,
  offsetY,
}) => {
  const translatedX = Math.round((containerWidth - statusWidth * scale) / 2);
  const translatedY = Math.round(offsetY);
  const eliminationOrder = gameState.eliminatedOrder ?? [];
  const eliminatedIndex = eliminationOrder.indexOf(playerIndex);
  const rank = eliminatedIndex >= 0 ? gameState.players.length - eliminatedIndex : undefined;

  return (
    <g transform={`translate(${translatedX}, ${translatedY}) scale(${scale})`}>
      <StatusElement
        player={player}
        width={statusWidth}
        height={statusHeight}
        isActive={gameState.turn === playerIndex}
        rank={rank}
      />
    </g>
  );
};

