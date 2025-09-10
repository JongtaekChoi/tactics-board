import AsyncStorage from "@react-native-async-storage/async-storage";
import { Player, Stroke } from '../types';
import { initialPlayers, initialBall } from '../utils/helpers';

interface BoardData {
  home: Player[];
  away: Player[];
  ball: Player;
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