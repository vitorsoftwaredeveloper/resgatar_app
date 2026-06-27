import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

// Warm flame tones, independent of the liturgical color so the streak reads as
// its own distinct, gamified element.
export const STREAK_ACCENT = "#E8862E";
export const STREAK_ACCENT_DIM = "#C9BCAE";

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
        label: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "600",
          color: colors.textMuted,
          letterSpacing: 0.8,
          marginBottom: SPACING.sm2,
        },
        row: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        left: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm,
          flexShrink: 1,
        },
        flameWrap: {
          width: 40,
          height: 40,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FBEBD9",
        },
        flameWrapDim: {
          backgroundColor: colors.softBrown,
        },
        texts: {
          flexShrink: 1,
        },
        headline: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.text,
        },
        subtitle: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: 2,
        },
        right: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
        },
        week: {
          flexDirection: "row",
          gap: SPACING.xs,
        },
        dayCol: {
          alignItems: "center",
          gap: 4,
        },
        dayInitial: {
          fontSize: TYPOGRAPHY.xsmall,
          color: colors.textMuted,
        },
        dot: {
          width: 9,
          height: 9,
          borderRadius: 5,
          backgroundColor: colors.border,
        },
        dotRead: {
          backgroundColor: STREAK_ACCENT,
        },
        dotToday: {
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: STREAK_ACCENT,
        },
      }),
    [colors],
  );
}
