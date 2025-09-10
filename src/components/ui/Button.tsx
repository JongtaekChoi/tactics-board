import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  label: string;
  active?: boolean;
  disabled?: boolean;
}

export default function Button({ onPress, label, active, disabled }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[
        styles.btn,
        active && { backgroundColor: "#222", borderColor: "#fff" },
        disabled && { backgroundColor: "#1a1a1a", borderColor: "#333" },
      ]}
    >
      <Text style={[
        { color: "white", fontWeight: "600" },
        disabled && { color: "#666" }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#333",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#555",
  },
});