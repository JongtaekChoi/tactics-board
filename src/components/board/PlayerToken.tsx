import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { COLORS, TOKEN_SIZE } from "../../utils/constants";
import { StyleSheet, Text } from "react-native";
import Svg, { Path } from "react-native-svg";

import React from "react";
import { Token } from "../../types";
import { useBoardDimensions } from "../../contexts/BoardContext";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface PlayerTokenProps {
  player: Token;
  isSelected: boolean;
  dragOffset?: any;
  isDragging?: any;
  dragPlayerId?: any;
}

export default function PlayerToken({
  player,
  isSelected,
  dragOffset,
  isDragging,
  dragPlayerId,
}: PlayerTokenProps) {
  const { TOKEN_SIZE, TOKEN_RADIUS } = useBoardDimensions();
  const getTokenStyle = () => {
    switch (player.side) {
      case "home":
        return { backgroundColor: COLORS.HOME_TEAM };
      case "away":
        return { backgroundColor: COLORS.AWAY_TEAM };
      case "ball":
        return { backgroundColor: COLORS.BALL_BACKGROUND, fontSize: 18 };
      default:
        return {};
    }
  };

  // 드래그 애니메이션 스타일
  const animatedStyle = useAnimatedStyle(() => {
    const isBeingDragged =
      isDragging?.value && dragPlayerId?.value === player.id;

    return {
      transform: [
        {
          translateX: isBeingDragged ? dragOffset?.value?.x || 0 : 0,
        },
        {
          translateY: isBeingDragged ? dragOffset?.value?.y || 0 : 0,
        },
        {
          scale: withSpring(isBeingDragged ? 1.3 : 1, {
            damping: 20,
            stiffness: 300,
          }),
        },
      ],
      zIndex: isBeingDragged ? 100 : 1,
      opacity: isBeingDragged ? 0.8 : 1,
    };
  });

  const rotation = player.rotation
    ? player.rotation
    : player.side === "home"
    ? 0
    : player.side === "away"
    ? 180
    : 0;

  return (
    <Animated.View
      style={[
        styles.token,
        {
          left: player.x - TOKEN_RADIUS,
          top: player.y - TOKEN_RADIUS,
          width: TOKEN_SIZE,
          height: TOKEN_SIZE,
          borderRadius: TOKEN_RADIUS,
          ...getTokenStyle(),
          borderWidth: isSelected ? 3 : 0,
          borderColor: isSelected ? COLORS.SELECTED : "transparent",
        },
        animatedStyle,
      ]}
    >
      {player.side !== "ball" && (
        <AnimatedSvg
          style={[
            styles.directionStyle,
            { transform: [{ rotate: `${rotation}deg` }] },
          ]}
          width={TOKEN_SIZE}
          height={TOKEN_SIZE}
          viewBox="0 0 20 20"
        >
          <Path d="M5,3 L10,0 L15,3" stroke="white" fill="none" />
        </AnimatedSvg>
      )}
      <Text
        style={[
          styles.tokenText,
          {
            fontSize:
              player.side === "ball" ? TOKEN_SIZE * 0.55 : TOKEN_SIZE * 0.45,
          },
        ]}
      >
        {player.label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  token: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  tokenText: {
    color: "white",
    fontWeight: "700",
  },
  directionStyle: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
