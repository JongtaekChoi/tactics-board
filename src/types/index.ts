export type Point = { x: number; y: number };

export type Stroke = {
  id: string;
  color: string;
  width: number;
  points: Point[];
};

export type Token = {
  id: string;
  x: number;
  y: number;
  side: "home" | "away" | "ball";
  // 0~360 degrees. If not specified, default orientation is upwards if side is "home",
  // downwards (180) if side is "away", and no rotation if side is "ball".
  rotation?: number;
  label: string;
};

export type Mode = "draw" | "move";

export type BoardData = {
  home: Token[];
  away: Token[];
  ball: Token;
  strokes: Stroke[];
};

export type FormationInfo = {
  name: string;
  description: string;
  positions: [number, number][];
};
