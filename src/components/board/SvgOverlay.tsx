import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stroke } from '../../types';

interface SvgOverlayProps {
  strokes: Stroke[];
}

export default function SvgOverlay({ strokes }: SvgOverlayProps) {
  // SVG 없이 뷰로 빠르게: 세그먼트별 작은 View를 이어 그리기(미니멀)
  // *진짜 예쁘게 하려면 react-native-svg 사용 권장*
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {strokes.flatMap((s, i) =>
        s.points.slice(1).map((p, j) => {
          const a = s.points[j];
          const b = p;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const len = Math.hypot(dx, dy) || 1;
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          return (
            <View
              key={`${i}-${j}`}
              style={{
                position: "absolute",
                left: a.x,
                top: a.y,
                width: len,
                height: s.width,
                backgroundColor: s.color,
                transform: [{ rotateZ: `${angle}deg` }],
                borderRadius: s.width / 2,
              }}
            />
          );
        })
      )}
    </View>
  );
}