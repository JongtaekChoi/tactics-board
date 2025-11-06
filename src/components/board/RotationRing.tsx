import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, { Circle } from "react-native-svg";

import React from "react";
import { StyleSheet } from "react-native";
import { Token } from "../../types";
import { useBoardDimensions } from "../../contexts/BoardContext";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface RotationRingProps {
  token: Token;
  onRotationChange: (tokenId: string, rotation: number) => void;
  onRotationComplete: (tokenId: string, rotation: number) => void;
}

export default function RotationRing({
  token,
  onRotationChange,
  onRotationComplete,
}: RotationRingProps) {
  const { TOKEN_SIZE } = useBoardDimensions();

  // 회전 링은 토큰보다 1.8배 큰 크기
  const RING_SIZE = TOKEN_SIZE * 1.8;
  const RING_RADIUS = RING_SIZE / 2;

  const currentRotation = useSharedValue(token.rotation || 0);
  const startAngle = useSharedValue(0);

  // 각도 계산 함수
  const calculateAngle = (
    x: number,
    y: number,
    centerX: number,
    centerY: number
  ) => {
    "worklet";
    const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
    // 0도를 위쪽으로 조정 (기본적으로 atan2는 오른쪽이 0도)
    return (angle + 90 + 360) % 360;
  };

  const rotationGesture = Gesture.Pan()
    .onStart((event) => {
      const centerX = RING_RADIUS;
      const centerY = RING_RADIUS;
      startAngle.value = calculateAngle(event.x, event.y, centerX, centerY);
    })
    .onUpdate((event) => {
      "worklet";
      const centerX = RING_RADIUS;
      const centerY = RING_RADIUS;
      const currentAngle = calculateAngle(event.x, event.y, centerX, centerY);

      // 각도 차이 계산 (360도 wraparound 고려)
      let angleDiff = currentAngle - startAngle.value;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;

      const newRotation = (currentRotation.value + angleDiff + 360) % 360;
      currentRotation.value = newRotation;

      // 실시간 회전 업데이트
      runOnJS(onRotationChange)(token.id, newRotation);

      startAngle.value = currentAngle;
    })
    .onEnd(() => {
      // 15도 단위로 스냅
      const snappedRotation = Math.round(currentRotation.value / 15) * 15;
      currentRotation.value = snappedRotation;

      runOnJS(onRotationComplete)(token.id, snappedRotation);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${currentRotation.value}deg` }],
  }));

  return (
    <GestureDetector gesture={rotationGesture}>
      <Animated.View
        style={[
          styles.ringContainer,
          {
            left: token.x - RING_RADIUS,
            top: token.y - RING_RADIUS,
            width: RING_SIZE,
            height: RING_SIZE,
          },
        ]}
      >
        {/* 회전 링 (점선 원) */}
        <Svg width={RING_SIZE} height={RING_SIZE} style={styles.ring}>
          <Circle
            cx={RING_RADIUS}
            cy={RING_RADIUS}
            r={RING_RADIUS - 4}
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="2"
            strokeDasharray="8,4"
            fill="none"
          />
        </Svg>

        {/* 회전 핸들 (작은 점) */}
        <AnimatedSvg
          width={RING_SIZE}
          height={RING_SIZE}
          style={[styles.handle, animatedStyle]}
        >
          <Circle
            cx={RING_RADIUS}
            cy={8}
            r={6}
            fill="rgba(255, 255, 255, 0.9)"
          />
        </AnimatedSvg>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  ringContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },
  ring: {
    position: "absolute",
  },
  handle: {
    position: "absolute",
  },
});
