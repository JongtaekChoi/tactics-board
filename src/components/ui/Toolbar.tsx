import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Mode } from '../../types';
import Button from './Button';

interface ToolbarProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onExport: () => void;
  onSave: () => void;
  onLoad: () => void;
}

export default function Toolbar({
  mode,
  onModeChange,
  onUndo,
  onRedo,
  onExport,
  onSave,
  onLoad,
}: ToolbarProps) {
  return (
    <View style={styles.toolbar}>
      <Button
        onPress={() => onModeChange("move")}
        active={mode === "move"}
        label="이동"
      />
      <Button
        onPress={() => onModeChange("draw")}
        active={mode === "draw"}
        label="펜"
      />
      <Button onPress={onUndo} label="Undo" />
      <Button onPress={onRedo} label="Redo" />
      {/* TODO: Export 기능 디버깅 필요 - 현재 동작 불안정 */}
      {/* <Button onPress={onExport} label="Export" /> */}
      <Button onPress={onSave} label="Save" />
      <Button onPress={onLoad} label="Load" />
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
});