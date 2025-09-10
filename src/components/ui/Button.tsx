import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ButtonProps {
  onPress: () => void;
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
}

export default function Button({ 
  onPress, 
  label, 
  icon, 
  active, 
  disabled, 
  size = 'medium' 
}: ButtonProps) {
  const isSmall = size === 'small';
  
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[
        styles.btn,
        isSmall && styles.btnSmall,
        active && { backgroundColor: "#222", borderColor: "#fff" },
        disabled && { backgroundColor: "#1a1a1a", borderColor: "#333" },
      ]}
    >
      <View style={styles.content}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={isSmall ? 16 : 20} 
            color={disabled ? "#666" : "white"} 
          />
        )}
        {label && (
          <Text style={[
            styles.text,
            isSmall && styles.textSmall,
            disabled && { color: "#666" }
          ]}>
            {label}
          </Text>
        )}
      </View>
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
  btnSmall: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  text: {
    color: "white", 
    fontWeight: "600",
    fontSize: 14,
  },
  textSmall: {
    fontSize: 12,
  },
});