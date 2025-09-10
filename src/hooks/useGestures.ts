import { Mode, Player, Point, Stroke } from "../types";
import { runOnJS, useSharedValue } from "react-native-reanimated";

import { Gesture } from "react-native-gesture-handler";
import { findNearestPlayer } from "../utils/helpers";

interface UseGesturesProps {
  mode: Mode;
  color: string;
  width: number;
  players: Player[];
  onStartDrawing: (point: Point) => void;
  onUpdateDrawing: (point: Point) => void;
  onFinishDrawing: () => void;
  onPlayerSelect: (playerId: string | null) => void;
  onPlayerMove: (playerId: string, x: number, y: number) => void;
  onPlayerEdit: (playerId: string) => void;
  selectedId: string | null;
}

export const useGestures = ({
  mode,
  color,
  width,
  players,
  onStartDrawing,
  onUpdateDrawing,
  onFinishDrawing,
  onPlayerSelect,
  onPlayerMove,
  onPlayerEdit,
  selectedId,
}: UseGesturesProps) => {
  const drawPan = Gesture.Pan()
    .enabled(mode === "draw")
    .onStart((e) => {
      try {
        runOnJS(onStartDrawing)({ x: e.x, y: e.y });
      } catch (error) {
        console.error("Draw start error:", error);
      }
    })
    .onUpdate((e) => {
      try {
        runOnJS(onUpdateDrawing)({ x: e.x, y: e.y });
      } catch (error) {
        console.error("Draw update error:", error);
      }
    })
    .onEnd(() => {
      try {
        runOnJS(onFinishDrawing)();
      } catch (error) {
        console.error("Draw end error:", error);
      }
    });

  const onTab = (x: number, y: number) => {
    try {
      const nearest = findNearestPlayer(x, y, players);
      if (nearest) {
        onPlayerSelect(nearest.id);
      } else if (selectedId) {
        onPlayerMove(selectedId, x, y);
        onPlayerSelect(null);
      }
    } catch (error) {
      console.error("Gesture tap error:", error);
    }
  };

  const tap = Gesture.Tap()
    .enabled(mode === "move")
    .onStart((e) => {
      const { x, y } = e;
      runOnJS(onTab)(x, y);
    });

  const composedGesture = Gesture.Exclusive(drawPan, tap);

  return { composedGesture };
};
