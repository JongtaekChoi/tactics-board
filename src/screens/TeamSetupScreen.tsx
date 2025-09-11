import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, TeamSetupConfig } from '../types/navigation';
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

const PLAYER_COUNT_OPTIONS = [
  { value: 11, label: '11 vs 11', description: '정규 경기' },
  { value: 7, label: '7 vs 7', description: 'Futsal / 유소년' },
  { value: 5, label: '5 vs 5', description: '실내 축구' },
] as const;

const SCENARIO_OPTIONS = [
  { value: 'free', label: '자유 전술', description: '일반적인 전술보드' },
  { value: 'attack', label: '공격 전술', description: '득점 기회 창출' },
  { value: 'defense', label: '수비 전술', description: '실점 방지' },
  { value: 'setpiece', label: '세트피스', description: '코너킥, 프리킥' },
] as const;

type SetupStep = 'team' | 'count' | 'scenario' | 'complete';

export default function TeamSetupScreen({ navigation, route }: TeamSetupScreenProps) {
  const { boardId } = route.params;
  
  const [currentStep, setCurrentStep] = useState<SetupStep>('team');
  const [config, setConfig] = useState<TeamSetupConfig>({
    teamSelection: 'both-teams',
    playerCount: 11,
    scenario: 'free',
  });

  // 애니메이션 values
  const countOpacity = useSharedValue(0);
  const countTranslateY = useSharedValue(30);
  const scenarioOpacity = useSharedValue(0);
  const scenarioTranslateY = useSharedValue(30);

  const handleTeamSelection = (teamSelection: 'home-only' | 'both-teams') => {
    setConfig(prev => ({ ...prev, teamSelection }));
    setCurrentStep('count');
    
    // 인원 수 섹션 애니메이션
    countOpacity.value = withTiming(1, { duration: 500 });
    countTranslateY.value = withSpring(0);
  };

  const handlePlayerCountSelection = (playerCount: number) => {
    setConfig(prev => ({ ...prev, playerCount }));
    setCurrentStep('scenario');
    
    // 전술 유형 섹션 애니메이션
    scenarioOpacity.value = withTiming(1, { duration: 500 });
    scenarioTranslateY.value = withSpring(0);
  };

  const handleScenarioSelection = (scenario: 'attack' | 'defense' | 'setpiece' | 'free') => {
    setConfig(prev => ({ ...prev, scenario }));
    setCurrentStep('complete');
  };

  const handleContinue = () => {
    navigation.navigate('Board', { 
      boardId, 
      teamConfig: config 
    });
  };

  // 애니메이션 스타일
  const countAnimatedStyle = useAnimatedStyle(() => ({
    opacity: countOpacity.value,
    transform: [{ translateY: countTranslateY.value }],
  }));

  const scenarioAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scenarioOpacity.value,
    transform: [{ translateY: scenarioTranslateY.value }],
  }));

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
        {/* Step 1: 팀 선택 */}
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

        {/* Step 2: 인원 수 (조건부 애니메이션) */}
        {currentStep !== 'team' && (
          <Animated.View style={[styles.section, countAnimatedStyle]}>
            <Text style={styles.sectionTitle}>인원 수</Text>
            <Text style={styles.sectionDescription}>경기 형태를 선택하세요</Text>
            <View style={styles.optionsGrid}>
              {PLAYER_COUNT_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  title={option.label}
                  value={option.value}
                  isSelected={config.playerCount === option.value}
                  onPress={() => handlePlayerCountSelection(option.value)}
                />
              ))}
            </View>
          </Animated.View>
        )}

        {/* Step 3: 전술 유형 (조건부 애니메이션) */}
        {(currentStep === 'scenario' || currentStep === 'complete') && (
          <Animated.View style={[styles.section, scenarioAnimatedStyle]}>
            <Text style={styles.sectionTitle}>전술 유형</Text>
            <Text style={styles.sectionDescription}>어떤 상황을 연습할까요?</Text>
            <View style={styles.optionsGrid}>
              {SCENARIO_OPTIONS.map((option) => (
                <OptionCard
                  key={option.value}
                  title={option.label}
                  value={option.value}
                  isSelected={config.scenario === option.value}
                  onPress={() => handleScenarioSelection(option.value)}
                />
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {currentStep === 'complete' && (
        <View style={styles.footer}>
          <Button 
            onPress={handleContinue}
            variant="primary"
            style={styles.continueButton}
          >
            <Text style={styles.continueText}>전술보드 시작</Text>
          </Button>
        </View>
      )}
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
});