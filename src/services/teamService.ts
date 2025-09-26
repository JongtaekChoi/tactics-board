import AsyncStorage from '@react-native-async-storage/async-storage';
import { Team, Player, LegacyPlayerData, CreateTeamInput, UpdateTeamInput } from '../types/team';

// 스토리지 키 상수
const STORAGE_KEYS = {
  TEAMS: 'teams',
  DATA_VERSION: 'dataVersion',
} as const;

// 현재 데이터 버전
const CURRENT_DATA_VERSION = 1;

/**
 * 레거시 데이터 마이그레이션 함수
 * string[] 형태의 선수 데이터를 Player[] 형태로 변환
 */
export const migratePlayerData = (players: LegacyPlayerData): Player[] => {
  if (!players || players.length === 0) {
    return [];
  }

  // 이미 Player 객체 배열인 경우
  if (typeof players[0] === 'object' && players[0] !== null && 'id' in players[0]) {
    return players as Player[];
  }

  // string 배열을 Player 배열로 변환
  return (players as string[]).map((name, index) => ({
    id: `player-${Date.now()}-${index}`,
    name: name.trim(),
  }));
};


/**
 * 안전한 팀 데이터 로딩 (마이그레이션 지원)
 */
export const loadTeams = async (): Promise<Team[]> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.TEAMS);
    if (!stored) return [];

    const teams = JSON.parse(stored);

    // 레거시 데이터 자동 마이그레이션
    return teams.map((team: any) => ({
      ...team,
      players: migratePlayerData(team.players || []),
      metadata: team.metadata || {},
      createdAt: team.createdAt ? new Date(team.createdAt) : new Date(),
      updatedAt: team.updatedAt ? new Date(team.updatedAt) : new Date(),
    }));
  } catch (error) {
    console.error('팀 데이터 로딩 실패:', error);
    return [];
  }
};

/**
 * 팀 데이터 저장 (버전 관리 포함)
 */
export const saveTeams = async (teams: Team[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
    await AsyncStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION.toString());
  } catch (error) {
    console.error('팀 데이터 저장 실패:', error);
    throw error;
  }
};

/**
 * 새 팀 생성
 */
export const createTeam = async (input: CreateTeamInput): Promise<Team> => {
  const teams = await loadTeams();

  const newTeam: Team = {
    id: `team-${Date.now()}`,
    name: input.name.trim(),
    players: input.players.map((player, index) => ({
      id: `player-${Date.now()}-${index}`,
      name: player.name.trim(),
      displayName: player.displayName,
      position: player.position,
      number: player.number,
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
    metadata: {},
  };

  const updatedTeams = [...teams, newTeam];
  await saveTeams(updatedTeams);

  return newTeam;
};

/**
 * 팀 정보 업데이트
 */
export const updateTeam = async (input: UpdateTeamInput): Promise<Team> => {
  const teams = await loadTeams();

  const teamIndex = teams.findIndex(team => team.id === input.id);
  if (teamIndex === -1) {
    throw new Error('팀을 찾을 수 없습니다');
  }

  const existingTeam = teams[teamIndex];

  const updatedTeam: Team = {
    ...existingTeam,
    name: input.name?.trim() || existingTeam.name,
    players: input.players
      ? input.players.map((player, index) => ({
          id: player.name === existingTeam.players[index]?.name
            ? existingTeam.players[index]?.id || `player-${Date.now()}-${index}`
            : `player-${Date.now()}-${index}`,
          name: player.name.trim(),
          displayName: player.displayName,
          position: player.position,
          number: player.number,
        }))
      : existingTeam.players,
    updatedAt: new Date(),
  };

  teams[teamIndex] = updatedTeam;
  await saveTeams(teams);

  return updatedTeam;
};

/**
 * 팀 삭제
 */
export const deleteTeam = async (teamId: string): Promise<void> => {
  const teams = await loadTeams();
  const filteredTeams = teams.filter(team => team.id !== teamId);
  await saveTeams(filteredTeams);
};

/**
 * ID로 팀 검색
 */
export const getTeamById = async (teamId: string): Promise<Team | null> => {
  const teams = await loadTeams();
  return teams.find(team => team.id === teamId) || null;
};

/**
 * 데이터 버전 확인
 */
export const getDataVersion = async (): Promise<number> => {
  try {
    const version = await AsyncStorage.getItem(STORAGE_KEYS.DATA_VERSION);
    return version ? parseInt(version, 10) : 0;
  } catch {
    return 0;
  }
};

/**
 * 데이터 마이그레이션 실행
 */
export const migrateDataIfNeeded = async (): Promise<void> => {
  const currentVersion = await getDataVersion();

  if (currentVersion < CURRENT_DATA_VERSION) {
    console.log(`데이터 마이그레이션 실행: v${currentVersion} -> v${CURRENT_DATA_VERSION}`);

    // 기존 팀 데이터를 로드하고 새 형식으로 저장
    const teams = await loadTeams();
    await saveTeams(teams);

    console.log('데이터 마이그레이션 완료');
  }
};