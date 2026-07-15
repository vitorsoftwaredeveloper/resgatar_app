import { useAppTheme } from "@/context/ThemeContext";
import { SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: colors.background,
        },
        container: {
          backgroundColor: colors.background,
        },
        hint: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          lineHeight: 18,
          marginBottom: SPACING.sm,
        },
        footer: {
          padding: SPACING.md,
          backgroundColor: colors.background,
        },
      }),
    [colors],
  );
}
