import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { STREAK_ACCENT } from "@/components/StreakCard/styles";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center",
          padding: SPACING.xl,
        },
        card: {
          width: "100%",
          maxWidth: 360,
          backgroundColor: colors.card,
          borderRadius: RADIUS.lg,
          padding: SPACING.xl,
          alignItems: "center",
        },
        eyebrow: {
          fontSize: TYPOGRAPHY.xsmall,
          fontWeight: "700",
          letterSpacing: 1,
          color: STREAK_ACCENT,
          marginBottom: SPACING.md,
        },
        iconOuter: {
          width: 104,
          height: 104,
          borderRadius: 52,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FBEBD9",
          marginBottom: SPACING.md,
        },
        iconInner: {
          width: 76,
          height: 76,
          borderRadius: 38,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.card,
        },
        title: {
          fontSize: TYPOGRAPHY.title,
          fontWeight: "700",
          color: colors.text,
          textAlign: "center",
        },
        description: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textMuted,
          textAlign: "center",
          marginTop: SPACING.xs,
          lineHeight: TYPOGRAPHY.body * 1.4,
        },
        remaining: {
          fontSize: TYPOGRAPHY.small,
          color: STREAK_ACCENT,
          fontWeight: "600",
          marginTop: SPACING.sm2,
        },
        button: {
          marginTop: SPACING.lg,
          width: "100%",
        },
      }),
    [colors],
  );
}
