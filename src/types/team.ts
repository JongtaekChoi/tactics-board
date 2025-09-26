// 확장 가능한 팀 관리 데이터 모델
// v1.1.0 기준으로 구현, 향후 확장 고려

export interface Player {
  id: string;
  name: string;
  displayName?: string; // 토큰에 표시할 짧은 이름 (예: "홍길동" → "홍", "이영희" → "이영")
  // v1.2.0에서 추가 예정
  position?: 'GK' | 'DEF' | 'MID' | 'FWD';
  number?: number;
  // v2.0.0에서 추가 예정 (경기 관리)
  // birthDate?: Date;
  // nationality?: string;
  // stats?: PlayerStats;
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  createdAt: Date;
  updatedAt: Date;
  // 향후 확장을 위한 메타데이터
  metadata?: {
    logo?: string;        // v1.2.0에서 추가 예정
    stadium?: string;     // v2.0.0에서 추가 예정
    manager?: string;     // v2.0.0에서 추가 예정
    [key: string]: any;   // 유연한 확장
  };
}

// AsyncStorage 키 구조
export interface StorageStructure {
  teams: Team[];
  currentBoard: any; // BoardState는 기존 App.tsx에서 정의됨
  boardHistory: any[];
  dataVersion: number; // 스키마 버전 관리
}

// 레거시 호환성을 위한 타입
export type LegacyPlayerData = string[] | Player[];

// 확장성을 위한 유틸리티 타입들
export interface PlayerStats {
  goals: number;
  assists: number;
  appearances: number;
  // v2.0.0에서 확장 예정
}

export interface ExtendedPlayer extends Player {
  matchStats?: PlayerStats;
  condition?: 'fit' | 'tired' | 'injured';
  // 향후 경기 관리 시스템에서 활용
}

// 팀 생성/편집을 위한 입력 타입
export interface CreateTeamInput {
  name: string;
  players: Omit<Player, 'id'>[];
}

export interface UpdateTeamInput extends Partial<CreateTeamInput> {
  id: string;
}