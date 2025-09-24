import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { Team, Player } from '../types/team';
import { createTeam, updateTeam, getTeamById } from '../services/teamService';
import type { RootStackParamList } from '../types/navigation';

type TeamEditNavigationProp = StackNavigationProp<RootStackParamList, 'TeamEdit'>;
type TeamEditRouteProp = RouteProp<RootStackParamList, 'TeamEdit'>;

/**
 * 팀 편집 화면 (생성/수정 통합)
 */
export default function TeamEditScreen() {
  const navigation = useNavigation<TeamEditNavigationProp>();
  const route = useRoute<TeamEditRouteProp>();

  const isEditing = !!route.params?.teamId;

  const [teamName, setTeamName] = useState('');
  const [players, setPlayers] = useState<Omit<Player, 'id'>[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * 기존 팀 데이터 로드 (편집 모드)
   */
  useEffect(() => {
    const loadTeamData = async () => {
      if (!isEditing || !route.params?.teamId) return;

      try {
        const team = await getTeamById(route.params.teamId);
        if (team) {
          setTeamName(team.name);
          setPlayers(team.players.map(player => ({
            name: player.name,
            position: player.position,
            number: player.number,
          })));
        }
      } catch (error) {
        Alert.alert('오류', '팀 정보를 불러오는데 실패했습니다.');
        navigation.goBack();
      }
    };

    loadTeamData();
  }, [isEditing, route.params?.teamId]);

  /**
   * 선수 추가
   */
  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) {
      Alert.alert('알림', '선수 이름을 입력해주세요.');
      return;
    }

    const trimmedName = newPlayerName.trim();

    // 중복 확인
    if (players.some(player => player.name === trimmedName)) {
      Alert.alert('알림', '이미 등록된 선수입니다.');
      return;
    }

    setPlayers([...players, { name: trimmedName }]);
    setNewPlayerName('');
  };

  /**
   * 선수 제거
   */
  const handleRemovePlayer = (index: number) => {
    Alert.alert(
      '선수 제거',
      `"${players[index].name}" 선수를 제거하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '제거',
          style: 'destructive',
          onPress: () => {
            const updatedPlayers = players.filter((_, i) => i !== index);
            setPlayers(updatedPlayers);
          },
        },
      ]
    );
  };

  /**
   * 팀 저장 (생성/수정)
   */
  const handleSave = async () => {
    if (!teamName.trim()) {
      Alert.alert('알림', '팀 이름을 입력해주세요.');
      return;
    }

    if (players.length === 0) {
      Alert.alert('알림', '최소 1명 이상의 선수를 등록해주세요.');
      return;
    }

    try {
      setLoading(true);

      if (isEditing && route.params?.teamId) {
        // 팀 수정
        await updateTeam({
          id: route.params.teamId,
          name: teamName.trim(),
          players: players,
        });
      } else {
        // 새 팀 생성
        await createTeam({
          name: teamName.trim(),
          players: players,
        });
      }

      navigation.goBack();
    } catch (error) {
      console.error('팀 저장 실패:', error);
      Alert.alert('오류', '팀 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 선수 아이템 렌더러
   */
  const renderPlayerItem = ({ item, index }: { item: Omit<Player, 'id'>; index: number }) => (
    <View style={styles.playerItem}>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        {/* v1.2.0에서 포지션 정보 추가 예정 */}
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemovePlayer(index)}
      >
        <Text style={styles.removeButtonText}>제거</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* 팀 이름 입력 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>팀 이름</Text>
          <TextInput
            style={styles.teamNameInput}
            value={teamName}
            onChangeText={setTeamName}
            placeholder="팀 이름을 입력하세요"
            placeholderTextColor="#666"
            maxLength={30}
          />
        </View>

        {/* 선수 목록 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            선수 목록 ({players.length}명)
          </Text>

          {/* 새 선수 추가 */}
          <View style={styles.addPlayerContainer}>
            <TextInput
              style={styles.playerInput}
              value={newPlayerName}
              onChangeText={setNewPlayerName}
              placeholder="선수 이름"
              placeholderTextColor="#666"
              maxLength={20}
              onSubmitEditing={handleAddPlayer}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddPlayer}
            >
              <Text style={styles.addButtonText}>추가</Text>
            </TouchableOpacity>
          </View>

          {/* 선수 목록 */}
          <FlatList
            data={players}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderPlayerItem}
            style={styles.playerList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>

      {/* 저장 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? '저장 중...' : isEditing ? '수정 완료' : '팀 생성'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  teamNameInput: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  addPlayerContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  playerInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  playerList: {
    maxHeight: 300,
  },
  playerItem: {
    backgroundColor: '#1a1a1a',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#666',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});