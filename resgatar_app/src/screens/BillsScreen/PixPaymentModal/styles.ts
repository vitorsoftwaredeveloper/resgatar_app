import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: COLORS.softBrown,
  },

  amountContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },

  amountLabel: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginBottom: 4,
  },

  amount: {
    fontSize: 36,
    fontWeight: "700",
    color: COLORS.text,
  },

  qrContainer: {
    alignItems: "center",
    marginBottom: SPACING.md,
  },

  qrBox: {
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },

  helperText: {
    textAlign: "center",
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginBottom: SPACING.md,
  },

  pixCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.border,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    marginHorizontal: 48,
  },

  pixCode: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
  },

  copyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SPACING.sm2,
  },

  infoBox: {
    backgroundColor: COLORS.muted,
    borderRadius: SPACING.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    marginHorizontal: 48,
  },

  infoText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.white,
    textAlign: "center",
    lineHeight: 18,
  },

  badge: {
    alignSelf: "center",
    backgroundColor: COLORS.waiting,
    paddingHorizontal: 14,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.lg,
    marginBottom: SPACING.md,
    marginTop: SPACING.md,
  },

  badgeText: {
    fontSize: TYPOGRAPHY.subtitle,
    color: COLORS.white,
    fontWeight: "600",
  },

  badgePaid: {
    backgroundColor: COLORS.successBackground,
  },

  badgePaidText: {
    color: COLORS.success,
    fontWeight: "700",
    alignSelf: "center",
    borderRadius: SPACING.lg,
    fontSize: TYPOGRAPHY.subtitle,
  },

  containerCopy: {
    alignItems: "center",
    justifyContent: "center",
  },

  tooltipContainer: {
    position: "absolute",
    bottom: 42,
    alignItems: "center",
    width: 70,
    marginLeft: SPACING.sm2,
  },

  balloon: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.xs,
  },

  balloonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.small,
    fontWeight: "500",
  },

  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: COLORS.primary,
  },
});
