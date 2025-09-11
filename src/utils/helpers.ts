import { Player } from '../types';
import { TeamSetupConfig } from '../types/navigation';
import { BOARD_WIDTH, BOARD_HEIGHT, SELECTION_RADIUS } from './constants';

export const initialPlayers = (side: "home" | "away", count: number = 11): Player[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: `${side}-${i + 1}`,
    x: side === "home" ? BOARD_WIDTH * 0.25 : BOARD_WIDTH * 0.75,
    y: BOARD_HEIGHT * (0.08 + (0.84 * i) / (count - 1)),
    side,
    label: `${i + 1}`,
  }));

// 전술 유형별 포지션 정의 (11명 기준, 비율로 정의)
const FORMATIONS = {
  free: {
    // 기본 2줄 대형
    home: [
      [0.2, 0.15], [0.2, 0.25], [0.2, 0.35], [0.2, 0.45], [0.2, 0.55], [0.2, 0.65], [0.2, 0.75], [0.2, 0.85],
      [0.15, 0.3], [0.15, 0.5], [0.15, 0.7]
    ],
    away: [
      [0.8, 0.15], [0.8, 0.25], [0.8, 0.35], [0.8, 0.45], [0.8, 0.55], [0.8, 0.65], [0.8, 0.75], [0.8, 0.85],
      [0.85, 0.3], [0.85, 0.5], [0.85, 0.7]
    ]
  },
  attack: {
    // 공격적 3-4-3 포메이션
    home: [
      [0.3, 0.2], [0.3, 0.4], [0.3, 0.6], [0.3, 0.8], // 공격수들
      [0.25, 0.15], [0.25, 0.35], [0.25, 0.65], [0.25, 0.85], // 미드필더들
      [0.15, 0.25], [0.15, 0.5], [0.15, 0.75] // 수비수들
    ],
    away: [
      [0.85, 0.25], [0.85, 0.5], [0.85, 0.75], // 수비적 배치
      [0.75, 0.15], [0.75, 0.35], [0.75, 0.65], [0.75, 0.85],
      [0.7, 0.2], [0.7, 0.4], [0.7, 0.6], [0.7, 0.8]
    ]
  },
  defense: {
    // 수비적 5-3-2 포메이션  
    home: [
      [0.15, 0.1], [0.15, 0.25], [0.15, 0.4], [0.15, 0.6], [0.15, 0.75], [0.15, 0.9], // 수비수들
      [0.25, 0.3], [0.25, 0.5], [0.25, 0.7], // 미드필더들
      [0.35, 0.4], [0.35, 0.6] // 공격수들
    ],
    away: [
      [0.7, 0.2], [0.7, 0.4], [0.7, 0.6], [0.7, 0.8], // 공격적 배치
      [0.75, 0.15], [0.75, 0.35], [0.75, 0.65], [0.75, 0.85],
      [0.85, 0.1], [0.85, 0.3], [0.85, 0.7], [0.85, 0.9]
    ]
  },
  setpiece: {
    // 코너킥 상황 (좌측 코너 기준)
    home: [
      [0.05, 0.05], // 코너킥 키커
      [0.15, 0.15], [0.2, 0.25], [0.25, 0.35], [0.3, 0.45], // 박스 근처
      [0.4, 0.3], [0.4, 0.5], [0.4, 0.7], // 중앙
      [0.5, 0.25], [0.5, 0.5], [0.5, 0.75] // 후방
    ],
    away: [
      [0.9, 0.5], // 골키퍼
      [0.8, 0.2], [0.8, 0.35], [0.8, 0.65], [0.8, 0.8], // 골라인 수비
      [0.75, 0.25], [0.75, 0.45], [0.75, 0.55], [0.75, 0.75], // 박스 수비
      [0.6, 0.4], [0.6, 0.6] // 중거리 수비
    ]
  }
};

export const createPlayersFromConfig = (config: TeamSetupConfig): { home: Player[]; away: Player[]; ball: Player } => {
  const { teamSelection, playerCount, scenario } = config;
  
  const formation = FORMATIONS[scenario] || FORMATIONS.free;
  
  const createPositionalPlayers = (side: 'home' | 'away', count: number): Player[] => {
    const positions = formation[side];
    return Array.from({ length: count }).map((_, i) => {
      const pos = positions[i] || positions[positions.length - 1]; // fallback to last position
      return {
        id: `${side}-${i + 1}`,
        x: pos[0] * BOARD_WIDTH,
        y: pos[1] * BOARD_HEIGHT,
        side,
        label: `${i + 1}`,
      };
    });
  };
  
  const home = (teamSelection === 'home-only' || teamSelection === 'both-teams') 
    ? createPositionalPlayers('home', playerCount) 
    : [];
  
  const away = (teamSelection === 'both-teams') 
    ? createPositionalPlayers('away', playerCount) 
    : [];
  
  // 전술 유형별 볼 위치
  const ballPositions = {
    free: { x: 0.5, y: 0.5 },
    attack: { x: 0.6, y: 0.5 }, // 상대 진영
    defense: { x: 0.4, y: 0.5 }, // 우리 진영
    setpiece: { x: 0.02, y: 0.02 }, // 코너
  };
  
  const ballPos = ballPositions[scenario] || ballPositions.free;
  const ball = {
    id: 'ball',
    x: ballPos.x * BOARD_WIDTH,
    y: ballPos.y * BOARD_HEIGHT,
    side: 'ball' as const,
    label: '⚽',
  };
  
  return { home, away, ball };
};

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