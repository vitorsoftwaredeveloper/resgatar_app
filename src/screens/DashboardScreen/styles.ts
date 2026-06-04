import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 56,
    gap: SPACING.sm2,
  },
  errorTitle: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: "700",
    color: COLORS.textStrong,
  },
  errorSubtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xxs,
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.softBrown,
  },
  retryText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
