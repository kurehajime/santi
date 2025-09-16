type Seat = 'top' | 'left' | 'right' | 'bottom';

type Point = { x: number; y: number };

export type SeatLayout = {
  seat: Seat;
  playerIndex: number;
  kind: 'cpu' | 'player';
  transform: string;
  width: number;
  height: number;
  x: number;
  y: number;
};

export type FieldLayout = {
  padding: number;
  innerWidth: number;
  innerHeight: number;
  cardWidth: number;
  seats: SeatLayout[];
  anchors: Point[];
};

const PADDING = 16;
const SEAT_FOOTPRINT_RATIO = 0.9;
const CPU_SEAT_VISIBLE_W_RATIO = 0.6;
const CARD_WIDTH_RATIO = 0.18;
const CPU_HIDE_OFFSET_TOP_PX = 100;
const CPU_HIDE_OFFSET_LEFT_PX = 200;
const CPU_HIDE_OFFSET_RIGHT_PX = 200;
const CPU_SIDE_Y_SHIFT_PX = 50;

const seatTransform = (seat: Seat, x: number, y: number, boxW: number, boxH: number) => {
  const angle = seat === 'top' ? 180 : seat === 'left' ? 90 : seat === 'right' ? -90 : 0;
  if (angle === 0) return `translate(${x}, ${y})`;
  return `translate(${x}, ${y}) rotate(${angle} ${boxW / 2} ${boxH / 2})`;
};

export const buildFieldLayout = (width: number, height: number): FieldLayout => {
  const padding = PADDING;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const sectionHeight = innerHeight / 3;

  const seatWidth = innerWidth * SEAT_FOOTPRINT_RATIO;
  const seatHeight = sectionHeight * SEAT_FOOTPRINT_RATIO;
  const sideSeatWidth = seatHeight;
  const cpuSeatWidth = innerWidth * CPU_SEAT_VISIBLE_W_RATIO;
  const cardWidth = Math.min(innerWidth, innerHeight) * CARD_WIDTH_RATIO;

  const seatEntries: Array<Omit<SeatLayout, 'transform'> & { transform?: string }> = [
    {
      seat: 'top',
      playerIndex: 2,
      kind: 'cpu',
      x: (innerWidth - cpuSeatWidth) / 2,
      y: 8 - CPU_HIDE_OFFSET_TOP_PX,
      width: cpuSeatWidth,
      height: seatHeight,
    },
    {
      seat: 'left',
      playerIndex: 1,
      kind: 'cpu',
      x: 8 - CPU_HIDE_OFFSET_LEFT_PX,
      y: (innerHeight - sideSeatWidth) / 2 - CPU_SIDE_Y_SHIFT_PX,
      width: cpuSeatWidth,
      height: sideSeatWidth,
    },
    {
      seat: 'right',
      playerIndex: 3,
      kind: 'cpu',
      x: innerWidth - cpuSeatWidth - 8 + CPU_HIDE_OFFSET_RIGHT_PX,
      y: (innerHeight - sideSeatWidth) / 2 - CPU_SIDE_Y_SHIFT_PX,
      width: cpuSeatWidth,
      height: sideSeatWidth,
    },
    {
      seat: 'bottom',
      playerIndex: 0,
      kind: 'player',
      x: (innerWidth - seatWidth) / 2,
      y: innerHeight - seatHeight - 8,
      width: seatWidth,
      height: seatHeight,
    },
  ];

  const seats: SeatLayout[] = seatEntries.map((entry) => ({
    ...entry,
    transform: seatTransform(entry.seat, entry.x, entry.y, entry.width, entry.height),
  }));

  const anchors: Point[] = [];
  seats.forEach((seat) => {
    anchors[seat.playerIndex] = {
      x: seat.x + seat.width / 2,
      y: seat.y + seat.height / 2,
    };
  });

  return {
    padding,
    innerWidth,
    innerHeight,
    cardWidth,
    seats,
    anchors,
  };
};
