import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        banner: {
          height: 64,
          borderRadius: RADIUS.md,
          backgroundColor: colors.skeletonBg,
          marginBottom: SPACING.md,
        },
        card: {
          height: 96,
          borderRadius: RADIUS.md,
          backgroundColor: colors.skeletonBg,
          marginBottom: SPACING.md,
        },
        cardSmall: {
          height: 112,
          borderRadius: RADIUS.md,
          backgroundColor: colors.skeletonBg,
          marginBottom: SPACING.md,
        },
        cardTall: {
          height: 128,
          borderRadius: RADIUS.md,
          backgroundColor: colors.skeletonBg,
          marginBottom: SPACING.md,
        },
      }),
    [colors],
  );
}
