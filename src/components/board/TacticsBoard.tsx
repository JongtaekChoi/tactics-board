import { Stroke, Token } from "../../types";

import Animated from "react-native-reanimated";
import { COLORS } from "../../utils/constants";
import { GestureDetector } from "react-native-gesture-handler";
import Pitch from "./Pitch";
import PlayerToken from "./PlayerToken";
import React from "react";
import { StyleSheet } from "react-native";
import SvgOverlay from "./SvgOverlay";
import { useBoardDimensions } from "../../contexts/BoardContext";

interface TacticsBoardProps {
  players: Token[];
  strokes: Stroke[];
  currentStroke: Stroke | null;
  selectedId: string | null;
  selectedStrokeId?: string | null;
  gesture: any;
  dragOffset?: any;
  isDragging?: any;
  dragPlayerId?: any;
}

export default function TacticsBoard({
  players,
  strokes,
  currentStroke,
  selectedId,
  selectedStrokeId,
  gesture,
  dragOffset,
  isDragging,
  dragPlayerId,
}: TacticsBoardProps) {
  const { BOARD_WIDTH, BOARD_HEIGHT } = useBoardDimensions();

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[styles.board, { width: BOARD_WIDTH, height: BOARD_HEIGHT }]}
      >
        <Pitch />
        <SvgOverlay strokes={strokes} selectedStrokeId={selectedStrokeId} />
        {currentStroke && <SvgOverlay strokes={[currentStroke]} />}
        {players.map((player) => (
          <PlayerToken
            key={player.id}
            player={player}
            isSelected={selectedId === player.id}
            dragOffset={dragOffset}
            isDragging={isDragging}
            dragPlayerId={dragPlayerId}
          />
        ))}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  board: {
    alignSelf: "center",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.PITCH,
  },
});
