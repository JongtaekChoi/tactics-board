import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS, WIDTHS } from '../../utils/constants';

interface ColorPickerProps {
  color: string;
  onColorChange: (color: string) => void;
  width: number;
  onWidthChange: (width: number) => void;
}

export default function ColorPicker({
  color,
  onColorChange,
  width,
  onWidthChange,
}: ColorPickerProps) {
  const colorOptions = [COLORS.RED, COLORS.GREEN, COLORS.BLUE];

  return (
    <View style={styles.subbar}>
      {colorOptions.map((c) => (
        <TouchableOpacity
          key={c}
          onPress={() => onColorChange(c)}
          style={[
            styles.colorSwatch,
            { backgroundColor: c, borderWidth: color === c ? 2 : 0 },
          ]}
        />
      ))}
      {WIDTHS.map((w) => (
        <TouchableOpacity
          key={w}
          onPress={() => onWidthChange(w)}
          style={[
            styles.widthDot,
            {
              width: w * 2,
              height: w * 2,
              borderWidth: width === w ? 2 : 0,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  subbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  colorSwatch: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderColor: "white",
  },
  widthDot: { 
    borderColor: "white", 
    borderRadius: 999 
  },
});