import { Player } from '../types';
import { BOARD_WIDTH, BOARD_HEIGHT, SELECTION_RADIUS } from './constants';

export const initialPlayers = (side: "home" | "away"): Player[] =>
  Array.from({ length: 11 }).map((_, i) => ({
    id: `${side}-${i + 1}`,
    x: side === "home" ? BOARD_WIDTH * 0.25 : BOARD_WIDTH * 0.75,
    y: BOARD_HEIGHT * (0.08 + (0.84 * i) / 10),
    side,
    label: `${i + 1}`,
  }));

export const initialBall = (): Player => ({
  id: 'ball',
  x: BOARD_WIDTH * 0.5,
  y: BOARD_HEIGHT * 0.5,
  side: 'ball',
  label: '⚽',
});

export const findNearestPlayer = (x: number, y: number, players: Player[]): Player | null => {
  if (!players || players.length === 0) return null;
  if (typeof x !== 'number' || typeof y !== 'number' || !isFinite(x) || !isFinite(y)) return null;
  
  try {
    return players.reduce(
      (best, cur) => {
        if (!cur || typeof cur.x !== 'number' || typeof cur.y !== 'number') return best;
        const d = (cur.x - x) ** 2 + (cur.y - y) ** 2;
        return d < SELECTION_RADIUS * SELECTION_RADIUS && d < best.dist ? { player: cur, dist: d } : best;
      },
      { player: null as Player | null, dist: Infinity }
    ).player;
  } catch (error) {
    console.error('Error in findNearestPlayer:', error);
    return null;
  }
};