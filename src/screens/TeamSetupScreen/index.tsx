import React, { useEffect, useState } from "react";
import {
  RootStackParamList,
  TacticalType,
  TeamSetupConfig,
} from "../../types/navigation";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Button from "../../components/ui/Button";
import { COLORS } from "../../utils/constants";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { StackNavigationProp } from "@react-navigation/stack";
import { Team } from "../../types/team";
import TeamSetupView from "./TeamSetupView";
import { loadTeams } from "../../services/teamService";
import { useI18n } from "../../hooks/useI18n";

type TeamSetupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "TeamSetup">;
  route: RouteProp<RootStackParamList, "TeamSetup">;
};

const formations: TacticalType[] = [
  "free",
  "4-4-2",
  "4-3-3",
  "3-5-2",
  "4-2-3-1",
];

export default function TeamSetupScreen({
  navigation,
  route,
}: TeamSetupScreenProps) {
  const { boardId } = route.params;
  const { t, changeLanguage, currentLanguage } = useI18n();

  const [config, setConfig] = useState<TeamSetupConfig>({
    teamSelection: "both-teams", // 자동으로 결정됨
    homePlayerCount: 11,
    awayPlayerCount: 11,
    homeTacticalType: "free",
    awayTacticalType: "free",
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
      console.error("팀 목록 로드 실패:", error);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  // 통합 폼 핸들러들 (토글 방식)
  const handleHomeTeamSelection = (teamId: string) => {
    setConfig((prev) => ({ ...prev, homeTeamId: teamId }));
  };

  const handleAwayTeamToggle = (enabled: boolean) => {
    setIsAwayTeamEnabled(enabled);
    if (!enabled) {
      // 어웨이팀 비활성화 시 선택 초기화
      setConfig((prev) => ({
        ...prev,
        awayTeamId: undefined,
        teamSelection: "home-only",
      }));
    } else {
      // 어웨이팀 활성화 시 팀 선택 모드로 전환
      setConfig((prev) => ({
        ...prev,
        teamSelection: "both-teams",
      }));
    }
  };

  const handleAwayTeamSelection = (teamId: string) => {
    setConfig((prev) => ({ ...prev, awayTeamId: teamId }));
  };

  const handleHomePlayerCountSelection = (homePlayerCount: number) => {
    setConfig((prev) => ({ ...prev, homePlayerCount }));
  };

  const handleAwayPlayerCountSelection = (awayPlayerCount: number) => {
    setConfig((prev) => ({ ...prev, awayPlayerCount }));
  };

  const handleContinue = () => {
    navigation.navigate("Board", {
      boardId,
      teamConfig: config,
    });
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
        <Text style={styles.title}>{t("teamSetup.title")}</Text>
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => changeLanguage(currentLanguage === "ko" ? "en" : "ko")}
        >
          <Text style={styles.languageButtonText}>
            {currentLanguage === "ko" ? "EN" : "한"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 1. 홈팀 설정 */}
        <TeamSetupView
          teamType="home"
          tacticalType={config.homeTacticalType}
          teamId={config.homeTeamId || null}
          playerCount={config.homePlayerCount}
          isLoadingTeams={isLoadingTeams}
          teams={teams}
          changeTacticalType={(changeType: TacticalType) =>
            setConfig((prev: TeamSetupConfig) => ({
              ...prev,
              homeTacticalType: changeType,
            }))
          }
          changePlayerCount={handleHomePlayerCountSelection}
          handleTeamSelection={handleHomeTeamSelection}
          setPlayerCount={handleHomePlayerCountSelection}
        />

        {/* 2. 어웨이팀 설정 */}
        <View style={styles.section}>
          <View style={styles.toggleHeader}>
            <View style={styles.toggleInfo}>
              <Text style={styles.sectionTitle}>
                {t("teamSetup.awayTeam.title")}
              </Text>
              <Text style={styles.sectionDescription}>
                {isAwayTeamEnabled
                  ? t("teamSetup.awayTeam.description")
                  : t("teamSetup.awayTeam.homeOnlyMode")}
              </Text>
            </View>
            <Switch
              value={isAwayTeamEnabled}
              onValueChange={handleAwayTeamToggle}
              trackColor={{ false: "#333", true: COLORS.PRIMARY }}
              thumbColor={isAwayTeamEnabled ? "#fff" : "#888"}
            />
          </View>

          {isAwayTeamEnabled && (
            <TeamSetupView
              teamType="away"
              tacticalType={config.awayTacticalType}
              teamId={config.awayTeamId || null}
              playerCount={config.awayPlayerCount}
              isLoadingTeams={isLoadingTeams}
              teams={teams}
              changeTacticalType={(changeType: TacticalType) =>
                setConfig((prev: TeamSetupConfig) => ({
                  ...prev,
                  awayTacticalType: changeType,
                }))
              }
              changePlayerCount={handleAwayPlayerCountSelection}
              handleTeamSelection={handleAwayTeamSelection}
              setPlayerCount={handleAwayPlayerCountSelection}
            />
          )}
        </View>
      </ScrollView>

      {/* 하단 시작 버튼 */}
      <View style={styles.footer}>
        <Button
          onPress={handleContinue}
          variant="primary"
          style={styles.continueButton}
        >
          <Text style={styles.continueText}>{t("teamSetup.common.start")}</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#111",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    width: 60,
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  languageButton: {
    width: 60,
    height: 32,
    backgroundColor: "#333",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  languageButtonText: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionDescription: {
    color: "#888",
    fontSize: 14,
    marginBottom: 16,
  },
  // 토글 관련 스타일
  toggleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleInfo: {
    flex: 1,
  },
  awayTeamSelection: {
    marginTop: 8,
  },
  subSectionTitle: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 12,
  },
  optionsGrid: {
    gap: 12,
  },
  optionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#333",
    backgroundColor: "#222",
  },
  selectedCard: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: `${COLORS.PRIMARY}20`,
  },
  optionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  selectedText: {
    color: COLORS.PRIMARY,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  continueButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 16,
  },
  continueText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  sliderContainer: {
    marginVertical: 20,
    paddingHorizontal: 8,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sliderLabel: {
    color: "#888",
    fontSize: 12,
  },
  slider: {
    height: 40,
    marginVertical: 8,
  },
  playerCountDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginTop: 12,
  },
  playerCountNumber: {
    color: COLORS.PRIMARY,
    fontSize: 36,
    fontWeight: "bold",
  },
  playerCountUnit: {
    color: COLORS.PRIMARY,
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 4,
  },
  loadingText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 32,
  },
  noTeamsContainer: {
    paddingVertical: 32,
    alignItems: "center",
  },
  noTeamsText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  createTeamButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createTeamButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});
