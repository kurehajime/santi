import React from 'react';
import type { CardId } from '../model/types';

export type HoverCard = {
  id: CardId | null;
  width: number; // overlay width in px
};

type Ctx = {
  hover: HoverCard | null;
  setHover: (hc: HoverCard | null) => void;
  enabled: boolean;
};

export const CardHoverContext = React.createContext<Ctx>({
  hover: null,
  setHover: () => void 0,
  enabled: true,
});

export const useCardHover = () => React.useContext(CardHoverContext);
