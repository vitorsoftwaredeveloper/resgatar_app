import { useAppTheme } from "@/context/ThemeContext";
import { SPACING } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        wrap: {
          marginBottom: SPACING.md,
        },
        eyebrow: {
          width: 220,
          height: 12,
          borderRadius: 4,
          backgroundColor: colors.skeletonBg,
        },
        title: {
          width: "70%",
          height: 30,
          borderRadius: 6,
          backgroundColor: colors.skeletonBg,
          marginTop: SPACING.xs,
        },
        pill: {
          width: 96,
          height: 24,
          borderRadius: 999,
          backgroundColor: colors.skeletonBg,
          marginTop: SPACING.sm,
        },
      }),
    [colors],
  );
}
