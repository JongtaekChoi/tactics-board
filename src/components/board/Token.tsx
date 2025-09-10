import { COLORS, TOKEN_RADIUS, TOKEN_SIZE } from "../../utils/constants";
import { StyleSheet, Text, View } from "react-native";

import { Player } from "../../types";
import React from "react";

interface TokenProps {
  player: Player;
  isSelected: boolean;
}

export default function Token({ player, isSelected }: TokenProps) {
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

  return (
    <View
      style={[
        styles.token,
        {
          left: player.x - TOKEN_RADIUS,
          top: player.y - TOKEN_RADIUS,
          ...getTokenStyle(),
          borderWidth: isSelected ? 3 : 0,
          borderColor: isSelected ? COLORS.SELECTED : "transparent",
        },
      ]}
    >
      <Text
        style={[styles.tokenText, player.side === "ball" && { fontSize: 18 }]}
      >
        {player.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  token: {
    position: "absolute",
    width: TOKEN_SIZE,
    height: TOKEN_SIZE,
    borderRadius: TOKEN_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
  tokenText: {
    color: "white",
    fontWeight: "700",
  },
});
