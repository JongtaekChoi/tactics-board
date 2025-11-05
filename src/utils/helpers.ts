import { BOARD_HEIGHT, BOARD_WIDTH, SELECTION_RADIUS } from "./constants";
import { Point, Stroke, Token } from "../types";
import { TacticalType, TeamSetupConfig } from "../types/navigation";

export const initialPlayers = (
  side: "home" | "away",
  count: number = 11
): Token[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: `${side}-${i + 1}`,
    x: side === "home" ? BOARD_WIDTH * 0.25 : BOARD_WIDTH * 0.75,
    y: BOARD_HEIGHT * (0.08 + (0.84 * i) / (count - 1)),
    side,
    label: `${i + 1}`,
  }));

// 통합된 전술 시스템 - 포메이션과 전술 유형을 하나로 통합
// 세로 축구장: 위쪽(y=0) = 상대팀, 아래쪽(y=1) = 우리팀
export const TACTICAL_FORMATIONS = {
  free: {
    name: "자유 전술",
    description: "기본 2줄 대형",
    home: [
      [0.15, 0.85],
      [0.25, 0.85],
      [0.35, 0.85],
      [0.45, 0.85],
      [0.55, 0.85],
      [0.65, 0.85],
      [0.75, 0.85],
      [0.85, 0.85], // 1라인
      [0.3, 0.75],
      [0.5, 0.75],
      [0.7, 0.75], // 2라인
    ],
    away: [
      [0.15, 0.15],
      [0.25, 0.15],
      [0.35, 0.15],
      [0.45, 0.15],
      [0.55, 0.15],
      [0.65, 0.15],
      [0.75, 0.15],
      [0.85, 0.15], // 1라인
      [0.3, 0.25],
      [0.5, 0.25],
      [0.7, 0.25], // 2라인
    ],
  },
  "4-4-2": {
    name: "4-4-2 클래식",
    description: "균형 잡힌 포메이션",
    home: [
      [0.5, 0.9], // GK
      [0.2, 0.75],
      [0.4, 0.75],
      [0.6, 0.75],
      [0.8, 0.75], // 수비수 4명
      [0.2, 0.55],
      [0.4, 0.55],
      [0.6, 0.55],
      [0.8, 0.55], // 미드필더 4명
      [0.35, 0.35],
      [0.65, 0.35], // 공격수 2명
    ],
    away: [
      [0.5, 0.1], // GK
      [0.2, 0.25],
      [0.4, 0.25],
      [0.6, 0.25],
      [0.8, 0.25], // 수비수 4명
      [0.2, 0.45],
      [0.4, 0.45],
      [0.6, 0.45],
      [0.8, 0.45], // 미드필더 4명
      [0.35, 0.65],
      [0.65, 0.65], // 공격수 2명
    ],
  },
  "4-3-3": {
    name: "4-3-3 공격형",
    description: "공격적 포메이션",
    home: [
      [0.5, 0.9], // GK
      [0.2, 0.75],
      [0.4, 0.75],
      [0.6, 0.75],
      [0.8, 0.75], // 수비수 4명
      [0.3, 0.55],
      [0.5, 0.55],
      [0.7, 0.55], // 미드필더 3명
      [0.2, 0.35],
      [0.5, 0.35],
      [0.8, 0.35], // 공격수 3명
    ],
    away: [
      [0.5, 0.1], // GK
      [0.2, 0.25],
      [0.4, 0.25],
      [0.6, 0.25],
      [0.8, 0.25], // 수비수 4명
      [0.3, 0.45],
      [0.5, 0.45],
      [0.7, 0.45], // 미드필더 3명
      [0.2, 0.65],
      [0.5, 0.65],
      [0.8, 0.65], // 공격수 3명
    ],
  },
  "3-5-2": {
    name: "3-5-2 중원형",
    description: "중원 장악 포메이션",
    home: [
      [0.5, 0.9], // GK
      [0.3, 0.75],
      [0.5, 0.75],
      [0.7, 0.75], // 수비수 3명
      [0.15, 0.55],
      [0.35, 0.55],
      [0.5, 0.55],
      [0.65, 0.55],
      [0.85, 0.55], // 미드필더 5명
      [0.4, 0.35],
      [0.6, 0.35], // 공격수 2명
    ],
    away: [
      [0.5, 0.1], // GK
      [0.3, 0.25],
      [0.5, 0.25],
      [0.7, 0.25], // 수비수 3명
      [0.15, 0.45],
      [0.35, 0.45],
      [0.5, 0.45],
      [0.65, 0.45],
      [0.85, 0.45], // 미드필더 5명
      [0.4, 0.65],
      [0.6, 0.65], // 공격수 2명
    ],
  },
  "4-2-3-1": {
    name: "4-2-3-1 현대형",
    description: "현대적 포메이션",
    home: [
      [0.5, 0.9], // GK
      [0.2, 0.75],
      [0.4, 0.75],
      [0.6, 0.75],
      [0.8, 0.75], // 수비수 4명
      [0.35, 0.6],
      [0.65, 0.6], // 수비형 미드필더 2명
      [0.2, 0.45],
      [0.5, 0.45],
      [0.8, 0.45], // 공격형 미드필더 3명
      [0.5, 0.3], // 스트라이커 1명
    ],
    away: [
      [0.5, 0.1], // GK
      [0.2, 0.25],
      [0.4, 0.25],
      [0.6, 0.25],
      [0.8, 0.25], // 수비수 4명
      [0.35, 0.4],
      [0.65, 0.4], // 수비형 미드필더 2명
      [0.2, 0.55],
      [0.5, 0.55],
      [0.8, 0.55], // 공격형 미드필더 3명
      [0.5, 0.7], // 스트라이커 1명
    ],
  },
  "5-3-2": {
    name: "5-3-2 수비형",
    description: "수비적 포메이션",
    home: [
      [0.5, 0.9], // GK
      [0.15, 0.75],
      [0.35, 0.75],
      [0.5, 0.75],
      [0.65, 0.75],
      [0.85, 0.75], // 수비수 5명
      [0.3, 0.55],
      [0.5, 0.55],
      [0.7, 0.55], // 미드필더 3명
      [0.4, 0.35],
      [0.6, 0.35], // 공격수 2명
    ],
    away: [
      [0.5, 0.1], // GK
      [0.15, 0.25],
      [0.35, 0.25],
      [0.5, 0.25],
      [0.65, 0.25],
      [0.85, 0.25], // 수비수 5명
      [0.3, 0.45],
      [0.5, 0.45],
      [0.7, 0.45], // 미드필더 3명
      [0.4, 0.65],
      [0.6, 0.65], // 공격수 2명
    ],
  },
  setpiece: {
    name: "세트피스",
    description: "코너킥 전술",
    home: [
      [0.05, 0.95], // 코너킥 키커 (좌하단)
      [0.15, 0.8],
      [0.25, 0.75],
      [0.35, 0.7],
      [0.3, 0.6], // 박스 근처 대기
      [0.4, 0.65],
      [0.5, 0.7],
      [0.6, 0.65], // 박스 안 헤딩 포인트
      [0.25, 0.85],
      [0.5, 0.85],
      [0.75, 0.85], // 후방 지원
    ],
    away: [
      [0.5, 0.05], // 골키퍼
      [0.2, 0.1],
      [0.35, 0.1],
      [0.65, 0.1],
      [0.8, 0.1], // 골라인 수비
      [0.25, 0.2],
      [0.45, 0.2],
      [0.55, 0.2],
      [0.75, 0.2], // 박스 수비
      [0.4, 0.35],
      [0.6, 0.35], // 중거리 클리어링
    ],
  },
};

// 인원수별 동적 포메이션 생성
export const generateDynamicFormation = (
  playerCount: number
): { home: number[][]; away: number[][] } => {
  switch (playerCount) {
    case 3:
      return {
        home: [
          [0.5, 0.9],
          [0.3, 0.65],
          [0.7, 0.65],
        ], // 삼각형 배치
        away: [
          [0.5, 0.1],
          [0.3, 0.35],
          [0.7, 0.35],
        ],
      };
    case 4:
      return {
        home: [
          [0.5, 0.9],
          [0.3, 0.7],
          [0.7, 0.7],
          [0.5, 0.5],
        ], // 다이아몬드
        away: [
          [0.5, 0.1],
          [0.3, 0.3],
          [0.7, 0.3],
          [0.5, 0.5],
        ],
      };
    case 5:
      return {
        home: [
          [0.5, 0.9],
          [0.2, 0.7],
          [0.5, 0.7],
          [0.8, 0.7],
          [0.5, 0.5],
        ], // 펜타곤
        away: [
          [0.5, 0.1],
          [0.2, 0.3],
          [0.5, 0.3],
          [0.8, 0.3],
          [0.5, 0.5],
        ],
      };
    case 6:
      return {
        home: [
          [0.5, 0.9],
          [0.3, 0.7],
          [0.7, 0.7],
          [0.3, 0.5],
          [0.7, 0.5],
          [0.5, 0.3],
        ], // 2-2-1
        away: [
          [0.5, 0.1],
          [0.3, 0.3],
          [0.7, 0.3],
          [0.3, 0.5],
          [0.7, 0.5],
          [0.5, 0.7],
        ],
      };
    case 7:
      return {
        home: [
          [0.5, 0.9],
          [0.25, 0.7],
          [0.75, 0.7],
          [0.25, 0.55],
          [0.75, 0.55],
          [0.4, 0.4],
          [0.6, 0.4],
        ], // 풋살 2-2-2
        away: [
          [0.5, 0.1],
          [0.25, 0.3],
          [0.75, 0.3],
          [0.25, 0.45],
          [0.75, 0.45],
          [0.4, 0.6],
          [0.6, 0.6],
        ],
      };
    case 8:
      return {
        home: [
          [0.5, 0.9],
          [0.2, 0.75],
          [0.5, 0.75],
          [0.8, 0.75],
          [0.25, 0.55],
          [0.75, 0.55],
          [0.35, 0.35],
          [0.65, 0.35],
        ], // 1-3-2-2
        away: [
          [0.5, 0.1],
          [0.2, 0.25],
          [0.5, 0.25],
          [0.8, 0.25],
          [0.25, 0.45],
          [0.75, 0.45],
          [0.35, 0.65],
          [0.65, 0.65],
        ],
      };
    case 9:
      return {
        home: [
          [0.5, 0.9],
          [0.2, 0.75],
          [0.5, 0.75],
          [0.8, 0.75],
          [0.3, 0.55],
          [0.7, 0.55],
          [0.25, 0.35],
          [0.5, 0.35],
          [0.75, 0.35],
        ], // 1-3-2-3
        away: [
          [0.5, 0.1],
          [0.2, 0.25],
          [0.5, 0.25],
          [0.8, 0.25],
          [0.3, 0.45],
          [0.7, 0.45],
          [0.25, 0.65],
          [0.5, 0.65],
          [0.75, 0.65],
        ],
      };
    case 10:
      return {
        home: [
          [0.5, 0.9],
          [0.2, 0.75],
          [0.4, 0.75],
          [0.6, 0.75],
          [0.8, 0.75],
          [0.25, 0.55],
          [0.75, 0.55],
          [0.3, 0.35],
          [0.5, 0.35],
          [0.7, 0.35],
        ], // 1-4-2-3
        away: [
          [0.5, 0.1],
          [0.2, 0.25],
          [0.4, 0.25],
          [0.6, 0.25],
          [0.8, 0.25],
          [0.25, 0.45],
          [0.75, 0.45],
          [0.3, 0.65],
          [0.5, 0.65],
          [0.7, 0.65],
        ],
      };
    default: // 11명
      return TACTICAL_FORMATIONS.free;
  }
};

export const createPlayersFromConfig = (
  config: TeamSetupConfig
): { home: Token[]; away: Token[]; ball: Token } => {
  const { teamSelection, playerCount, tacticalType } = config;

  // 11명인 경우 기존 포메이션 시스템 사용
  let formation;
  if (playerCount === 11 && TACTICAL_FORMATIONS[tacticalType]) {
    formation = TACTICAL_FORMATIONS[tacticalType];
  } else {
    // 다른 인원수인 경우 동적 생성
    const dynamicFormation = generateDynamicFormation(playerCount);
    formation = {
      name: `${playerCount}명 자유 전술`,
      description: `${playerCount}명 기본 배치`,
      home: dynamicFormation.home,
      away: dynamicFormation.away,
    };
  }

  const createPositionalPlayers = (
    side: "home" | "away",
    count: number
  ): Token[] => {
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

  const home =
    teamSelection === "home-only" || teamSelection === "both-teams"
      ? createPositionalPlayers("home", playerCount)
      : [];

  const away =
    teamSelection === "both-teams"
      ? createPositionalPlayers("away", playerCount)
      : [];

  // 전술 유형별 볼 위치 (세로 축구장 기준)
  const ballPositions: Record<TacticalType, { x: number; y: number }> = {
    free: { x: 0.5, y: 0.5 }, // 중앙
    "4-4-2": { x: 0.5, y: 0.5 }, // 중앙
    "4-3-3": { x: 0.5, y: 0.4 }, // 약간 전진
    "3-5-2": { x: 0.5, y: 0.5 }, // 중앙
    "4-2-3-1": { x: 0.5, y: 0.45 }, // 약간 전진
    "5-3-2": { x: 0.5, y: 0.6 }, // 약간 후진
    setpiece: { x: 0.02, y: 0.98 }, // 좌하단 코너
  };

  const ballPos = ballPositions[tacticalType] || ballPositions.free;
  const ball = {
    id: "ball",
    x: ballPos.x * BOARD_WIDTH,
    y: ballPos.y * BOARD_HEIGHT,
    side: "ball" as const,
    label: "⚽",
  };

  return { home, away, ball };
};

// 전술 유형을 기존 플레이어들에게 적용하는 함수
export const applyTacticalFormation = (
  players: Token[],
  tacticalType: TacticalType
): Token[] => {
  const formation = TACTICAL_FORMATIONS[tacticalType];
  if (!formation) return players;

  const homePlayers = players.filter((p) => p.side === "home");
  const awayPlayers = players.filter((p) => p.side === "away");

  return players.map((player) => {
    if (player.side === "ball") return player;

    let positions;
    let playerList;

    if (player.side === "home") {
      positions = formation.home;
      playerList = homePlayers;
    } else {
      positions = formation.away;
      playerList = awayPlayers;
    }

    const playerIndex = playerList.findIndex((p) => p.id === player.id);
    const position = positions[playerIndex];

    if (position) {
      return {
        ...player,
        x: position[0] * BOARD_WIDTH,
        y: position[1] * BOARD_HEIGHT,
      };
    }

    return player;
  });
};

export const initialBall = (): Token => ({
  id: "ball",
  x: BOARD_WIDTH * 0.5,
  y: BOARD_HEIGHT * 0.5,
  side: "ball",
  label: "⚽",
});

// 터치 영역 내 모든 플레이어 찾기 (거리순 정렬)
export const findPlayersInTouchArea = (
  x: number,
  y: number,
  players: Token[]
): Token[] => {
  if (!players || players.length === 0) return [];
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    !isFinite(x) ||
    !isFinite(y)
  )
    return [];

  try {
    const playersWithDistance = players
      .filter(
        (player) =>
          player && typeof player.x === "number" && typeof player.y === "number"
      )
      .map((player) => {
        const distance = (player.x - x) ** 2 + (player.y - y) ** 2;
        return { player, distance };
      })
      .filter(({ distance }) => distance < SELECTION_RADIUS * SELECTION_RADIUS)
      .sort((a, b) => a.distance - b.distance);

    return playersWithDistance.map(({ player }) => player);
  } catch (error) {
    console.error("Error in findPlayersInTouchArea:", error);
    return [];
  }
};

// 겹친 토큰들 중에서 순환 선택
export const selectNextPlayerInArea = (
  x: number,
  y: number,
  players: Token[],
  currentSelectedId: string | null
): Token | null => {
  const playersInArea = findPlayersInTouchArea(x, y, players);

  if (playersInArea.length === 0) return null;
  if (playersInArea.length === 1) return playersInArea[0];

  // 현재 선택된 플레이어가 터치 영역에 있는지 확인
  const currentIndex = playersInArea.findIndex(
    (p) => p.id === currentSelectedId
  );

  if (currentIndex === -1) {
    // 현재 선택된 플레이어가 없거나 터치 영역에 없으면 첫 번째 선택
    return playersInArea[0];
  }

  // 다음 플레이어로 순환 (마지막이면 첫 번째로)
  const nextIndex = (currentIndex + 1) % playersInArea.length;
  return playersInArea[nextIndex];
};

// 기존 함수 유지 (하위 호환성)
export const findNearestPlayer = (
  x: number,
  y: number,
  players: Token[]
): Token | null => {
  const playersInArea = findPlayersInTouchArea(x, y, players);
  return playersInArea.length > 0 ? playersInArea[0] : null;
};

// 점과 선분 사이의 최단 거리 계산
const distanceToLineSegment = (
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    // 선분이 점인 경우
    return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
  }

  const t = Math.max(
    0,
    Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy))
  );
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;

  return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
};

// 터치 위치에서 가장 가까운 선 찾기
export const findNearestStroke = (
  x: number,
  y: number,
  strokes: Stroke[]
): Stroke | null => {
  if (!strokes || strokes.length === 0) return null;
  if (
    typeof x !== "number" ||
    typeof y !== "number" ||
    !isFinite(x) ||
    !isFinite(y)
  )
    return null;

  try {
    let nearestStroke: Stroke | null = null;
    let minDistance = SELECTION_RADIUS; // 선택 반경 내에서만 감지

    for (const stroke of strokes) {
      if (!stroke.points || stroke.points.length < 2) continue;

      // 각 선분에 대해 최단 거리 계산
      for (let i = 0; i < stroke.points.length - 1; i++) {
        const p1 = stroke.points[i];
        const p2 = stroke.points[i + 1];

        if (
          !p1 ||
          !p2 ||
          typeof p1.x !== "number" ||
          typeof p1.y !== "number" ||
          typeof p2.x !== "number" ||
          typeof p2.y !== "number"
        )
          continue;

        const distance = distanceToLineSegment(x, y, p1.x, p1.y, p2.x, p2.y);

        if (distance < minDistance) {
          minDistance = distance;
          nearestStroke = stroke;
        }
      }
    }

    return nearestStroke;
  } catch (error) {
    console.error("Error in findNearestStroke:", error);
    return null;
  }
};
