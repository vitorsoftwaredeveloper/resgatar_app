import { COLORS, RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.card,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.background,
    marginRight: SPACING.sm2,
    justifyContent: "center",
    alignItems: "center",
  },
  iconSvg: {
    color: COLORS.primary,
  },
  info: {
    flex: 1,
  },
  month: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: "600",
    color: COLORS.textStrong,
  },
  description: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  right: {
    alignItems: "flex-end",
  },
  value: {
    fontSize: TYPOGRAPHY.subtitle,
    fontWeight: "600",
    color: COLORS.textStrong,
  },
  badge: {
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: SPACING.sm2,
  },
  pending: {
    backgroundColor: COLORS.waiting,
  },
  paid: {
    backgroundColor: COLORS.successBackground,
  },
  badgeText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: "500",
  },
  pendingText: {
    color: COLORS.white,
  },
  paidText: {
    color: COLORS.success,
  },
});
