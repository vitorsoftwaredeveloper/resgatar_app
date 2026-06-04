import { RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useAppTheme } from "@/context/ThemeContext";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
          marginBottom: SPACING.md,
          ...SHADOW.card,
        },
        row: {
          flexDirection: "row",
          alignItems: "center",
        },
        info: {
          flex: 1,
        },
        month: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "600",
          color: colors.textStrong,
        },
        description: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          marginTop: 2,
        },
        right: {
          alignItems: "flex-end",
        },
        value: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "600",
          color: colors.textStrong,
        },
        badge: {
          marginTop: SPACING.xs,
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
        divider: {
          borderBottomColor: colors.background,
          borderBottomWidth: 1,
          marginVertical: SPACING.md,
        },
      }),
    [colors],
  );
}
