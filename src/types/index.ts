export type Point = { x: number; y: number };

export type Stroke = {
  id: string;
  color: string;
  width: number;
  points: Point[];
};

export type Player = { 
  id: string; 
  x: number; 
  y: number; 
  side: 'home' | 'away' | 'ball'; 
  label: string;
};

export type Mode = 'draw' | 'move';

export type BoardData = {
  home: Player[];
  away: Player[];
  ball: Player;
  strokes: Stroke[];
};

export type FormationInfo = {
  name: string;
  description: string;
  positions: [number, number][];
};