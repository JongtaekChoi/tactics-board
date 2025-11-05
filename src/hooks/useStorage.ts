import { Stroke, Token } from "../types";
import { initialBall, initialPlayers } from "../utils/helpers";

import AsyncStorage from "@react-native-async-storage/async-storage";

interface BoardData {
  home: Token[];
  away: Token[];
  ball: Token;
  strokes: Stroke[];
}

export const useStorage = () => {
  const saveBoard = async (data: BoardData) => {
    await AsyncStorage.setItem("@tactics:last", JSON.stringify(data));
  };

  const loadBoard = async (): Promise<BoardData | null> => {
    const raw = await AsyncStorage.getItem("@tactics:last");
    if (!raw) return null;

    const data = JSON.parse(raw);
    return {
      home: data.home ?? initialPlayers("home"),
      away: data.away ?? initialPlayers("away"),
      ball: data.ball ?? initialBall(),
      strokes: data.strokes ?? [],
    };
  };

  return { saveBoard, loadBoard };
};
