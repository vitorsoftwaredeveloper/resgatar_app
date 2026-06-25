import { useAppTheme } from "@/context/ThemeContext";
import { SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm2,
          marginBottom: SPACING.md,
        },
        line: {
          flex: 1,
          height: 1,
          backgroundColor: colors.border,
        },
        center: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
        },
        title: {
          fontSize: TYPOGRAPHY.small,
          fontWeight: "700",
          color: colors.primary,
          letterSpacing: 1.4,
          textTransform: "uppercase",
        },
      }),
    [colors],
  );
}
