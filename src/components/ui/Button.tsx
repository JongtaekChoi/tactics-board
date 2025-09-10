import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  label: string;
  active?: boolean;
}

export default function Button({ onPress, label, active }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btn,
        active && { backgroundColor: "#222", borderColor: "#fff" },
      ]}
    >
      <Text style={{ color: "white", fontWeight: "600" }}>{label}</Text>
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