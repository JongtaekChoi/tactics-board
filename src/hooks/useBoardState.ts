import { useState } from 'react';
import { Point, Stroke } from '../types';
import { useHistory } from './useHistory';

export const useBoardState = () => {
  const history = useHistory();
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedStrokeId, setSelectedStrokeId] = useState<string | null>(null);

  // 그리기 관련
  const startDrawing = (point: Point, color: string, width: number) => {
    const newStroke = {
      id: `stroke-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      color,
      width,
      points: [point]
    };
    setCurrentStroke(newStroke);
  };

  const updateDrawing = (point: Point) => {
    setCurrentStroke(current => 
      current ? {
        ...current,
        points: [...current.points, point],
      } : null
    );
  };

  const finishDrawing = () => {
    if (currentStroke && currentStroke.points.length > 1) {
      history.applyAction({
        type: 'DRAW_STROKE',
        stroke: currentStroke,
      });
    }
    setCurrentStroke(null);
  };

  // 플레이어 이동
  const movePlayer = (playerId: string, x: number, y: number) => {
    history.applyAction({
      type: 'MOVE_PLAYER',
      playerId,
      x,
      y,
    });
  };

  // 플레이어 라벨 수정
  const updatePlayerLabel = (playerId: string, label: string) => {
    if (playerId === 'ball') return; // 볼은 편집 불가
    history.applyAction({
      type: 'UPDATE_PLAYER_LABEL',
      playerId,
      label,
    });
  };

  // 플레이어 회전
  const rotatePlayer = (playerId: string, rotation: number) => {
    history.applyAction({
      type: 'ROTATE_PLAYER',
      playerId,
      rotation,
    });
  };

  // 스트로크 선택
  const selectStroke = (strokeId: string | null) => {
    setSelectedStrokeId(strokeId);
  };

  // 선택된 스트로크 삭제
  const deleteSelectedStroke = () => {
    if (selectedStrokeId) {
      history.applyAction({
        type: 'DELETE_STROKE',
        strokeId: selectedStrokeId,
      });
      setSelectedStrokeId(null);
    }
  };

  // 데이터에서 상태 설정
  const loadFromData = (homeData: any[], awayData: any[], ballData: any, strokesData: Stroke[]) => {
    history.loadState({
      home: homeData,
      away: awayData,
      ball: ballData,
      strokes: strokesData,
    });
    setSelectedId(null);
  };

  const { currentState } = history;
  const allPlayers = [...currentState.home, ...currentState.away, currentState.ball];

  return {
    // 상태
    home: currentState.home,
    away: currentState.away,
    ball: currentState.ball,
    allPlayers,
    strokes: currentState.strokes,
    currentStroke,
    selectedId,
    selectedStrokeId,

    // 액션들
    setSelectedId,
    startDrawing,
    updateDrawing,
    finishDrawing,
    movePlayer,
    updatePlayerLabel,
    rotatePlayer,
    selectStroke,
    deleteSelectedStroke,
    loadFromData,

    // 히스토리 컨트롤
    undo: history.undo,
    redo: history.redo,
    reset: history.reset,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
  };
};