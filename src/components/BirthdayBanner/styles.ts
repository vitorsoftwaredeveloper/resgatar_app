import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: colors.card,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
          marginBottom: SPACING.md,
          borderWidth: 1,
          borderColor: colors.border,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
          marginBottom: SPACING.sm2,
        },
        icon: {
          color: colors.textMuted,
        },
        label: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "600",
          color: colors.textMuted,
          letterSpacing: 0.8,
        },
        list: {
          gap: SPACING.md,
          paddingRight: SPACING.xs,
        },
        item: {
          alignItems: "center",
          width: 56,
          gap: SPACING.xs,
        },
        name: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "600",
          color: colors.text,
          textAlign: "center",
        },
        day: {
          fontSize: TYPOGRAPHY.xsmall,
          color: colors.textMuted,
          textAlign: "center",
        },
        dayToday: {
          color: colors.primary,
          fontWeight: "700",
        },
        nameToday: {
          color: colors.primary,
        },
        avatarRing: {
          borderRadius: 999,
          borderWidth: 2,
          borderColor: colors.primary,
          padding: 2,
          shadowColor: colors.primary,
          shadowOpacity: 0.5,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 0 },
          elevation: 4,
        },
        todayBadge: {
          position: "absolute",
          bottom: -2,
          right: -2,
          backgroundColor: colors.card,
          borderRadius: 999,
          width: 18,
          height: 18,
          alignItems: "center",
          justifyContent: "center",
        },
        todayBadgeText: {
          fontSize: 10,
        },
      }),
    [colors],
  );
}
