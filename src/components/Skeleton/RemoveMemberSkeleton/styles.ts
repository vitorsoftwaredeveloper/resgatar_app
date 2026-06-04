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
          marginHorizontal: SPACING.md,
          padding: SPACING.md,
          borderRadius: RADIUS.md,
          backgroundColor: colors.card,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
        left: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.sm2,
        },
        avatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.skeletonBg,
        },
        texts: {
          gap: SPACING.xxs,
        },
        lineLarge: {
          width: 120,
          height: 14,
          borderRadius: 8,
          backgroundColor: colors.skeletonBg,
        },
        lineSmall: {
          width: 160,
          height: 12,
          borderRadius: 8,
          backgroundColor: colors.skeletonBg,
        },
        action: {
          width: 44,
          height: 44,
          borderRadius: RADIUS.sm,
          backgroundColor: colors.skeletonBg,
        },
      }),
    [colors],
  );
}
