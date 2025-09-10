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
});