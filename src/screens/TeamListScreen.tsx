import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Team } from '../types/team';
import { loadTeams, deleteTeam, migrateDataIfNeeded } from '../services/teamService';
import type { RootStackParamList } from '../types/navigation';

type TeamListNavigationProp = StackNavigationProp<RootStackParamList, 'TeamList'>;

/**
 * 팀 목록 화면
 */
export default function TeamListScreen() {
  const navigation = useNavigation<TeamListNavigationProp>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * 팀 목록 로드
   */
  const loadTeamList = async () => {
    try {
      setLoading(true);
      await migrateDataIfNeeded(); // 마이그레이션 실행
      const teamList = await loadTeams();
      setTeams(teamList);
    } catch (error) {
      console.error('팀 목록 로드 실패:', error);
      Alert.alert('오류', '팀 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      loadTeamList();
    }, [])
  );

  /**
   * 팀 삭제 처리
   */
  const handleDeleteTeam = (team: Team) => {
    Alert.alert(
      '팀 삭제',
      `"${team.name}" 팀을 삭제하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTeam(team.id);
              await loadTeamList();
            } catch (error) {
              Alert.alert('오류', '팀 삭제에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  /**
   * 팀 수정으로 이동
   */
  const handleEditTeam = (team: Team) => {
    navigation.navigate('TeamEdit', { teamId: team.id });
  };

  /**
   * 새 팀 생성으로 이동
   */
  const handleCreateTeam = () => {
    navigation.navigate('TeamEdit', {});
  };

  /**
   * 팀 아이템 렌더러
   */
  const renderTeamItem = ({ item: team }: { item: Team }) => (
    <View style={styles.teamItem}>
      <TouchableOpacity
        style={styles.teamInfo}
        onPress={() => handleEditTeam(team)}
      >
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.playerCount}>{team.players.length}명</Text>
        <Text style={styles.teamDate}>
          생성: {team.createdAt.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      <View style={styles.teamActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditTeam(team)}
        >
          <Text style={styles.editButtonText}>편집</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTeam(team)}
        >
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * 빈 목록 렌더러
   */
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>등록된 팀이 없습니다</Text>
      <Text style={styles.emptySubText}>
        새 팀을 만들어서 선수들을 관리해보세요
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>팀 관리</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateTeam}
        >
          <Text style={styles.createButtonText}>+ 새 팀</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={teams}
        keyExtractor={(item) => item.id}
        renderItem={renderTeamItem}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadTeamList}
            tintColor="#4CAF50"
          />
        }
        contentContainerStyle={teams.length === 0 ? styles.emptyList : undefined}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  teamItem: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  playerCount: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 2,
  },
  teamDate: {
    fontSize: 12,
    color: '#999',
  },
  teamActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});