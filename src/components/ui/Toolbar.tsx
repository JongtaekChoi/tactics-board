import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Mode } from '../../types';
import Button from './Button';

interface ToolbarProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onLoad: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function Toolbar({
  mode,
  onModeChange,
  onUndo,
  onRedo,
  onReset,
  onSave,
  onSaveAs,
  onLoad,
  canUndo,
  canRedo,
}: ToolbarProps) {
  return (
    <View style={styles.toolbar}>
      <Button
        onPress={() => onModeChange("move")}
        active={mode === "move"}
        icon="move"
        label="이동"
      />
      <Button
        onPress={() => onModeChange("draw")}
        active={mode === "draw"}
        icon="pencil"
        label="펜"
      />
      <Button onPress={onUndo} icon="arrow-undo" disabled={!canUndo} />
      <Button onPress={onRedo} icon="arrow-redo" disabled={!canRedo} />
      <Button onPress={onReset} icon="refresh" />
      <Button onPress={onSave} icon="save" />
      <Button onPress={onSaveAs} icon="copy" />
      <Button onPress={onLoad} icon="folder-open" />
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