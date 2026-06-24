import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "#00000055",
        },
        container: {
          flex: 1,
          backgroundColor: colors.background,
        },
        list: {
          marginTop: SPACING.xxs,
        },
        listContent: {
          gap: SPACING.sm2,
          paddingBottom: SPACING.lg,
        },
        memberHeader: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm2,
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.md,
        },
        memberName: {
          fontWeight: "600",
          fontSize: TYPOGRAPHY.subtitle,
          color: colors.textStrong,
        },
        memberEmail: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        monthCard: {
          marginHorizontal: SPACING.md,
          padding: SPACING.md,
          borderRadius: RADIUS.md,
          backgroundColor: colors.card,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        monthInfo: {
          flex: 1,
        },
        monthName: {
          fontWeight: "600",
          fontSize: TYPOGRAPHY.body,
          color: colors.textStrong,
        },
        monthDescription: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: 2,
        },
        badge: {
          paddingHorizontal: SPACING.sm,
          paddingVertical: 4,
          borderRadius: SPACING.sm2,
        },
        pending: {
          backgroundColor: colors.waiting,
        },
        paid: {
          backgroundColor: colors.successBackground,
        },
        badgeText: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "500",
        },
        pendingText: {
          color: colors.white,
        },
        paidText: {
          color: colors.success,
        },
        registerButton: {
          minHeight: 40,
          paddingHorizontal: SPACING.md,
        },
      }),
    [colors],
  );
}
