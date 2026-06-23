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
          flex: 1,
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: SPACING.xxl,
          gap: SPACING.md,
        },
        iconCircle: {
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: colors.softBrown,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: SPACING.sm,
        },
        title: {
          fontSize: TYPOGRAPHY.title,
          fontWeight: "700",
          color: colors.textStrong,
          textAlign: "center",
        },
        message: {
          fontSize: TYPOGRAPHY.subtitle,
          color: colors.textMuted,
          textAlign: "center",
          lineHeight: 22,
        },
        bold: {
          fontWeight: "700",
          color: colors.text,
        },
        button: {
          marginTop: SPACING.md,
          backgroundColor: colors.primary,
          paddingHorizontal: SPACING.xl,
          paddingVertical: SPACING.sm2,
          borderRadius: RADIUS.sm,
        },
        buttonText: {
          color: colors.white,
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
        },
      }),
    [colors],
  );
}
