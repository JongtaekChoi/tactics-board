import { initialBall, initialPlayers } from "../utils/helpers";

import { Token } from "../types";
import { useState } from "react";

export const usePlayerMovement = () => {
  const [home, setHome] = useState(initialPlayers("home"));
  const [away, setAway] = useState(initialPlayers("away"));
  const [ball, setBall] = useState(initialBall());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const movePlayer = (playerId: string, x: number, y: number) => {
    if (playerId === "ball") {
      setBall((prev) => ({ ...prev, x, y }));
    } else {
      setHome((arr) =>
        arr.map((pl) => (pl.id === playerId ? { ...pl, x, y } : pl))
      );
      setAway((arr) =>
        arr.map((pl) => (pl.id === playerId ? { ...pl, x, y } : pl))
      );
    }
  };

  const updatePlayerLabel = (playerId: string, label: string) => {
    if (playerId === "ball") return; // 볼은 편집 불가
    setHome((arr) =>
      arr.map((pl) => (pl.id === playerId ? { ...pl, label } : pl))
    );
    setAway((arr) =>
      arr.map((pl) => (pl.id === playerId ? { ...pl, label } : pl))
    );
  };

  const resetPlayers = () => {
    setHome(initialPlayers("home"));
    setAway(initialPlayers("away"));
    setBall(initialBall());
    setSelectedId(null);
  };

  const setPlayersFromData = (
    homeData: Token[],
    awayData: Token[],
    ballData: Token
  ) => {
    setHome(homeData);
    setAway(awayData);
    setBall(ballData);
    setSelectedId(null);
  };

  const allPlayers = [...home, ...away, ball];

  return {
    home,
    away,
    ball,
    allPlayers,
    selectedId,
    setSelectedId,
    movePlayer,
    updatePlayerLabel,
    resetPlayers,
    setPlayersFromData,
  };
};
