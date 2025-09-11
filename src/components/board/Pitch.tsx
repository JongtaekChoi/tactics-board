import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BOARD_WIDTH, BOARD_HEIGHT, COLORS } from '../../utils/constants';

export default function Pitch() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.PITCH }]} />
      {/* 바운더리 */}
      <View style={[styles.line, { left: 8, right: 8, top: 8, bottom: 8 }]} />
      {/* 하프라인 */}
      <View
        style={[
          styles.line,
          { left: 8, right: 8, top: BOARD_HEIGHT / 2, height: 2 },
        ]}
      />
      {/* 센터써클(간이) */}
      <View
        style={{
          position: "absolute",
          left: BOARD_WIDTH / 2 - 36,
          top: BOARD_HEIGHT / 2 - 36,
          width: 72,
          height: 72,
          borderRadius: 36,
          borderWidth: 2,
          borderColor: "white",
        }}
      />
      
      {/* 상단 골 포스트 */}
      <View style={[styles.goalPost, styles.topGoal]} />
      <View style={[styles.goalPostLeft, { top: 6, left: BOARD_WIDTH / 2 - 22 }]} />
      <View style={[styles.goalPostRight, { top: 6, left: BOARD_WIDTH / 2 + 20 }]} />
      
      {/* 하단 골 포스트 */}
      <View style={[styles.goalPost, styles.bottomGoal]} />
      <View style={[styles.goalPostLeft, { bottom: 6, left: BOARD_WIDTH / 2 - 22 }]} />
      <View style={[styles.goalPostRight, { bottom: 6, left: BOARD_WIDTH / 2 + 20 }]} />
      
      {/* 페널티 박스 - 상단 */}
      <View style={[styles.penaltyBox, styles.topPenaltyBox]} />
      {/* 페널티 박스 - 하단 */}
      <View style={[styles.penaltyBox, styles.bottomPenaltyBox]} />
      
      {/* 골 에리어 - 상단 */}
      <View style={[styles.goalArea, styles.topGoalArea]} />
      {/* 골 에리어 - 하단 */}
      <View style={[styles.goalArea, styles.bottomGoalArea]} />
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    position: "absolute",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 4,
  },
  goalPost: {
    position: "absolute",
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  goalPostLeft: {
    position: "absolute",
    width: 2,
    height: 8,
    backgroundColor: "white",
  },
  goalPostRight: {
    position: "absolute", 
    width: 2,
    height: 8,
    backgroundColor: "white",
  },
  topGoal: {
    top: 6,
    left: BOARD_WIDTH / 2 - 20,
    width: 40,
    height: 2,
  },
  bottomGoal: {
    bottom: 6,
    left: BOARD_WIDTH / 2 - 20,
    width: 40,
    height: 2,
  },
  topPenaltyBox: {
    top: 8,
    left: BOARD_WIDTH / 2 - 50,
    width: 100,
    height: 60,
  },
  bottomPenaltyBox: {
    bottom: 8,
    left: BOARD_WIDTH / 2 - 50,
    width: 100,
    height: 60,
  },
  topGoalArea: {
    top: 8,
    left: BOARD_WIDTH / 2 - 25,
    width: 50,
    height: 25,
  },
  bottomGoalArea: {
    bottom: 8,
    left: BOARD_WIDTH / 2 - 25,
    width: 50,
    height: 25,
  },
  penaltyBox: {
    position: "absolute",
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  goalArea: {
    position: "absolute",
    borderColor: "white", 
    borderWidth: 2,
    backgroundColor: "transparent",
  },
});