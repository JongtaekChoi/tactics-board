export type TeamSetupConfig = {
  teamSelection: 'home-only' | 'away-only' | 'both-teams';
  playerCount: 11 | 7 | 5 | number;
  scenario: 'attack' | 'defense' | 'setpiece' | 'free';
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
};