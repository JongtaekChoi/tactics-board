export type TacticalType = 'free' | '4-4-2' | '4-3-3' | '3-5-2' | '4-2-3-1' | '5-3-2' | 'setpiece';

export type TeamSetupConfig = {
  teamSelection: 'home-only' | 'both-teams';
  playerCount: 11 | 7 | 5 | number;
  tacticalType: TacticalType;
};

export type RootStackParamList = {
  Home: undefined;
  TeamSetup: {
    boardId?: string;
  };
  Board: {
    boardId?: string;
    teamConfig: TeamSetupConfig;
  };
  // v1.1.0 팀 관리 화면들
  TeamList: undefined;
  TeamEdit: {
    teamId?: string;
  };
};