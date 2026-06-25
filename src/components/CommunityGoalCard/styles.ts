import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.md,
          padding: SPACING.md,
          marginBottom: SPACING.md,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xxs,
          marginBottom: SPACING.sm2,
        },
        title: {
          fontSize: TYPOGRAPHY.subtitle,
          color: colors.text,
          fontWeight: "600",
        },
        valueRow: {
          flexDirection: "row",
          alignItems: "baseline",
          gap: SPACING.xs,
          marginBottom: SPACING.sm,
        },
        percent: {
          fontSize: TYPOGRAPHY.hero,
          color: colors.success,
          fontWeight: "700",
        },
        caption: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
        },
        track: {
          height: 12,
          borderRadius: 6,
          backgroundColor: colors.softBrown,
          overflow: "hidden",
        },
        fill: {
          height: "100%",
          borderRadius: 6,
          backgroundColor: colors.success,
        },
        reachedRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
          marginTop: SPACING.sm,
        },
        reachedText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.success,
          fontWeight: "600",
        },
      }),
    [colors],
  );
}
