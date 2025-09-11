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
// 세로 축구장: 위쪽(y=0) = 상대팀, 아래쪽(y=1) = 우리팀
const FORMATIONS = {
  free: {
    // 기본 2줄 대형 - 우리팀은 아래쪽
    home: [
      [0.15, 0.85], [0.25, 0.85], [0.35, 0.85], [0.45, 0.85], [0.55, 0.85], [0.65, 0.85], [0.75, 0.85], [0.85, 0.85], // 1라인
      [0.3, 0.75], [0.5, 0.75], [0.7, 0.75] // 2라인
    ],
    // 상대팀은 위쪽
    away: [
      [0.15, 0.15], [0.25, 0.15], [0.35, 0.15], [0.45, 0.15], [0.55, 0.15], [0.65, 0.15], [0.75, 0.15], [0.85, 0.15], // 1라인
      [0.3, 0.25], [0.5, 0.25], [0.7, 0.25] // 2라인
    ]
  },
  attack: {
    // 공격적 4-3-3 포메이션 - 우리팀 전진 배치
    home: [
      [0.2, 0.3], [0.4, 0.3], [0.6, 0.3], [0.8, 0.3], // 공격수 라인 (전진)
      [0.25, 0.5], [0.5, 0.5], [0.75, 0.5], // 미드필더 라인
      [0.15, 0.7], [0.35, 0.7], [0.65, 0.7], [0.85, 0.7] // 수비수 라인
    ],
    // 상대팀은 수비적 배치
    away: [
      [0.25, 0.1], [0.5, 0.1], [0.75, 0.1], // 수비적 공격수
      [0.15, 0.2], [0.35, 0.2], [0.65, 0.2], [0.85, 0.2], // 미드필더
      [0.1, 0.3], [0.3, 0.3], [0.7, 0.3], [0.9, 0.3] // 수비수
    ]
  },
  defense: {
    // 수비적 5-3-2 포메이션 - 우리팀 깊은 배치
    home: [
      [0.1, 0.85], [0.25, 0.85], [0.4, 0.85], [0.6, 0.85], [0.75, 0.85], [0.9, 0.85], // 수비수 6명
      [0.3, 0.7], [0.5, 0.7], [0.7, 0.7], // 미드필더 3명
      [0.4, 0.55], [0.6, 0.55] // 공격수 2명
    ],
    // 상대팀은 공격적 배치
    away: [
      [0.2, 0.45], [0.4, 0.45], [0.6, 0.45], [0.8, 0.45], // 공격수들 전진
      [0.15, 0.3], [0.35, 0.3], [0.65, 0.3], [0.85, 0.3], // 미드필더
      [0.1, 0.15], [0.3, 0.15], [0.7, 0.15], [0.9, 0.15] // 수비수
    ]
  },
  setpiece: {
    // 코너킥 상황 (우리팀이 좌하단 코너에서 킥)
    home: [
      [0.05, 0.95], // 코너킥 키커 (좌하단)
      [0.15, 0.8], [0.25, 0.75], [0.35, 0.7], [0.3, 0.6], // 박스 근처 대기
      [0.4, 0.65], [0.5, 0.7], [0.6, 0.65], // 박스 안 헤딩 포인트
      [0.25, 0.85], [0.5, 0.85], [0.75, 0.85] // 후방 지원
    ],
    // 상대팀은 골라인 근처 수비
    away: [
      [0.5, 0.05], // 골키퍼
      [0.2, 0.1], [0.35, 0.1], [0.65, 0.1], [0.8, 0.1], // 골라인 수비
      [0.25, 0.2], [0.45, 0.2], [0.55, 0.2], [0.75, 0.2], // 박스 수비  
      [0.4, 0.35], [0.6, 0.35] // 중거리 클리어링
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
  
  // 전술 유형별 볼 위치 (세로 축구장 기준)
  const ballPositions = {
    free: { x: 0.5, y: 0.5 }, // 중앙
    attack: { x: 0.5, y: 0.3 }, // 상대 진영 (위쪽)
    defense: { x: 0.5, y: 0.7 }, // 우리 진영 (아래쪽)
    setpiece: { x: 0.02, y: 0.98 }, // 좌하단 코너
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