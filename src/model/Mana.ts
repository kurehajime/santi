export interface Mana {
  green: number;
  red: number;
  blue: number;
}

export const createMana = (green = 0, red = 0, blue = 0): Mana => ({
  green,
  red,
  blue,
});

