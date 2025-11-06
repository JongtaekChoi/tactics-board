import { Stroke, Token } from "../types";

import { useFormationHelpers } from "./useFormationHelpers";
import { useState } from "react";

export type HistoryState = {
  home: Token[];
  away: Token[];
  ball: Token;
  strokes: Stroke[];
};

export type HistoryAction =
  | { type: "DRAW_STROKE"; stroke: Stroke }
  | { type: "MOVE_PLAYER"; playerId: string; x: number; y: number }
  | { type: "UPDATE_PLAYER_LABEL"; playerId: string; label: string }
  | { type: "DELETE_STROKE"; strokeId: string }
  | { type: "ROTATE_PLAYER"; playerId: string; rotation: number };

export const useHistory = () => {
  const { initialPlayers, initialBall } = useFormationHelpers();

  const [history, setHistory] = useState<HistoryState[]>([
    {
      home: initialPlayers("home"),
      away: initialPlayers("away"),
      ball: initialBall,
      strokes: [],
    },
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentState = history[currentIndex];

  const pushState = (newState: HistoryState) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const applyAction = (action: HistoryAction) => {
    const current = history[currentIndex];
    let newState: HistoryState;

    switch (action.type) {
      case "DRAW_STROKE":
        newState = {
          ...current,
          strokes: [...current.strokes, action.stroke],
        };
        break;

      case "MOVE_PLAYER":
        if (action.playerId === "ball") {
          newState = {
            ...current,
            ball: { ...current.ball, x: action.x, y: action.y },
          };
        } else {
          const isHome = current.home.some((p) => p.id === action.playerId);
          newState = {
            ...current,
            home: isHome
              ? current.home.map((p) =>
                  p.id === action.playerId
                    ? { ...p, x: action.x, y: action.y }
                    : p
                )
              : current.home,
            away: !isHome
              ? current.away.map((p) =>
                  p.id === action.playerId
                    ? { ...p, x: action.x, y: action.y }
                    : p
                )
              : current.away,
          };
        }
        break;

      case "UPDATE_PLAYER_LABEL":
        if (action.playerId === "ball") return; // 볼은 편집 불가
        const isHomePLayer = current.home.some((p) => p.id === action.playerId);
        newState = {
          ...current,
          home: isHomePLayer
            ? current.home.map((p) =>
                p.id === action.playerId ? { ...p, label: action.label } : p
              )
            : current.home,
          away: !isHomePLayer
            ? current.away.map((p) =>
                p.id === action.playerId ? { ...p, label: action.label } : p
              )
            : current.away,
        };
        break;

      case "DELETE_STROKE":
        newState = {
          ...current,
          strokes: current.strokes.filter(
            (stroke) => stroke.id !== action.strokeId
          ),
        };
        break;

      case "ROTATE_PLAYER":
        if (action.playerId === "ball") {
          newState = {
            ...current,
            ball: { ...current.ball, rotation: action.rotation },
          };
        } else {
          const isHome = current.home.some((p) => p.id === action.playerId);
          newState = {
            ...current,
            home: isHome
              ? current.home.map((p) =>
                  p.id === action.playerId
                    ? { ...p, rotation: action.rotation }
                    : p
                )
              : current.home,
            away: !isHome
              ? current.away.map((p) =>
                  p.id === action.playerId
                    ? { ...p, rotation: action.rotation }
                    : p
                )
              : current.away,
          };
        }
        break;

      default:
        return;
    }

    pushState(newState);
  };

  const undo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const reset = () => {
    const initialState = {
      home: initialPlayers("home"),
      away: initialPlayers("away"),
      ball: initialBall,
      strokes: [],
    };
    setHistory([initialState]);
    setCurrentIndex(0);
  };

  const loadState = (state: HistoryState) => {
    setHistory([state]);
    setCurrentIndex(0);
  };

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    currentState,
    applyAction,
    undo,
    redo,
    reset,
    loadState,
    canUndo,
    canRedo,
  };
};
