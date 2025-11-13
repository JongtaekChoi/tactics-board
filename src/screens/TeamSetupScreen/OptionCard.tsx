import { StyleSheet, Text } from "react-native";

import Button from "../../components/ui/Button";
import { COLORS } from "../../utils/constants";

interface OptionCardProps {
  title: string;
  isSelected: boolean;
  onPress: () => void;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  title,
  isSelected,
  onPress,
}) => {
  const cardStyle = isSelected
    ? { ...styles.optionCard, ...styles.selectedCard }
    : styles.optionCard;

  return (
    <Button
      variant={isSelected ? "primary" : "secondary"}
      onPress={onPress}
      style={cardStyle}
    >
      <Text style={[styles.optionTitle, isSelected && styles.selectedText]}>
        {title}
      </Text>
    </Button>
  );
};
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
