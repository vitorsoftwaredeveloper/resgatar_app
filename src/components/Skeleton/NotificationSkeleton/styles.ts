import { RADIUS, SPACING } from "@/theme";
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
          borderRadius: RADIUS.lg,
          padding: SPACING.lg,
          marginBottom: SPACING.md,
        },

        title: {
          height: 18,
          width: "60%",
          backgroundColor: colors.border,
          borderRadius: 6,
          marginBottom: 10,
        },

        line: {
          height: 14,
          width: "100%",
          backgroundColor: colors.border,
          borderRadius: 6,
          marginBottom: 8,
        },

        small: {
          height: 12,
          width: "40%",
          backgroundColor: colors.border,
          borderRadius: 6,
        },
      }),
    [colors],
  );
}
