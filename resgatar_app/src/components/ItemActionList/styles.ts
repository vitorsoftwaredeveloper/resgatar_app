import { COLORS, SPACING, TYPOGRAPHY } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
    position: "relative",
  },
  left: {
    position: "absolute",
    left: 0,
    top: 18,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    backgroundColor: COLORS.background,
    borderRadius: SPACING.sm2,
  },
  center: {
    marginLeft: 56,
    marginRight: SPACING.xl,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textStrong,
  },
  description: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  arrow: {
    position: "absolute",
    right: 0,
    top: 22,
    fontSize: 22,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: SPACING.md,
    marginLeft: 56,
  },
});
