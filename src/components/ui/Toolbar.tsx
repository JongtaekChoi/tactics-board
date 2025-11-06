import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
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
  canRotate?: boolean;
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
  canRotate,
}: ToolbarProps) {
  return (
    <ScrollView
      horizontal
      style={styles.toolbar}
      contentContainerStyle={styles.toolbarContent}
      showsHorizontalScrollIndicator={false}
    >
      {/* 모드 버튼 그룹 */}
      <View style={styles.modeGroup}>
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
        {canRotate && (
          <Button
            onPress={() => onModeChange("rotate")}
            active={mode === "rotate"}
            icon="sync"
            size="small"
          />
        )}
      </View>

      {/* 구분선 */}
      <View style={styles.separator} />

      {/* 실행취소/복구 그룹 */}
      <View style={styles.actionGroup}>
        <Button onPress={onUndo} icon="arrow-undo" disabled={!canUndo} size="small" />
        <Button onPress={onRedo} icon="arrow-redo" disabled={!canRedo} size="small" />
      </View>

      {/* 삭제 버튼 */}
      {canDeleteStroke && onDeleteStroke && (
        <Button
          onPress={onDeleteStroke}
          icon="trash"
          size="small"
        />
      )}

      {/* 구분선 */}
      <View style={styles.separator} />

      {/* 파일 작업 그룹 */}
      <View style={styles.fileGroup}>
        <Button onPress={onReset} icon="refresh" size="small" />
        <Button onPress={onSave} icon="save" label="저장" size="small" />
        <Button onPress={onSaveAs} icon="copy" label="다른이름" size="small" />
        <Button onPress={onLoad} icon="folder-open" size="small" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  toolbar: {
    marginBottom: 8,
  },
  toolbarContent: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  modeGroup: {
    flexDirection: "row",
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 4,
  },
  actionGroup: {
    flexDirection: "row",
    gap: 4,
  },
  fileGroup: {
    flexDirection: "row",
    gap: 4,
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 4,
  },
});