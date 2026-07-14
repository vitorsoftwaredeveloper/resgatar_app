import { useAppTheme } from "@/context/ThemeContext";
import { RADIUS, SHADOW, SPACING, TYPOGRAPHY } from "@/theme";
import { FONTS } from "@/theme/fonts";
import { useMemo } from "react";
import { StyleSheet } from "react-native";

// Visual editorial "card" do navegador de datas — portado do resgatar-browser
// (mesmo estilo do desktop, agora também no mobile). O card inteiro tem fundo,
// borda e sombra; a semana são células com borda e números serifados.
export function useStyles() {
  const { colors } = useAppTheme();
  return useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          padding: SPACING.lg,
          marginBottom: SPACING.md,
          gap: 14,
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: RADIUS.lg,
          ...SHADOW.card,
        },
        navRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: SPACING.xs,
        },
        arrowBtn: {
          width: 38,
          height: 38,
          borderRadius: RADIUS.md,
          backgroundColor: colors.inputBg,
          alignItems: "center",
          justifyContent: "center",
        },
        arrowIcon: {
          color: colors.textMuted,
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
        },
        centerText: {
          fontFamily: FONTS.displaySemiBold,
          fontSize: 17,
          color: colors.textStrong,
          textAlign: "center",
        },
        weekRow: {
          flexDirection: "row",
          gap: 6,
        },
        dayCell: {
          flex: 1,
          alignItems: "center",
          paddingVertical: 10,
          borderRadius: RADIUS.md,
          borderWidth: 1,
          borderColor: colors.border,
          gap: 4,
        },
        dayCellSelected: {
          backgroundColor: colors.primary,
          borderColor: "transparent",
          ...SHADOW.card,
        },
        dayAbbr: {
          fontSize: 10,
          fontWeight: "600",
          color: colors.textMuted,
          letterSpacing: 0.6,
        },
        dayAbbrSelected: {
          color: colors.white,
        },
        dayNum: {
          fontFamily: FONTS.displaySemiBold,
          fontSize: 19,
          color: colors.text,
        },
        dayNumSelected: {
          color: colors.white,
        },
        dayNumToday: {
          color: colors.waiting,
        },
        backToToday: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          paddingTop: 2,
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
