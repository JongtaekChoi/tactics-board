import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import { Mode, BoardData } from '../types';
import { RootStackParamList } from '../types/navigation';
import { COLORS } from '../utils/constants';
import TacticsBoard from '../components/board/TacticsBoard';
import Toolbar from '../components/ui/Toolbar';
import ColorPicker from '../components/ui/ColorPicker';
import TextEditModal from '../components/ui/TextEditModal';
import { useDrawing } from '../hooks/useDrawing';
import { usePlayerMovement } from '../hooks/usePlayerMovement';
import { useGestures } from '../hooks/useGestures';

type BoardScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Board'>;
  route: RouteProp<RootStackParamList, 'Board'>;
};

export default function BoardScreen({ navigation, route }: BoardScreenProps) {
  const { boardId } = route.params;
  const shotRef = useRef<View>(null);
  const [mode, setMode] = useState<Mode>("move");
  const [color, setColor] = useState(COLORS.RED);
  const [widthPx, setWidthPx] = useState(4);
  const [boardName, setBoardName] = useState(`전술판 ${new Date().toLocaleDateString()}`);
  
  // 텍스트 편집 상태
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Custom hooks
  const drawing = useDrawing();
  const players = usePlayerMovement();

  // 제스처 핸들러
  const { composedGesture } = useGestures({
    mode,
    color,
    width: widthPx,
    players: players.allPlayers,
    onStartDrawing: (point) => drawing.startDrawing(point, color, widthPx),
    onUpdateDrawing: drawing.updateDrawing,
    onFinishDrawing: drawing.finishDrawing,
    onPlayerSelect: players.setSelectedId,
    onPlayerMove: players.movePlayer,
    onPlayerEdit: openTextEditor,
    selectedId: players.selectedId,
  });

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const loadBoard = async () => {
    if (!boardId) return;
    
    try {
      const savedData = await AsyncStorage.getItem(`board_${boardId}`);
      if (savedData) {
        const { name, data }: { name: string; data: BoardData } = JSON.parse(savedData);
        setBoardName(name);
        players.setPlayersFromData(data.home, data.away, data.ball);
        drawing.setStrokesFromData(data.strokes);
      }
    } catch (error) {
      console.error('보드 로드 실패:', error);
    }
  };

  // 텍스트 편집 함수들
  function openTextEditor(playerId: string) {
    if (playerId === 'ball') return; // 볼은 편집 불가
    const player = players.allPlayers.find(p => p.id === playerId);
    if (player) {
      setEditText(player.label);
      setEditingPlayer(playerId);
    }
  }

  const saveTextEdit = () => {
    if (!editingPlayer) return;
    players.updatePlayerLabel(editingPlayer, editText);
    setEditingPlayer(null);
    setEditText("");
  };

  // 저장/불러오기
  const handleSave = async () => {
    Alert.prompt(
      '전술판 저장',
      '전술판 이름을 입력하세요',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '저장',
          onPress: async (name) => {
            if (!name?.trim()) return;
            
            const id = boardId || Date.now().toString();
            const boardData: BoardData = {
              home: players.home,
              away: players.away,
              ball: players.ball,
              strokes: drawing.strokes,
            };

            try {
              await AsyncStorage.setItem(`board_${id}`, JSON.stringify({
                id,
                name: name.trim(),
                timestamp: Date.now(),
                data: boardData,
              }));
              setBoardName(name.trim());
              Alert.alert('저장 완료', '전술판이 성공적으로 저장되었습니다.');
            } catch (error) {
              console.error('저장 실패:', error);
              Alert.alert('저장 실패', '전술판 저장 중 오류가 발생했습니다.');
            }
          }
        }
      ],
      'plain-text',
      boardName
    );
  };

  const handleLoad = () => {
    navigation.navigate('Home');
  };

  // PNG 공유
  const sharePng = async () => {
    if (!shotRef.current) return;
    try {
      const uri = await captureRef(shotRef, { format: "png", quality: 1 });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error('공유 실패:', error);
      Alert.alert('공유 실패', '이미지 공유 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <Toolbar
        mode={mode}
        onModeChange={setMode}
        onUndo={drawing.undo}
        onRedo={drawing.redo}
        onExport={sharePng}
        onSave={handleSave}
        onLoad={handleLoad}
      />

      <ColorPicker
        color={color}
        onColorChange={setColor}
        width={widthPx}
        onWidthChange={setWidthPx}
      />

      <View ref={shotRef}>
        <TacticsBoard
          players={players.allPlayers}
          strokes={drawing.strokes}
          currentStroke={drawing.current}
          selectedId={players.selectedId}
          gesture={composedGesture}
        />
      </View>

      <TextEditModal
        visible={editingPlayer !== null}
        text={editText}
        onTextChange={setEditText}
        onSave={saveTextEdit}
        onCancel={() => setEditingPlayer(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: "#111"
  },
});