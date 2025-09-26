import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { RootStackParamList, TeamSetupConfig } from '../types/navigation';
import { Team } from '../types/team';
import { loadTeams } from '../services/teamService';
import Button from '../components/ui/Button';
import { COLORS } from '../utils/constants';
import { useI18n } from '../hooks/useI18n';

type TeamSetupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'TeamSetup'>;
  route: RouteProp<RootStackParamList, 'TeamSetup'>;
};




export default function TeamSetupScreen({ navigation, route }: TeamSetupScreenProps) {
  const { boardId } = route.params;
  const { t, changeLanguage, currentLanguage } = useI18n();

  const [config, setConfig] = useState<TeamSetupConfig>({
    teamSelection: 'both-teams', // 자동으로 결정됨
    playerCount: 11,
    tacticalType: 'free',
    homeTeamId: undefined,
    awayTeamId: undefined,
  });


  // 팀 목록 로드
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);

  // 어웨이팀 활성화 상태
  const [isAwayTeamEnabled, setIsAwayTeamEnabled] = useState(false);

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

  // 통합 폼 핸들러들 (토글 방식)
  const handleHomeTeamSelection = (teamId: string) => {
    setConfig(prev => ({ ...prev, homeTeamId: teamId }));
  };

  const handleAwayTeamToggle = (enabled: boolean) => {
    setIsAwayTeamEnabled(enabled);
    if (!enabled) {
      // 어웨이팀 비활성화 시 선택 초기화
      setConfig(prev => ({
        ...prev,
        awayTeamId: undefined,
        teamSelection: 'home-only'
      }));
    } else {
      // 어웨이팀 활성화 시 팀 선택 모드로 전환
      setConfig(prev => ({
        ...prev,
        teamSelection: 'both-teams'
      }));
    }
  };

  const handleAwayTeamSelection = (teamId: string) => {
    setConfig(prev => ({ ...prev, awayTeamId: teamId }));
  };

  // 설정에서 팀 선택 모드 결정
  const getTeamSelectionFromConfig = (config: TeamSetupConfig): 'home-only' | 'both-teams' => {
    if (config.homeTeamId && config.awayTeamId) {
      return 'both-teams';
    }
    return 'home-only';
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


  const OptionCard = ({
    title,
    isSelected,
    onPress
  }: {
    title: string;
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
        <View style={styles.headerLeft}>
          <Button
            onPress={() => navigation.goBack()}
            icon="arrow-back"
            size="small"
          />
        </View>
        <Text style={styles.title}>{t('teamSetup.title')}</Text>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => changeLanguage(currentLanguage === 'ko' ? 'en' : 'ko')}
        >
          <Text style={styles.languageButtonText}>
            {currentLanguage === 'ko' ? 'EN' : '한'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 1. 홈팀 선택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('teamSetup.homeTeam.title')}</Text>
          <Text style={styles.sectionDescription}>{t('teamSetup.homeTeam.description')}</Text>

          {isLoadingTeams ? (
            <Text style={styles.loadingText}>{t('teamSetup.common.loading')}</Text>
          ) : teams.length === 0 ? (
            <View style={styles.noTeamsContainer}>
              <Text style={styles.noTeamsText}>{t('teamSetup.common.noTeams')}</Text>
              <Button
                variant="primary"
                onPress={() => navigation.navigate('TeamList')}
                style={styles.createTeamButton}
              >
                <Text style={styles.createTeamButtonText}>{t('teamSetup.common.createTeam')}</Text>
              </Button>
            </View>
          ) : (
            <View style={styles.optionsGrid}>
              {teams.map((team) => (
                <OptionCard
                  key={team.id}
                  title={team.name}
                  
                  isSelected={config.homeTeamId === team.id}
                  onPress={() => handleHomeTeamSelection(team.id)}
                />
              ))}
              <OptionCard
                title={t('teamSetup.common.noTeam')}
                isSelected={config.homeTeamId === ''}
                onPress={() => handleHomeTeamSelection('')}
              />
            </View>
          )}
        </View>

        {/* 2. 어웨이팀 설정 */}
        <View style={styles.section}>
          <View style={styles.toggleHeader}>
            <View style={styles.toggleInfo}>
              <Text style={styles.sectionTitle}>{t('teamSetup.awayTeam.title')}</Text>
              <Text style={styles.sectionDescription}>
                {isAwayTeamEnabled ? t('teamSetup.awayTeam.description') : t('teamSetup.awayTeam.homeOnlyMode')}
              </Text>
            </View>
            <Switch
              value={isAwayTeamEnabled}
              onValueChange={handleAwayTeamToggle}
              trackColor={{ false: '#333', true: COLORS.PRIMARY }}
              thumbColor={isAwayTeamEnabled ? '#fff' : '#888'}
            />
          </View>

          {isAwayTeamEnabled && (
            <View style={styles.awayTeamSelection}>
              <Text style={styles.subSectionTitle}>{t('teamSetup.awayTeam.selectTitle')}</Text>
              {isLoadingTeams ? (
                <Text style={styles.loadingText}>{t('teamSetup.common.loading')}</Text>
              ) : teams.length === 0 ? (
                <View style={styles.noTeamsContainer}>
                  <Text style={styles.noTeamsText}>{t('teamSetup.common.noTeams')}</Text>
                  <Button
                    variant="primary"
                    onPress={() => navigation.navigate('TeamList')}
                    style={styles.createTeamButton}
                  >
                    <Text style={styles.createTeamButtonText}>{t('teamSetup.common.createTeam')}</Text>
                  </Button>
                </View>
              ) : (
                <View style={styles.optionsGrid}>
                  {teams.filter(team => team.id !== config.homeTeamId).map((team) => (
                    <OptionCard
                      key={team.id}
                      title={team.name}
                      isSelected={config.awayTeamId === team.id}
                      onPress={() => handleAwayTeamSelection(team.id)}
                    />
                  ))}
                  <OptionCard
                    title={t('teamSetup.common.noTeam')}
                    isSelected={config.awayTeamId === ''}
                    onPress={() => handleAwayTeamSelection('')}
                  />
                </View>
              )}
            </View>
          )}
        </View>

        {/* 3. 인원 수 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('teamSetup.playerCount.title')}</Text>
          <Text style={styles.sectionDescription}>
            {config.playerCount}{t('teamSetup.playerCount.unit')} - {t(`teamSetup.playerCount.descriptions.${config.playerCount}`)}
          </Text>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>3{t('teamSetup.playerCount.unit')}</Text>
              <Text style={styles.sliderLabel}>11{t('teamSetup.playerCount.unit')}</Text>
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
              <Text style={styles.playerCountUnit}>{t('teamSetup.playerCount.unit')}</Text>
            </View>
          </View>
        </View>

        {/* 4. 전술 유형 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('teamSetup.tactical.title')}</Text>
          <Text style={styles.sectionDescription}>{t('teamSetup.tactical.description')}</Text>
          <View style={styles.optionsGrid}>
            {(config.playerCount === 11
              ? ['free', '4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '5-3-2', 'setpiece']
              : ['free', 'setpiece']
            ).map((formation) => (
              <OptionCard
                key={formation}
                title={t(`teamSetup.tactical.formations.${formation}`)}
                isSelected={config.tacticalType === formation}
                onPress={() => handleTacticalSelection(formation as any)}
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
          <Text style={styles.continueText}>{t('teamSetup.common.start')}</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    width: 60,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  languageButton: {
    width: 60,
    height: 32,
    backgroundColor: '#333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
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
  // 토글 관련 스타일
  toggleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleInfo: {
    flex: 1,
  },
  awayTeamSelection: {
    marginTop: 8,
  },
  subSectionTitle: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
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