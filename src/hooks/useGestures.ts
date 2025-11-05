import { Mode, Point, Stroke, Token } from "../types";
import { findNearestStroke, selectNextPlayerInArea } from "../utils/helpers";
import { runOnJS, useSharedValue } from "react-native-reanimated";

import { Gesture } from "react-native-gesture-handler";
import { useFormationHelpers } from "./useFormationHelpers";

interface UseGesturesProps {
  mode: Mode;
  color: string;
  width: number;
  players: Token[];
  strokes: Stroke[];
  onStartDrawing: (point: Point) => void;
  onUpdateDrawing: (point: Point) => void;
  onFinishDrawing: () => void;
  onPlayerSelect: (playerId: string | null) => void;
  onPlayerMove: (playerId: string, x: number, y: number) => void;
  onPlayerEdit: (playerId: string) => void;
  onStrokeSelect: (strokeId: string | null) => void;
  selectedId: string | null;
}

export const useGestures = ({
  mode,
  color,
  width,
  players,
  strokes,
  onStartDrawing,
  onUpdateDrawing,
  onFinishDrawing,
  onPlayerSelect,
  onPlayerMove,
  onPlayerEdit,
  onStrokeSelect,
  selectedId,
}: UseGesturesProps) => {
  const { findNearestPlayer } = useFormationHelpers();
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
    // 터치 영역에서 플레이어를 찾되, 이미 선택된 플레이어가 있으면 우선 사용
    let targetPlayer = selectNextPlayerInArea(x, y, players, selectedId);

    // 터치 영역에 플레이어가 없지만 이미 선택된 플레이어가 있으면 그대로 사용
    if (!targetPlayer && selectedId) {
      targetPlayer = players.find((p) => p.id === selectedId) || null;
    }

    console.log("Drag start at:", x, y, "Target player:", targetPlayer);
    if (targetPlayer) {
      dragPlayerId.value = targetPlayer.id;
      isDragging.value = true;
      dragStartPosition.value = { x: targetPlayer.x, y: targetPlayer.y };
      dragOffset.value = { x: 0, y: 0 };
      onPlayerSelect(targetPlayer.id);
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

  const longTouch = Gesture.LongPress()
    .enabled(mode === "move")
    .minDuration(300)
    .onStart((e) => {
      const { x, y } = e;
      runOnJS(onDragStart)(x, y);
    });

  const onTab = (x: number, y: number) => {
    try {
      // 터치 영역에서 겹친 토큰들 중 순환 선택
      const nextPlayer = selectNextPlayerInArea(x, y, players, selectedId);

      if (nextPlayer) {
        // 새로운 플레이어 선택 (순환)
        onPlayerSelect(nextPlayer.id);
        dragPlayerId.value = nextPlayer.id;
        onStrokeSelect(null); // 플레이어 선택 시 스트로크 선택 해제
      } else {
        // 플레이어가 없으면 스트로크 확인
        const nearestStroke = findNearestStroke(x, y, strokes);

        if (nearestStroke) {
          // 스트로크 선택
          onStrokeSelect(nearestStroke.id);
          onPlayerSelect(null); // 스트로크 선택 시 플레이어 선택 해제
          dragPlayerId.value = null;
        } else if (selectedId) {
          // 터치 영역에 아무것도 없고 플레이어가 선택된 경우 그 위치로 이동
          onPlayerMove(selectedId, x, y);
          onPlayerSelect(null);
          dragPlayerId.value = null;
        } else {
          // 아무것도 선택되지 않은 상태에서 빈 곳을 터치하면 모든 선택 해제
          onStrokeSelect(null);
        }
      }
    } catch (error) {
      console.error("Gesture tap error:", error);
    }
  };

  const onDoubleTap = (x: number, y: number) => {
    try {
      // 더블탭에서는 현재 선택된 플레이어 상관없이 가장 가까운 플레이어 편집
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
    dragPlayer,
    longTouch
  );

  return {
    composedGesture,
    // 드래그 애니메이션 상태
    dragOffset,
    isDragging,
    dragPlayerId,
  };
};
