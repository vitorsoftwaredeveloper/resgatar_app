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
          flexDirection: "row",
          alignItems: "center",
          borderRadius: RADIUS.md,
          padding: SPACING.md,
          marginBottom: SPACING.md,
          borderLeftWidth: 4,
        },
        dot: {
          width: 10,
          height: 10,
          borderRadius: 5,
          marginRight: SPACING.sm2,
          flexShrink: 0,
        },
        textBlock: {
          flex: 1,
        },
        season: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "700",
        },
        date: {
          fontSize: TYPOGRAPHY.small,
          color: colors.textMuted,
          marginTop: 2,
        },
      }),
    [colors],
  );
}
