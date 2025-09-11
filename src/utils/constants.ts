import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const BOARD_WIDTH = width;
export const BOARD_HEIGHT = Math.round(width * 1.6);

export const COLORS = {
  RED: "#ff3b30",
  GREEN: "#34c759",
  BLUE: "#0a84ff",
  PRIMARY: "#0a84ff",
  HOME_TEAM: "#0a84ff",
  AWAY_TEAM: "#ff9f0a",
  BALL_BACKGROUND: "#fff0",
  SELECTED: "#00ff00",
  PITCH: "#0b5d17",
};

export const WIDTHS = [3, 5, 8];

export const TOKEN_SIZE = 32;
export const TOKEN_RADIUS = 16;
export const SELECTION_RADIUS = 16; // 40px radius for touch detection
