import { TacticalType, TeamSetupConfig } from "../types/navigation";
import { Team, Player as TeamPlayer } from "../types/team";

import { Token } from "../types";
import { getTeamById } from "../services/teamService";
import { useBoardDimensions } from "../contexts/BoardContext";
import { useMemo } from "react";

// 통합된 전술 시스템 - 포메이션과 전술 유형을 하나로 통합
// 세로 축구장: 위쪽(y=0) = 상대팀, 아래쪽(y=1) = 우리팀
const TACTICAL_FORMATIONS = {
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
};

// 인원수별 동적 포메이션 생성
const generateDynamicFormation = (
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

export const useFormationHelpers = () => {
  const { BOARD_WIDTH, BOARD_HEIGHT, SELECTION_RADIUS } = useBoardDimensions();

  const initialPlayers = useMemo(
    () =>
      (side: "home" | "away", count: number = 11): Token[] =>
        Array.from({ length: count }).map((_, i) => ({
          id: `${side}-${i + 1}`,
          x: side === "home" ? BOARD_WIDTH * 0.25 : BOARD_WIDTH * 0.75,
          y: BOARD_HEIGHT * (0.08 + (0.84 * i) / (count - 1)),
          side,
          label: `${i + 1}`,
        })),
    [BOARD_WIDTH, BOARD_HEIGHT]
  );

  const createPlayersFromConfig = async (
    config: TeamSetupConfig
  ): Promise<{ home: Token[]; away: Token[]; ball: Token }> => {
    const {
      teamSelection,
      homePlayerCount,
      awayPlayerCount,
      homeTacticalType,
      awayTacticalType,
      homeTeamId,
      awayTeamId,
    } = config;

    // 홈팀과 어웨이팀의 포메이션을 각각 생성
    let homeFormation, awayFormation;

    if (homePlayerCount === 11 && TACTICAL_FORMATIONS[homeTacticalType]) {
      const formation = TACTICAL_FORMATIONS[homeTacticalType];
      homeFormation = formation.home;
    } else {
      const homeDynamic = generateDynamicFormation(homePlayerCount);
      homeFormation = homeDynamic.home;
    }
    if (awayPlayerCount === 11 && TACTICAL_FORMATIONS[awayTacticalType]) {
      const formation = TACTICAL_FORMATIONS[awayTacticalType];
      awayFormation = formation.away;
    } else {
      const awayDynamic = generateDynamicFormation(awayPlayerCount);
      awayFormation = awayDynamic.away;
    }

    // 팀 데이터 로드
    const homeTeam = homeTeamId ? await getTeamById(homeTeamId) : null;
    const awayTeam = awayTeamId ? await getTeamById(awayTeamId) : null;

    const createPositionalPlayers = (
      side: "home" | "away",
      count: number,
      positions: number[][],
      team: Team | null
    ): Token[] => {
      return Array.from({ length: count }).map((_, i) => {
        const pos = positions[i] || positions[positions.length - 1]; // fallback to last position

        // 팀이 있고 해당 인덱스에 선수가 있으면 displayName 또는 이름 사용
        let label = `${i + 1}`;
        if (team && team.players[i]) {
          const player = team.players[i];
          label = player.displayName || player.name || `${i + 1}`;
        }

        return {
          id: `${side}-${i + 1}`,
          x: pos[0] * BOARD_WIDTH,
          y: pos[1] * BOARD_HEIGHT,
          side,
          label,
          // v1.1.0: 팀 데이터 연결 정보 저장
          teamId: team?.id,
          playerId: team?.players[i]?.id,
        };
      });
    };

    const home =
      teamSelection === "home-only" || teamSelection === "both-teams"
        ? createPositionalPlayers(
            "home",
            homePlayerCount,
            homeFormation,
            homeTeam
          )
        : [];

    const away =
      teamSelection === "both-teams"
        ? createPositionalPlayers(
            "away",
            awayPlayerCount,
            awayFormation,
            awayTeam
          )
        : [];

    const ballPos = { x: 0.5, y: 0.5 };
    const ball = {
      id: "ball",
      x: ballPos.x * BOARD_WIDTH,
      y: ballPos.y * BOARD_HEIGHT,
      side: "ball" as const,
      label: "⚽",
    };

    return { home, away, ball };
  };

  // 동기 버전의 createPlayersFromConfig (팀 데이터 없이)
  const createPlayersFromConfigSync = (
    config: TeamSetupConfig
  ): { home: Token[]; away: Token[]; ball: Token } => {
    const {
      teamSelection,
      homePlayerCount,
      awayPlayerCount,
      homeTacticalType,
      awayTacticalType,
    } = config;

    // 홈팀과 어웨이팀의 포메이션을 각각 생성
    let homeFormation, awayFormation;

    if (homePlayerCount === 11 && TACTICAL_FORMATIONS[homeTacticalType]) {
      const formation = TACTICAL_FORMATIONS[homeTacticalType];
      homeFormation = formation.home;
    } else {
      const homeDynamic = generateDynamicFormation(homePlayerCount);
      homeFormation = homeDynamic.home;
    }

    if (awayPlayerCount === 11 && TACTICAL_FORMATIONS[awayTacticalType]) {
      const formation = TACTICAL_FORMATIONS[awayTacticalType];
      awayFormation = formation.away;
    } else {
      const awayDynamic = generateDynamicFormation(awayPlayerCount);
      awayFormation = awayDynamic.away;
    }

    const createPositionalPlayers = (
      side: "home" | "away",
      count: number,
      positions: number[][]
    ): Token[] => {
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
        ? createPositionalPlayers("home", homePlayerCount, homeFormation)
        : [];

    const away =
      teamSelection === "both-teams"
        ? createPositionalPlayers("away", awayPlayerCount, awayFormation)
        : [];

    const ballPos = { x: 0.5, y: 0.5 };
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
  const applyTacticalFormation = (
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

  const initialBall = useMemo(
    (): Token => ({
      id: "ball",
      x: BOARD_WIDTH * 0.5,
      y: BOARD_HEIGHT * 0.5,
      side: "ball",
      label: "⚽",
    }),
    [BOARD_WIDTH, BOARD_HEIGHT]
  );

  const findNearestPlayer = (
    x: number,
    y: number,
    players: Token[]
  ): Token | null => {
    if (!players || players.length === 0) return null;
    if (
      typeof x !== "number" ||
      typeof y !== "number" ||
      !isFinite(x) ||
      !isFinite(y)
    )
      return null;

    try {
      return players.reduce(
        (best, cur) => {
          if (!cur || typeof cur.x !== "number" || typeof cur.y !== "number")
            return best;
          const d = (cur.x - x) ** 2 + (cur.y - y) ** 2;
          return d < SELECTION_RADIUS * SELECTION_RADIUS && d < best.dist
            ? { player: cur, dist: d }
            : best;
        },
        { player: null as Token | null, dist: Infinity }
      ).player;
    } catch (error) {
      console.error("Error in findNearestPlayer:", error);
      return null;
    }
  };

  return {
    initialPlayers,
    createPlayersFromConfig,
    createPlayersFromConfigSync,
    applyTacticalFormation,
    initialBall,
    findNearestPlayer,
  };
};
