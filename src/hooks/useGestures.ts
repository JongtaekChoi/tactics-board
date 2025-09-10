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

  // 애니메이션 기반 드래그 시스템
  const dragOffset = useSharedValue({ x: 0, y: 0 });
  const isDragging = useSharedValue(false);
  const dragPlayerId = useSharedValue<string | null>(null);
  const dragStartPosition = useSharedValue({ x: 0, y: 0 });

  const onDragStart = (x: number, y: number) => {
    let nearest = findNearestPlayer(x, y, players);
    if (nearest == null && selectedId) {
      nearest = players.find((p) => p.id === selectedId) || null;
    }
    console.log("Drag start at:", x, y, "Nearest player:", nearest);
    if (nearest) {
      dragPlayerId.value = nearest.id;
      isDragging.value = true;
      dragStartPosition.value = { x: nearest.x, y: nearest.y };
      dragOffset.value = { x: 0, y: 0 };
      onPlayerSelect(nearest.id);
    }
  };

  const onDragEnd = (translationX: number, translationY: number) => {
    if (dragPlayerId.value && isDragging.value) {
      const finalX = dragStartPosition.value.x + translationX;
      const finalY = dragStartPosition.value.y + translationY;

      // 드래그 완료 시에만 실제 상태 업데이트 (히스토리에 한 번만 추가)
      onPlayerMove(dragPlayerId.value, finalX, finalY);
    }

    // 애니메이션 상태 초기화
    dragPlayerId.value = null;
    isDragging.value = false;
    dragOffset.value = { x: 0, y: 0 };
    onPlayerSelect(null);
  };

  const dragPlayer = Gesture.Pan()
    .enabled(mode === "move")
    .onStart((e) => {
      const { x, y } = e;
      runOnJS(onDragStart)(x, y);
    })
    .onUpdate((e) => {
      if (dragPlayerId.value && isDragging.value) {
        dragOffset.value = {
          x: e.translationX,
          y: e.translationY,
        };
      }
    })
    .onEnd((e) => {
      runOnJS(onDragEnd)(e.translationX, e.translationY);
    });

  const onTab = (x: number, y: number) => {
    try {
      const nearest = findNearestPlayer(x, y, players);
      if (nearest) {
        onPlayerSelect(nearest.id);
        dragPlayerId.value = nearest.id;
      } else if (selectedId) {
        onPlayerMove(selectedId, x, y);
        onPlayerSelect(null);
        dragPlayerId.value = null;
      }
    } catch (error) {
      console.error("Gesture tap error:", error);
    }
  };

  const onDoubleTap = (x: number, y: number) => {
    try {
      const nearest = findNearestPlayer(x, y, players);
      if (nearest) {
        onPlayerEdit(nearest.id);
      }
    } catch (error) {
      console.error("Gesture double tap error:", error);
    }
  };

  const doubleTap = Gesture.Tap()
    .enabled(mode === "move")
    .numberOfTaps(2)
    .onStart((e) => {
      const { x, y } = e;
      runOnJS(onDoubleTap)(x, y);
    });

  const tap = Gesture.Tap()
    .enabled(mode === "move")
    .onStart((e) => {
      const { x, y } = e;
      runOnJS(onTab)(x, y);
    });

  const composedGesture = Gesture.Exclusive(
    drawPan,
    doubleTap,
    tap,
    dragPlayer
  );

  return {
    composedGesture,
    // 드래그 애니메이션 상태
    dragOffset,
    isDragging,
    dragPlayerId,
  };
};
