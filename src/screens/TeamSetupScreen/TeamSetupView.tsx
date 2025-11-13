import { RootStackParamList, TacticalType } from "../../types/navigation";
import { StyleSheet, Text, View } from "react-native";

import Button from "../../components/ui/Button";
import { COLORS } from "../../utils/constants";
import { OptionCard } from "./OptionCard";
import Slider from "@react-native-community/slider";
import { StackNavigationProp } from "@react-navigation/stack";
import { useI18n } from "../../hooks/useI18n";
import { useNavigation } from "@react-navigation/native";

interface Props {
  teamType: "home" | "away";
  tacticalType: TacticalType;
  isLoadingTeams: boolean;
  teams: { id: string; name: string }[];
  teamId: string | null;
  playerCount: number;
  setPlayerCount: (count: number) => void;
  handleTeamSelection: (teamId: string) => void;
  changeTacticalType: (type: TacticalType) => void;
  changePlayerCount: (count: number) => void;
}

export default function TeamSetupView({
  teamType,
  playerCount,
  tacticalType,
  teams,
  teamId,
  isLoadingTeams,
  changeTacticalType,
  handleTeamSelection,
  changePlayerCount,
}: Props) {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "TeamSetup">>();
  const { t } = useI18n();
  const isHomeTeam = teamType === "home";
  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {t(
            isHomeTeam ? "teamSetup.homeTeam.title" : "teamSetup.awayTeam.title"
          )}
        </Text>
        <Text style={styles.sectionDescription}>
          {t("teamSetup.homeTeam.description")}
        </Text>

        {isLoadingTeams ? (
          <Text style={styles.loadingText}>
            {t("teamSetup.common.loading")}
          </Text>
        ) : teams.length === 0 ? (
          <View style={styles.noTeamsContainer}>
            <Text style={styles.noTeamsText}>
              {t("teamSetup.common.noTeams")}
            </Text>
            <Button
              variant="primary"
              onPress={() => navigation.navigate("TeamList")}
              style={styles.createTeamButton}
            >
              <Text style={styles.createTeamButtonText}>
                {t("teamSetup.common.createTeam")}
              </Text>
            </Button>
          </View>
        ) : (
          <View style={styles.optionsGrid}>
            {teams.map((team) => (
              <OptionCard
                key={team.id}
                title={team.name}
                isSelected={teamId === team.id}
                onPress={() => handleTeamSelection(team.id)}
              />
            ))}
            <OptionCard
              title={t("teamSetup.common.noTeam")}
              isSelected={teamId === ""}
              onPress={() => handleTeamSelection("")}
            />
          </View>
        )}
      </View>

      {/* 2. 홈팀 인원 수 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isHomeTeam
            ? t("teamSetup.homePlayerCount.title")
            : t("teamSetup.awayPlayerCount.title")}
        </Text>
        <Text style={styles.sectionDescription}>
          {playerCount}
          {t("teamSetup.playerCount.unit")} -{" "}
          {t(`teamSetup.playerCount.descriptions.${playerCount}`)}
        </Text>

        <View style={styles.sliderContainer}>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>
              3{t("teamSetup.playerCount.unit")}
            </Text>
            <Text style={styles.sliderLabel}>
              11{t("teamSetup.playerCount.unit")}
            </Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={3}
            maximumValue={11}
            step={1}
            value={playerCount}
            onValueChange={changePlayerCount}
            minimumTrackTintColor={COLORS.PRIMARY}
            maximumTrackTintColor="#333"
            thumbTintColor={COLORS.PRIMARY}
          />

          <View style={styles.playerCountDisplay}>
            <Text style={styles.playerCountNumber}>{playerCount}</Text>
            <Text style={styles.playerCountUnit}>
              {t("teamSetup.playerCount.unit")}
            </Text>
          </View>
        </View>

        {/* 3. 전술 유형 선택 */}
        {playerCount == 11 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {t("teamSetup.tactical.title")}
            </Text>
            <Text style={styles.sectionDescription}>
              {t("teamSetup.tactical.description")}
            </Text>
            <View style={styles.optionsGrid}>
              {(playerCount === 11
                ? ["free", "4-4-2", "4-3-3", "3-5-2", "4-2-3-1"]
                : ["free", "setpiece"]
              ).map((formation) => (
                <OptionCard
                  key={formation}
                  title={t(`teamSetup.tactical.formations.${formation}`)}
                  isSelected={tacticalType === formation}
                  onPress={() => changeTacticalType(formation as any)}
                />
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </>
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
