import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.sm2,
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
  },
  season: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: "700",
  },
  date: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
