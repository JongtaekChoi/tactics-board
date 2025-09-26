import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { RootStackParamList, TeamSetupConfig } from '../types/navigation';
import { Team } from '../types/team';
import { loadTeams } from '../services/teamService';
import Button from '../components/ui/Button';
import { COLORS } from '../utils/constants';

type TeamSetupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'TeamSetup'>;
  route: RouteProp<RootStackParamList, 'TeamSetup'>;
};

const TEAM_OPTIONS = [
  { value: 'both-teams', label: '양팀 모두', description: '홈팀 vs 어웨이팀' },
  { value: 'home-only', label: '우리팀만', description: '공격 전술 연습' },
] as const;

// 인원수별 설명 매핑
const PLAYER_COUNT_DESCRIPTIONS: Record<number, string> = {
  3: '기초 드릴',
  4: '패스 연습', 
  5: '실내 축구',
  6: '소그룹 연습',
  7: 'Futsal / 유소년',
  8: '확장 연습',
  9: '준경기',
  10: '거의 풀팀',
  11: '정규 경기'
};

const TACTICAL_OPTIONS_11v11 = [
  { value: 'free', label: '자유 전술', description: '기본 2줄 대형' },
  { value: '4-4-2', label: '4-4-2 클래식', description: '균형 잡힌 포메이션' },
  { value: '4-3-3', label: '4-3-3 공격형', description: '공격적 포메이션' },
  { value: '3-5-2', label: '3-5-2 중원형', description: '중원 장악 포메이션' },
  { value: '4-2-3-1', label: '4-2-3-1 현대형', description: '현대적 포메이션' },
  { value: '5-3-2', label: '5-3-2 수비형', description: '수비적 포메이션' },
  { value: 'setpiece', label: '세트피스', description: '코너킥 전술' },
] as const;

const TACTICAL_OPTIONS_OTHER = [
  { value: 'free', label: '자유 전술', description: '기본 대형' },
  { value: 'setpiece', label: '세트피스', description: '코너킥 전술' },
] as const;

export default function TeamSetupScreen({ navigation, route }: TeamSetupScreenProps) {
  const { boardId } = route.params;

  const [config, setConfig] = useState<TeamSetupConfig>({
    teamSelection: 'both-teams',
    playerCount: 11,
    tacticalType: 'free',
    homeTeamId: undefined,
    awayTeamId: undefined,
  });

  // 팀 목록 로드
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  useEffect(() => {
    loadAllTeams();
  }, []);

  const loadAllTeams = async () => {
    try {
      const allTeams = await loadTeams();
      setTeams(allTeams);
    } catch (error) {
      console.error('팀 목록 로드 실패:', error);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  // 통합 폼 핸들러들
  const handleTeamSelection = (teamSelection: 'home-only' | 'both-teams') => {
    setConfig(prev => ({ ...prev, teamSelection }));
  };

  const handleHomeTeamSelection = (teamId: string) => {
    setConfig(prev => ({ ...prev, homeTeamId: teamId }));
  };

  const handleAwayTeamSelection = (teamId: string) => {
    setConfig(prev => ({ ...prev, awayTeamId: teamId }));
  };

  const handlePlayerCountSelection = (playerCount: number) => {
    setConfig(prev => ({ ...prev, playerCount }));
  };

  const handleTacticalSelection = (tacticalType: 'free' | '4-4-2' | '4-3-3' | '3-5-2' | '4-2-3-1' | '5-3-2' | 'setpiece') => {
    setConfig(prev => ({ ...prev, tacticalType }));
  };

  const handleContinue = () => {
    navigation.navigate('Board', {
      boardId,
      teamConfig: config
    });
  };

  // 폼 유효성 검사
  const isFormValid = () => {
    if (config.teamSelection === 'both-teams') {
      return config.homeTeamId !== undefined && config.awayTeamId !== undefined;
    }
    return config.homeTeamId !== undefined;
  };

  const OptionCard = ({ 
    title, 
    value, 
    isSelected, 
    onPress 
  }: { 
    title: string; 
    value: any; 
    isSelected: boolean; 
    onPress: () => void;
  }) => {
    const cardStyle = isSelected 
      ? { ...styles.optionCard, ...styles.selectedCard }
      : styles.optionCard;
      
    return (
      <Button
        variant={isSelected ? 'primary' : 'secondary'}
        onPress={onPress}
        style={cardStyle}
      >
        <Text style={[
          styles.optionTitle,
          isSelected && styles.selectedText
        ]}>
          {title}
        </Text>
      </Button>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Button
          onPress={() => navigation.goBack()}
          icon="arrow-back"
          size="small"
        />
        <Text style={styles.title}>팀 구성 설정</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 1. 팀 선택 방식 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>팀 선택</Text>
          <Text style={styles.sectionDescription}>어떤 팀을 배치할까요?</Text>
          <View style={styles.optionsGrid}>
            {TEAM_OPTIONS.map((option) => (
              <OptionCard
                key={option.value}
                title={option.label}
                value={option.value}
                isSelected={config.teamSelection === option.value}
                onPress={() => handleTeamSelection(option.value)}
              />
            ))}
          </View>
        </View>

        {/* 2. 홈팀 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>홈팀 선택</Text>
          <Text style={styles.sectionDescription}>홈팀을 선택하세요</Text>

          {isLoadingTeams ? (
            <Text style={styles.loadingText}>팀 목록을 불러오는 중...</Text>
          ) : teams.length === 0 ? (
            <View style={styles.noTeamsContainer}>
              <Text style={styles.noTeamsText}>등록된 팀이 없습니다.</Text>
              <Button
                variant="primary"
                onPress={() => navigation.navigate('TeamList')}
                style={styles.createTeamButton}
              >
                <Text style={styles.createTeamButtonText}>새 팀 만들기</Text>
              </Button>
            </View>
          ) : (
            <View style={styles.optionsGrid}>
              {teams.map((team) => (
                <OptionCard
                  key={team.id}
                  title={team.name}
                  value={team.id}
                  isSelected={config.homeTeamId === team.id}
                  onPress={() => handleHomeTeamSelection(team.id)}
                />
              ))}
              <OptionCard
                title="팀 없이 진행"
                value=""
                isSelected={config.homeTeamId === ''}
                onPress={() => handleHomeTeamSelection('')}
              />
            </View>
          )}
        </View>

        {/* 3. 어웨이팀 선택 (양팀 모드일 때만) */}
        {config.teamSelection === 'both-teams' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>어웨이팀 선택</Text>
            <Text style={styles.sectionDescription}>어웨이팀을 선택하세요</Text>
            <View style={styles.optionsGrid}>
              {teams.filter(team => team.id !== config.homeTeamId).map((team) => (
                <OptionCard
                  key={team.id}
                  title={team.name}
                  value={team.id}
                  isSelected={config.awayTeamId === team.id}
                  onPress={() => handleAwayTeamSelection(team.id)}
                />
              ))}
              <OptionCard
                title="팀 없이 진행"
                value=""
                isSelected={config.awayTeamId === ''}
                onPress={() => handleAwayTeamSelection('')}
              />
            </View>
          </View>
        )}

        {/* 4. 인원 수 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>인원 수</Text>
          <Text style={styles.sectionDescription}>
            {config.playerCount}명 - {PLAYER_COUNT_DESCRIPTIONS[config.playerCount]}
          </Text>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>3명</Text>
              <Text style={styles.sliderLabel}>11명</Text>
            </View>

            <Slider
              style={styles.slider}
              minimumValue={3}
              maximumValue={11}
              step={1}
              value={config.playerCount}
              onValueChange={handlePlayerCountSelection}
              minimumTrackTintColor={COLORS.PRIMARY}
              maximumTrackTintColor="#333"
              thumbTintColor={COLORS.PRIMARY}
            />

            <View style={styles.playerCountDisplay}>
              <Text style={styles.playerCountNumber}>{config.playerCount}</Text>
              <Text style={styles.playerCountUnit}>명</Text>
            </View>
          </View>
        </View>

        {/* 5. 전술 유형 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>전술 유형</Text>
          <Text style={styles.sectionDescription}>어떤 포메이션을 사용할까요?</Text>
          <View style={styles.optionsGrid}>
            {(config.playerCount === 11 ? TACTICAL_OPTIONS_11v11 : TACTICAL_OPTIONS_OTHER).map((option) => (
              <OptionCard
                key={option.value}
                title={option.label}
                value={option.value}
                isSelected={config.tacticalType === option.value}
                onPress={() => handleTacticalSelection(option.value)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 하단 시작 버튼 */}
      <View style={styles.footer}>
        <Button
          onPress={handleContinue}
          variant="primary"
          style={styles.continueButton}
        >
          <Text style={styles.continueText}>전술보드 시작</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#111',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDescription: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
  },
  optionsGrid: {
    gap: 12,
  },
  optionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#222',
  },
  selectedCard: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: `${COLORS.PRIMARY}20`,
  },
  optionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedText: {
    color: COLORS.PRIMARY,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  continueButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 16,
  },
  continueText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  sliderContainer: {
    marginVertical: 20,
    paddingHorizontal: 8,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderLabel: {
    color: '#888',
    fontSize: 12,
  },
  slider: {
    height: 40,
    marginVertical: 8,
  },
  playerCountDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: 12,
  },
  playerCountNumber: {
    color: COLORS.PRIMARY,
    fontSize: 36,
    fontWeight: 'bold',
  },
  playerCountUnit: {
    color: COLORS.PRIMARY,
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 4,
  },
  loadingText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 32,
  },
  noTeamsContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  noTeamsText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  createTeamButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createTeamButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});