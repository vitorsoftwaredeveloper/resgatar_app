import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SPACING, TYPOGRAPHY } from "@/theme";
import { useMemo } from "react";
import { Dimensions, StyleSheet } from "react-native";

const { height: SCREEN_H } = Dimensions.get("window");

export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
        },
        sheet: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.card,
          borderTopLeftRadius: RADIUS.xl,
          borderTopRightRadius: RADIUS.xl,
          paddingHorizontal: SPACING.lg,
          paddingBottom: SPACING.xl + 8,
          paddingTop: SPACING.sm,
          maxHeight: SCREEN_H * 0.72,
        },
        handle: {
          width: 40,
          height: 4,
          borderRadius: 2,
          backgroundColor: colors.border,
          alignSelf: "center",
          marginBottom: SPACING.md,
        },
        monthHeader: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: SPACING.md,
        },
        monthArrow: {
          width: 36,
          height: 36,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
        },
        monthArrowIcon: {
          color: colors.text,
        },
        monthTitle: {
          fontSize: TYPOGRAPHY.subtitle,
          fontWeight: "700",
          color: colors.textStrong,
        },
        weekHeader: {
          flexDirection: "row",
          marginBottom: SPACING.xs,
        },
        weekHeaderText: {
          flex: 1,
          textAlign: "center",
          fontSize: TYPOGRAPHY.small,
          fontWeight: "600",
          color: colors.textMuted,
        },
        grid: {
          flexDirection: "row",
          flexWrap: "wrap",
        },
        gridCell: {
          width: `${100 / 7}%`,
          alignItems: "center",
          paddingVertical: 4,
        },
        dayCircle: {
          width: 36,
          height: 36,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        },
        dayCircleSelected: {
          backgroundColor: colors.primary,
        },
        dayCircleToday: {
          borderWidth: 1,
          borderColor: colors.primary,
        },
        dayText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.text,
          fontWeight: "500",
        },
        dayTextOtherMonth: {
          color: colors.textMuted,
          opacity: 0.4,
        },
        dayTextSelected: {
          color: colors.white,
          fontWeight: "700",
        },
        dayTextToday: {
          color: colors.primary,
          fontWeight: "700",
        },
        footer: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: SPACING.md,
        },
        todayBtn: {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        },
        todayBtnText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.primary,
          fontWeight: "600",
        },
        closeBtn: {
          backgroundColor: colors.softBrown,
          borderRadius: RADIUS.sm,
          paddingHorizontal: SPACING.lg,
          paddingVertical: SPACING.sm,
        },
        closeBtnText: {
          fontSize: TYPOGRAPHY.body,
          color: colors.textStrong,
          fontWeight: "600",
        },
      }),
    [colors],
  );
}
