import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../utils/constants';

interface ButtonProps {
  onPress: () => void;
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  active?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium';
  variant?: 'primary' | 'secondary' | 'default';
  style?: ViewStyle;
  children?: React.ReactNode;
}

export default function Button({ 
  onPress, 
  label, 
  icon, 
  active, 
  disabled, 
  size = 'medium',
  variant = 'default',
  style,
  children
}: ButtonProps) {
  const isSmall = size === 'small';
  
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: COLORS.PRIMARY,
          borderColor: COLORS.PRIMARY,
        };
      case 'secondary':
        return {
          backgroundColor: 'transparent',
          borderColor: '#555',
        };
      default:
        return {
          backgroundColor: "#333",
          borderColor: "#555",
        };
    }
  };
  
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[
        styles.btn,
        isSmall && styles.btnSmall,
        getVariantStyle(),
        active && {
          backgroundColor: "#4CAF50",
          borderColor: "#4CAF50",
          shadowColor: "#4CAF50",
          shadowOpacity: 0.3,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
        },
        disabled && { backgroundColor: "#1a1a1a", borderColor: "#333" },
        style,
      ]}
    >
      <View style={styles.content}>
        {icon && (
          <Ionicons
            name={icon}
            size={isSmall ? 16 : 20}
            color={disabled ? "#666" : active ? "white" : "white"}
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
        {children}
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