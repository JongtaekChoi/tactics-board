export type TacticalType = "free" | "4-4-2" | "4-3-3" | "3-5-2" | "4-2-3-1";

export type TeamSetupConfig = {
  teamSelection: "home-only" | "both-teams";
  homePlayerCount: number; // 홈팀 인원 (3-11명)
  awayPlayerCount: number; // 어웨이팀 인원 (3-11명)
  homeTacticalType: TacticalType;
  awayTacticalType: TacticalType;
  homeTeamId?: string;
  awayTeamId?: string;
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
