import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { BoardData } from '../types';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

interface SavedBoard {
  id: string;
  name: string;
  timestamp: number;
  data: BoardData;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [savedBoards, setSavedBoards] = useState<SavedBoard[]>([]);

  useEffect(() => {
    loadSavedBoards();
  }, []);

  const loadSavedBoards = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const boardKeys = keys.filter(key => key.startsWith('board_'));
      const boards: SavedBoard[] = [];

      for (const key of boardKeys) {
        const data = await AsyncStorage.getItem(key);
        if (data) {
          const savedBoard = JSON.parse(data);
          boards.push(savedBoard);
        }
      }

      // 최신 순으로 정렬
      boards.sort((a, b) => b.timestamp - a.timestamp);
      setSavedBoards(boards);
    } catch (error) {
      console.error('보드 목록 로드 실패:', error);
    }
  };

  const createNewBoard = () => {
    navigation.navigate('TeamSetup', { boardId: undefined });
  };

  const openTeamManagement = () => {
    navigation.navigate('TeamList');
  };

  const openBoard = (board: SavedBoard) => {
    // 기존 보드는 기본 설정으로 열기
    const defaultConfig = {
      teamSelection: 'both-teams' as const,
      playerCount: 11 as const,
      tacticalType: 'free' as const,
    };
    navigation.navigate('Board', { boardId: board.id, teamConfig: defaultConfig });
  };

  const deleteBoard = async (boardId: string) => {
    Alert.alert(
      '보드 삭제',
      '정말로 이 보드를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(`board_${boardId}`);
              setSavedBoards(prev => prev.filter(board => board.id !== boardId));
            } catch (error) {
              console.error('보드 삭제 실패:', error);
            }
          }
        }
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return '방금 전';
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const renderBoardItem = ({ item }: { item: SavedBoard }) => (
    <TouchableOpacity
      style={styles.boardItem}
      onPress={() => openBoard(item)}
      onLongPress={() => deleteBoard(item.id)}
    >
      <View style={styles.boardPreview}>
        <Text style={styles.boardIcon}>⚽</Text>
      </View>
      <View style={styles.boardInfo}>
        <Text style={styles.boardName}>{item.name}</Text>
        <Text style={styles.boardDate}>{formatDate(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>축구 전술 보드</Text>
      
      <TouchableOpacity style={styles.newBoardButton} onPress={createNewBoard}>
        <Text style={styles.newBoardText}>새 전술판 만들기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.teamManagementButton} onPress={openTeamManagement}>
        <Text style={styles.teamManagementText}>👥 팀 관리</Text>
      </TouchableOpacity>

      {savedBoards.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>저장된 전술판</Text>
          <FlatList
            data={savedBoards}
            keyExtractor={(item) => item.id}
            renderItem={renderBoardItem}
            style={styles.boardList}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>저장된 전술판이 없습니다</Text>
          <Text style={styles.emptySubText}>새로운 전술판을 만들어보세요!</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  newBoardButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  newBoardText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  teamManagementButton: {
    backgroundColor: '#FF9800',
    padding: 16,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
  },
  teamManagementText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  boardList: {
    flex: 1,
  },
  boardItem: {
    flexDirection: 'row',
    backgroundColor: '#222',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  boardPreview: {
    width: 50,
    height: 50,
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  boardIcon: {
    fontSize: 24,
  },
  boardInfo: {
    flex: 1,
  },
  boardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  boardDate: {
    fontSize: 14,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
  },
});