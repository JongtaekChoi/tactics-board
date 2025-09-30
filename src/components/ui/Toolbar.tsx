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
  onDeleteStroke?: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canDeleteStroke?: boolean;
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
  onDeleteStroke,
  canUndo,
  canRedo,
  canDeleteStroke,
}: ToolbarProps) {
  return (
    <ScrollView 
      horizontal 
      style={styles.toolbar}
      contentContainerStyle={styles.toolbarContent}
      showsHorizontalScrollIndicator={false}
    >
      <Button
        onPress={() => onModeChange("move")}
        active={mode === "move"}
        icon="move"
        size="small"
      />
      <Button
        onPress={() => onModeChange("draw")}
        active={mode === "draw"}
        icon="pencil"
        size="small"
      />
      <Button onPress={onUndo} icon="arrow-undo" disabled={!canUndo} size="small" />
      <Button onPress={onRedo} icon="arrow-redo" disabled={!canRedo} size="small" />
      {canDeleteStroke && onDeleteStroke && (
        <Button
          onPress={onDeleteStroke}
          icon="trash"
          size="small"
        />
      )}
      <Button onPress={onReset} icon="refresh" size="small" />
      <Button onPress={onSave} icon="save" size="small" />
      <Button onPress={onSaveAs} icon="copy" size="small" />
      <Button onPress={onLoad} icon="folder-open" size="small" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    marginBottom: 8,
  },
  toolbarContent: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
});