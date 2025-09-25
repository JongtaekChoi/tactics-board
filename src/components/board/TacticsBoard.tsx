import React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { Player, Stroke } from '../../types';
import { COLORS } from '../../utils/constants';
import { useBoardDimensions } from '../../contexts/BoardContext';
import Pitch from './Pitch';
import Token from './Token';
import SvgOverlay from './SvgOverlay';

interface TacticsBoardProps {
  players: Player[];
  strokes: Stroke[];
  currentStroke: Stroke | null;
  selectedId: string | null;
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
  gesture,
  dragOffset,
  isDragging,
  dragPlayerId
}: TacticsBoardProps) {
  const { BOARD_WIDTH, BOARD_HEIGHT } = useBoardDimensions();

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.board, { width: BOARD_WIDTH, height: BOARD_HEIGHT }]}>
        <Pitch />
        <SvgOverlay strokes={strokes} />
        {currentStroke && <SvgOverlay strokes={[currentStroke]} />}
        {players.map((player) => (
          <Token
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