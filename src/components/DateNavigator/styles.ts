import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          // paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.sm2,
          paddingBottom: SPACING.xxl,
          gap: SPACING.sm2,
        },
        navRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
        },
        arrowBtn: {
          width: 36,
          height: 36,
          borderRadius: RADIUS.sm,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
          alignItems: "center",
          justifyContent: "center",
        },
        arrowIcon: {
          color: colors.text,
        },
        centerTarget: {
          flex: 1,
        },
        centerBtn: {
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: SPACING.xs,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
          borderRadius: RADIUS.sm,
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.sm,
        },
        centerText: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "600",
          color: colors.textStrong,
          textAlign: "center",
        },
        weekRow: {
          flexDirection: "row",
          justifyContent: "space-between",
        },
        dayCell: {
          flex: 1,
          alignItems: "center",
          paddingVertical: SPACING.xs,
          borderRadius: RADIUS.sm,
          gap: 2,
        },
        dayCellSelected: {
          backgroundColor: colors.primary,
        },
        dayAbbr: {
          fontSize: 9,
          fontWeight: "600",
          color: colors.textMuted,
          letterSpacing: 0.3,
        },
        dayAbbrSelected: {
          color: colors.white,
        },
        dayNum: {
          fontSize: TYPOGRAPHY.body,
          fontWeight: "600",
          color: colors.text,
        },
        dayNumSelected: {
          color: colors.white,
        },
        dayNumToday: {
          color: colors.primary,
        },
        backToToday: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          paddingVertical: 2,
        },
        backToTodayText: {
          fontSize: TYPOGRAPHY.small,
          color: colors.primary,
          fontWeight: "500",
        },
      }),
    [colors],
  );
}
