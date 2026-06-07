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
          justifyContent: "space-between",
          marginBottom: SPACING.sm2,
        },
        label: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "600",
          color: colors.textMuted,
          letterSpacing: 0.8,
        },
        badge: {
          borderWidth: 1,
          borderRadius: 999,
          paddingHorizontal: SPACING.sm,
          paddingVertical: 2,
        },
        badgeText: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "600",
          letterSpacing: 0.5,
        },
        title: {
          fontSize: TYPOGRAPHY.large,
          fontWeight: "700",
          color: colors.primary,
          marginBottom: SPACING.sm2,
          lineHeight: TYPOGRAPHY.large * 1.3,
        },
        footer: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
        },
        date: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
        dot: {
          width: 8,
          height: 8,
          borderRadius: 4,
        },
        colorName: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
        },
      }),
    [colors],
  );
}
